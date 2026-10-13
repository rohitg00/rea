import { createHash } from "node:crypto";
import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it as nativeTest, onTestFinished } from "vitest";
import { z } from "zod";
import { SqliteDatabaseService } from "../../../src/application/sqlite/SqliteDatabaseService.js";
import { projectAnalysisError } from "../../../src/domain/analysisErrorProjection.js";
import { sqliteDatabaseSchema } from "../../../src/domain/sqlite/sqliteDatabase.js";
import { PrivateRuntimeRoot } from "../../../src/process/PrivateRuntimeRoot.js";
import { spawnOwnedProviderProcess } from "../../../src/process/ProviderProcess.js";
import { cleanupOwnedProcessGroup } from "../../../src/process/ProcessOwnership.js";
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
const {
  artifact: _artifact,
  wal: _wal,
  ...inspectionShape
} = sqliteDatabaseSchema.shape;
const replySchema = z.object({
  ok: z.literal(true),
  inspection: z.strictObject(inspectionShape),
});

it.each([
  { mismatch: "table", cleanup: "worker" },
  { mismatch: "columns", cleanup: "snapshot" },
  { mismatch: "row-limit", cleanup: "worker" },
  { mismatch: "schema-scope", cleanup: "snapshot" },
  { mismatch: "schema-table", cleanup: "none" },
  { mismatch: "schema-index", cleanup: "worker" },
  { mismatch: "schema-trigger", cleanup: "snapshot" },
  { mismatch: "schema-views", cleanup: "worker" },
] as const)(
  "rejects a shape-valid $mismatch mismatch with $cleanup cleanup before retaining Evidence",
  async ({ mismatch, cleanup }) => {
    const workspace = await createTestWorkspace("rea-sqlite-selection-");
    const database = createSqliteDatabaseFixture(workspace.root);
    database.close();
    const original = await readFile(database.path);
    let cleanupAllowed = false;
    let rootPath = "";
    let replyChanged = false;
    const provider = new SqliteDatabaseProvider(
      process.env,
      async (spawn) => {
        rootPath = spawn.cwd ?? "";
        const launched = await spawnOwnedProviderProcess({
          ...spawn,
          arguments: spawn.arguments.map((argument, index) =>
            index === 1 ? workerPath : argument,
          ),
        });
        return {
          ...launched,
          cleanup: async () => {
            if (!replyChanged) {
              const replyPath = join(rootPath, "reply.json");
              const reply = replySchema.parse(
                JSON.parse(await readFile(replyPath, "utf8")),
              );
              if (reply.inspection.rows === null)
                throw new Error("Worker did not return selected rows");
              switch (mismatch) {
                case "table":
                  reply.inspection.rows.table = "another-table";
                  break;
                case "columns":
                  reply.inspection.rows.columns = ["integer_value"];
                  break;
                case "row-limit":
                  reply.inspection.rows.row_limit = 3;
                  break;
                case "schema-scope":
                  reply.inspection.schema.scope = "database";
                  break;
                case "schema-table":
                  reply.inspection.schema.tables =
                    reply.inspection.schema.tables.map((table) => ({
                      ...table,
                      name: "another-table",
                    }));
                  break;
                case "schema-index":
                  reply.inspection.schema.indexes =
                    reply.inspection.schema.indexes.map((index) => ({
                      ...index,
                      table: "another-table",
                    }));
                  break;
                case "schema-trigger":
                  reply.inspection.schema.triggers =
                    reply.inspection.schema.triggers.map((trigger) => ({
                      ...trigger,
                      table: "another-table",
                    }));
                  break;
                case "schema-views":
                  reply.inspection.schema.views = [
                    { name: "unexpected-view", sql: "SELECT 1" },
                  ];
                  break;
              }
              sqliteDatabaseSchema.parse({
                artifact: {
                  path: database.path,
                  bytes: original.length,
                  sha256: createHash("sha256").update(original).digest("hex"),
                },
                wal: null,
                ...reply.inspection,
              });
              await writeFile(replyPath, JSON.stringify(reply));
              replyChanged = true;
            }
            if (cleanup === "worker" && !cleanupAllowed)
              return {
                cleaned: false,
                reason: "Worker cleanup confirmation denied",
              };
            return (
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
        return {
          path: root.path,
          close: async () => {
            if (cleanup === "snapshot" && !cleanupAllowed)
              throw new Error("Snapshot cleanup confirmation denied");
            await root.close();
          },
        };
      },
    );
    const service = new SqliteDatabaseService(provider);
    onTestFinished(async () => {
      cleanupAllowed = true;
      await service.close();
      await removeTestWorkspace(workspace.root);
    });
    const result = await service.inspect({
      path: database.path,
      table: "records",
      columns: ["id"],
      row_limit: 2,
    });
    if (result.ok) throw new Error("Changed selection must not succeed");
    expect(replyChanged).toBe(true);
    const projected = projectAnalysisError(result.error);
    if (cleanup === "none") expect(projected.code).toBe("unreadable_output");
    else
      expect(projected).toMatchObject({
        code: "cleanup_incomplete",
        details: {
          diagnostics: { previous_error: { code: "unreadable_output" } },
        },
      });
    expect(result.error.partialObservation).toBeUndefined();
    if (cleanup !== "none") {
      await expect(access(rootPath)).resolves.toBeUndefined();
      await expect(service.close()).rejects.toMatchObject({
        cleanupIncomplete: true,
        partialObservation: undefined,
      });
    }
    cleanupAllowed = true;
    await service.close();
    await expect(access(rootPath)).rejects.toMatchObject({ code: "ENOENT" });
    expect(await readFile(database.path)).toEqual(original);
  },
);
