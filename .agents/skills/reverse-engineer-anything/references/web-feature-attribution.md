# Attribute captured website code

Use this workflow to locate original source or module relationships for one
selected captured script. Start with a concrete question, such as which original
source contains a reported callback, or which captured module could satisfy its
import. Source association, execution coverage and feature causality are separate
claims. A plausible filename or matching URL is not a source identity.

## Select and export the retained source

Start with the existing capture and its Evidence ID. If source bytes are missing,
follow [runtime observation](runtime-observation.md) to discover the selected
page with `list_browser_targets` and request `inspect_web_page` with
`include_script_sources: true`. For example, after selecting the actual target:

```json
{
  "cdp_endpoint": "http://127.0.0.1:9222",
  "target_id": "TARGET_ID_FROM_LIST_BROWSER_TARGETS",
  "include_script_sources": true
}
```

Save the complete Evidence from MCP `structuredContent`, or the normalized
result, as UTF-8 JSON. `export_web_scripts` accepts saved `inspect_web_page` or
`capture_browser_scenario` results. It does not accept `observe_web_execution` or
`inspect_web_event_listeners` results. An existing scenario must have retained
`capture.network.response_body`; do not initiate browser actions merely to fill
this gap. Keep the recorded capture coverage and source-body limitations.

Call `export_web_scripts` with an absent output directory whose parent exists:

```json
{
  "capture_path": "/analysis/capture.json",
  "output_directory": "/analysis/exported-scripts"
}
```

Use returned `manifest.path` and select the zero-based index in `scripts`, not a
CDP script ID. Check `content.state`, `content.sha256`, `content.bytes`, and the
source identity: `script_key`/`frame_id` for page scripts, or
`transaction_id`/event sequence references for scenario responses. Preserve
`source_evidence_id`, `capture_sha256` and manifest identity in the evidence chain.
Multiple entries sharing a URL remain separate candidates.

If `analysis_input` is non-null, pass that returned object to
`analyze_javascript_application` when local file/module inventory is needed.
This analyzes exported bytes; its filesystem resolution cannot establish browser
import-map behavior. If `analysis_input` is null, stop static analysis and report
the unavailable source reasons. Export neither refetches assets nor executes them.

## Map one generated point to original source

Choose a local source-map file explicitly. A `source_map_url` declaration alone
does not supply its bytes or establish that it matches the deployed script. Do
not fetch the declaration automatically. With a selected map and exported script,
call `trace_web_source_location`:

```json
{
  "manifest_path": "/analysis/exported-scripts/manifest.json",
  "script_index": 0,
  "source_map": {
    "path": "/analysis/app.js.map",
    "url": "https://example.test/maps/app.js.map?v=7#context"
  },
  "generated_position": { "line": 1, "column": 25 }
}
```

Replace the example index and point with the selected entry and known position.
The map URL is a name-resolution context, not a fetch request. The operation
verifies manifest, script and map bytes; map pairing remains caller-selected.
If only a local map is available, its absolute file URL, such as
`file:///analysis/app.js.map`, supplies local resolution context. Report the
deployment URL as unknown; local resolution does not recover browser source URLs.

Lines here are one-based and script-relative; columns are zero-based UTF-16.
For a runtime callback/request location, retain the available session `script_id`,
source digest and enclosing-resource coordinates. Separately captured matching
text establishes byte correspondence, not the same runtime instance; do not join
captures by script ID or URL alone. Convert an external-script line with
`line_number + 1`; an empty script ID does not prevent that coordinate conversion.
For an associated inline script with known `resource_start`, use
`line_number - resource_start.line_number + 1`, subtracting the start column only
on that first resource line. Keep columns unchanged on later lines. Missing
columns or an unknown inline association/start leave the conversion unknown.
See [coordinate semantics](https://github.com/morluto/rea/blob/main/docs/web-runtime.md)
before transferring a runtime point.

Read `lookup.matched_generated_position` and every `matches` entry. Lookup uses
the greatest generated position at or before the request, including earlier
lines; it is not necessarily an exact-point match. Keep generated-only segments,
duplicate sources and indexed section identities. An original position outside
embedded text has no verified text offset. `sourcesContent` hashes identify the
map's embedded text, not an independently captured original file. A mapped point
does not establish coverage of an entire function or execution.

## Trace an outgoing module edge when it answers the question

For a selected import or re-export, use `trace_web_module_imports`. Supply explicit
inline/document-base context and a local import map only when known:

```json
{
  "manifest_path": "/analysis/exported-scripts/manifest.json",
  "script_index": 0,
  "importer_url": "https://example.test/app/main.js?build=2#entry",
  "import_map": {
    "path": "/analysis/import-map.json",
    "base_url": "https://example.test/maps/"
  }
}
```

Omit optional context when unavailable; the reported source URL is then used as
the importer, which cannot establish an inline script's document base. Literal
imports require caller-supplied Chromium via absolute `REA_BROWSER_EXECUTABLE`.
Only REA's resolver stub executes; captured application code is parsed as data.
The selected import map is context, not proof that the page installed it.

Retain each resolved URL or rejection and all `captured_candidates`. Query and
fragment variants are distinct; `response-url-without-fragment` is weaker than
`exact-reported-url`. Candidate metadata is recorded capture evidence; only the
selected script's bytes are reverified. Computed imports remain unknown, and a
resolved URL with no captured candidate does not prove the dependency was absent.
Do not fetch missing modules or replace native edges with guessed bundler IDs.

## Finish with a bounded conclusion

Report the selected script/digest, requested and matched coordinates, source/map
Evidence links, candidate module edges and unresolved alternatives. Separate
captured text, map derivation and any inference connecting them to the feature.
Existing execution observations cover their recorded window, not prior activity;
missing coverage is unknown, and a listener or initiator association alone does
not prove feature causality.

Stop when the selected source question is answered. Otherwise name one useful
next probe: retain missing source bytes, obtain an explicitly selected local map,
verify an ambiguous candidate's bytes, or collect a separately scoped execution
window. State what that probe would distinguish; do not expand into navigation,
clicking, page evaluation, remote fetching or unrelated module traversal.
