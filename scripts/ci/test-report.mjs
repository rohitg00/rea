import { execFileSync } from "node:child_process";
import { appendFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

import { z } from "zod";

const root = process.cwd();
const historyDirectory = join(root, ".cache/ci-test-history");
const historyPath = join(historyDirectory, "test-results.json");
// Never let a failed or partial rerun leave a previous successful history file.
await rm(historyPath, { force: true });
const report = z
  .object({
    version: z.literal(1),
    success: z.boolean(),
    files: z.array(
      z.object({
        name: z.string().min(1),
        durationMs: z.number().finite().nonnegative(),
      }),
    ),
  })
  .parse(JSON.parse(await readFile("test-timings.json", "utf8")));

const files = report.files.map(({ name, durationMs }) => {
  const path = relative(root, resolve(root, name));
  if (
    path === "" ||
    path === ".." ||
    path.startsWith(".." + sep) ||
    isAbsolute(path)
  )
    throw new Error(`Test report path is outside the checkout: ${name}`);
  return { name: path.split(sep).join("/"), durationMs };
});
const complete = process.env.SHARD_RESULT === "success";
const passed =
  complete && process.env.MERGE_RESULT === "success" && report.success;
// Successful shards and merged reports must account for the complete portable
// inventory. Coverage thresholds alone cannot prove that every file ran.
if (passed && process.env.CI_VERIFY_TEST_INVENTORY === "true") {
  const expected = execFileSync(
    "git",
    ["ls-files", "-z", "--", "src", "tests"],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  )
    .split("\0")
    .filter((path) => path.endsWith(".test.ts"));
  const actual = files.map(({ name }) => name);
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const missing = expected.filter((path) => !actualSet.has(path));
  const unexpected = actual.filter((path) => !expectedSet.has(path));
  if (missing.length || unexpected.length || actualSet.size !== actual.length)
    throw new Error(
      `Incomplete portable test inventory: ${JSON.stringify({ missing, unexpected, duplicateFiles: actual.length - actualSet.size })}`,
    );
}
const summary = [
  complete ? "## Merged test diagnostics" : "## Partial test diagnostics",
  "",
  `Shard result: ${process.env.SHARD_RESULT ?? "unknown"}; merge result: ${process.env.MERGE_RESULT ?? "unknown"}.`,
  passed
    ? "Successful timing history is available."
    : "This report is diagnostic only and is not a successful timing baseline.",
  "",
  "Durations include tests and hooks, worker preparation, environment, imports, and setup. They are scheduling weights, not summed workflow wall time.",
  "",
  "| Slowest file | Duration (ms) |",
  "| --- | ---: |",
  ...files
    .toSorted((left, right) => right.durationMs - left.durationMs)
    .slice(0, 20)
    .map(
      ({ name, durationMs }) =>
        `| ${name.replaceAll("|", "\\|")} | ${durationMs} |`,
    ),
  "",
].join("\n");
if (process.env.GITHUB_STEP_SUMMARY)
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
else console.log(summary);

if (passed) {
  await mkdir(historyDirectory, { recursive: true });
  await writeFile(
    historyPath,
    JSON.stringify({ version: 1, success: true, files }),
  );
}
