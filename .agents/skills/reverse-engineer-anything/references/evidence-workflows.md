# Evidence, comparison, and verification workflows

Evidence-producing tools return the complete Evidence record directly in MCP
`structuredContent` and CLI JSON. Read `normalized_result` for operation data,
and cite `evidence_id` when another tool or your explanation needs a stable
reference. Preserve authority, limitations, coverage, and residual unknowns. If a result
is incomplete or paginated, continue only when the remaining data matters to
the task; do not fetch a bundle or resource merely to read a result already
returned inline. When complete `inspect_binary_layout` or
`analyze_javascript_application` Evidence is already retained, call
`inspect_analysis_view` for a summary, one section/symbol/module, or a stable
page instead of repeating the producer.

Completed `inspect_artifact` inventory also supports a summary and
`view: {kind: "inventory", collection: "occurrences", logical_paths: ["package.json", "main.js"]}`.
Omit `logical_paths` to page all available occurrences; `[]` selects none.
Other inventory collections are `nodes`, `edges` and
`integrity_contradictions`. Keep `source_complete` separate from page exhaustion:
a missing match in partial source Evidence does not establish absence. Use the
returned parent Evidence ID for subsequent views and export before closing the
session when the source must survive it.
When `tools/list` advertises `inspect_artifact.detail`, request `"summary"` to
retain its complete source and receive that view immediately. Without that
advertised choice, keep the existing complete call. CLI inspection returns
portable complete Evidence; save it before projecting a selected inline view.

## Keep competing explanations testable

For an unanswered question, state what observation would distinguish the
remaining explanations. Select the smallest supported probe that can supply
that evidence within the requested scope. A matching string, loaded script or
static path can identify a candidate without proving the observed behavior.
Keep a negative result bounded by the searched artifact, selected records,
capture interval and coverage. A missing provider or truncated search leaves a
gap; repeating an unchanged call does not close it.

Use `record_unknown` for a question that must survive the investigation. For
example, after static analysis identifies a candidate cache file but no runtime
observation establishes a startup change:

```json
{
  "question": "Does the selected application create or modify the candidate cache file during startup?",
  "severity": "medium",
  "domain": "startup-cache",
  "required_authority": "controlled-replay",
  "required_confidence": "observed",
  "required_environment": null,
  "recommended_probes": [
    {
      "operation": "capture_process_scenario",
      "rationale": "Compare before and final snapshots of the selected cache file during the startup scenario."
    }
  ],
  "relationships": []
}
```

Add returned supporting or contradicting Evidence IDs when available. Choose
requirements that match the question; this example records a proposed probe
and does not run or authorize it. Keep static findings available if runtime
execution is outside the request.
Filesystem snapshots can show changes; unchanged snapshots do not establish
that the application never read or opened the cache file.

`list_unknowns` returns current heads; use exact filters and its `next_offset`
when paging. `update_unknown` replaces all mutable fields, not just those that
changed. Start from the current head, preserve its evidence links, requirements
and relationships, and send its revision as `expected_revision`. On a stale
revision, reread and reconcile the new evidence before submitting an update.

Use `verify_unknown_resolution` with the returned `unknown_id` to inspect the
current disposition. It does not run a probe or discover new evidence. A
verified resolution must satisfy the recorded authority, confidence and
environment requirements; registry mutation Evidence is not proof of an
answer. `result.valid` can be true for withdrawn or out-of-scope questions;
only `result.truthVerified` indicates a verified disposition. Cite the actual
resolution evidence and its coverage, not the boolean alone.

## Resume with portable Evidence

Retained IDs belong to the current MCP session. `close_binary` clears its ledger,
including unknown revisions. A successful target switch retains Evidence, but
failed provider retirement can clear it. Export before closing, switching
providers or handing off work so the original observations remain available:

1. Call `export_evidence_bundle` with a caller-selected absolute local path,
   such as `{"path":"/work/investigation/evidence.json"}`. Existing files
   require an explicit `overwrite: true`; preserve the original export when
   it is the handoff baseline.
2. Record the bundle path, artifact digests, relevant Evidence IDs and unknown
   IDs, the answered question, competing explanations, coverage gaps and next
   useful probe. Reference the bundle rather than copying complete payloads
   into the handoff. Preserve any external captures or exported source/map
   files needed by later tools; a bundle does not recreate those files.
3. In the destination MCP session, open the intended target first only if the
   next operation requires an active target. Then call `import_evidence_bundle`
   with the saved absolute path. Import validates IDs, manifests and unknown
   revision history before merging atomically; it does not select a target,
   restore an analysis database, start a provider, or refresh runtime facts.
4. Discover imported records with `get_evidence_bundle` using
   `{"detail":"summary","filters":{"operation":"analyze_javascript_application"}}`,
   adding an exact target SHA-256 when several artifacts are present. Use
   returned IDs for supported retained views and `list_unknowns` for current
   heads. Recheck any claimed resolution with `verify_unknown_resolution`.

The handoff is usable when the selected records and unknown heads can be read
in the destination session and any next required external artifact is
available. Historical observations remain historical even when import succeeds.
Evidence import is distinct from `open_binary` analysis-snapshot restoration,
which requires the matching target, provider and analysis profile. The CLI
`evidence-import` validates a file; it does not populate a future MCP session.

## Compare only the stated scope

Use comparisons with complete, compatible page sets when claiming equivalence
or absence:

- `compare_artifacts` compares inventory pages by occurrence path, content,
  metadata, and graph relations.
- `compare_functions` compares explicit function Evidence, not fuzzy
  whole-binary matches.
- `compare_bundles` compares canonical bundle membership and unknown history.
- `find_changed_behavior` combines existing comparisons; static differences
  remain candidates, not causal proof.
- `build_call_path` needs explicit function dossiers from one artifact/provider;
  an incomplete frontier makes absence unknown.
- `correlate_static_and_runtime` uses explicit mappings; matching patterns are
  hypotheses, not causality.
- `verify_reconstruction` evaluates a finite typed specification. A pass covers
  only declared comparable claims, not global equivalence.

Process captures are opt-in behavioral evidence, not a security sandbox. V3
captures cannot be upgraded to V4; rerun the original scenario. Distinguish root
exit from descendant settlement and require freshness when the task needs it.
A timed-out target that must write a final report needs `finalization_ms`: REA
sends SIGTERM to the captured root, keeps observing, and sends SIGKILL once
only if the target has not exited by the end of the interval.
`exit.finalization.signals` lists each attempt with its delivery result; the
observed exit signal stays in `exit.signal`, `exit.code` is null for every
deadline exit, and the code of a finalizer that exited on its own is in
`exit.finalization.exit_code` (null on a signal exit or when no exit was
observed).

Use `inspect_analysis_view` with `view: {kind: "api-surface"}` on retained
`inspect_web_network_capture` HAR Evidence to group observed request lines by
method, origin and path template. Format matches are inferences, not handler
identity or schemas. Group pages cite parent record ordinals; consult record
coverage and exclusions before claiming completeness. No requests are replayed.
