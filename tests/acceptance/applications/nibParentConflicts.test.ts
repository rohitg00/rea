import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { expect } from "vitest";

import { encodeNibArchiveFixture } from "../../../src/artifacts/apple/NibArchive.fixture.js";
import { toolContract } from "../../../src/contracts/toolContracts.js";
import { interfaceBuilderAnalysisSchema } from "../../../src/domain/apple/interfaceBuilderGraph.js";
import { thinMach } from "../../../src/domain/binaryTarget.fixture.js";
import { createTestTempDirectory } from "../../fixtures/temporaryDirectory.js";
import { cliTest } from "../../support/cli/cliFixture.js";

type NibObject = Parameters<
  typeof encodeNibArchiveFixture
>[0]["objects"][number];

const hierarchyFixture = (input: {
  readonly kind: "windows" | "mixed" | "consistent" | "repeated" | "legacy";
  readonly reverse?: boolean;
}) => {
  const ids = input.reverse
    ? { first: 2, second: 1, child: 0 }
    : { first: 0, second: 1, child: 2 };
  const competingWindows =
    input.kind === "windows" || input.kind === "repeated";
  const childParent = input.kind === "mixed" ? ids.second : ids.first;
  const hasSuperview = ["mixed", "consistent", "repeated"].includes(input.kind);
  const objects: NibObject[] = [];
  objects[ids.first] = {
    classIndex: input.kind === "legacy" ? 1 : 0,
    values:
      input.kind === "legacy"
        ? { NSContentView: { ref: ids.child } }
        : { NSWindowView: { ref: ids.child } },
  };
  objects[ids.second] = {
    classIndex: competingWindows ? 0 : 1,
    values: competingWindows ? { NSWindowView: { ref: ids.child } } : {},
  };
  objects[ids.child] = {
    classIndex: 1,
    values: {
      ...(hasSuperview ? { NSSuperview: { ref: childParent } } : {}),
      NSSubview: { ref: 3 },
    },
  };
  objects.push(
    { classIndex: 1, values: {} },
    { classIndex: 1, values: {} },
    { classIndex: 1, values: { NSSuperview: { ref: 4 } } },
    { classIndex: 1, values: { NSSuperview: { ref: ids.child } } },
    { classIndex: 2, values: { NSRoot: { ref: ids.first } } },
  );
  return {
    bytes: encodeNibArchiveFixture({
      classes: ["NSWindowTemplate", "NSView", "NSIBObjectData"],
      objects,
    }),
    objects,
    ids,
    conflict: competingWindows || input.kind === "mixed",
  };
};

const decodeWithMcp = async (app: string) => {
  const contract = toolContract("decode_interface_builder");
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [resolve("scripts/rea.mjs"), "mcp"],
    env: {
      PATH: process.env.PATH ?? "",
      REA_LOG_LEVEL: "silent",
      REA_ANALYSIS_PROVIDER: "auto",
    },
    stderr: "pipe",
  });
  const client = new Client({ name: "nib-parent-conflicts", version: "1" });
  try {
    await client.connect(transport);
    const opened = await client.callTool({
      name: "open_binary",
      arguments: { path: app },
    });
    expect(opened.isError, JSON.stringify(opened)).not.toBe(true);
    const response = await client.callTool({
      name: contract.name,
      arguments: {},
    });
    expect(response.isError, JSON.stringify(response)).not.toBe(true);
    return contract.outputSchema.parse(response.structuredContent)
      .normalized_result;
  } finally {
    try {
      await client.close();
    } finally {
      await transport.close();
    }
  }
};

cliTest(
  "keeps conflicting NIB view parents unknown through CLI and stdio MCP",
  async ({ cli }) => {
    const root = await createTestTempDirectory("rea-nib-parent-conflicts-");
    const app = join(root, "Fixture.app");
    const contents = join(app, "Contents");
    await mkdir(join(contents, "Resources"), { recursive: true });
    await mkdir(join(contents, "MacOS"));
    await writeFile(
      join(contents, "MacOS/App"),
      thinMach(0xfeedfacf, 0x0100000c),
    );
    await writeFile(
      join(contents, "Info.plist"),
      "<plist><dict><key>CFBundleExecutable</key><string>App</string><key>CFBundleIdentifier</key><string>dev.rea.nib-parents</string></dict></plist>",
    );
    const fixtures = [
      hierarchyFixture({ kind: "windows" }),
      hierarchyFixture({ kind: "windows", reverse: true }),
      hierarchyFixture({ kind: "mixed" }),
      hierarchyFixture({ kind: "mixed", reverse: true }),
      hierarchyFixture({ kind: "repeated" }),
      hierarchyFixture({ kind: "repeated", reverse: true }),
      hierarchyFixture({ kind: "consistent" }),
      hierarchyFixture({ kind: "legacy" }),
    ];
    for (const [index, fixture] of fixtures.entries())
      await writeFile(
        join(contents, `Resources/Panel-${index}.nib`),
        fixture.bytes,
      );
    const result = await cli.run({
      arguments: ["decode-interface-builder", app, "--json"],
      environment: { REA_LOG_LEVEL: "silent", REA_ANALYSIS_PROVIDER: "auto" },
    });
    expect(result.exitCode, result.stdout + result.stderr).toBe(0);
    const contract = toolContract("decode_interface_builder");
    const evidence = contract.outputSchema.parse(result.json);
    expect(await decodeWithMcp(app)).toEqual(evidence.normalized_result);
    const report = interfaceBuilderAnalysisSchema.parse(
      evidence.normalized_result,
    );
    expect(report.documents).toHaveLength(fixtures.length);
    expect(report.graph.truncated).toBe(true);
    for (const [index, fixture] of fixtures.entries()) {
      const relativePath = `Contents/Resources/Panel-${index}.nib`;
      const nodes = report.graph.nodes.filter(({ evidence: sources }) =>
        sources.some(({ artifact_path }) => artifact_path === relativePath),
      );
      const objectNodes = nodes.filter(
        ({ attributes }) =>
          attributes.interface_builder_object_id !== undefined,
      );
      const byObjectId = new Map(
        objectNodes.map((node) => [
          node.attributes.interface_builder_object_id,
          node,
        ]),
      );
      expect(objectNodes).toHaveLength(7);
      const links = report.graph.edges
        .filter(
          ({ from, to, relation }) =>
            relation === "contains" &&
            objectNodes.some(({ id }) => id === from) &&
            objectNodes.some(({ id }) => id === to),
        )
        .map(({ from, to }) => [
          objectNodes.find(({ id }) => id === from)?.attributes
            .interface_builder_object_id,
          objectNodes.find(({ id }) => id === to)?.attributes
            .interface_builder_object_id,
        ]);
      expect(links).toEqual(
        expect.arrayContaining([
          [String(fixture.ids.child), "3"],
          [String(fixture.ids.child), "6"],
          ["4", "5"],
        ]),
      );
      expect(
        links.filter(([, child]) => child === String(fixture.ids.child)),
      ).toEqual(
        fixture.conflict
          ? []
          : [[String(fixture.ids.first), String(fixture.ids.child)]],
      );
      expect(
        report.documents.find(
          ({ relative_path }) => relative_path === relativePath,
        ),
      ).toMatchObject({
        hierarchy_complete: !fixture.conflict,
        archive_sha256: createHash("sha256")
          .update(fixture.bytes)
          .digest("hex"),
      });
      expect(
        report.graph.coverage.find(
          ({ facet }) => facet === `hierarchy:${relativePath}`,
        ),
      ).toMatchObject(
        fixture.conflict
          ? {
              status: "partial",
              reason: "serialized_view_hierarchy_incomplete",
              omitted: 1,
            }
          : { status: "complete", reason: null, omitted: 0 },
      );
      for (const [id, object] of fixture.objects.slice(0, 7).entries()) {
        expect(byObjectId.get(String(id))?.attributes.nibValues).toEqual(
          Object.fromEntries(
            Object.entries(object.values).map(([key, value]) => [
              key,
              typeof value === "object" && value !== null
                ? { objectID: String(value.ref) }
                : value,
            ]),
          ),
        );
      }
      expect(await readFile(join(app, relativePath))).toEqual(fixture.bytes);
    }
  },
  60_000,
);
