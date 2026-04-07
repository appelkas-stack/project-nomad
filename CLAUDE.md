# CLAUDE.md — Project N.O.M.A.D.

AI assistant guidance for the **Node for Offline Media, Archives, and Data** codebase.

---

## Project Overview

Project N.O.M.A.D. is a self-contained, offline-first knowledge and education server. It bundles:
- AI chat with a local knowledge base (Ollama + Qdrant RAG)
- Offline Wikipedia and medical references (Kiwix/ZIM)
- Educational courses (Kolibri)
- Offline maps (ProtoMaps/MapLibre)
- Data utilities (CyberChef, FlatNotes)
- System benchmarking with a leaderboard

The app is distributed as a Docker Compose stack, intended to run on resource-constrained or air-gapped hardware.

---

## Repository Layout

```
project-nomad/
├── admin/                  # Main application (AdonisJS + React/Inertia)
│   ├── app/
│   │   ├── controllers/    # HTTP handlers (snake_case filenames)
│   │   ├── models/         # Lucid ORM models
│   │   ├── services/       # Business logic (injected via IoC container)
│   │   ├── jobs/           # BullMQ queue jobs
│   │   ├── validators/     # Vine validators
│   │   ├── middleware/      # HTTP middleware
│   │   └── utils/          # Pure utility helpers
│   ├── inertia/            # React frontend
│   │   ├── pages/          # Top-level page components
│   │   ├── components/     # Reusable UI components (PascalCase)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   ├── providers/      # Inertia providers (QueryClient, etc.)
│   │   ├── lib/            # Frontend utilities
│   │   └── css/            # Global styles
│   ├── config/             # AdonisJS config files
│   ├── database/
│   │   ├── migrations/     # Versioned database migrations
│   │   └── seeders/        # Data seeders
│   ├── start/
│   │   ├── routes.ts       # All HTTP routes
│   │   ├── kernel.ts       # Middleware registration
│   │   └── env.ts          # Environment variable schema & validation
│   ├── tests/              # Japa test suites
│   ├── commands/           # Custom Ace CLI commands
│   ├── providers/          # AdonisJS service providers
│   ├── adonisrc.ts         # AdonisJS root config
│   ├── vite.config.ts      # Vite (frontend bundler)
│   ├── tailwind.config.ts  # Tailwind CSS (desert color theme)
│   └── tsconfig.json       # TypeScript config
├── install/                # Installer & Docker Compose scripts
│   ├── install_nomad.sh
│   ├── management_compose.yaml   # Production Docker Compose
│   ├── start_nomad.sh / stop_nomad.sh / update_nomad.sh
├── collections/            # JSON configs for downloadable content
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   └── scripts/
├── Dockerfile              # Multi-stage production image
├── package.json            # Root package (version source, Remotion)
└── .releaserc.json         # Semantic Release config
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | AdonisJS 6.x (TypeScript) |
| Frontend | React 19 + Inertia.js |
| Database | MySQL 8.0 (Lucid ORM) |
| Cache / Queues | Redis 7 + BullMQ |
| Styling | Tailwind CSS 4 |
| Bundler | Vite + SWC |
| Testing | Japa |
| Containerization | Docker / Docker Compose |
| Node version | 22 |

---

## Development Setup

All commands run from inside the `admin/` directory unless noted.

```bash
# Install dependencies
cd admin && npm install

# Copy and configure environment
cp .env.example .env
# Edit .env: set DB_*, REDIS_*, APP_KEY, NOMAD_STORAGE_PATH

# Run database migrations
node ace migration:run

# Start development server (with HMR)
npm run dev
# or
node ace serve --hmr
```

Required external services (run via Docker or locally):
- MySQL 8 on port 3306
- Redis 7 on port 6379

The full stack (including MySQL, Redis, Ollama, Qdrant, etc.) is managed via `install/management_compose.yaml` in production.

---

## Key Commands

All from `admin/`:

```bash
npm run dev           # Development server with hot module reload
npm run build         # Production build (node ace build)
npm run start         # Start production server
npm run test          # Run Japa test suite
npm run lint          # ESLint
npm run format        # Prettier (writes in place)
npm run typecheck     # tsc --noEmit (no emit, just type checking)

# Queue workers (run separately)
npm run work:downloads
npm run work:model-downloads
npm run work:benchmarks
npm run work:all      # All queues at once

# Ace CLI
node ace migration:run
node ace migration:rollback
node ace db:seed
node ace make:controller <Name>
node ace make:model <Name>
node ace make:migration <name>
```

---

## Environment Variables

Defined and validated in `admin/start/env.ts`. Key variables:

| Variable | Description |
|---|---|
| `PORT` / `HOST` | Server bind address |
| `APP_KEY` | Encryption key (min 16 chars, generate with `node ace generate:key`) |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` | MySQL connection |
| `REDIS_HOST`, `REDIS_PORT` | Redis connection |
| `NOMAD_STORAGE_PATH` | Root path for content files (ZIM, maps, PDFs) |
| `NODE_ENV` | `development` or `production` |
| `LOG_LEVEL` | Logging verbosity |
| `SESSION_DRIVER` | `cookie` or `redis` |

Never commit `.env` files. Always use `.env.example` as the template.

---

## Architecture Patterns

### Backend (AdonisJS)

- **Controllers** handle HTTP requests and delegate to services. Keep them thin.
- **Services** contain business logic and are registered with the IoC container. Inject them via constructor binding, not `new`.
- **Models** use Lucid ORM (Active Record). Relationships defined via `@hasMany`, `@belongsTo`, etc.
- **Jobs** are BullMQ queue workers. Define the `handle()` method; schedule via service layer.
- **Validators** use Vine (AdonisJS's built-in validator). Co-locate validator files with their controllers.
- **Routes** are all in `start/routes.ts`. Group related routes with `router.group()`.

### Frontend (React + Inertia)

- **Pages** receive props from controllers via `inertia.render()`. No separate API calls needed for initial data.
- **Components** are reusable and live in `inertia/components/`. PascalCase filenames.
- **Data fetching after load** uses `@tanstack/react-query`. The QueryClient is set up in `inertia/providers/`.
- **Forms** use Inertia's `useForm` hook for backend-integrated forms, or React state for client-only forms.
- **Routing** uses Inertia's `router.visit()` / `<Link>` — do not use `window.location`.

### Shared Data

Global shared data (user, flash messages, etc.) is injected in `config/inertia.ts` via `sharedData`. Access with `usePage().props` on the frontend.

---

## Naming Conventions

| Context | Convention | Example |
|---|---|---|
| Backend files | snake_case | `chat_session.ts`, `rag_service.ts` |
| Frontend components | PascalCase | `ChatMessage.tsx`, `StyledButton.tsx` |
| Database tables | snake_case plural | `chat_messages`, `installed_resources` |
| Model classes | PascalCase singular | `ChatMessage`, `InstalledResource` |
| Controllers | PascalCase + `Controller` suffix | `ChatsController` |
| Services | PascalCase + `Service` suffix | `RagService`, `DockerService` |
| Jobs | PascalCase + `Job` suffix | `DownloadJob`, `EmbedJob` |
| Migrations | Timestamp prefix + description | `1700000000_create_services_table.ts` |

---

## Testing

Tests use the **Japa** framework (AdonisJS native). Run with:

```bash
cd admin && npm run test
```

Test files live in `admin/tests/`. Follow the existing structure for new tests. Use AdonisJS's test utilities for database isolation (transactions, seeders).

---

## Code Quality

The project enforces quality via:

- **ESLint** — `@adonisjs/eslint-config` + `@tanstack/eslint-plugin-query`
- **Prettier** — `@adonisjs/prettier-config`
- **TypeScript** — strict mode

Run before committing:
```bash
npm run lint
npm run format
npm run typecheck
```

CI runs a build check on all PRs via `.github/workflows/build-admin-on-pr.yml`.

---

## Commit Conventions

This project uses **Conventional Commits** (enforced by Semantic Release):

```
<type>(<optional scope>): <description>

Types: feat, fix, docs, refactor, chore, test, perf, ci, build
```

Examples:
```
feat(ui): add map layer toggle control
fix(rag): handle empty embedding response from Ollama
docs: update FAQ with model download steps
chore: bump node version to 22
```

Breaking changes: add `!` after type or include `BREAKING CHANGE:` in footer.

**Add `[skip ci]` to commit messages for documentation-only changes** that don't need a build.

---

## Release Process

Releases are automated via **Semantic Release** (`release.yml` GitHub Action):
- Triggered manually with authorization
- Runs on `main` (stable) or `rc` (pre-release) branches
- Bumps version in `package.json` (root), generates changelog, creates GitHub release
- Version in `admin/package.json` stays at `0.0.0` — root `package.json` is the source of truth

---

## Docker & Deployment

**Production image** is built from the multi-stage `Dockerfile`:
1. `base` — Node 22-slim + system deps (graphicsmagick, libvips, build-essential)
2. `deps` — Install all npm deps
3. `production-deps` — Prune to production-only deps
4. `build` — Run `node ace build`
5. `final` — Minimal image with only production artifacts

**Production services** (`install/management_compose.yaml`):
- `admin` — Main app, port 8080
- `mysql` — Database, port 3306
- `redis` — Cache/queue, port 6379
- `updater` — Sidecar for self-updates, port 8081
- `dozzle` — Optional log viewer, port 9999

External services (Ollama, Qdrant, Kiwix, Kolibri) run separately and are referenced by service name in config.

---

## Key External Integrations

| Service | Purpose | Client |
|---|---|---|
| Ollama | LLM inference, embeddings | `ollama` npm package |
| Qdrant | Vector DB for RAG | HTTP API via axios |
| Docker Engine | Service lifecycle management | `dockerode` |
| Kiwix (ZIM) | Offline Wikipedia/content | Internal ZIM parser |
| Tesseract.js | OCR for PDF/image content | `tesseract.js` |
| MapLibre + PMTiles | Offline maps | `maplibre-gl`, `pmtiles` |

---

## Important Files to Know

| File | Purpose |
|---|---|
| `admin/start/routes.ts` | All HTTP routes |
| `admin/start/env.ts` | Env var validation schema |
| `admin/adonisrc.ts` | AdonisJS app config (aliases, providers, commands) |
| `admin/config/inertia.ts` | Inertia shared data & SSR config |
| `admin/config/queue.ts` | BullMQ queue definitions |
| `admin/vite.config.ts` | Frontend build config |
| `install/management_compose.yaml` | Production Docker Compose |
| `package.json` (root) | Version source of truth |
| `.releaserc.json` | Semantic Release config |

---

## Common Pitfalls

- **Do not** add business logic to controllers — use services.
- **Do not** call `new SomeService()` — use AdonisJS IoC injection.
- **Do not** push to `main` directly — PRs only; CI must pass.
- **Do not** modify `admin/package.json` version — it stays at `0.0.0`.
- **Do not** commit `.env` files or secrets.
- When adding a new env variable, always add it to both `.env.example` and `admin/start/env.ts`.
- Queue jobs must be registered in `adonisrc.ts` under `jobs`.
- New migrations must never modify existing migration files — always create new ones.
