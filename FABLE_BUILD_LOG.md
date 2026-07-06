# FABLE_BUILD_LOG.md

> Loop 8 artifact — build log. Newest first.

## 2026-07-06 — M0 task 0.1: eval harness skeleton ✅

- **Where:** dedicated Fable repo (local commit `f7821ad`; persistence snapshot in `fable-staging/` — see its STAGING_NOTE.md; GitHub repo creation blocked by integration permissions, awaiting manual creation of `appelkas-stack/fable`).
- **What:** `eval/` harness — question-set YAML schema (answerable/unanswerable + `expectedSources`, validated on load), runner, scorers (refusal correctness; citation hit + precision; grounding via a clearly-labeled baseline lexical scorer to be replaced by a calibrated judge in task 0.3), adapter interface + registry, deterministic stub adapter exercising every failure path (bad refusal, hallucination, wrong citation, ungrounded answer), CLI emitting scored JSON reports, 4 self-tests (node:test).
- **Why this design:** the Scorer/Adapter interfaces are the extension points for tasks 0.3–0.5; scorers return `null` when not applicable so metrics can't be polluted by refusals; answerable questions are rejected at load time if they lack `expectedSources` (garbage question sets fail fast).
- **Verification:** `npm run typecheck` clean; `npm test` 4/4 (end-to-end report shape + designed-failure metric values; perfect score on well-behaved subset; schema validation; grounding heuristic); `npm run eval` produces the scored report (stub: 75% refusal correctness, 80% citation hit — exactly the designed failures).
- **Edge cases handled:** empty answers, refusals, missing snippets, zero-citation answers, adapter-reported vs wall-clock latency.
- **Risks left:** baseline grounding scorer is lexical and must not be quoted as a product claim (flagged in code + README); incumbent adapters not yet built (task 0.4); real question sets pending (0.2). One test expectation was corrected during verification (citation hit 4/5, not 3/5 — the harness was right, the comment math was wrong).
