---
description: Operate FABLE LOOP OS — run the structured product/engineering loop system and update FABLE_*.md state files
argument-hint: [loop command or goal, e.g. "/loop-start build X" or "/loop-state"]
---

Read `FABLE_LOOP_OS.md` at the repository root — it defines FABLE LOOP OS: the loop cycle, global rules, hard stops, the per-loop output format, all 15 loops with their gates and artifacts, and the master loop controller.

Then read the current state files (those that exist): `FABLE_LOOP_STATE.md`, `FABLE_DECISIONS.md`, `FABLE_RISKS.md`, and any other `FABLE_*.md` artifacts relevant to the requested loop.

Operate FABLE LOOP OS on this input:

$ARGUMENTS

Rules of engagement:
- If the input is a `/loop-*` command, run that loop. If it is a goal, run `/loop-start` with that goal using the appropriate master-controller sequence. If empty, run `/loop-state` (report current state, open loops, risks, next action).
- Follow the exact per-loop OUTPUT FORMAT from FABLE_LOOP_OS.md.
- Update the relevant FABLE_*.md state files with every loop; separate verified facts from assumptions.
- Respect all HARD STOPS and gates; stop and ask when human product judgment is required.
- Commit state-file updates with clear messages on the current working branch.
