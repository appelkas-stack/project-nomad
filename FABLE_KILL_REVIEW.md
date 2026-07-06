# FABLE_KILL_REVIEW.md

> Loop 14 artifact — Adversarial Kill Review. Date: 2026-07-06.
> Rules: argue the strongest case AGAINST Fable on every axis, then decide what (if anything) survives. Evidence cites FABLE_COMPETITORS.md; new attacks are reasoned, marked [attack-inference].

## 1. Why Fable should not exist

**"Citation-first RAG" is a feature, not a product — and the feature is converging everywhere.** LocalAI shipped RAG source citations in June 2026. Hyperlink (Nexa AI, funded) already ships cited answers over local files, free. Open WebUI has knowledge collections and 124k+ stars of iteration speed; AnythingLLM's entire roadmap is RAG quality. NOMAD's issue #947 requests exactly this. The realistic window before "grounded answers with citations" is table stakes in every local-AI tool is **6–18 months** [attack-inference]. Fable's differentiator has an expiry date, and the company is being founded on the expiring part.

**The honest counter:** citations-as-checkbox ≠ citation-first product (verification pass, refusal mode, per-corpus tuning, measurable grounding rate). Checkbox citations that still hallucinate may even sharpen the trust gap. But this counter only holds if Fable can *prove* a quality delta — which is exactly why the eval harness must come first. If the benchmark shows incumbents are already good enough, **kill the project at that point, cheaply.**

## 2. Why competitors win

- **NOMAD (the killer scenario):** 33k stars, a 530k-sub YouTube distribution engine, an active roadmap, and this exact feature already requested by its community. If Fable launches standalone, Chris Sherwood can ship a "good enough" version in a quarter and his audience will never hear of Fable. Fable's planned distribution (the NOMAD community) is **owned by its most credible fast-follower** (R-19).
- **Hyperlink/Nexa:** venture-funded, on-device, NPU-optimized, free-during-beta. If they add ZIM/corpus support, they occupy the wedge with more engineering capacity [attack-inference].
- **Prepper Disk:** owns the paying-customer relationship and the hardware channel. Their AI is weak *today*, but swapping a 3B for an 8B + better retrieval is an incremental upgrade for them and an existential race for Fable.

**Counter:** none of the three is structurally *prevented* from winning — the only defenses are (a) speed to a provable quality bar, (b) making NOMAD a channel instead of a rival (contribute the engine upstream, own the pack layer), and (c) the corpus/recipe/eval moat, which compounds only if started now.

## 3. Why users will not pay

- The loudest audience (self-hosters) has **documented DIY price-resistance** — "$75 DIY vs $180 commercial" is the #1 forum objection; a free GitHub "AI-Survival-USB" exists specifically to spite paid products.
- The engine is free (strategically forced — see Open WebUI backlash), so revenue rests entirely on **packs**. But most pack raw material (Wikipedia, WikiMed, iFixit ZIMs) is free from Kiwix; the paid delta is "verified/current/tuned," which is invisible until the moment it matters. Convincing buyers to pay $49/yr for *invisible* curation is a hard marketing problem [attack-inference].
- Buyers with proven willingness to pay (preppers) pay for **objects** (a box in a Faraday bag), not software subscriptions. Zero "sell me a box" chatter in NOMAD's issues cuts both ways: maybe the payer is elsewhere, maybe the payer doesn't exist for software.
- Khoj — a beloved, well-executed personal-AI-knowledge product — could not make individuals pay sustainably, and died.

**Counter:** Msty ($149–349/yr) and RecurseChat ($9.99) prove individuals do pay for local-AI *software* when it's the polish layer; Prepper Disk proves they pay for curation+convenience bundles. But the conversion rate is genuinely unknown → **must be tested with a pre-order/landing page BEFORE building the pack pipeline**, not after.

## 4. Why the tech will fail

- **CPU latency is brutal:** hybrid retrieval + cross-encoder rerank + 3–8B generation, all on a 16GB no-GPU mini-PC, targeting p50 ≤10s. Reranking 40 chunks on CPU alone can eat seconds; an 8B Q4 generates ~5–15 tok/s on desktop CPUs — a 200-token grounded answer can blow the budget by itself [attack-inference]. The thesis metric may be physically unmeetable on the promised hardware, forcing either weaker models (quality collapse → Prepper-Disk-grade) or higher hardware floor (audience collapse → Hyperlink's 32GB problem).
- **Indexing cost:** embedding a 100GB+ Wikipedia ZIM on CPU takes days, not the onboarding-friendly "~X min" the narrative promises. NOMAD's own embed pipeline batches for a reason. First-run experience may be the real killer, not answer latency [attack-inference].
- **Citation verification is unsolved in the general case:** sentence-to-chunk attribution is approximate; a "verified" citation that's subtly wrong is worse than no citation for a medical answer.

**Counter — and the kill-review's most important output:** every one of these is *measurable in week one* with the eval harness before any product code. Mitigations exist (pre-built indexes shipped inside packs — which also strengthens the paid-pack value proposition; extractive-first answers for latency; refusal-biased thresholds), but none should be assumed. **The eval harness is not MVP task #1 by preference; it is the kill-switch.**

## 5. Why distribution will fail

- App stores (Umbrel/TrueNAS/Runtipi) are shelves, not demand: low-intent browsing, no featured placement guarantee.
- YouTube creators made NOMAD famous because it was *free and theirs*. A commercial quasi-competitor gets no such love; riding r/selfhosted while monetizing invites the exact backlash Open WebUI got [attack-inference].
- The paying persona (preparedness-mainstream) is reached via channels Fable has no presence in (prepper expos, gift guides, Amazon) — channels that favor hardware objects.

**Counter:** the upstream-contribution path converts the biggest distribution threat into the channel (engine lands in NOMAD → 33k-star reach → Fable owns packs/brand). This requires the founder to genuinely prefer ecosystem-play over empire-play — a real strategic commitment, not a tactic.

## 6. Why the founder will lose focus

The plan spans: retrieval engineering + model ops + eval science + content curation + licensing negotiation + 4 platform packagings + community management + marketing to two very different personas. That is 3–4 jobs. Evidence of risk: this repo already contains one drive-by experiment (unused remotion deps). A solo founder doing content-ops (the revenue side) will starve the engine (the moat side), or vice versa [attack-inference].

**Counter:** the phased plan (below) forces one job at a time with kill-gates between phases.

## 7. The smallest version still worth testing

**"The Offline RAG Benchmark + one great demo."** Four weeks, ~zero capital:

1. **Eval harness + public benchmark report** — a question set (answerable/unanswerable, medical/repair/encyclopedia) run against Open WebUI, AnythingLLM, LM Studio, NOMAD, and a Fable prototype pipeline, measuring grounding rate, refusal correctness, citation accuracy, CPU latency. Publish it ("State of Offline RAG 2026"). This (a) proves or kills the quality-gap thesis with data, (b) is itself link-worthy distribution in exactly the right communities, (c) becomes the permanent quality regression suite.
2. **One vertical demo** — Fable prototype answering over WikiMed with citations + refusal, running on a 16GB no-GPU machine, screen-recorded.
3. **WTP probe** — "Fable Packs" landing page with pre-order for a verified medical pack; measure conversion against the benchmark-report traffic.

Kill criteria for the smallest version: incumbents score >80% grounded already (no gap) · Fable prototype can't beat them meaningfully on the same hardware (no product) · pre-order conversion ~0 against real traffic (no business). Any of the three → stop or pivot to contributing the eval work upstream and walking away cheap.

## VERDICT

**The idea survives — narrowed and re-sequenced.** It dies as "build the engine, then find out"; it lives as "prove the gap, then build only what the proof justifies." Three binding conditions attach:

1. **Eval harness before any product code** (kills R-15 cheaply, in either direction).
2. **WTP validated by pre-orders before content-ops investment** (kills R-16 cheaply).
3. **Upstream engagement with NOMAD in phase 1, not after launch** (converts R-19 from threat to channel — founder decision point).

Gate: idea survives kill review → **PASSED, conditionally**. → Loop 7 (Implementation Plan) with the conditions baked into milestone 0.
