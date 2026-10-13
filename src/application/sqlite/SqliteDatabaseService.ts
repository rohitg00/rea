import { isAbsolute } from "node:path";
import type { ExecutionOptions } from "../AnalysisProvider.js";
import type { SqliteDatabasePort } from "./SqliteDatabasePort.js";
import type { AnalysisError } from "../../domain/analysisErrorBase.js";
import {
  AnalysisCancelledError,
  AnalysisInputError,
  AnalysisOutputError,
} from "../../domain/analysisErrorCore.js";
import { createEvidence, type Evidence } from "../../domain/evidence.js";
import {
  inspectSqliteDatabaseInputSchema,
  sqliteDatabaseSchema,
  matchesSelectedSqliteDatabase,
  sqliteInspectionParameters,
} from "../../domain/sqlite/sqliteDatabase.js";
import { analysisInputErrorFromIssues } from "../../domain/inputIssueProjection.js";
import { err, ok, type Result } from "../../domain/result.js";
import { jsonValueSchema } from "../../domain/jsonValue.js";

const OPERATION = "inspect_sqlite_database";

/** Shared snapshot inspection and caller-selection validation for CLI and MCP. */
export class SqliteDatabaseService {
  constructor(readonly provider: SqliteDatabasePort) {}

  /** Await provider shutdown, retaining failed cleanup owners for retry. */
  close(): Promise<void> {
    return this.provider.close?.() ?? Promise.resolve();
  }

  /** Inspect an explicit database snapshot and preserve its original database/WAL identity. */
  async inspect(
    rawInput: unknown,
    options?: ExecutionOptions,
  ): Promise<Result<Evidence, AnalysisError>> {
    if (options?.signal?.aborted)
      return err(new AnalysisCancelledError(OPERATION));
    const input = inspectSqliteDatabaseInputSchema.safeParse(rawInput);
    if (!input.success)
      return err(
        analysisInputErrorFromIssues(OPERATION, input.error.issues, rawInput, {
          cause: input.error,
        }),
      );
    if (!isAbsolute(input.data.path))
      return err(
        new AnalysisInputError(OPERATION, undefined, [
          {
            path: ["path"],
            reason: "invalid_format",
            message: "Expected an absolute filesystem path on this host.",
          },
        ]),
      );
    const inspected = await this.provider.inspect(input.data, options);
    if (!inspected.ok) return inspected;
    const execution = inspected.value;
    const report = sqliteDatabaseSchema.safeParse(execution.result);
    if (
      !report.success ||
      execution.subject === null ||
      !matchesSelectedSqliteDatabase(report.data, input.data, execution.subject)
    )
      return err(
        new AnalysisOutputError(
          OPERATION,
          "SQLite adapter returned malformed data or changed the selected database identity/table/row limit.",
        ),
      );
    return ok(
      createEvidence(execution.subject, execution.provider, {
        operation: OPERATION,
        parameters: sqliteInspectionParameters(input.data),
        result: jsonValueSchema.parse(report.data),
        ...(execution.rawResult === null
          ? {}
          : { rawResult: execution.rawResult }),
        confidence: "observed",
        locations: execution.locations,
        limitations: execution.limitations,
      }),
    );
  }
}
