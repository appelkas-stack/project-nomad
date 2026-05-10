# Morning Rewire 🔥

A tiny ADHD-friendly morning game built for *virality*. Five steps,
~5 minutes, then your brain is online — and shareable.

## The five steps

1. **Breathe** — 4 rounds of box breathing.
2. **Move** — a 20–30s body activation (today's move is the same for everyone).
3. **Hydrate** — tap the glass five times.
4. **Focus** — daily seeded "tap 1→10" puzzle. Everyone gets the **same scramble** today, so you can compare times with friends.
5. **Intent** — type the ONE thing that matters today.

## Viral hooks built in

| Mechanic                | Why it spreads                                                                 |
| ----------------------- | ------------------------------------------------------------------------------ |
| 🔥 **Streak**           | Identity-forming. People share Day-7, Day-30, Day-100 milestones unprompted.   |
| 🏅 **Personal best**    | Focus puzzle has a leaderboard-of-one. Beating your PB is shareable.           |
| 📅 **Daily challenge**  | Same focus puzzle + same mantra each day for every user → friendly competition.|
| 📲 **Share card**       | Each completion renders a polished 1080×1920 PNG (TikTok/IG/Snap-ready) via Canvas. |
| 💬 **Web Share API**    | One tap → native iOS/Android share sheet → posts the image + caption + invite link. |
| 🎁 **Invite link**      | Auto-generated `?ref=xxxxxx` link in every share. Soft attribution, no backend.|
| 🏆 **Badges**           | 1-day, 7-day, 14-day, 30-day, 100-day, 365-day. Each unlock triggers confetti + share prompt. |
| 🔁 **Streak heatmap**   | GitHub-style 35-cell grid → renders as an emoji 🔥▫️ chain for text-only shares. |
| 🪞 **Daily mantra**     | Same date-seeded mantra for all users → great quote-card content for IG/Twitter. |
| ✨ **Confetti + haptics** | Cheap dopamine hit at every win — makes people *want* to play again tomorrow.|

## Run on your phone

It's a single static page. Two easy options:

- **Locally**: open a terminal in this folder and run
  ```
  python3 -m http.server 8080
  ```
  Then on your phone (same Wi-Fi) visit `http://<your-computer-ip>:8080/`.

- **Anywhere static**: drop the files onto Netlify, GitHub Pages,
  Cloudflare Pages, or any S3 bucket. The Open Graph / Twitter card
  meta tags + `og-image.svg` make the URL itself shareable.

On iOS Safari or Android Chrome, tap **Share → Add to Home Screen** to
install it as a standalone app. It runs fully offline after first load.

## How sharing works

Tapping **Share my morning** on the completion screen:

1. Renders a vertical 1080×1920 image card on a hidden `<canvas>`:
   `Day N 🔥` + today's mantra + focus time + your intent + `#MorningRewire`.
2. Wraps it as a PNG `File`.
3. Calls `navigator.share({ files, text, title })` — native sheet pops up.
4. Caption is pre-baked with your stats and your `?ref=xxxxxx` invite link.
5. On browsers without `navigator.canShare({files})` it falls back to
   downloading the PNG + copying the caption to the clipboard.

The invite link captures the inviter's code on first load via
`?ref=` and stashes it in localStorage — when you later wire a backend
or analytics, you have the attribution chain ready.

## Design notes

- Big tap targets, single decision per screen — ADHD friendly.
- Each step gives instant visual + haptic feedback (`navigator.vibrate`).
- The daily seed (`YYYYMMDD`) means a friend playing on the same day
  gets the *same focus scramble* and *same mantra* — natural conversation starter.
- No accounts, no network, no tracking. State lives only on the phone.

## Files

```
index.html              # 5 screens + welcome + history + streak share
styles.css              # Mobile-first dark UI with gradients & motion
game.js                 # Seeded RNG, share canvas, badges, history
manifest.webmanifest    # Install to home screen
og-image.svg            # Social link preview
```
