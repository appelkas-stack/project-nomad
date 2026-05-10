# Morning Rewire 🔥

A tiny ADHD-friendly morning game. Five steps, ~5 minutes, then your brain is online.

## The five steps

1. **Breathe** — 4 rounds of box breathing (inhale / hold / exhale / hold).
2. **Move** — a random 20–30s body activation (stretch, march, twist).
3. **Hydrate** — tap the glass five times as you sip.
4. **Focus** — tap 1→10 in scrambled order; warms up working memory.
5. **Intent** — type the ONE most important thing for today.

Streaks 🔥 and XP ★ are saved in `localStorage` so the dopamine compounds.

## Run on your phone

It's a single static page. Two easy options:

- **Locally**: open a terminal in this folder and run
  ```
  python3 -m http.server 8080
  ```
  Then on your phone (same Wi-Fi) visit `http://<your-computer-ip>:8080/`.

- **Anywhere static**: drop the four files (`index.html`, `styles.css`,
  `game.js`, `manifest.webmanifest`) onto Netlify, GitHub Pages, Cloudflare
  Pages, or any S3 bucket.

On iOS Safari or Android Chrome, tap **Share → Add to Home Screen** to
install it as a standalone app. It runs fully offline after first load.

## Design notes

- Big tap targets, no tiny text, single decision per screen — ADHD friendly.
- Each step gives instant visual + haptic feedback (`navigator.vibrate`).
- The game rewards completion, not perfection — you can skip a step.
- No accounts, no network, no tracking. State lives only on your phone.
