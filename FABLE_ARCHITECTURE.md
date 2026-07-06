# FABLE_ARCHITECTURE.md

> Part 1: Loop 2 artifact — as-is architecture of the existing codebase (Project N.O.M.A.D.).
> Part 2 (end of file): Loop 6 artifact — target architecture for the selected Fable wedge.
> Date: 2026-07-06 · Observations cite files; inferences are marked *(inference)*.

---

# PART 1 — AS-IS (Project N.O.M.A.D. v1.30.3)

## System Diagram (text)

```
                    ┌────────────────────────── Host (Debian, /opt/project-nomad) ──────────────────────────┐
                    │                                                                                        │
 Browser (LAN) ──►  │  admin :8080  (AdonisJS 6 + Inertia/React "Command Center")                            │
   no auth          │   ├── HTTP API + Inertia pages (start/routes.ts)                                       │
                    │   ├── Transmit SSE (realtime progress)          ┌── mysql:8.0  (app state)             │
                    │   ├── BullMQ workers (queue:work --all) ────────┼── redis:7    (queues + SSE bus)      │
                    │   └── dockerode ──► /var/run/docker.sock ──► manages "nomad_*" tool containers:        │
                    │                     ├── nomad_kiwix_server :8090   (offline Wikipedia/ZIM)             │
                    │                     ├── nomad_ollama       :11434  (local LLM, GPU-aware)              │
                    │                     ├── nomad_qdrant       :6333/4 (vectors for RAG)                   │
                    │                     ├── nomad_cyberchef    :8100                                       │
                    │                     ├── nomad_flatnotes    :8200   (auth disabled)                     │
                    │                     └── nomad_kolibri      :8300   (Khan Academy)                      │
                    │  sidecars: dozzle :9999 (logs, docker.sock) · updater (self-update, docker.sock,       │
                    │            writable /opt/project-nomad) · disk-collector (host / read-only)            │
                    └────────────────────────────────────────────────────────────────────────────────────────┘
 Internet (install/download only): GitHub/ghcr · Kiwix catalog · Protomaps · Ollama registry ·
                                   api.projectnomad.us (manifests, updates) · benchmark.projectnomad.us
```

## Component Responsibilities (backend, `admin/app/services/`)

- **docker_service.ts** — orchestration engine: install/start/stop/update/rollback of `nomad_*` containers via dockerode over the mounted Docker socket; image pulls with SSE progress; NVIDIA GPU passthrough (AMD/ROCm detected but disabled, `docker_service.ts:477`); rolling update with 5s health check + rollback.
- **container_registry_service.ts** — queries Docker Hub/ghcr for newer image tags (token auth, arch checks, semver filtering).
- **ollama_service.ts / chat_service.ts** — LLM model management + chat (SSE streaming); sessions/messages persisted to MySQL; auto-titles and suggestions.
- **rag_service.ts / zim_extraction_service.ts / embed jobs** — RAG pipeline: PDF (pdf-parse, pdf2pic + tesseract OCR), images, txt, and ZIM articles → chonkie chunking → `nomic-embed-text:v1.5` (768-dim) via Ollama → Qdrant collection `nomad_knowledge_base`; retrieval for chat.
- **zim_service.ts / map_service.ts** — content managers for Kiwix ZIMs and Protomaps PMTiles: remote catalogs, downloads, style.json generation, deletes (path-traversal guarded at service layer).
- **collection_manifest_service.ts / collection_update_service.ts** — curated-collection manifests from api.projectnomad.us; content update checks/applies.
- **benchmark_service.ts** — CPU/mem/disk + AI tokens/sec benchmark, composite "NOMAD score," HMAC-signed submission to the public leaderboard.
- **system_service.ts / system_update_service.ts** — system info/health, internet check, DB↔container sync, and admin self-update via file handshake with the `updater` sidecar over a shared volume.
- **queue_service.ts / download_service.ts** — BullMQ queue factory over Redis; download job facade.

## Data Flow (representative)

1. **Content install:** UI → `/api/zim|maps` → `RunDownloadJob` (queue `downloads`, resumable) → file in `/opt/project-nomad/storage` → `InstalledResource` row → Kiwix restart → optional `EmbedFileJob` → Qdrant.
2. **Chat w/ knowledge base:** UI → `/api/ollama/chat` (SSE) → `rag_service.searchSimilarDocuments` (Qdrant) → context into Ollama prompt → streamed response → `chat_messages`.
3. **Tool install:** UI → `/api/system/services/...` → DockerService preflight/lock → image pull (SSE progress via Transmit channel `service-installation`) → container create on `project-nomad_default` network.

## Database Schema (MySQL 8 via Lucid; `config/database.ts:5`)

- `services` — tool-container catalog (name, image, command, JSON config, depends_on self-FK, install status, update tracking). Seeded by `database/seeders/service_seeder.ts`.
- `benchmark_results`, `benchmark_settings` — scores, hardware specs, builder tag.
- `kv_store` — generic settings.
- `chat_sessions`, `chat_messages` — chat history (cascade delete).
- `zim_file_metadata`, `wikipedia_selections` — content metadata.
- `collection_manifests`, `installed_resources` — curated-content state.
- **No user/auth tables exist.** `better-sqlite3` is a dependency but unused in app code *(inference — no imports found)*.

## API Design

REST-ish JSON under `/api/*` grouped by domain (system/services, ollama, chat, rag, zim, maps, benchmark, downloads, docs, content-updates, easy-setup, health) + Inertia pages (`/`, `/chat`, `/maps`, `/easy-setup`, `/settings/*`, `/docs/*`) + Transmit SSE routes. VineJS body validation; SSRF guard (`assertNotPrivateUrl`) on download URLs. **No route-level middleware/auth** (`start/kernel.ts:48`).

## Frontend Architecture

Inertia + React 19 + Vite + Tailwind v4, SSR disabled. Server state via TanStack Query; realtime via Transmit SSE (channels in `constants/broadcast.ts`: `benchmark-progress`, `ollama-model-download`, `service-installation`, `service-updates`). Pages under `inertia/pages/` (home, chat, maps, easy-setup, docs, settings/*); Uppy uploads; MapLibre/react-map-gl for maps.

## Job/Queue Architecture (BullMQ on Redis)

| Queue | Job | Notes |
|---|---|---|
| `downloads` | RunDownloadJob | concurrency 3, resumable |
| `model-downloads` | DownloadModelJob | concurrency 2, waits for Ollama readiness |
| `benchmarks` | RunBenchmarkJob | concurrency 1 |
| `file-embeddings` | EmbedFileJob | concurrency 2, self-dispatching batches for large ZIMs |
| `system` | CheckUpdateJob | cron `0 2,14 * * *` |
| `service-updates` | CheckServiceUpdatesJob | cron `0 3 * * *` |

Workers run via `node ace queue:work --all` started in `install/entrypoint.sh` (migrate → seed → workers → server).

## AI Architecture

Ollama (pinned `ollama/ollama:0.18.1`) for chat + embeddings; Qdrant `v1.16` for vectors; model catalog and recommendations fetched from api.projectnomad.us; GPU detection informs model recommendations and benchmark scoring.

## Security Architecture (as-is)

- **No authn/authz at all** — `@adonisjs/auth` installed but unused; session middleware commented out (`start/kernel.ts:40`).
- Shield: CSP off, **CSRF off** (`config/shield.ts:19`, TODO comment), HSTS off; only xFrame DENY + nosniff on.
- CORS wide open: `origin: ['*']` with `credentials: true` (`config/cors.ts`) — spec-contradictory but intent is an open API.
- Plain HTTP :8080, no reverse proxy/TLS in the stack.
- Positive controls that DO exist: SSRF guard on download URLs, path-traversal guards on deletes (`zim_service.ts:339`, `map_service.ts:411`), docker exec via argv arrays (no shell interpolation), Dozzle actions/shell disabled.
- Weak points: hardcoded benchmark HMAC secret (`benchmark_service.ts:35`), `replaceme` defaults for APP_KEY/MySQL creds in `management_compose.yaml`, docker.sock mounted in admin/updater/dozzle.

## Scaling Strategy

Single-node appliance by design. Vertical scaling only (GPU/VRAM for larger models; SSD for content). Redis/BullMQ concurrency limits protect the host. No multi-node or HA story — appropriate for the product *(inference)*.

## Failure Modes

- Docker daemon unreachable → whole control plane degraded (health endpoint still returns ok — it checks nothing).
- Container update failure → built-in rename/rollback path in `docker_service.updateContainer`.
- Download interruption → resumable jobs with retry; Wikipedia-specific failure hook marks selections failed (`commands/queue/work.ts:72`).
- Ollama not ready → model downloads retry up to 40 times.
- Self-update relies on file handshake with updater sidecar over shared volume — if the sidecar is absent/outdated the update stalls.

## Tradeoffs (observed design stance)

- **Openness over security:** zero-friction LAN appliance; all safety pushed to network posture.
- **Boring, proven infra:** AdonisJS monolith + MySQL + Redis + Docker socket, no k8s/microservices — good fit for a single-box product.
- **Pinned images + rolling update w/ rollback:** favors stability over freshness.
- **No tests, build-only CI** (`.github/workflows/build-admin-on-pr.yml`): velocity over regression safety — currently the biggest engineering-quality gap.

## Build-vs-Buy already decided upstream

Kiwix, Ollama, Qdrant, Kolibri, Protomaps, CyberChef, FlatNotes, Dozzle are all bought (OSS); the product's own IP is the orchestration UX, curated collections, easy-setup wizard, and benchmark/community layer.

---

# PART 2 — TARGET ARCHITECTURE: "Fable Answers" wedge (Loop 6)

> Design goal: the citation-first offline answer engine (see FABLE_GAP_MAP.md §wedge, FABLE_PRODUCT_THESIS.md §MVP scope). Simple enough for a small team, strong enough to become the appliance later. Reuses NOMAD assets where they exist.

## System diagram (text)

```
                       ┌──────────────── Fable node (user hardware, 8–16GB, no GPU assumed) ────────────────┐
 Browser (LAN) ──────► │  fable-app :7777  (single service: API + UI)                                       │
   no account          │   ├── Ask API  ──► Answer Orchestrator                                             │
                       │   │                 ├── Retriever ──► Index Store (embedded vector+FTS, SQLite/    │
                       │   │                 │                 sqlite-vec — no separate Qdrant container)   │
                       │   │                 ├── Grounding Gate (confidence threshold → answer | refuse)    │
                       │   │                 └── Generator ──► Inference Runtime (llama.cpp-server or       │
                       │   │                                   any Ollama-compatible endpoint, 3–8B Q4)     │
                       │   ├── Citations resolver ──► ZIM Reader (libzim) → exact source page render        │
                       │   ├── Library Manager (add ZIM/PDF/EPUB, packs, indexing progress)                 │
                       │   └── Indexer (background queue, per-corpus recipes)                               │
                       │  storage: /library (ZIMs, docs) · /index (embeddings+FTS) · /models               │
                       └────────────────────────────────────────────────────────────────────────────────────┘
 Online only (optional): pack registry CDN (signed manifests + content) · model download mirror
```

## Component responsibilities

- **Answer Orchestrator** — the product. Pipeline: query → hybrid retrieval (vector + BM25/FTS, reciprocal-rank fusion) → rerank (small cross-encoder, CPU-friendly) → grounding gate → constrained generation with inline citation markers → citation verification pass (every claim sentence must map to a retrieved chunk, else strip/refuse).
- **Grounding Gate** — if top-k relevance < threshold: return honest-degradation response ("not in your library") + closest pages. This is a hard product invariant, not a tuning knob.
- **Per-corpus recipes** — chunking/embedding/rerank parameters keyed by content type (encyclopedia / manual / textbook / reference), shipped as versioned config with each pack; recipe evals run in CI.
- **Index Store** — embedded (SQLite + sqlite-vec + FTS5). Rationale: one fewer container than NOMAD's Qdrant, works on 4GB machines, single-file backup. Qdrant remains a pluggable backend for big libraries *(build-vs-buy: embed by default, scale out optionally)*.
- **Inference Runtime** — llama.cpp-server bundled (no Docker-in-Docker, no Ollama dependency) but speaks the OpenAI-compatible protocol so any Ollama/LM Studio endpoint can be pointed at instead (answers NOMAD issue #292 remote-Ollama demand).
- **ZIM Reader** — libzim page rendering for citation targets; doubles as the AI-off reading mode (anti-AI faction requirement).
- **Pack system** — signed manifest (content hash, version, provenance metadata, recipe version, license) → download → verify → index. Freshness subscription = access to updated manifests; everything already downloaded works forever.

## Data flow (ask path)

question → embed (local, ~100ms) → hybrid search index (~50ms) → rerank top-40→8 (~1–3s CPU) → gate → prompt with numbered chunks → 3–8B generation with citation markers (~5–8s CPU) → verify citations → render answer + tappable sources. **p50 target ≤10s on 16GB no-GPU** (thesis metric).

## API design (minimal)

`POST /api/ask` (SSE stream: tokens + citation events) · `GET /api/sources/:id` (rendered page) · `GET/POST /api/library` (list/add/delete content) · `GET /api/packs` + `POST /api/packs/:id/install` · `GET /api/jobs` (indexing progress) · `GET /api/health` (real checks: index, runtime, disk).

## Frontend

Single-page app, two primary surfaces: **Ask** (answer + citation rail + source viewer) and **Library** (packs, content, indexing). Deliberately not a chat-app clone — answers are documents with receipts, not bubbles. Reuse NOMAD's React/Tailwind conventions where code is shared.

## Database schema (embedded SQLite)

`documents` (id, source_type zim|pdf|epub, path, title, pack_id, version) · `chunks` (id, doc_id, seq, text, page_ref, embedding BLOB, fts-indexed) · `packs` (id, version, manifest_json, installed_at) · `questions` (id, text, answered bool, grounded bool, latency_ms — local-only quality telemetry, never transmitted) · `settings` (kv).

## Security architecture (fixing NOMAD's posture, not inheriting it)

- Same LAN-appliance model BUT: **CSRF enabled from day one**, no wildcard-CORS, no Docker-socket access (nothing to orchestrate — single process + bundled runtime), optional PIN for settings/library mutation, signed packs (supply-chain integrity), no telemetry.
- AI-specific: retrieved content is data, not instructions (prompt-injection hardening on chunk boundaries); citation-verification pass limits leakage of ungrounded model priors.

## Observability / failure modes

Local-only metrics (grounded-rate, refusal-rate, latency) surfaced in a quality panel — the user can see the benchmark. Failure modes: model too big for RAM → auto-select smaller quant with warning; index corruption → rebuild from library; pack registry unreachable → everything degrades to fully-offline gracefully (that's the product promise).

## Scaling strategy

Vertical only (bigger model if GPU present — auto-detect and upgrade recipe). The same binary/image becomes the appliance firmware later (Version 3 path). Multi-node is anti-scope.

## Build-vs-buy

Buy/reuse: llama.cpp, sqlite-vec, libzim, ZIM ecosystem, existing NOMAD extraction code (`zim_extraction_service.ts` logic), app-store packaging (Umbrel/TrueNAS/Runtipi templates). Build: orchestrator, grounding gate, citation verification, recipes, pack format, eval harness — the five things that ARE the product.

## Tradeoffs

- Embedded index vs Qdrant: chose reach (low-end hardware) over max scale — pluggable escape hatch retained.
- Bundled llama.cpp vs require-Ollama: chose zero-dependency install over ecosystem familiarity — compatible endpoint keeps both.
- Not building on the full NOMAD monolith: Fable ships as one focused service that NOMAD (and Umbrel, and TrueNAS) can host — avoids inheriting the no-auth/Docker-socket posture and the MySQL+Redis+workers stack that excludes small hardware.

## Gate check (Loop 6)

Simple enough to build (5 owned components, everything else commodity), strong enough to scale (appliance path preserved, GPU auto-upgrade, pluggable index) — **gate PASSED**. → Loop 7 (Implementation Plan) is the next loop, NOT run: user directive is to stop before implementation.
