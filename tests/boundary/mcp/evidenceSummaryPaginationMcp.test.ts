import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { STDIO_DEFAULT_MAX_BUFFER_SIZE } from "@modelcontextprotocol/server";
import { Ajv2020 } from "ajv/dist/2020.js";
import { expect, onTestFinished } from "vitest";

import { toolContract } from "../../../src/contracts/toolContracts.js";
import type { Evidence } from "../../../src/domain/evidence.js";
import { createEvidenceBundle } from "../../../src/domain/evidenceBundle.js";
import {
  evidenceBundleSummarySchema,
  type EvidenceRecordFilters,
} from "../../../src/domain/evidenceRecordSummary.js";
import { createServer } from "../../../src/server/createServer.js";
import { createTestBinarySession } from "../../fixtures/binarySession.js";
import {
  evidenceDiscoveryFixture,
  largeEvidenceDiscoveryFixture,
} from "../../fixtures/evidenceDiscovery.js";
import { parseMcpToolError } from "../../fixtures/mcpToolError.js";
import { createTestTempDirectory } from "../../fixtures/temporaryDirectory.js";
import { mcpTest, type TestMcp } from "../../support/mcp/mcpFixture.js";

const bundleResult = (content: unknown) =>
  toolContract("get_evidence_bundle").outputSchema.parse(content).result;

const connect = async (mcp: TestMcp, records: Evidence[]) => {
  const session = createTestBinarySession(() => {
    throw new Error("Evidence discovery must not start a provider");
  });
  onTestFinished(async () => {
    await session.close();
  });
  for (const record of records) {
    const retained = session.recordEvidence(record);
    if (!retained.ok) throw retained.error;
  }
  return mcp.connect(createServer({ kind: "session", session }));
};

mcpTest(
  "pages discovery metadata after exact filters without changing unpaged delivery",
  async ({ mcp }) => {
    const records = evidenceDiscoveryFixture();
    const client = await connect(mcp, records);
    const all = await client.callTool({
      name: "get_evidence_bundle",
      arguments: { detail: "summary" },
    });
    const summary = evidenceBundleSummarySchema.parse(
      bundleResult(all.structuredContent),
    );
    expect(summary).not.toHaveProperty("pagination");
    expect(summary.records.map(({ evidence_id }) => evidence_id)).toEqual(
      records.map(({ evidence_id }) => evidence_id).sort(),
    );
    const sample = records[0]!;
    const combined = {
      operation: "analyze_function",
      target_sha256: sample.subject!.digest.sha256,
      analysis_profile_digest: sample.analysis_profile!.digest,
      procedure_address: "0x401000",
    };
    const cases: [EvidenceRecordFilters, string[]][] = [
      [{}, records.map((record) => record.evidence_id)],
      [{ evidence_id: sample.evidence_id }, [sample.evidence_id]],
      [
        { operation: "address_name" },
        records.slice(6).map((record) => record.evidence_id),
      ],
      [
        { target_sha256: "a".repeat(64) },
        records
          .filter((_, index) => index % 2 === 0)
          .map((record) => record.evidence_id),
      ],
      [
        { analysis_profile_digest: sample.analysis_profile!.digest },
        records.slice(0, 4).map((record) => record.evidence_id),
      ],
      [
        { procedure_address: "0x401000" },
        records.slice(0, 6).map((record) => record.evidence_id),
      ],
      [combined, [records[0]!.evidence_id, records[2]!.evidence_id]],
      [{ procedure_address: "0xmissing" }, []],
    ];
    for (const [filters, ids] of cases) {
      const expected = ids.sort();
      for (const page of [
        { limit: 2 },
        { offset: 1, limit: 2 },
        { offset: 2 },
        { offset: expected.length, limit: 1 },
        { offset: Number.MAX_SAFE_INTEGER, limit: Number.MAX_SAFE_INTEGER },
        { limit: Number.MAX_SAFE_INTEGER },
      ]) {
        const response = await client.callTool({
          name: "get_evidence_bundle",
          arguments: { detail: "summary", filters, ...page },
        });
        expect(response.isError, JSON.stringify(response)).not.toBe(true);
        const result = evidenceBundleSummarySchema.parse(
          bundleResult(response.structuredContent),
        );
        const offset = page.offset ?? 0;
        const selected = expected.slice(
          offset,
          page.limit === undefined
            ? undefined
            : Math.min(expected.length, offset) +
                Math.min(page.limit, expected.length),
        );
        expect(result.records.map((record) => record.evidence_id)).toEqual(
          selected,
        );
        expect(result).toMatchObject({
          filters,
          total_retained_records: records.length,
          matching_records: expected.length,
          pagination: {
            offset,
            next_offset:
              offset + selected.length < expected.length
                ? offset + selected.length
                : null,
          },
        });
        expect(result.records).toEqual(
          summary.records.filter((record) =>
            selected.includes(record.evidence_id),
          ),
        );
        expect(
          JSON.parse(
            response.content.find((content) => content.type === "text")?.text ??
              "null",
          ),
        ).toEqual(response.structuredContent);
      }
    }
    const complete = await client.callTool({
      name: "get_evidence_bundle",
      arguments: {},
    });
    expect(bundleResult(complete.structuredContent)).toEqual(
      createEvidenceBundle(records),
    );
  },
);

mcpTest(
  "advertises safe integer pagination and rejects invalid or complete-mode paging",
  async ({ mcp }) => {
    const client = await connect(mcp, []);
    const advertised = (await client.listTools()).tools.find(
      (tool) => tool.name === "get_evidence_bundle",
    )!;
    const ajv = new Ajv2020({ strict: false, validateFormats: false });
    expect(ajv.validateSchema(advertised.inputSchema)).toBe(true);
    const outputSchema: Record<string, unknown> = advertised.outputSchema!;
    expect(ajv.validateSchema(outputSchema)).toBe(true);
    const validate = ajv.compile(advertised.inputSchema);
    expect(
      validate({
        detail: "summary",
        offset: Number.MAX_SAFE_INTEGER,
        limit: Number.MAX_SAFE_INTEGER,
      }),
    ).toBe(true);
    for (const [field, values] of Object.entries({
      offset: [-1, 0.5, Number.MAX_SAFE_INTEGER + 1, null, "0"],
      limit: [0, -1, 0.5, Number.MAX_SAFE_INTEGER + 1, null, "1"],
    })) {
      for (const value of values) {
        const arguments_ = { detail: "summary", [field]: value };
        expect(validate(arguments_), JSON.stringify(arguments_)).toBe(false);
        expect(
          (
            await client.callTool({
              name: "get_evidence_bundle",
              arguments: arguments_,
            })
          ).isError,
        ).toBe(true);
      }
    }
    for (const detail of [undefined, "complete"]) {
      for (const paging of [
        { offset: 0 },
        { limit: 1 },
        { offset: 0, limit: 1 },
        { offset: 0, limit: 1, filters: {} },
      ]) {
        const response = await client.callTool({
          name: "get_evidence_bundle",
          arguments: { ...(detail === undefined ? {} : { detail }), ...paging },
        });
        const error = parseMcpToolError(response).error;
        expect(error).toMatchObject({
          code: "invalid_request",
          details: {
            issues: expect.arrayContaining(
              Object.keys(paging).map((field) =>
                expect.objectContaining({
                  path: [field],
                  expected: "detail: summary",
                }),
              ),
            ),
          },
        });
      }
    }
    const empty = await client.callTool({
      name: "get_evidence_bundle",
      arguments: { detail: "summary", offset: 0, limit: 1 },
    });
    expect(bundleResult(empty.structuredContent)).toMatchObject({
      matching_records: 0,
      records: [],
      pagination: { offset: 0, next_offset: null },
    });
    expect(ajv.validate(outputSchema, empty.structuredContent)).toBe(true);
  },
);

mcpTest(
  "traverses metadata beyond the ordinary MCP frame while retaining provenance, export identity and native views",
  async ({ mcp }) => {
    const records = largeEvidenceDiscoveryFixture();
    const parent = records[0]!;
    const client = await connect(mcp, records);
    const root = await createTestTempDirectory("rea-evidence-summary-pages-");
    const before = join(root, "before.json");
    const after = join(root, "after.json");
    const exportBundle = async (path: string) => {
      const response = await client.callTool({
        name: "export_evidence_bundle",
        arguments: { path },
      });
      expect(response.isError).not.toBe(true);
      return createHash("sha256")
        .update(await readFile(path))
        .digest("hex");
    };
    const digest = await exportBundle(before);
    const broad = await client.callTool({
      name: "get_evidence_bundle",
      arguments: { detail: "summary" },
    });
    expect(parseMcpToolError(broad).error).toMatchObject({
      code: "resource_constraint",
      details: { resource: "transport" },
    });
    const ids: string[] = [];
    let offset: number | null = 0;
    while (offset !== null) {
      const response = await client.callTool({
        name: "get_evidence_bundle",
        arguments: { detail: "summary", offset, limit: 1_000 },
      });
      expect(response.isError).not.toBe(true);
      expect(
        Buffer.byteLength(
          JSON.stringify({ jsonrpc: "2.0", id: 1, result: response }),
        ),
      ).toBeLessThan(STDIO_DEFAULT_MAX_BUFFER_SIZE);
      expect(response._meta).toMatchObject({
        provenance: { untrusted_content: true, source: "analysis_target" },
      });
      const result = evidenceBundleSummarySchema.parse(
        bundleResult(response.structuredContent),
      );
      expect(result.matching_records).toBe(records.length);
      expect(
        result.records.every(
          (record) => record.retention === "complete-record",
        ),
      ).toBe(true);
      ids.push(...result.records.map((record) => record.evidence_id));
      offset = result.pagination!.next_offset;
    }
    expect(ids).toEqual(records.map((record) => record.evidence_id).sort());
    expect(await exportBundle(after)).toBe(digest);
    const view = await client.callTool({
      name: "inspect_analysis_view",
      arguments: {
        source: { kind: "retained-evidence", evidence_id: parent.evidence_id },
        view: { kind: "native", facet: "pseudocode", limit: 12 },
      },
    });
    expect(view.isError).not.toBe(true);
    expect(
      toolContract("inspect_analysis_view").outputSchema.parse(
        view.structuredContent,
      ),
    ).toMatchObject({
      evidence_links: [parent.evidence_id],
      normalized_result: {
        parent_evidence_id: parent.evidence_id,
        item: { text: "int fixture_" },
      },
    });
    await client.ping();
  },
  60_000,
);
