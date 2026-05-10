/* Morning Rewire — a 5-step ADHD brain primer.
   Self-contained. No build, no network. Stores progress in localStorage. */
(function () {
  "use strict";

  const STORAGE = "morning-rewire/v1";
  const STEPS = ["welcome", "breathe", "move", "hydrate", "focus", "intent", "complete"];

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

  const stage = document.getElementById("stage");
  const progressBar = document.getElementById("progressBar");
  const streakEl = document.getElementById("streak");
  const xpEl = document.getElementById("xp");
  const skipBtn = document.getElementById("skipBtn");
  const resetBtn = document.getElementById("resetBtn");

  const state = load();
  let stepIndex = 0;
  let xpEarnedToday = 0;
  let stepCleanup = null;

  render();
  refreshHud();

  skipBtn.addEventListener("click", () => {
    if (stepIndex === 0 || stepIndex === STEPS.length - 1) return;
    next({ skipped: true });
  });

  resetBtn.addEventListener("click", () => {
    if (!confirm("Reset today's progress?")) return;
    xpEarnedToday = 0;
    stepIndex = 0;
    render();
  });

  function next(opts) {
    opts = opts || {};
    if (!opts.skipped && stepIndex > 0 && stepIndex < STEPS.length - 1) {
      xpEarnedToday += 10;
    }
    stepIndex = Math.min(stepIndex + 1, STEPS.length - 1);
    render();
  }

  function render() {
    if (typeof stepCleanup === "function") {
      try { stepCleanup(); } catch (_) { /* ignore */ }
      stepCleanup = null;
    }
    stage.innerHTML = "";
    const name = STEPS[stepIndex];
    const tpl = document.getElementById("tpl-" + name);
    const node = tpl.content.firstElementChild.cloneNode(true);
    stage.appendChild(node);

    progressBar.style.width = (stepIndex / (STEPS.length - 1)) * 100 + "%";

    const setupFn = setups[name];
    if (setupFn) stepCleanup = setupFn(node);

    // Wire generic actions.
    node.querySelectorAll("[data-action]").forEach((b) => {
      b.addEventListener("click", () => {
        const a = b.dataset.action;
        if (a === "start")  next();
        if (a === "next")   next();
        if (a === "finish") finish();
      });
    });
  }

  function finish() {
    const today = todayKey();
    if (state.lastCompleted !== today) {
      const yesterday = dayKey(-1);
      state.streak = state.lastCompleted === yesterday ? state.streak + 1 : 1;
      state.lastCompleted = today;
      state.totalXp += xpEarnedToday;
      save(state);
    }
    refreshHud();
    stepIndex = 0;
    render();
  }

  function refreshHud() {
    streakEl.textContent = "🔥 " + state.streak;
    xpEl.textContent = "★ " + state.totalXp;
  }

  /* ---------- Step setups ---------- */
  const setups = {
    welcome(node) {
      // Nothing to do — button handled by data-action.
      return null;
    },

    breathe(node) {
      const ring = node.querySelector("#breatheRing");
      const count = node.querySelector("#breatheCount");
      const phase = node.querySelector("#breathePhase");
      const inst = node.querySelector("#breatheInstruction");
      const done = node.querySelector("#breatheDone");

      const phases = [
        { name: "Inhale",  cls: "inhale", sec: 4 },
        { name: "Hold",    cls: "inhale", sec: 4 },
        { name: "Exhale",  cls: "exhale", sec: 4 },
        { name: "Hold",    cls: "exhale", sec: 4 },
      ];
      const totalRounds = 4;
      let round = 0;
      let pIdx = 0;
      let secLeft = phases[0].sec;
      let tick;

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

      const m = MOVES[Math.floor(Math.random() * MOVES.length)];
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

      const N = 10;
      const positions = shuffle([...Array(16).keys()]).slice(0, N);
      const layout = new Array(16).fill(null);
      positions.forEach((cellIdx, i) => { layout[cellIdx] = i + 1; });

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
                const elapsed = ((Date.now() - startedAt) / 1000 + penalty).toFixed(1);
                hint.textContent = "Sharp — " + elapsed + "s. Working memory online.";
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
      hint.textContent = "Next: 1";
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
      const intent = node.querySelector("#completeIntent");
      const fs = node.querySelector("#finalStreak");
      const fx = node.querySelector("#finalXp");
      const ft = node.querySelector("#finalTotal");
      const confetti = node.querySelector("#confetti");

      // Apply today's completion if not already applied.
      const today = todayKey();
      let displayStreak = state.streak;
      let displayTotal = state.totalXp + xpEarnedToday;
      if (state.lastCompleted !== today) {
        const yesterday = dayKey(-1);
        displayStreak = state.lastCompleted === yesterday ? state.streak + 1 : 1;
      }

      intent.textContent = state.lastIntent
        ? "Today: " + state.lastIntent
        : "Now go do the thing.";
      fs.textContent = displayStreak + "🔥";
      fx.textContent = "+" + xpEarnedToday + "★";
      ft.textContent = displayTotal + "★";

      // Confetti burst.
      const colors = ["#ffb454", "#ff7ab6", "#6ee7b7", "#7ab6ff", "#f4f4ff"];
      for (let i = 0; i < 40; i++) {
        const piece = document.createElement("span");
        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = colors[i % colors.length];
        piece.style.animationDuration = (1.6 + Math.random() * 1.4) + "s";
        piece.style.animationDelay = (Math.random() * 0.2) + "s";
        piece.style.transform = "rotate(" + Math.random() * 360 + "deg)";
        confetti.appendChild(piece);
      }
      if (navigator.vibrate) navigator.vibrate([30, 60, 30, 60, 80]);
      return null;
    },
  };

  /* ---------- Helpers ---------- */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
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
    } catch (_) { /* ignore */ }
    return defaults();
  }
  function defaults() {
    return { streak: 0, lastCompleted: null, totalXp: 0, lastIntent: "" };
  }
  function save(s) {
    try { localStorage.setItem(STORAGE, JSON.stringify(s)); } catch (_) { /* ignore */ }
  }
})();
