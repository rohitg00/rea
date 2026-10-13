import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { expect } from "vitest";

import { toolContract } from "../../src/contracts/toolContracts.js";
import { createEvidenceBundle } from "../../src/domain/evidenceBundle.js";
import { evidenceBundleSummarySchema } from "../../src/domain/evidenceRecordSummary.js";
import { evidenceDiscoveryFixture } from "../fixtures/evidenceDiscovery.js";
import { createTestTempDirectory } from "../fixtures/temporaryDirectory.js";
import { cliTest } from "../support/cli/cliFixture.js";

cliTest(
  "pages a portable bundle with the MCP selection and preserves the file and complete default",
  async ({ cli }) => {
    const root = await createTestTempDirectory("rea-evidence-pagination-cli-");
    const path = join(root, "evidence.json");
    const bundle = createEvidenceBundle(evidenceDiscoveryFixture());
    const bytes = JSON.stringify(bundle);
    await writeFile(path, bytes);
    const environment = {
      HOME: root,
      XDG_CONFIG_HOME: root,
      XDG_CACHE_HOME: root,
    };
    const inspect = (options: Record<string, unknown>) =>
      cli.run({
        arguments: [
          "inspect-evidence-bundle",
          JSON.stringify({ path, ...options }),
          "--json",
        ],
        environment,
      });
    const complete = await inspect({});
    expect(complete.exitCode, complete.stdout).toBe(0);
    expect(complete.json).toEqual(bundle);
    const all = await inspect({
      detail: "summary",
      filters: { operation: "analyze_function" },
    });
    expect(all.exitCode, all.stdout).toBe(0);
    const summary = evidenceBundleSummarySchema.parse(all.json);
    expect(summary).not.toHaveProperty("pagination");
    const response = await inspect({
      detail: "summary",
      filters: { operation: "analyze_function" },
      offset: 1,
      limit: 2,
    });
    expect(response.exitCode, response.stdout).toBe(0);
    expect(response.json).toEqual({
      ...summary,
      records: summary.records.slice(1, 3),
      pagination: { offset: 1, next_offset: 3 },
    });
    for (const options of [
      { offset: 0 },
      { detail: "complete", limit: 1 },
      { detail: "summary", offset: -1 },
      { detail: "summary", limit: 0 },
    ]) {
      const invalid = await inspect(options);
      expect(invalid.exitCode).toBe(1);
      expect(invalid.json).toMatchObject({ code: "invalid_request" });
    }
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [resolve("scripts/rea.mjs"), "mcp"],
      cwd: process.cwd(),
      env: {
        ...environment,
        PATH: process.env.PATH ?? "",
        REA_LOG_LEVEL: "silent",
      },
      stderr: "pipe",
    });
    transport.stderr?.on("data", () => undefined);
    const client = new Client({
      name: "evidence-pagination-parity",
      version: "1",
    });
    try {
      await client.connect(transport);
      const imported = await client.callTool({
        name: "import_evidence_bundle",
        arguments: { path },
      });
      expect(imported.isError, JSON.stringify(imported)).not.toBe(true);
      expect(
        toolContract("import_evidence_bundle").outputSchema.parse(
          imported.structuredContent,
        ).result,
      ).toMatchObject({
        imported: 8,
        total: 8,
      });
      const paged = await client.callTool({
        name: "get_evidence_bundle",
        arguments: {
          detail: "summary",
          filters: { operation: "analyze_function" },
          offset: 1,
          limit: 2,
        },
      });
      expect(paged.isError, JSON.stringify(paged)).not.toBe(true);
      expect(
        toolContract("get_evidence_bundle").outputSchema.parse(
          paged.structuredContent,
        ).result,
      ).toEqual(response.json);
      await client.ping();
    } finally {
      try {
        await client.close();
      } finally {
        await transport.close();
      }
    }
    expect(await readFile(path, "utf8")).toBe(bytes);
  },
);
