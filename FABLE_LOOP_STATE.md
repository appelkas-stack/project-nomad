# FABLE_LOOP_STATE.md

> Master state file for the FABLE LOOP OS operating on this repository.
> Last updated: 2026-07-06 · Loop iteration: 6 · Branch: `claude/fable-loop-os-system-67ab72`

## 0. Active goal (set 2026-07-06 by human)

"Research, design, and build **Fable** as a revolutionary AI-native product. Start with competition and gap discovery. Do not build yet. Loop through research, gap map, product thesis, Fable narrative, and architecture. Update all Fable loop files. **Stop before implementation and give the one MVP wedge worth building.**"

**Marked assumption A4:** "Fable" was not explicitly defined by the human. Interpreted as: the AI-native product to be carved out of this repo's domain (local AI + offline knowledge). All Loop 2–6 artifacts rest on A4.

## 1. Product identity — two layers

- **Host repo:** Project N.O.M.A.D. v1.30.3 (Crosstalk Solutions; `appelkas-stack` fork) — offline-first knowledge/education server. As-is analysis: FABLE_ARCHITECTURE.md Part 1.
- **Fable (the product being designed):** the **offline answer engine** — citation-first Q&A over the user's offline library, tuned for modest hardware, monetized via verified knowledge packs. Thesis: FABLE_PRODUCT_THESIS.md.

## 2. Selected MVP wedge (Loop 3 output, human sign-off pending)

**"Fable Answers":** ask your offline library anything → grounded answer with tappable page-level citations → honest refusal ("not in your library, closest pages:") when ungrounded → runs on 8–16GB no-GPU hardware. Free/open engine; revenue from verified knowledge packs + freshness subscription (Version 2 "Fable Library"); appliance (Version 3) is the later growth path. Full reasoning: FABLE_GAP_MAP.md.

## 3. Key verified market facts (details + sources in FABLE_COMPETITORS.md)

- 30+ competitors/substitutes mapped across 4 categories; nobody ships "ask offline, get a cited answer from curated content."
- RAG quality is the #1 documented complaint in every leading local-AI tool.
- Upstream NOMAD: 32,963 stars / 3,295 forks (GitHub API, 2026-07-06) — category demand proven; software-only, unmonetized, GPU-hungry, English-only.
- Prepper Disk: documented paying buyers at $180–280; AI SKU on pre-order (3B on a Pi); sales boomed on data-deletion anxiety (404media).
- Price anchors: Kiwix Hotspot $319 · RACHEL $500 · Umbrel $399–699 · Msty licenses $149–349/yr · Khoj's hosted SaaS died Apr 2026.
- Anti-AI faction exists inside the target audience (NOMAD issue #456) → AI-optional is a hard requirement.

## 4. Loop ledger

| Loop | Status | Artifact |
|---|---|---|
| 1 — Context Intake | ✅ | FABLE_LOOP_STATE.md |
| 2a — Architecture Reverse-Engineering (as-is) | ✅ | FABLE_ARCHITECTURE.md Part 1 |
| 2 — Competitive Intelligence | ✅ gate passed (30+ mapped) | FABLE_COMPETITORS.md |
| 3 — Gap Discovery | ✅ gate passed (wedge selected) | FABLE_GAP_MAP.md |
| 4 — Product Thesis | ✅ gate passed (w/ caveat → R-16) | FABLE_PRODUCT_THESIS.md |
| 5 — Fable Narrative | ✅ gate passed (10-second test) | FABLE_NARRATIVE.md |
| 6 — Architecture (target) | ✅ gate passed | FABLE_ARCHITECTURE.md Part 2 |
| 7 — Implementation Plan | ⏸ **STOPPED per human directive** ("do not build yet") | — |
| 14 — Adversarial Kill | Recommended before Loop 7 | — |

## 5. Dangerous assumptions (live)

- **A4 (critical):** Fable = offline-answer-engine interpretation of the goal. If the human meant a different product entirely, Loops 2–6 must be re-run.
- A5: free-engine + paid-packs conversion is unproven in this niche (R-16).
- A6: content licensing for packs (medical/manuals) is obtainable at indie cost — unvalidated (R-17).
- A1–A3 (repo posture, fork intent, no tests): unchanged, see git history of this file.

## 6. Next action

**Gated on human decision:**
1. **Approve the wedge** → run Loop 14 (Adversarial Kill) then Loop 7 (Implementation Plan) → Build.
2. **Challenge A4** → redefine Fable, re-run from Loop 2 with corrected scope.
3. Optionally first: `/loop-kill` to stress-test the wedge before committing.

## 7. Pointers

Decisions: FABLE_DECISIONS.md · Risks: FABLE_RISKS.md · OS spec: FABLE_LOOP_OS.md · Command: `.claude/commands/fable-loop.md`
