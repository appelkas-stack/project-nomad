/* Morning Rewire — 5-step ADHD brain primer with viral hooks.
   Self-contained. No build, no network. Stores progress in localStorage. */
(function () {
  "use strict";

  const STORAGE = "morning-rewire/v2";
  const STEPS = ["welcome", "breathe", "move", "hydrate", "focus", "intent", "complete"];
  const SCREENS = ["history", "streak"]; // non-flow screens, reachable via go()
  const SHARE_URL_BASE = location.origin + location.pathname.replace(/[^/]*$/, "");
  const HASHTAG = "#MorningRewire";

  const MOVES = [
    { emoji: "🤸", text: "Stand and stretch up high",   sec: 25 },
    { emoji: "🙆", text: "Roll your shoulders both ways", sec: 20 },
    { emoji: "🚶", text: "March in place — knees up",   sec: 30 },
    { emoji: "🧘", text: "Twist left, then right",       sec: 20 },
    { emoji: "🤾", text: "Reach for the sky, then toes", sec: 25 },
  ];

  const INTENT_SUGGESTIONS = [
    "Reply to that one email",
    "Drink water before coffee",
    "Walk for 10 minutes",
    "Open the one thing I'm avoiding",
    "Write down 3 priorities",
  ];

  // Daily mantras — one per day, seeded by date, so everyone gets the same.
  const MANTRAS = [
    "Start ugly. Start anyway.",
    "Boring beats brilliant when boring shows up.",
    "Action first. Motivation follows.",
    "Two-minute rule: just start.",
    "Done is the engine of motivation.",
    "Tiny step now > huge step later.",
    "Future you is already grateful.",
    "Today's win: showing up.",
    "Momentum is built in mornings.",
    "Your brain isn't broken — it's wired different.",
    "Five steps. That's the whole job.",
    "Slow is smooth. Smooth is fast.",
    "Hydration is a personality trait.",
    "Pick the one thing. Drop the rest.",
    "Streak today. Identity tomorrow.",
    "Notice the chaos. Choose the next step.",
    "Discipline is a love letter to future you.",
    "Tap. Breathe. Move. Drink. Decide.",
    "Half-done is more than not started.",
    "Tomorrow's energy is built today.",
    "Your nervous system before your inbox.",
    "Win the morning, coast the day.",
    "Don't break the chain.",
    "The only bad rep is the one you didn't do.",
    "Small streak, big brain.",
  ];

  const BADGES = [
    { id: "first",    days:   1, label: "🌱 First Spark"   },
    { id: "week",     days:   7, label: "🔥 7-Day Streak"  },
    { id: "two",      days:  14, label: "⚡ Fortnight"     },
    { id: "month",    days:  30, label: "🌟 30-Day Brain"  },
    { id: "hundred",  days: 100, label: "🏆 Century Club"  },
    { id: "year",     days: 365, label: "👑 365 Mornings"  },
  ];

  const stage = document.getElementById("stage");
  const progressBar = document.getElementById("progressBar");
  const streakEl = document.getElementById("streak");
  const xpEl = document.getElementById("xp");
  const skipBtn = document.getElementById("skipBtn");
  const resetBtn = document.getElementById("resetBtn");

  const state = load();
  let stepIndex = 0;
  let xpEarnedToday = 0;
  let focusTimeToday = null;
  let stepCleanup = null;

  // Capture inviter code from ?ref=xxxx — soft attribution, no backend.
  captureInviter();

  render();
  refreshHud();

  skipBtn.addEventListener("click", () => {
    if (stepIndex === 0 || stepIndex === STEPS.length - 1) return;
    next({ skipped: true });
  });
  resetBtn.addEventListener("click", () => {
    if (!confirm("Reset today's progress?")) return;
    xpEarnedToday = 0;
    focusTimeToday = null;
    stepIndex = 0;
    currentScreen = "welcome";
    render();
  });

  let currentScreen = "welcome";

  function next(opts) {
    opts = opts || {};
    if (SCREENS.includes(currentScreen)) {
      go("welcome");
      return;
    }
    if (!opts.skipped && stepIndex > 0 && stepIndex < STEPS.length - 1) {
      xpEarnedToday += 10;
    }
    stepIndex = Math.min(stepIndex + 1, STEPS.length - 1);
    currentScreen = STEPS[stepIndex];
    render();
  }

  function go(name) {
    if (SCREENS.includes(name)) {
      currentScreen = name;
    } else {
      stepIndex = Math.max(0, STEPS.indexOf(name));
      currentScreen = STEPS[stepIndex];
    }
    render();
  }

  function render() {
    if (typeof stepCleanup === "function") {
      try { stepCleanup(); } catch (_) { /* ignore */ }
      stepCleanup = null;
    }
    stage.innerHTML = "";
    const name = currentScreen;
    const tpl = document.getElementById("tpl-" + name);
    const node = tpl.content.firstElementChild.cloneNode(true);
    stage.appendChild(node);

    progressBar.style.width = SCREENS.includes(name)
      ? "0%"
      : (stepIndex / (STEPS.length - 1)) * 100 + "%";

    const setupFn = setups[name];
    if (setupFn) stepCleanup = setupFn(node);

    node.querySelectorAll("[data-action]").forEach((b) => {
      b.addEventListener("click", () => {
        const a = b.dataset.action;
        if (a === "start")        next();
        if (a === "next")         next();
        if (a === "finish")       finish();
        if (a === "show-history") showHistory();
        if (a === "share-streak") shareStreak();
        if (a === "invite")       invite();
      });
    });
  }

  function finish() {
    applyCompletion();
    refreshHud();
    stepIndex = 0;
    currentScreen = "welcome";
    xpEarnedToday = 0;
    focusTimeToday = null;
    render();
  }

  function applyCompletion() {
    const today = todayKey();
    if (state.lastCompleted === today) return;

    const yesterday = dayKey(-1);
    state.streak = state.lastCompleted === yesterday ? state.streak + 1 : 1;
    state.lastCompleted = today;
    state.totalXp += xpEarnedToday;
    if (!state.history.includes(today)) state.history.push(today);
    if (state.history.length > 400) state.history = state.history.slice(-400);

    // Track focus best.
    if (focusTimeToday != null) {
      if (state.bestFocus == null || focusTimeToday < state.bestFocus) {
        state.bestFocus = focusTimeToday;
        state.bestFocusDate = today;
      }
    }

    // Earn badges.
    BADGES.forEach((b) => {
      if (state.streak >= b.days && !state.badges.includes(b.id)) {
        state.badges.push(b.id);
      }
    });

    save(state);
  }

  function refreshHud() {
    streakEl.textContent = "🔥 " + state.streak;
    xpEl.textContent = "★ " + state.totalXp;
  }

  /* ---------- Step setups ---------- */
  const setups = {
    welcome(node) {
      const today = todayKey();
      const dayOfYear = computeDayOfYear(new Date());
      node.querySelector("#welcomeDay").textContent = dayOfYear;
      node.querySelector("#welcomeMantra").textContent = '"' + mantraFor(today) + '"';

      const best = state.bestFocus;
      const bestEl = node.querySelector("#welcomeBest");
      const bestInline = node.querySelector("#welcomeBestInline");
      if (best != null) {
        bestEl.textContent = "Personal best on focus: " + best.toFixed(1) + "s · streak " + state.streak + "🔥";
        bestInline.textContent = "PB " + best.toFixed(1) + "s";
      } else {
        bestEl.textContent = "Today's puzzle is the same for everyone — set the first PB.";
      }
      return null;
    },

    breathe(node) {
      const ring = node.querySelector("#breatheRing");
      const count = node.querySelector("#breatheCount");
      const phase = node.querySelector("#breathePhase");
      const inst = node.querySelector("#breatheInstruction");
      const done = node.querySelector("#breatheDone");

      const phases = [
        { name: "Inhale", cls: "inhale", sec: 4 },
        { name: "Hold",   cls: "inhale", sec: 4 },
        { name: "Exhale", cls: "exhale", sec: 4 },
        { name: "Hold",   cls: "exhale", sec: 4 },
      ];
      const totalRounds = 4;
      let round = 0, pIdx = 0, secLeft = phases[0].sec, tick;

      function update() {
        const p = phases[pIdx];
        phase.textContent = p.name;
        ring.classList.remove("inhale", "exhale");
        ring.classList.add(p.cls);
        count.textContent = secLeft;
        inst.textContent = "Round " + (round + 1) + " of " + totalRounds;
      }
      update();
      tick = setInterval(() => {
        secLeft -= 1;
        if (secLeft <= 0) {
          pIdx = (pIdx + 1) % phases.length;
          if (pIdx === 0) round += 1;
          if (round >= totalRounds) {
            clearInterval(tick);
            phase.textContent = "Nice 👏";
            count.textContent = "✓";
            inst.textContent = "Lungs warmed up.";
            done.disabled = false;
            return;
          }
          secLeft = phases[pIdx].sec;
        }
        update();
      }, 1000);
      return () => clearInterval(tick);
    },

    move(node) {
      const moveTitle = node.querySelector("#moveMove");
      const ill = node.querySelector("#moveIllustration");
      const fill = node.querySelector("#moveFill");
      const num = node.querySelector("#moveTimer");
      const hint = node.querySelector("#moveHint");
      const done = node.querySelector("#moveDone");

      // Same move each day for everyone — daily shared experience.
      const rng = mulberry32(seedFromDate(todayKey()) ^ 0x4d4f56);
      const m = MOVES[Math.floor(rng() * MOVES.length)];
      moveTitle.textContent = m.text;
      ill.textContent = m.emoji;
      hint.textContent = "Keep going until the ring fills.";

      const total = m.sec;
      let left = total;
      const dash = 289.03;
      num.textContent = left;
      fill.style.strokeDashoffset = dash;

      const tick = setInterval(() => {
        left -= 1;
        num.textContent = Math.max(left, 0);
        fill.style.strokeDashoffset = dash * (left / total);
        if (left <= 0) {
          clearInterval(tick);
          num.textContent = "✓";
          hint.textContent = "Body activated.";
          done.disabled = false;
          if (navigator.vibrate) navigator.vibrate(60);
        }
      }, 1000);
      return () => clearInterval(tick);
    },

    hydrate(node) {
      const glass = node.querySelector("#glass");
      const water = node.querySelector("#glassWater");
      const hint = node.querySelector("#hydrateHint");
      const done = node.querySelector("#hydrateDone");
      const TARGET = 5;
      let gulps = 0;

      function update() {
        const pct = Math.min(gulps / TARGET, 1) * 100;
        water.style.height = pct + "%";
        if (gulps >= TARGET) {
          hint.textContent = "Hydrated. Nervous system thanks you.";
          done.disabled = false;
        } else {
          hint.textContent = "Tap the glass — " + (TARGET - gulps) + " to go";
        }
      }
      update();
      glass.addEventListener("click", () => {
        if (gulps >= TARGET) return;
        gulps += 1;
        if (navigator.vibrate) navigator.vibrate(15);
        update();
      });
      return null;
    },

    focus(node) {
      const grid = node.querySelector("#focusGrid");
      const hint = node.querySelector("#focusHint");
      const done = node.querySelector("#focusDone");

      // Daily seeded puzzle — same scramble for everyone today.
      const seed = seedFromDate(todayKey());
      const rng = mulberry32(seed);
      const N = 10;
      const slots = seededShuffle([...Array(16).keys()], rng).slice(0, N);
      const layout = new Array(16).fill(null);
      slots.forEach((cellIdx, i) => { layout[cellIdx] = i + 1; });

      let nextNum = 1;
      const startedAt = Date.now();
      let penalty = 0;

      for (let i = 0; i < 16; i++) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "focus-cell";
        const val = layout[i];
        if (val) {
          cell.textContent = val;
          cell.dataset.num = val;
          cell.addEventListener("click", () => {
            const v = Number(cell.dataset.num);
            if (v === nextNum) {
              cell.classList.add("hit");
              setTimeout(() => cell.classList.add("done"), 120);
              cell.style.pointerEvents = "none";
              nextNum += 1;
              if (nextNum > N) {
                const elapsed = (Date.now() - startedAt) / 1000 + penalty;
                focusTimeToday = elapsed;
                let msg = "Sharp — " + elapsed.toFixed(1) + "s. Working memory online.";
                if (state.bestFocus != null && elapsed < state.bestFocus) {
                  msg = "🏅 NEW PERSONAL BEST · " + elapsed.toFixed(1) + "s (was " + state.bestFocus.toFixed(1) + ")";
                } else if (state.bestFocus != null) {
                  msg = elapsed.toFixed(1) + "s · PB still " + state.bestFocus.toFixed(1) + "s. Try again tomorrow.";
                }
                hint.textContent = msg;
                done.disabled = false;
                if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
              } else {
                hint.textContent = "Next: " + nextNum;
              }
            } else {
              cell.classList.add("miss");
              penalty += 1;
              if (navigator.vibrate) navigator.vibrate(40);
              setTimeout(() => cell.classList.remove("miss"), 250);
            }
          });
        } else {
          cell.disabled = true;
          cell.style.visibility = "hidden";
        }
        grid.appendChild(cell);
      }
      hint.textContent = "Next: 1 · Daily challenge";
      return null;
    },

    intent(node) {
      const input = node.querySelector("#intentInput");
      const sugg = node.querySelector("#intentSuggestions");
      const done = node.querySelector("#intentDone");

      INTENT_SUGGESTIONS.forEach((s) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = s;
        b.addEventListener("click", () => {
          input.value = s;
          input.dispatchEvent(new Event("input"));
          input.focus();
        });
        sugg.appendChild(b);
      });

      input.addEventListener("input", () => {
        done.disabled = input.value.trim().length < 3;
      });
      done.addEventListener("click", () => {
        state.lastIntent = input.value.trim();
        save(state);
      }, { once: true });

      setTimeout(() => input.focus({ preventScroll: true }), 50);
      return null;
    },

    complete(node) {
      // Apply today's completion now so the share card reflects it.
      applyCompletion();
      refreshHud();

      const today = todayKey();
      const dayOfYear = computeDayOfYear(new Date());
      const mantra = mantraFor(today);

      node.querySelector("#completeIntent").textContent = state.lastIntent
        ? "Today: " + state.lastIntent
        : "Now go do the thing.";
      node.querySelector("#finalStreak").textContent = state.streak + "🔥";
      node.querySelector("#finalFocus").textContent = focusTimeToday != null
        ? focusTimeToday.toFixed(1) + "s"
        : "—";
      node.querySelector("#finalTotal").textContent = state.totalXp + "★";

      // Milestone banner.
      const banner = node.querySelector("#milestoneBanner");
      const newMilestone = BADGES.find(
        (b) => state.streak === b.days && state.badges.includes(b.id)
      );
      const isPb = focusTimeToday != null && state.bestFocus === focusTimeToday;
      if (newMilestone) {
        banner.hidden = false;
        banner.textContent = "🎉 New badge unlocked: " + newMilestone.label;
      } else if (isPb) {
        banner.hidden = false;
        banner.textContent = "🏅 New personal best — " + focusTimeToday.toFixed(1) + "s";
      }

      // Confetti.
      const confetti = node.querySelector("#confetti");
      const colors = ["#ffb454", "#ff7ab6", "#6ee7b7", "#7ab6ff", "#f4f4ff"];
      const burst = newMilestone || isPb ? 80 : 40;
      for (let i = 0; i < burst; i++) {
        const piece = document.createElement("span");
        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = colors[i % colors.length];
        piece.style.animationDuration = (1.6 + Math.random() * 1.4) + "s";
        piece.style.animationDelay = (Math.random() * 0.2) + "s";
        piece.style.transform = "rotate(" + Math.random() * 360 + "deg)";
        confetti.appendChild(piece);
      }
      if (navigator.vibrate) navigator.vibrate([30, 60, 30, 60, 80]);

      // Render the share card.
      const canvas = node.querySelector("#shareCanvas");
      drawShareCard(canvas, {
        title: "Brain online",
        streak: state.streak,
        focusTime: focusTimeToday,
        focusPB: state.bestFocus,
        intent: state.lastIntent,
        mantra: mantra,
        dayOfYear: dayOfYear,
        isPb: isPb,
        milestone: newMilestone ? newMilestone.label : null,
      });

      // Wire up share buttons.
      const shareText = buildShareText({
        kind: "morning",
        streak: state.streak,
        focusTime: focusTimeToday,
        isPb: isPb,
        milestone: newMilestone ? newMilestone.label : null,
      });
      const url = inviteUrl();

      node.querySelector("#shareBtn").addEventListener("click", () => {
        shareNative(canvas, "Morning Rewire", shareText + "\n" + url + "\n" + HASHTAG);
      });
      node.querySelector("#copyBtn").addEventListener("click", () => {
        copyToClipboard(shareText + "\n" + url + "\n" + HASHTAG, "Link copied — paste anywhere");
      });
      node.querySelector("#downloadBtn").addEventListener("click", () => {
        downloadCanvas(canvas, "morning-rewire-day-" + state.streak + ".png");
      });

      return null;
    },

    history(node) {
      node.querySelector("#historyStreakBig").textContent = state.streak + " 🔥";

      const heat = node.querySelector("#historyHeatmap");
      const today = new Date();
      const cells = 35;
      // Start from 34 days ago, end today.
      for (let i = cells - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const cell = document.createElement("div");
        cell.className = "heatmap-cell";
        if (state.history.includes(key)) cell.classList.add("done");
        if (i === 0) cell.classList.add("today");
        cell.title = key;
        heat.appendChild(cell);
      }

      const badges = node.querySelector("#historyBadges");
      BADGES.forEach((b) => {
        const el = document.createElement("div");
        el.className = "badge" + (state.badges.includes(b.id) ? " earned" : "");
        el.textContent = b.label;
        badges.appendChild(el);
      });
      return null;
    },

    streak(node) {
      node.querySelector("#streakDayNum").textContent = state.streak;
      const canvas = node.querySelector("#streakCanvas");
      drawStreakCard(canvas, state);

      const text = buildShareText({ kind: "streak", streak: state.streak });
      const url = inviteUrl();
      node.querySelector("#streakShareBtn").addEventListener("click", () => {
        shareNative(canvas, "My streak", text + "\n" + url + "\n" + HASHTAG);
      });
      node.querySelector("#streakCopyBtn").addEventListener("click", () => {
        copyToClipboard(text + "\n" + url + "\n" + HASHTAG, "Copied!");
      });
      node.querySelector("#streakDownloadBtn").addEventListener("click", () => {
        downloadCanvas(canvas, "morning-rewire-streak-" + state.streak + ".png");
      });
      return null;
    },
  };

  function showHistory() { go("history"); }
  function shareStreak() { go("streak"); }

  function invite() {
    const url = inviteUrl();
    const text =
      "I'm doing a 5-step morning brain primer — try it with me " +
      url + " " + HASHTAG;
    if (navigator.share) {
      navigator.share({ title: "Morning Rewire", text: text, url: url }).catch(() => {});
    } else {
      copyToClipboard(text, "Invite link copied!");
    }
  }

  /* ---------- Share card rendering (Canvas → PNG) ---------- */
  function drawShareCard(canvas, data) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    // Background gradient.
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#2a1c3d");
    bg.addColorStop(0.6, "#1a1a2e");
    bg.addColorStop(1, "#0f0f1a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Soft glow blobs.
    drawBlob(ctx, W * 0.2, H * 0.15, 600, "rgba(255,180,84,0.35)");
    drawBlob(ctx, W * 0.85, H * 0.7, 700, "rgba(255,122,182,0.30)");

    // Header.
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "700 42px -apple-system, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("☀️  MORNING REWIRE", W / 2, 160);

    // Streak — big and proud.
    ctx.fillStyle = "#ffb454";
    ctx.font = "900 260px -apple-system, system-ui, sans-serif";
    ctx.fillText("Day " + data.streak, W / 2, 480);

    ctx.font = "900 200px -apple-system, system-ui, sans-serif";
    ctx.fillText("🔥", W / 2, 720);

    // Mantra in a soft card.
    drawRoundedRect(ctx, 80, 820, W - 160, 320, 36);
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "700 32px -apple-system, system-ui, sans-serif";
    ctx.fillText("TODAY'S MANTRA", W / 2, 900);

    ctx.fillStyle = "#f4f4ff";
    ctx.font = "800 56px -apple-system, system-ui, sans-serif";
    wrapText(ctx, '"' + data.mantra + '"', W / 2, 980, W - 220, 70);

    // Stats row.
    const statsY = 1240;
    drawStat(ctx, W * 0.25, statsY, "FOCUS",
      data.focusTime != null ? data.focusTime.toFixed(1) + "s" : "—",
      "#ff7ab6");
    drawStat(ctx, W * 0.75, statsY, "PB",
      data.focusPB != null ? data.focusPB.toFixed(1) + "s" : "—",
      "#6ee7b7");

    // Milestone or PB chip.
    if (data.milestone) {
      drawChip(ctx, W / 2, 1450, data.milestone, "#ffb454", "#1a0f2a");
    } else if (data.isPb) {
      drawChip(ctx, W / 2, 1450, "🏅 New Personal Best", "#6ee7b7", "#06281b");
    }

    // Intent.
    if (data.intent) {
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "italic 600 42px -apple-system, system-ui, sans-serif";
      wrapText(ctx, '"' + data.intent + '"', W / 2, 1600, W - 200, 60);
    }

    // Footer.
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "700 36px -apple-system, system-ui, sans-serif";
    ctx.fillText("Day " + data.dayOfYear + " · " + new Date().getFullYear(), W / 2, 1780);
    ctx.fillStyle = "#ffb454";
    ctx.font = "900 48px -apple-system, system-ui, sans-serif";
    ctx.fillText(HASHTAG, W / 2, 1850);
  }

  function drawStreakCard(canvas, s) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#2a1c3d");
    bg.addColorStop(1, "#0f0f1a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    drawBlob(ctx, W * 0.5, H * 0.4, 900, "rgba(255,180,84,0.32)");

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "700 42px -apple-system, system-ui, sans-serif";
    ctx.fillText("☀️  MORNING REWIRE", W / 2, 180);

    ctx.fillStyle = "#ffb454";
    ctx.font = "900 320px -apple-system, system-ui, sans-serif";
    ctx.fillText(s.streak + "", W / 2, 600);

    ctx.fillStyle = "#f4f4ff";
    ctx.font = "800 80px -apple-system, system-ui, sans-serif";
    ctx.fillText("day streak 🔥", W / 2, 720);

    // Last-35 emoji chain as a visual flex.
    const chain = buildEmojiChain(s.history, 35);
    drawRoundedRect(ctx, 80, 820, W - 160, 800, 40);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fill();

    ctx.font = "700 60px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("LAST 35 MORNINGS", W / 2, 920);

    ctx.font = "60px -apple-system, system-ui, sans-serif";
    ctx.fillStyle = "#f4f4ff";
    wrapText(ctx, chain, W / 2, 1040, W - 220, 80);

    if (s.bestFocus != null) {
      drawChip(ctx, W / 2, 1700, "Focus PB · " + s.bestFocus.toFixed(1) + "s",
        "#6ee7b7", "#06281b");
    }
    ctx.fillStyle = "#ffb454";
    ctx.font = "900 48px -apple-system, system-ui, sans-serif";
    ctx.fillText(HASHTAG, W / 2, 1840);
  }

  function buildEmojiChain(history, n) {
    const out = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      out.push(history.includes(key) ? "🔥" : "▫️");
    }
    // Insert spaces every 7 for readability.
    let chain = "";
    for (let i = 0; i < out.length; i++) {
      chain += out[i];
      if ((i + 1) % 7 === 0 && i !== out.length - 1) chain += " ";
    }
    return chain;
  }

  function drawBlob(ctx, x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y,     x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x,     y + h, r);
    ctx.arcTo(x,     y + h, x,     y,     r);
    ctx.arcTo(x,     y,     x + w, y,     r);
    ctx.closePath();
  }

  function drawStat(ctx, x, y, label, value, color) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "700 32px -apple-system, system-ui, sans-serif";
    ctx.fillText(label, x, y);
    ctx.fillStyle = color;
    ctx.font = "900 96px -apple-system, system-ui, sans-serif";
    ctx.fillText(value, x, y + 100);
  }

  function drawChip(ctx, cx, cy, text, bg, fg) {
    ctx.font = "900 44px -apple-system, system-ui, sans-serif";
    const w = ctx.measureText(text).width + 80;
    const h = 88;
    drawRoundedRect(ctx, cx - w / 2, cy - h / 2, w, h, h / 2);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, cy + 4);
    ctx.textBaseline = "alphabetic";
  }

  function wrapText(ctx, text, x, y, maxW, lineH) {
    const words = (text || "").split(/\s+/);
    let line = "";
    let yy = y;
    const lines = [];
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    for (const ln of lines) {
      ctx.fillText(ln, x, yy);
      yy += lineH;
    }
    return yy;
  }

  /* ---------- Sharing ---------- */
  function canvasToBlob(canvas) {
    return new Promise((res) => canvas.toBlob(res, "image/png"));
  }

  async function shareNative(canvas, title, text) {
    try {
      const blob = await canvasToBlob(canvas);
      const file = new File([blob], "morning-rewire.png", { type: "image/png" });
      if (
        navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share
      ) {
        await navigator.share({ title: title, text: text, files: [file] });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: title, text: text });
        return;
      }
    } catch (err) {
      if (err && err.name === "AbortError") return;
    }
    // Fallback — copy text and download image.
    copyToClipboard(text, "Copied! Now paste with the saved image.");
    downloadCanvas(canvas, "morning-rewire.png");
  }

  function downloadCanvas(canvas, filename) {
    canvas.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    });
  }

  function copyToClipboard(text, toastMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast(toastMsg || "Copied"));
    } else {
      const t = document.createElement("textarea");
      t.value = text;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch (_) {}
      t.remove();
      toast(toastMsg || "Copied");
    }
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;left:50%;bottom:80px;transform:translateX(-50%);" +
      "background:#1a1a2e;color:#fff;padding:10px 16px;border-radius:12px;" +
      "border:1px solid rgba(255,255,255,.12);z-index:9999;font-weight:600;" +
      "box-shadow:0 12px 32px -10px rgba(0,0,0,.6);font-size:14px;";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function buildShareText(opts) {
    if (opts.kind === "streak") {
      return "Day " + opts.streak + " 🔥 of Morning Rewire — five steps to wake my ADHD brain up. Try it:";
    }
    let line = "Day " + opts.streak + " 🔥 — brain online in 5 minutes.";
    if (opts.milestone) line += " Just unlocked " + opts.milestone + ".";
    else if (opts.isPb && opts.focusTime != null) {
      line += " New focus PB: " + opts.focusTime.toFixed(1) + "s.";
    } else if (opts.focusTime != null) {
      line += " Today's focus: " + opts.focusTime.toFixed(1) + "s.";
    }
    line += " Beat me 👇";
    return line;
  }

  function inviteUrl() {
    let code = state.code;
    if (!code) {
      code = randomCode();
      state.code = code;
      save(state);
    }
    return SHARE_URL_BASE + "?ref=" + code;
  }

  function captureInviter() {
    try {
      const params = new URLSearchParams(location.search);
      const ref = params.get("ref");
      if (ref && !state.invitedBy) {
        state.invitedBy = ref;
        save(state);
      }
    } catch (_) { /* ignore */ }
  }

  function randomCode() {
    return Math.random().toString(36).slice(2, 8);
  }

  /* ---------- Daily content (seeded) ---------- */
  function mantraFor(dateKey) {
    const seed = seedFromDate(dateKey);
    return MANTRAS[seed % MANTRAS.length];
  }

  function computeDayOfYear(d) {
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    return Math.floor(diff / 86400000);
  }

  /* ---------- Helpers ---------- */
  function mulberry32(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seedFromDate(dateKey) {
    return parseInt(dateKey.replace(/-/g, ""), 10) || 1;
  }
  function seededShuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function todayKey() { return dayKey(0); }
  function dayKey(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) return Object.assign(defaults(), JSON.parse(raw));
    } catch (_) {}
    // Migrate v1 if present.
    try {
      const old = localStorage.getItem("morning-rewire/v1");
      if (old) {
        const parsed = JSON.parse(old);
        return Object.assign(defaults(), parsed);
      }
    } catch (_) {}
    return defaults();
  }
  function defaults() {
    return {
      streak: 0,
      lastCompleted: null,
      totalXp: 0,
      lastIntent: "",
      history: [],
      bestFocus: null,
      bestFocusDate: null,
      badges: [],
      code: null,
      invitedBy: null,
    };
  }
  function save(s) {
    try { localStorage.setItem(STORAGE, JSON.stringify(s)); } catch (_) {}
  }
})();
