# FABLE_DECISIONS.md

> Log of decisions made by FABLE LOOP OS. Newest first.
> Format: ID · Date · Decision · Rationale · Status

| ID | Date | Decision | Rationale | Status |
|---|---|---|---|---|
| D-003 | 2026-07-06 | Gate after Loop 2 and request a human decision on the next track (audit / security / research / build). | FABLE LOOP OS was started without a `[goal]`; per hard-stop rules, choosing the product direction is human judgment. Loops 1–2 required no such judgment; Loop 3+ does. | Open — awaiting human |
| D-002 | 2026-07-06 | Treat this repo as an **existing codebase** and run the existing-codebase loop sequence (Context Intake → Architecture Reverse-Engineering → …), not the new-idea sequence. | Repo contains a shipped v1.30.3 product with real users, docs, installer, and release pipeline. | Applied |
| D-001 | 2026-07-06 | Maintain FABLE state as markdown files at repo root on branch `claude/fable-loop-os-system-67ab72`; never push to other branches. | Required by FABLE LOOP OS external-state rule and the session's branch mandate. | Applied |
