# FABLE_PRODUCT_THESIS.md

> Loop 4 artifact — Product Thesis. Date: 2026-07-06.
> Wedge from FABLE_GAP_MAP.md: "Fable Answers" — citation-first offline answer engine + verified knowledge packs.

## One-sentence positioning

**Fable is the offline answer engine: ask your own library anything, get a trustworthy answer with the exact page it came from — no internet, no cloud, no subscription required to keep working.**

## Product manifesto

The internet forgets, gets filtered, and goes down — 313 shutdowns in 52 countries in 2025, thousands of public-knowledge pages deleted. People responded by hoarding archives they can't actually use: 6 million raw Wikipedia articles behind a keyword search is not knowledge, it's a haystack. Meanwhile local AI answers fluently and lies confidently — and the people who most need offline answers (a parent mid-emergency, a nurse at a disconnected clinic, a homesteader mid-repair) are exactly the people who can't afford a hallucination.

Fable's bet: **trust is the product.** Not model size, not feature count. Every answer carries its receipts — the exact pages in your own offline library it came from — and when the library doesn't contain the answer, Fable says so and shows the closest pages instead of guessing. The archive you already have becomes something you can talk to; the AI you were right not to trust becomes accountable.

## ICP (ideal customer profile)

**Primary (buyer):** the "resilient household" — preparedness-mainstream and data-preservationist buyers (US-led, 30–60, mixed gender, FEMA's 83%-took-action cohort) who already spent $180–280 on a Prepper Disk-class device or are considering one. They own modest hardware (a mini-PC, an old laptop, 8–16GB RAM, usually no GPU). They buy turnkey, not DIY.

**Secondary (evangelist):** self-hosters/homelabbers (NOMAD's 33k-star community) — they won't pay for software but they harden it, spread it, and demand it on the platforms (Umbrel, TrueNAS) that reach buyers.

**Tertiary (later, via channel):** NGO/education deployers (RACHEL/Kolibri channel; frontline-health-LLM pilots) and homeschool families — served after the engine is proven, not before.

## Pain (ranked)

1. "I have the archive but can't find the answer when it matters" (keyword search over 6M articles).
2. "I don't trust AI answers, especially for medical/safety questions" (hallucination anxiety; documented anti-AI faction).
3. "My content is stale and there's no update story" (universal complaint).
4. "Everything good requires a GPU and a terminal" (NOMAD's own spec excludes its audience; setup friction = its top 'Critical' issues).

## Jobs-to-be-done

- When the network is down/absent and something is wrong, get me a correct, sourced procedure fast (medical, repair, safety).
- When I'm learning or homeschooling offline, answer questions and show me where to read more.
- When I archive knowledge, keep it current and prove to me it's trustworthy.

## Activation moment

**The first cited answer from the user's own library** — within 15 minutes of install: pick a starter pack (or point at existing ZIMs) → indexing runs → user asks a real question → answer arrives with tappable page citations → user taps one and lands on the source page. "It showed me where it got that" is the moment Fable is unlike every AI they've used.

## Retention loop

Monthly verified content updates (new/refreshed packs) → notification: "your medical pack has 214 updated articles" → re-index → new questions answerable → renewed confidence in the box being *current* → subscription renews. Secondary loop: each answered-well moment builds the habit of asking Fable before asking the internet.

## Monetization model

- **Core engine: free and open source** (Apache-2.0, consistent with ecosystem norms; closed-source would kill the evangelist channel — see Open WebUI backlash).
- **Fable Packs: paid verified knowledge packs + freshness subscription** — $49/yr (or ~$5/mo) for curated, versioned, provenance-tracked packs (medical, repair/service manuals, homestead, region/maps, education), with licensed content where it matters (the thing DIY cannot copy). Precedents: Msty $149/yr licenses, Prepper Disk's licensed-content defense, universal staleness complaint.
- **Later:** hardware-partner licensing (Prepper Disk-class vendors, Umbrel) and NGO/education deployments. Explicitly NOT hosted SaaS (Khoj precedent).

## Why now

1. Data-deletion/shutdown anxiety is at all-time highs and buying devices (404media-documented boom).
2. Small local models crossed the "good enough with great retrieval" threshold (3–8B class) while incumbents still chase big-model UX.
3. The category's demand event (NOMAD, 33k stars in 4 months) just proved the audience and left the trust/quality/hardware-reality gaps open.
4. Trust positioning is newly claimable: Open WebUI license backlash + Ollama cloud pivot alienated exactly our evangelists.

## Why Fable wins

- Only player whose **unit of value is the verified answer**, not the archive (Kiwix/Prepper Disk) or the chat UI (Open WebUI/LM Studio).
- Citation-first is both differentiator and defensible habit: competitors would need to rebuild retrieval around provenance, not bolt it on.
- Corpus curation + per-corpus retrieval tuning compound into a moat; chat UIs don't.
- Rides, rather than fights, the ecosystem: ZIM standard, Ollama-compatible runtimes, NOMAD community, app-store distribution.

## MVP scope (build)

1. ZIM-native retrieval pipeline: per-corpus chunking/embedding recipes (encyclopedia, manual, textbook), tuned for 8–16GB no-GPU hardware (small embedder + 3–8B answer model, quantized).
2. Citation-first answer UX: every claim maps to tappable source pages; confidence gating; "not in your library — closest pages:" honest-degradation mode.
3. Library manager: point at existing ZIMs/documents, pick starter packs, index with progress.
4. One-click packaging: Docker image + Umbrel/TrueNAS/Runtipi/CasaOS app listings; NOMAD-compatible integration.
5. Eval harness: a question-set benchmark per pack (answerable + unanswerable questions) — the quality claim must be measurable, or the whole thesis collapses.

## Anti-scope (explicitly not building)

- No hosted cloud, no accounts-on-our-servers, no telemetry.
- No general chat features (personas, web search, image gen) — Open WebUI exists.
- No custom hardware in MVP; no handhelds ever.
- No model training; inference + retrieval only.
- No enterprise RBAC; family-grade profiles at most.
- AI-optional: the library manager + citations work as a great offline reader even with AI off.

## Success metrics

- **Activation:** ≥60% of installs reach first-cited-answer within 1 day.
- **Quality (the metric):** ≥90% of benchmark answers fully grounded (zero uncited claims); ≥95% correct refusal on unanswerable questions; p50 answer latency ≤10s on a 16GB no-GPU mini-PC.
- **Adoption:** app-store listings live on ≥3 platforms; 5k installs in 90 days post-launch (NOMAD's gravity makes this conservative).
- **Revenue (wedge 2):** 500 pack subscriptions in the first 6 months ≈ $24.5k ARR — enough to prove the model, not the business.

## Gate check (Loop 4)

Clear user (resilient household + proven $180–280 spend), painful problem (can't get trusted answers from owned archives; documented across every competitor's complaint channels), believable willingness to pay (Prepper Disk/Msty/RecurseChat precedents; freshness subscription monetizes the top complaint) — **gate PASSED**, with one honest caveat carried to FABLE_RISKS.md: free-engine + paid-packs conversion is unproven in this exact niche; the kill-review (Loop 14, not yet run) must attack it.
