import { createHash } from "node:crypto";
import { access, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { expect, it as nativeTest, onTestFinished } from "vitest";
import { projectAnalysisError } from "../../../src/domain/analysisErrorProjection.js";
import { cleanupOwnedProcessGroup } from "../../../src/process/ProcessOwnership.js";
import { PrivateRuntimeRoot } from "../../../src/process/PrivateRuntimeRoot.js";
import { spawnOwnedProviderProcess } from "../../../src/process/ProviderProcess.js";
import { SqliteDatabaseProvider } from "../../../src/sqlite/SqliteDatabaseProvider.js";
import {
  createSqliteDatabaseFixture,
  SQLITE_NATIVE_LIMITS_AVAILABLE,
} from "../../fixtures/sqlite/database.js";
import {
  createTestWorkspace,
  removeTestWorkspace,
} from "../../support/workspace/workspaceFixture.js";

const it = nativeTest.runIf(SQLITE_NATIVE_LIMITS_AVAILABLE);
const workerPath = fileURLToPath(
  new URL("../../../dist/sqlite/SqliteDatabaseWorker.js", import.meta.url),
);

it.each(["rows", "schema"] as const)(
  "retains completed worker %s while retrying process cleanup before snapshot cleanup",
  async (mode) => {
    const workspace = await createTestWorkspace("rea-sqlite-worker-evidence-");
    const database = createSqliteDatabaseFixture(
      workspace.root,
      mode === "schema",
    );
    if (mode === "rows") database.close();
    const original = await readFile(database.path);
    const wal = mode === "schema" ? await readFile(database.walPath) : null;
    let processCleanupAllowed = false;
    let rootCleanupAllowed = false;
    let processAttempts = 0;
    let rootAttempts = 0;
    const roots: PrivateRuntimeRoot[] = [];
    const provider = new SqliteDatabaseProvider(
      process.env,
      async (spawn) => {
        const launched = await spawnOwnedProviderProcess({
          ...spawn,
          arguments: spawn.arguments.map((argument, index) =>
            index === 1 ? workerPath : argument,
          ),
        });
        return {
          ...launched,
          cleanup: async () => {
            processAttempts += 1;
            expect(launched.process.exitCode).toBe(0);
            if (!processCleanupAllowed)
              return {
                cleaned: false,
                reason: "Worker cleanup confirmation denied",
              };
            return (
              launched.cleanup?.() ??
              launched.cleanup?.() ??
              cleanupOwnedProcessGroup(launched.ownership)
            );
          },
        };
      },
      async () => {
        const root = await PrivateRuntimeRoot.create({
          parent: workspace.root,
        });
        roots.push(root);
        return {
          path: root.path,
          close: async () => {
            rootAttempts += 1;
            if (!rootCleanupAllowed)
              throw new Error("Snapshot cleanup confirmation denied");
            await root.close();
          },
        };
      },
    );
    onTestFinished(async () => {
      processCleanupAllowed = true;
      rootCleanupAllowed = true;
      await provider.close();
      if (mode === "schema") database.close();
      await removeTestWorkspace(workspace.root);
    });
    const input = {
      path: database.path,
      ...(mode === "rows"
        ? { table: "records", columns: ["id"], row_limit: 2 }
        : { schema_scope: "database" as const }),
    };
    const first = await provider.inspect(input);
    if (first.ok) throw new Error("Unconfirmed cleanup must fail");
    const partial = first.error.partialObservation;
    expect(projectAnalysisError(first.error)).toMatchObject({
      code: "cleanup_incomplete",
      details: {
        diagnostics: {
          reason: "Worker cleanup confirmation denied",
          previous_error: null,
        },
        partial_observation: {
          operation: "inspect_sqlite_database",
          confidence: "observed",
          parameters: input,
          subject: {
            local_path: database.path,
            digest: {
              sha256: createHash("sha256").update(original).digest("hex"),
            },
          },
          normalized_result: {
            wal:
              wal === null
                ? null
                : {
                    path: database.walPath,
                    sha256: createHash("sha256").update(wal).digest("hex"),
                  },
            schema: {
              tables: expect.arrayContaining([
                expect.objectContaining({ name: "records" }),
              ]),
            },
            rows:
              mode === "schema"
                ? null
                : {
                    returned_rows: 2,
                    columns: ["id"],
                    values: [
                      [{ type: "integer", value: "1" }],
                      [{ type: "integer", value: "2" }],
                    ],
                  },
          },
        },
      },
    });
    expect(processAttempts).toBe(1);
    expect(rootAttempts).toBe(0);
    const root = roots[0];
    if (root === undefined) throw new Error("Missing retained snapshot");
    await expect(access(root.path)).resolves.toBeUndefined();
    const blocked = await provider.inspect(input);
    if (blocked.ok)
      throw new Error("Unconfirmed cleanup must block acquisition");
    expect(blocked.error.partialObservation).toEqual(partial);
    expect(roots).toHaveLength(1);
    expect(processAttempts).toBe(2);
    await expect(provider.close()).rejects.toMatchObject({
      cleanupIncomplete: true,
      partialObservation: partial,
    });
    expect(rootAttempts).toBe(0);
    processCleanupAllowed = true;
    await expect(provider.close()).rejects.toMatchObject({
      cleanupResources: [root.path],
      partialObservation: partial,
    });
    expect(rootAttempts).toBe(1);
    rootCleanupAllowed = true;
    await provider.close();
    expect(processAttempts).toBe(4);
    await expect(access(root.path)).rejects.toMatchObject({ code: "ENOENT" });
    expect(await readFile(database.path)).toEqual(original);
    if (wal !== null) expect(await readFile(database.walPath)).toEqual(wal);
  },
);

it.each([
  { fault: "malformed-json", code: "unreadable_output" },
  { fault: "malformed-report", code: "unreadable_output" },
  { fault: "missing", code: "unreadable_output" },
  { fault: "selection", code: "invalid_request" },
  { fault: "output-limit", code: "resource_constraint" },
  { fault: "memory", code: "resource_constraint" },
  { fault: "cancelled", code: "cancelled" },
  { fault: "nonzero", code: "execution_failure" },
] as const)(
  "preserves $fault failure without inventing completed evidence during failed cleanup",
  async ({ fault, code }) => {
    const workspace = await createTestWorkspace("rea-sqlite-worker-failure-");
    const database = createSqliteDatabaseFixture(workspace.root);
    database.close();
    const original = await readFile(database.path);
    const controller = new AbortController();
    let cleanupAllowed = false;
    let rootPath = "";
    let attempts = 0;
    const provider = new SqliteDatabaseProvider(process.env, async (spawn) => {
      rootPath = spawn.cwd ?? "";
      const requestPath = spawn.arguments[2];
      if (requestPath === undefined) throw new Error("Missing worker request");
      const launched = await spawnOwnedProviderProcess({
        ...spawn,
        arguments:
          fault === "nonzero"
            ? [
                "--input-type=module",
                "-e",
                `await import(${JSON.stringify(workerPath)}); process.exitCode = 9;`,
                "sqlite-worker-test",
                requestPath,
              ]
            : spawn.arguments.map((argument, index) =>
                index === 1 ? workerPath : argument,
              ),
      });
      return {
        ...launched,
        cleanup: async () => {
          attempts += 1;
          if (cleanupAllowed)
            return (
              launched.cleanup?.() ??
              launched.cleanup?.() ??
              cleanupOwnedProcessGroup(launched.ownership)
            );
          const replyPath = join(rootPath, "reply.json");
          if (fault === "malformed-json") await writeFile(replyPath, "{");
          if (fault === "malformed-report") {
            const reply = z
              .object({
                ok: z.literal(true),
                inspection: z.record(z.string(), z.unknown()),
              })
              .parse(JSON.parse(await readFile(replyPath, "utf8")));
            await writeFile(
              replyPath,
              JSON.stringify({
                ...reply,
                inspection: {
                  ...reply.inspection,
                  rows: {
                    table: "records",
                    columns: ["id"],
                    values: [],
                    returned_rows: 2,
                    row_limit: 2,
                    truncated: false,
                    order: "unspecified",
                  },
                },
              }),
            );
          }
          if (fault === "missing") await rm(replyPath, { force: true });
          if (fault === "output-limit" || fault === "memory")
            await writeFile(
              replyPath,
              JSON.stringify({
                ok: false,
                reason: fault,
                message: `Controlled ${fault} worker reply`,
              }),
            );
          if (fault === "cancelled") controller.abort();
          return {
            cleaned: false,
            reason: "Worker cleanup confirmation denied",
          };
        },
      };
    });
    onTestFinished(async () => {
      cleanupAllowed = true;
      await provider.close();
      await removeTestWorkspace(workspace.root);
    });
    const result = await provider.inspect(
      {
        path: database.path,
        table: fault === "selection" ? "missing-table" : "records",
        columns: ["id"],
        row_limit: 2,
      },
      { signal: controller.signal },
    );
    if (result.ok) throw new Error("Failed worker inspection must not succeed");
    expect(projectAnalysisError(result.error)).toMatchObject({
      code: "cleanup_incomplete",
      details: {
        diagnostics: {
          reason: "Worker cleanup confirmation denied",
          previous_error: { code },
        },
      },
    });
    expect(result.error.partialObservation).toBeUndefined();
    expect(attempts).toBe(1);
    await expect(access(rootPath)).resolves.toBeUndefined();
    cleanupAllowed = true;
    await provider.close();
    expect(attempts).toBe(2);
    await expect(access(rootPath)).rejects.toMatchObject({ code: "ENOENT" });
    expect(await readFile(database.path)).toEqual(original);
  },
);
