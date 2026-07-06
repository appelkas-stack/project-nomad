# FABLE_RISKS.md

> Ranked risk register. Severity: Critical / High / Medium / Low.
> Sources: Loop 1 (context intake) + Loop 2 (architecture reverse-engineering), 2026-07-06.
> Facts vs assumptions are marked. Items are *risks*, not confirmed vulnerabilities, until an Audit/Security Loop verifies them.

| # | Risk | Severity | Type | Evidence | Status |
|---|---|---|---|---|---|
| R-01 | **No authentication anywhere** — every API route (Docker orchestration, settings, downloads, chat) is unauthenticated by design. Any device on the LAN has full control, including the Docker daemon. | High (by-design, documented) | Security | README §About Security; no auth middleware registered in `admin/start/kernel.ts` | Accepted upstream by design; re-evaluate if exposure model ever changes |
| R-02 | **Command Center controls the Docker daemon** (dockerode, docker socket). Combined with R-01, any LAN attacker can pull/run containers → effectively root on the host. | High | Security | `admin/app/services/docker_service.ts`; compose mounts (verify in Security Loop) | Needs Security Loop verification |
| R-03 | **No automated tests** — `admin/tests/` has only `bootstrap.ts`; root test script is a stub. Every change ships on typecheck/lint/manual QA only. | High | Quality | `admin/tests/`, `package.json` | Open — candidate for QA Loop |
| R-04 | **CSRF disabled + no session auth** means state-changing endpoints are callable cross-origin from any website visited by a browser on the same LAN (drive-by attacks against `http://device:8080`). | Medium–High | Security | Verify `admin/config/shield.ts` / CORS config in Security Loop | Needs verification |
| R-05 | Shell/installer surface: `install/*.sh` run as root and the app shells out for system tasks — input paths (filenames, model names, ZIM titles) reaching shell commands would be code-exec as root. | Medium | Security | `install/` scripts; verify service-layer exec calls in Security Loop | Needs verification |
| R-06 | **Fork drift**: this fork's only divergence from upstream is adding `remotion` deps at repo root (PR #2) with no consuming code — unclear intent; dead deps add install weight and attack surface. | Medium | Product/Tech | Root `package.json`, commit `04a3821` | Needs human clarification |
| R-07 | Business direction for this fork is unknown (no goal given) — building features now risks waste. | Medium | Business | FABLE_LOOP_STATE.md §6 | Gated — awaiting human |
| R-08 | Large binary assets committed to git (`install/wikipedia_*.zim`) bloat clone size and CI. | Low | Ops | `install/` directory listing | Open |
| R-09 | AI/RAG stack (Ollama, Qdrant, document upload with OCR/PDF parsing) exposes parsing of untrusted files and prompt-injection surface via uploaded documents. | Medium | Security/AI | `rag_service.ts`, `embed_file_job.ts`, tesseract.js/pdf-parse deps | Needs Security Loop verification |
