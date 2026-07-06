# FABLE_NARRATIVE.md

> Loop 5 artifact — Narrative & positioning. Date: 2026-07-06.
> Ten-second test: "Fable turns your offline library into something you can ask — every answer shows the exact page it came from, and it works with the internet completely gone."

## Category statement

Fable creates the category of the **offline answer engine** — between the archive (Kiwix, Prepper Disk: content you can't converse with) and the chatbot (local LLMs: conversation you can't trust).

## The story arc

- **Before-state:** You did the responsible thing. You saved Wikipedia, the medical guides, the repair manuals. Hundreds of gigabytes of "just in case."
- **The pain:** Then the moment comes — no signal, a real question, minutes that matter — and your library is a haystack with a keyword search. Or worse: you ask an AI, and it answers *something*, fluently, and you have no way to know if it's true.
- **The failed old way:** Archives without answers (Kiwix, prepper drives). Answers without receipts (every chatbot). Setups without mercy (Docker, GPUs, terminals).
- **The Fable transformation:** Plug in. Point Fable at your library. Ask. Fable answers **and shows you the page** — your page, in your library, on your hardware. And when your library doesn't know, Fable says "I don't know," and hands you the closest pages instead of a guess.
- **After-state:** The knowledge you saved became knowledge you can use. Calmly, offline, forever — no account, no cloud, no rug-pull.

## Homepage

**Hero headline:** *Your library. Answering.*

**Subheadline:** Fable is the offline answer engine — ask anything, get a real answer with the exact pages it came from. Runs on your hardware, needs no internet, no account, no cloud.

**Three proof points:**
1. **Every answer shows its receipts.** Tappable citations to the exact pages in your offline library. If it's not in your library, Fable says so — no guessing, ever.
2. **Runs on the computer you already own.** Tuned for ordinary 8–16GB machines. No GPU, no terminal, no Docker degree required.
3. **Never goes stale, never phones home.** Verified knowledge packs keep your library current when you're online — and everything keeps working forever when you're not.

**Primary CTA:** *Ask your library something →* (interactive demo: a real question answered with citations, before any download)

**Secondary CTA:** Get Fable free · Browse knowledge packs

## Objection handling

| Objection | Response |
|---|---|
| "I can DIY this with Kiwix + Ollama for $75." | You can — Fable's engine is free and open source, so DIY *with* it. What you can't DIY is verified, versioned, current content and retrieval that's been tuned per-corpus. That's what packs are for. |
| "I don't trust AI, especially for medical stuff." | Neither do we. That's why Fable never answers without citations, refuses when the library doesn't contain the answer, and works as a pure library reader with AI switched off entirely. |
| "Another subscription?" | Fable never needs a subscription to work. Packs are optional and only do one thing: keep content current. Cancel and everything you have keeps working, offline, forever. |
| "Is my data leaving my machine?" | Nothing leaves. No account, no telemetry, no cloud calls. Pull the ethernet cable and verify. |
| "Will you rug-pull the license?" | Apache-2.0, permanently. We sell content and convenience, not your exit costs. |

## Onboarding copy (first-run, 4 screens)

1. **"Welcome to Fable."** Your offline library is about to start answering questions. No account needed — let's go.
2. **"Build your library."** Add a starter pack (Essentials: offline Wikipedia + first-aid + repair basics), or point Fable at ZIM files and documents you already have.
3. **"Indexing…"** Fable is reading your library so it can cite exact pages later. (~X min for your collection — ask your first question as soon as the bar turns green.)
4. **"Ask something real."** Try: *"How do I treat a second-degree burn?"* — notice the sources under the answer. Tap one. That's the page it came from. That's how every answer works here.

## Product personality

A calm librarian, not a survival bro and not a hype bot. Competent, plain-spoken, honest about limits. Says "I don't know" without embarrassment. Never urgent, never cute during emergencies. Visual language: warm paper-and-ink over tactical camo; the brand is a *library*, not a bunker — that's what keeps homeschoolers, educators, and preservationists in the tent with preppers.

## UX emotional arc

Anxiety ("will this thing actually work when it matters?") → relief at first cited answer ("it showed me where") → confidence (habitual asking) → calm ownership ("my library is current, mine, and answerable"). Every design decision serves the moment of *verification* — the tap from answer to source — because that's where trust is manufactured.

## Gate check (Loop 5)

Ten-second explanation exists (top of file), the hero passes the "read it once, get it" test, and the story survives its hardest audience (AI skeptics) by making the citation the hero — **gate PASSED**. → Loop 6 (Architecture).
