# FABLE_BUILD_PLAN.md

> Loop 7 artifact — Implementation Plan for "Fable Answers". Date: 2026-07-06.
> Binding conditions from FABLE_KILL_REVIEW.md: (1) eval harness before product code, (2) pack pre-orders before content ops, (3) NOMAD upstream engagement in phase 1. Timelines assume a solo founder working ~full-time; they are estimates, not commitments.

## Milestones

### M0 — PROOF (the kill-switch) · ~4 weeks
The smallest version worth testing (kill review §7). No product UI.
- Eval harness: question sets, grounding/refusal/citation/latency scorers.
- Benchmark run vs Open WebUI, AnythingLLM, LM Studio, NOMAD on identical hardware (16GB no-GPU reference machine + one GPU machine).
- Fable prototype pipeline (script-grade, not product): hybrid retrieval + rerank + gate + generation + citation check over WikiMed + Wikipedia-mini ZIMs.
- Public artifact: "State of Offline RAG 2026" report.
- WTP probe: Fable Packs landing page + verified-medical-pack pre-order, pointed at report traffic.
- Upstream engagement: open a NOMAD discussion/issue sharing the benchmark + intent (founder decision point F1 first).
- **Exit gate (kill criteria):** incumbents <80% grounded AND prototype beats best incumbent by ≥15pts grounded at ≤2× latency AND pre-order conversion >0.5% → proceed. Any failure → stop or pivot per kill review.

### M1 — MVP ENGINE · ~6–8 weeks after M0 passes
- `fable` service: Ask API (SSE) + Library manager + background indexer.
- Embedded index (SQLite + sqlite-vec + FTS5); bundled llama.cpp-server; OpenAI-compatible external-endpoint option.
- Citation-first answer UI (Ask surface + source viewer + citation rail); honest-refusal mode; AI-off reader mode.
- Recipes v1: encyclopedia + manual + textbook.
- **Pre-built pack indexes** (ship embeddings inside packs — solves CPU-indexing-days problem, strengthens paid-pack value; from kill review §4).
- Quality panel (local-only grounded-rate/latency metrics).
- **Exit gate:** activation flow (install → first cited answer) ≤15 min on reference hardware with a pre-indexed starter pack; benchmark regression suite green; p50 ≤10s or explicitly re-negotiated metric with data.

### M2 — ALPHA (distribution) · ~4 weeks
- Packaging: Docker image; Umbrel, Runtipi, TrueNAS, CasaOS app listings; NOMAD integration path per F1 outcome.
- Docs, install guides, demo video.
- 20–50 alpha users from self-host communities; structured feedback.
- **Exit gate:** ≥3 store listings live; ≥60% of alpha installs reach first-cited-answer day one.

### M3 — BETA (revenue) · ~6 weeks
- Pack system: signed manifests, versioning, provenance metadata, update checks, purchase/entitlement flow (one-time codes or license keys — no accounts server if avoidable).
- First two paid packs: Verified Medical, Repair/Manuals (licensing per F3).
- Freshness pipeline: curation workflow + monthly release train.
- **Exit gate:** ≥100 paying pack customers or ≥$5k revenue in 60 days of beta → else revisit business model (Loop 13) before launch.

### M4 — PRODUCTION LAUNCH
- Security pass (Loop 10), performance pass (Loop 11), deployment/rollback/update story (Loop 12), launch narrative (Loop 5 assets), creator seeding.
- Gate: FABLE LOOP OS Loops 9–12 gates all pass.

## Folder structure (new top-level `fable/` in this repo — see F2)

```
fable/
├── eval/                    # M0 — the kill-switch, kept forever as regression suite
│   ├── questions/           # per-corpus question sets (answerable + unanswerable), YAML
│   ├── scorers/             # grounding, refusal, citation-accuracy, latency
│   ├── adapters/            # openwebui, anythingllm, lmstudio, nomad, fable
│   └── report/              # benchmark report generator
├── engine/                  # M1
│   ├── src/
│   │   ├── ask/             # orchestrator, retrieval, rerank, gate, generate, verify
│   │   ├── index/           # sqlite-vec store, FTS, per-corpus recipes
│   │   ├── library/         # ZIM/PDF/EPUB ingestion (port of zim_extraction_service logic)
│   │   ├── packs/           # manifest verify/install/update (M3)
│   │   ├── runtime/         # llama.cpp lifecycle + OpenAI-compatible client
│   │   └── api/             # HTTP + SSE
│   ├── ui/                  # Ask + Library surfaces (React, reuse admin/ conventions)
│   └── tests/
├── packs/                   # M3 — pack build tooling + curation workflow
└── packaging/               # M2 — docker/, umbrel/, runtipi/, truenas/, casaos/
```

## Build order & dependency map

```
M0: questions → scorers → adapters(incumbents) → prototype pipeline → benchmark report → WTP page
        │                                              │
M1: recipes v1 ◄── learnings ──┘        engine/src/ask ◄── prototype promoted
    index store → library ingestion → runtime → api → ui → quality panel
M2: packaging (depends only on M1 docker image) ∥ docs ∥ alpha cohort
M3: packs tooling → signed manifests → entitlements → first packs (depends on F3 licensing)
```
Parallelizable: M2 packaging alongside late M1; pack curation research alongside M1 (no build until M0 WTP + F3).

## Task list — M0 (current milestone), with acceptance criteria

| # | Task | Acceptance criteria |
|---|---|---|
| 0.1 | **Eval harness skeleton**: question-set schema (question, expected-grounding refs, answerable flag), runner, scorer interfaces | `fable/eval` runs end-to-end against a stub adapter and emits a scored JSON report |
| 0.2 | Question sets v1: 60 medical (WikiMed), 40 encyclopedia, 20 repair; 30% unanswerable-by-corpus | Each question has human-verified source pages; unanswerables verified absent |
| 0.3 | Grounding + citation scorers | Sentence→chunk attribution scored; agreement with hand-scoring on 30-sample calibration ≥85% |
| 0.4 | Incumbent adapters (Open WebUI, AnythingLLM, LM Studio, NOMAD) | Same corpus + model loaded in each; automated runs reproducible |
| 0.5 | Fable prototype pipeline | Beats best incumbent on grounded-rate on the same hardware/model, measured |
| 0.6 | Benchmark report + publish | Report with methodology, reproducible configs; posted publicly |
| 0.7 | WTP landing page + pre-order | Live page, analytics, pre-order (refundable) flow |
| 0.8 | NOMAD upstream engagement (after F1) | Discussion opened with benchmark data; response logged in FABLE_DECISIONS.md |

## Test strategy

- Eval harness IS the primary test asset (quality regression suite forever; runs in CI on every recipe/engine change).
- Engine: unit tests for gate/verify logic (the safety-critical paths), integration test per corpus type, golden-answer snapshots.
- UI: activation-flow e2e (install → first cited answer).
- Unlike the host repo (zero tests — R-03), tests are non-negotiable here: the product claim is measurable quality.

## Timeline (aggregate, solo founder)

M0 ~4 wks → M1 ~6–8 wks → M2 ~4 wks → M3 ~6 wks → launch ≈ **5–6 months** to revenue-tested launch. Every milestone has a kill/renegotiate gate; the maximum sunk cost before the first kill decision is ~4 weeks.

## Founder decision points (require human input; do not proceed past them silently)

- **F1 (before task 0.8): NOMAD relationship** — contribute engine upstream and own packs/brand (recommended in kill review) vs. standalone product vs. silent parallel build. Shapes M2 entirely.
- **F2 (before M1): repo home** — `fable/` inside this fork vs. fresh dedicated repo (cleaner licensing/story, loses monorepo convenience). Plan assumes `fable/` until decided.
- **F3 (before M3): content licensing scope** — which pack content requires licenses (medical references beyond WikiMed, OEM service manuals) and budget ceiling; determines pack lineup (R-17).
- **F4 (M0 exit): kill/proceed call on the benchmark + WTP data** — this one is the point of the whole plan.

## Stack decision (D-012, recorded in FABLE_DECISIONS.md)

TypeScript/Node for engine + eval (reuses NOMAD's libzim/extraction code and the founder-familiar stack; better-sqlite3 — currently an unused dep upstream — becomes load-bearing), llama.cpp as a spawned server binary, React UI. Rust single-binary rewrite is a possible M4+ optimization, not an MVP concern.

## Gate check (Loop 7)

Next coding task is atomic and testable: **task 0.1 — eval harness skeleton** with a stub adapter and a scored-report acceptance test. **Gate PASSED.** → Loop 8 (Build) is ready to start on task 0.1 upon go-ahead.
