import type { EvidenceBundle } from "../../domain/evidenceBundle.js";
import { AnalysisInputError } from "../../domain/analysisErrorCore.js";
import { err, ok, type Result } from "../../domain/result.js";
import {
  summarizeEvidenceBundle,
  type EvidenceBundleSummary,
  type EvidenceRecordFilters,
  type EvidenceRecordPage,
} from "../../domain/evidenceRecordSummary.js";

/** Select complete bundle delivery or discovery metadata without analysis payloads. */
export const inspectEvidenceBundle = (
  bundle: EvidenceBundle,
  options: EvidenceRecordPage & {
    readonly detail: "complete" | "summary";
    readonly filters?: EvidenceRecordFilters | undefined;
  },
): Result<EvidenceBundle | EvidenceBundleSummary, AnalysisInputError> => {
  const summaryOptions = ["filters", "offset", "limit"] as const;
  const unsupported = summaryOptions.filter(
    (field) => options[field] !== undefined,
  );
  if (options.detail === "complete" && unsupported.length > 0)
    return err(
      new AnalysisInputError(
        "get_evidence_bundle",
        undefined,
        unsupported.map((field) => ({
          path: [field],
          reason: "invalid_value",
          message:
            field === "filters"
              ? "Record filters require detail: summary; complete returns the canonical bundle."
              : "Record pagination requires detail: summary; complete returns the canonical bundle.",
          expected: "detail: summary",
        })),
      ),
    );
  return ok(
    options.detail === "summary"
      ? summarizeEvidenceBundle(bundle, options.filters, options)
      : bundle,
  );
};
