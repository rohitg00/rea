import { createAnalysisProfile } from "../../src/domain/analysisProfile.js";
import { createEvidence, type Evidence } from "../../src/domain/evidence.js";
import { ghidraFunctionDossier } from "../../src/domain/ghidraValues.fixture.js";

const provider = { id: "ghidra", name: "Ghidra", version: "12.1.4" };

export const evidenceDiscoveryFixture = (): Evidence[] =>
  Array.from({ length: 8 }, (_, index) =>
    createEvidence(
      {
        path: `/fixtures/target-${String(index % 2)}.exe`,
        format: "pe",
        sha256: (index % 2 ? "b" : "a").repeat(64),
      },
      provider,
      {
        operation: index < 6 ? "analyze_function" : "address_name",
        parameters: { observation: index },
        analysisProfile: createAnalysisProfile(provider, {
          language: index < 4 ? "x86" : "arm",
        }),
        result: index < 6 ? ghidraFunctionDossier() : "fixture_main",
      },
    ),
  );

export const largeEvidenceDiscoveryFixture = (): Evidence[] => {
  const native = evidenceDiscoveryFixture()[0]!;
  return [
    native,
    ...Array.from({ length: 12_000 }, (_, index) =>
      createEvidence(
        {
          path: "/fixtures/application/bin/analysis-target.exe",
          format: "pe",
          sha256: "c".repeat(64),
        },
        provider,
        {
          operation: "address_name",
          parameters: { address: `0x${(0x401000 + index * 16).toString(16)}` },
          result: `function_${String(index)}`,
        },
      ),
    ),
  ];
};
