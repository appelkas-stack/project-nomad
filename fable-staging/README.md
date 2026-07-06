# Fable

**The offline answer engine.** Ask your offline library anything; get a grounded answer with page-level citations to the exact sources it came from — and an honest "not in your library" when it can't. No internet, no cloud, no account.

> Strategy, research, and loop state live in the companion repo's `FABLE_*.md` files (see `FABLE_PRODUCT_THESIS.md`, `FABLE_BUILD_PLAN.md`). This repo is the product code.

## Status: M0 — PROOF

Current milestone is the kill-switch, not the product: an eval harness measuring what the thesis stands on — **grounding, refusal correctness, citation accuracy, latency** — first against incumbent local-AI tools, then against the Fable prototype. If the benchmark shows no exploitable quality gap, this project stops cheaply.

### Eval harness (task 0.1 — done)

```bash
npm install
npm test                                                # harness self-tests
npm run eval -- --questions eval/questions/sample.yaml  # run vs stub adapter
```

Emits a scored JSON report (`eval/out/report.json`) with per-question scores and aggregate metrics (grounded rate, refusal correctness, citation hit/precision, p50/p95 latency).

Layout:

```
eval/
├── questions/    # YAML question sets (answerable + unanswerable, expectedSources)
├── src/
│   ├── types.ts      # Question/Adapter/Scorer/Report contracts
│   ├── runner.ts     # load → ask → score → aggregate
│   ├── scorers/      # refusal, citation, grounding (baseline), latency via runner
│   └── adapters/     # systems under test; `stub` today, incumbents next
└── cli.ts
```

### Roadmap (M0 tasks)

- [x] 0.1 harness skeleton (this)
- [ ] 0.2 real question sets: 60 medical (WikiMed) / 40 encyclopedia / 20 repair, ~30% unanswerable
- [ ] 0.3 judge-based grounding & citation scorers, calibrated ≥85% vs hand-scoring
- [ ] 0.4 incumbent adapters: Open WebUI, AnythingLLM, LM Studio, NOMAD
- [ ] 0.5 Fable prototype pipeline (hybrid retrieval → rerank → grounding gate → cited generation)
- [ ] 0.6 publish "State of Offline RAG 2026" benchmark report
- [ ] 0.7 willingness-to-pay probe (Fable Packs pre-order page)
- [ ] 0.8 share benchmark with NOMAD upstream

**Note on the baseline grounding scorer:** `eval/src/scorers/grounding.ts` is a lexical-overlap stand-in so the harness runs end-to-end from day one. Its numbers are not product claims; task 0.3 replaces it behind the same interface.

## License

Apache-2.0.
