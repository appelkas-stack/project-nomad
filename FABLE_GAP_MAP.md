# FABLE_GAP_MAP.md

> Loop 3 artifact — Gap Discovery. Date: 2026-07-06.
> Input: FABLE_COMPETITORS.md (30+ competitors/substitutes, 4 categories). Facts cite that file; wedge selection is judgment, marked as such.

## The structural finding

The market is **three camps that don't talk to each other**:

| Camp | Has | Lacks |
|---|---|---|
| Local-AI software (Open WebUI, LM Studio, AnythingLLM, Msty…) | AI, momentum | Curated knowledge, appliance UX, trust-grade RAG |
| Offline-knowledge/education (Kiwix, IIAB, RACHEL, Kolibri, Prepper Disk) | Corpus, channels, paying buyers | Any real AI; modern UX |
| Self-hosting platforms (Umbrel, TrueNAS, Start9…) | Hardware + app-store distribution | Integration — Ollama and Kiwix sit side-by-side, unwired |

Everything needed exists as commodity parts. **Nobody ships the experience: ask a question offline, get a trustworthy, cited answer from a curated corpus.** The only entity combining all ingredients (Project NOMAD, this repo's upstream) is free, software-only, English-only, GPU-hungry, and unmonetized.

## A. Obvious gaps
1. **Answers, not archives** — every incumbent ships a searchable pile; the user in the moment of need has a *question*. Grounded Q&A over the offline corpus is at best half-attempted (NOMAD toolbox RAG; Prepper Disk's 3B pre-order at 3–30s/answer).
2. **Turnkey AI appliance hole** — NOMAD refuses hardware; Prepper Disk's AI is hobbyist-grade; Etsy fills the gap badly at $700–1,000. No credible product at the proven $300–500 anchor.
3. **RAG quality as product** — the #1 documented complaint in every leading local-AI tool; all treat retrieval quality as user-tunable config.

## B. Hidden gaps
1. **Citation-first trust UX** — prepper/preparedness buyers are precisely the users who distrust hallucination; "answer + the exact page in your offline library" is simultaneously the differentiator, the safety requirement, and the anti-AI-faction peace treaty (the citation *is* the fallback browsing UX). No incumbent does this.
2. **The data-preservationist persona** — fastest-growing driver (federal data deletions, 832k-member DataHoarder mobilization); buyers want "a library of record that can answer questions," not camo branding. Under-marketed by everyone.
3. **Freshness as revenue** — staleness is a universal complaint AND nobody has recurring revenue. A verified-content update subscription monetizes the complaint and defuses the DIY price objection (you sell maintenance/curation, not a Pi).

## C. Technical gaps
1. **Small-model excellence on modest hardware** — NOMAD's recommended spec (RTX 3060/32GB) excludes most buyers; NOMAD issues show crashes on 4–8GB boxes. Nobody has tuned retrieval+model for the 8–16GB no-GPU reality.
2. **ZIM-native retrieval** — Kiwix's 3,000+ ZIM corpus has no semantic layer; per-corpus tuned chunking/embedding (encyclopedia vs manual vs map vs textbook) is unbuilt anywhere.
3. **Honest degradation** — no tool says "I don't know; here are the 3 closest pages" instead of hallucinating. Trivial to build, absent everywhere.

## D. UX gaps
1. Setup: `curl | sudo bash` + Docker vs plug-in-and-ask. Two of NOMAD's "Critical—blocking" issues were installer friction.
2. Multi-user middle: enterprise RBAC or single-user desktop — no family/classroom box.
3. Multilingual: English-only across the board; NOMAD's top-reacted issues are international content requests.

## E. Business gaps
1. No incumbent has both a paying customer and a working product (Prepper Disk has buyers + weak product; NOMAD has product + no revenue).
2. Khoj's death proves hosted-SaaS is the wrong model here; Msty ($149–349 licenses), RecurseChat ($9.99), Prepper Disk (hardware), LM Studio (teams) prove one-time/prosumer/hardware works.

## F. Distribution gaps
1. NOMAD's 33k-star community and Crosstalk's audience prove YouTube-creator distribution; no *commercial* player owns that channel.
2. Umbrel/TrueNAS/Runtipi app stores carry Ollama and Kiwix separately — an integrated "Fable" app would be the only knowledge-native listing.
3. Education/NGO channel (RACHEL's donors, Kolibri's UNHCR pipeline, Gates/PATH frontline-health-LLM trials) has zero AI-native vendor.

## G. Moat opportunities
1. **Curated, versioned, citation-anchored corpus** (licensed + verified content with provenance) — content deals and curation labor compound; DIY can't copy it.
2. **Per-corpus retrieval tuning data** — every deployed box improves the retrieval recipes; a quality dataset nobody else is collecting.
3. **Trust brand** — post-Open-WebUI-license-backlash, post-Ollama-cloud-pivot, "actually offline, actually yours, no rug-pull" is claimable now.

## H. Anti-opportunities (do NOT build)
1. Hosted cloud SaaS (Khoj died there; contradicts the offline promise).
2. Generic ChatGPT-clone UI features (Open WebUI has won that; 124k+ stars of head start).
3. Bigger-model arms race (cloud labs win; the wedge is small-model + retrieval quality).
4. Prepper-camo branding (caps the market; alienates data-preservationists, educators, homeschoolers).
5. Handheld hardware (The Ark's vaporware; WikiReader's historical failure).
6. AI-mandatory design (a documented anti-AI faction exists in the core audience).

---

## Three product versions

### 1. Conservative MVP — "Fable Answers"
A **citation-first offline answer engine over the user's ZIM/document library**. Software: ask a question → grounded answer with page-level citations into the offline corpus → one tap opens the source page; honest "I don't know, here are the closest pages" degradation; tuned for 8–16GB no-GPU hardware. Ships as (a) a feature/fork within the NOMAD ecosystem and (b) a one-click app on Umbrel/TrueNAS/Runtipi/CasaOS.

### 2. Differentiated wedge — "Fable Library"
Conservative MVP **plus the curated, versioned content layer**: verified knowledge packs (medical, repair, homestead, education, region packs) with provenance and a freshness-update subscription ($5–10/mo or $49/yr). Monetizes the staleness complaint; sells curation DIY can't copy.

### 3. Category-defining — "The Fable" (appliance)
A $399–499 plug-in box: join its Wi-Fi, ask anything, get cited answers; family multi-user; multilingual packs; AI-optional mode; education channel (tutor over Kolibri-style content) for homeschool/NGO markets. RACHEL-leapfrog at RACHEL's own price point. Requires supply chain + capital — a later phase, and partnership (Prepper-Disk-style vendors, Umbrel) may beat building hardware.

---

## Wedge selection (recommendation — judgment, not fact)

**Selected wedge: Version 1 → 2 ladder, led by "Fable Answers": the citation-first offline answer engine, tuned for modest hardware, with verified knowledge packs as the revenue layer.**

Why this one:
1. It attacks the **single most-documented complaint in the entire market** (RAG quality/trust) rather than a speculative need.
2. It is the missing layer for BOTH sides: Kiwix's corpus-without-a-brain and local-AI's brain-without-a-corpus. GPT4All's abandoned roadmap literally listed "offline Wikipedia chat" — validated, then orphaned.
3. It is buildable **now, by a small team, on assets in this repo** (libzim extraction, Qdrant, Ollama plumbing already exist) — no supply chain, no capital raise.
4. Distribution is pre-built: NOMAD's 33k-star community (contribute the engine upstream = instant reach), self-host app stores, and YouTube creators who already cover the category.
5. Revenue follows the Msty/Prepper Disk precedent (prosumer license and/or content packs), not the Khoj precedent (hosted SaaS).
6. The appliance (Version 3) remains open as the growth path once the engine has proven answer quality — hardware without the answer engine is just another Prepper Disk.

Gate: one wedge strongly recommended — **PASSED**. → Loop 4 (Product Thesis).
