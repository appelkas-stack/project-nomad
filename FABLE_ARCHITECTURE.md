# FABLE_ARCHITECTURE.md

> Loop 2 artifact — Architecture Reverse-Engineering of the existing codebase.
> Date: 2026-07-06 · Source: full repo survey. Observations cite files; inferences are marked *(inference)*.

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
