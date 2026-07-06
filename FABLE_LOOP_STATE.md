# FABLE_LOOP_STATE.md

> Master state file for the FABLE LOOP OS operating on this repository.
> Last updated: 2026-07-06 · Loop iteration: 2 · Branch: `claude/fable-loop-os-system-67ab72`

---

## 1. Product Identity

- **Product:** Project N.O.M.A.D. (Node for Offline Media, Archives, and Data)
- **Owner:** Crosstalk Solutions, LLC (this repo is the `appelkas-stack` fork/clone)
- **Version:** 1.30.3 (semantic-release managed)
- **License:** Apache 2.0
- **One-liner:** A self-contained, offline-first knowledge and education server ("Command Center") that orchestrates containerized tools — offline Wikipedia (Kiwix), local AI chat with RAG (Ollama + Qdrant), education (Kolibri/Khan Academy), offline maps (ProtoMaps), data tools (CyberChef), and notes (FlatNotes) — on Debian-based hardware.
- **Positioning:** "Knowledge That Never Goes Offline." Deliberately targets *beefy, GPU-backed* hardware (unlike minimalist survival-computer competitors) to run local LLMs well.

## 2. Target User (as stated / inferred)

- **Stated:** Preparedness/off-grid users, homelabbers, educators, families — people who want critical knowledge + AI available without internet.
- **Community evidence:** Public website (projectnomad.us), Discord community, public benchmark leaderboard with "Builder Tags," public roadmap (roadmap.projectnomad.us). Distribution is creator-led (Crosstalk Solutions is a known YouTube/networking brand).
- *(Assumption — not verified in repo)*: Primary acquisition channel is the Crosstalk Solutions audience.

## 3. Business Goal (inferred — needs human confirmation)

- Open-source, no telemetry, no auth, free to install. No visible monetization in the repo (no billing code, no license gating).
- *(Assumption)*: Value likely accrues via brand/community/hardware-guide affiliation rather than direct SaaS revenue. **This is a dangerous assumption to build on without confirmation.**

## 4. Technical Assets (verified in repo)

| Asset | Location | Notes |
|---|---|---|
| Command Center app | `admin/` | AdonisJS 6 (TypeScript) + Inertia.js + React 19 + Tailwind 4 |
| Orchestration | `admin/app/services/docker_service.ts`, `container_registry_service.ts` | Manages tool containers via dockerode |
| AI stack | `ollama_service.ts`, `rag_service.ts`, `chat_service.ts` + Qdrant client, chonkie chunking, tesseract.js OCR, pdf-parse | Local chat + document RAG |
| Content stack | `zim_service.ts`, `zim_extraction_service.ts` (Kiwix/ZIM), `map_service.ts` (PMTiles/ProtoMaps), `collection_*` services | Curated collections in `/collections/*.json` |
| Jobs/queues | BullMQ queues: `downloads`, `model-downloads`, `benchmarks`; jobs in `admin/app/jobs/` | Worker commands in `package.json` |
| Persistence | MySQL (mysql2) + better-sqlite3; models in `admin/app/models/` | 9 Lucid models incl. chat, benchmark, services, kv_store |
| Install/ops | `install/*.sh`, `management_compose.yaml`, `Dockerfile` | Terminal-based installer for Debian; helper start/stop/update/uninstall scripts |
| Benchmark | `benchmark_service.ts`, community leaderboard (benchmark.projectnomad.us) | Hardware scoring |
| Docs | `admin/docs`, `FAQ.md`, in-app docs pages | |
| Anomaly | Root `package.json` depends on `remotion` + `@remotion/cli` (added in PR #2 on this fork) | Unused by the app as far as observed; likely fork-specific experiment for video rendering |

## 5. Known Constraints & Posture

- **No authentication by design** (README §Security). Network-level controls are the recommended mitigation; explicitly not internet-facing.
- **Offline-first:** internet needed only for install/downloads; zero telemetry; connectivity check via `https://1.1.1.1/cdn-cgi/trace`.
- **Test posture:** `admin/tests/` contains only `bootstrap.ts` — effectively no automated test suite. Root `package.json` test script is a stub.
- Requires sudo/root install; Command Center controls the Docker daemon (high-privilege by nature).

## 6. Missing Information (needs human input)

1. **The goal.** FABLE LOOP OS was started without a `[goal]`. Is the mission: (a) audit/harden this codebase, (b) build a specific feature, (c) product/market strategy for the fork, or (d) something else (e.g., the remotion dependency hints at a video-generation direction)?
2. Relationship of this fork (`appelkas-stack`) to upstream (`Crosstalk-Solutions`) — contribute upstream or diverge?
3. Business intent: is monetization relevant at all, or is this purely an OSS/community project?

## 7. Dangerous Assumptions (flagged)

- A1: "No auth is acceptable" — acceptable only while never internet-exposed; any feature that changes exposure invalidates it.
- A2: "The fork should follow upstream's product direction" — unconfirmed.
- A3: "No tests" means verification of changes relies on typecheck/lint/manual QA — every Build Loop must state this explicitly.

## 8. Open Loops

| Loop | Status | Artifact |
|---|---|---|
| 1 — Context Intake | ✅ Complete (this file) | FABLE_LOOP_STATE.md |
| 2 — Architecture Reverse-Engineering | ✅ Complete | FABLE_ARCHITECTURE.md |
| Next | ⏸ Gated on human decision | See §9 |

## 9. Next Action

Master controller default for an existing codebase: Audit Loop → Security Loop → Performance Loop → Refactor Plan → Build. But loop selection depends on the missing goal (§6.1). **Gate: need human decision** on which track to run:
- `/loop-audit` — full codebase audit (natural next step; no product judgment required)
- `/loop-security` — security review (high leverage given no-auth + Docker-root posture)
- `/loop-research` / `/loop-product` — market and product strategy loops
- `/loop-build [task]` — a specific feature

## 10. Risk Register Pointer

See `FABLE_RISKS.md`. Decisions log: `FABLE_DECISIONS.md`.
