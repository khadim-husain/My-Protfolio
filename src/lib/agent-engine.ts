import {
  AGENTS, CONFIG, AgentConfig, AnimKind, clamp, easeInOutCubic, easeOutBack, easeOutCubic,
} from "./animation-config";

type TargetState = "pending" | "claimed" | "done";

interface Target {
  id: string;
  el: HTMLElement;
  order: number;
  kind: AnimKind;
  section: string;
  state: TargetState;
  visible: boolean;
  chars: HTMLElement[];
  shown: number;
}

export interface AgentView {
  cursor: HTMLElement;
  sel: HTMLElement;
}

type Phase = "idle" | "move" | "select" | "build" | "release";
type HeroState = "swarm" | "burst" | "hero_active" | "hero_done";

interface Runtime {
  cfg: AgentConfig;
  view: AgentView;
  index: number;
  phase: Phase;
  target: Target | null;
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  t0: number;
  dur: number;
  hidden: boolean;
  placed: boolean;
  rotDeg: number;
}

const pt = (x: number, y: number) => ({ x, y });

/**
 * Deterministic automated 8-agent animation engine replicating VIDEO A:
 *  - 0.0s - 1.0s: All 8 agents orbit in a circular swarm in the center of the hero screen.
 *  - 1.0s - 1.8s: Radial burst outward to assigned hero elements with cyan blueprint framing.
 *  - 1.8s - 4.5s: Synchronized parallel construction (PORTFOLIO sweep, name, greeting, role, intro, portrait, CTAs, stats).
 *  - 4.5s - 5.0s: Clean release, selection boxes dissolve, all cursors smoothly fade out and hide completely.
 *  - Lower sections activate on scroll; refreshes restart fresh from top.
 */
export class AgentEngine {
  private targets: Target[] = [];
  private agents: Runtime[] = [];
  private io: IntersectionObserver | null = null;
  private mq: MediaQueryList | null = null;
  private raf = 0;
  private lastTs = 0;
  private clock = 0;
  private lastClaim = -1e9;
  private enabled = true;
  private paused = false;
  private force: string | null = null;
  private count = CONFIG.desktopAgents;
  private started = false;
  private lastAgentIndex = -1;
  private resetDebounce: NodeJS.Timeout | null = null;
  private heroState: HeroState = "swarm";

  /* ---------- lifecycle ---------- */

  init(views: AgentView[]) {
    this.agents = AGENTS.map((cfg, index) => {
      const fallbackView: AgentView = {
        cursor: views[index]?.cursor || document.createElement("div"),
        sel: views[index]?.sel || document.createElement("div"),
      };
      const runtime: Runtime = {
        cfg,
        view: fallbackView,
        index,
        phase: "idle" as Phase,
        target: null,
        x: 0,
        y: 0,
        fromX: 0,
        fromY: 0,
        t0: 0,
        dur: 1,
        hidden: false,
        placed: false,
        rotDeg: 0,
      };
      return runtime;
    });

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.scan();

    if (prefersReducedMotion) {
      this.finishAll();
      this.enabled = false;
      return;
    }

    this.mq = window.matchMedia(CONFIG.mobileQuery);
    this.mq.addEventListener("change", this.onMq);
    this.applyCount();

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", this.onWindowScroll, { passive: true });
      if (window.scrollY > 80) {
        this.heroState = "hero_done";
        for (const t of this.targets) {
          if (t.section === "hero") this.finalize(t);
        }
        for (const a of this.agents) this.hideAgent(a);
      } else {
        this.heroState = "swarm";
      }
    }
  }

  registerView(index: number, view: AgentView) {
    if (this.agents[index]) {
      this.agents[index].view = view;
      if (this.heroState !== "swarm" && this.agents[index].phase === "idle") {
        this.hideAgent(this.agents[index]);
      }
    }
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.lastTs = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  destroy() {
    this.started = false;
    cancelAnimationFrame(this.raf);
    this.io?.disconnect();
    this.mq?.removeEventListener("change", this.onMq);
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", this.onWindowScroll);
    }
    if (this.resetDebounce) {
      clearTimeout(this.resetDebounce);
      this.resetDebounce = null;
    }
    this.io = null;
    for (const a of this.agents) {
      this.onInterrupt(a);
    }
  }

  /* ---------- public controls ---------- */

  setEnabled(on: boolean) {
    if (on === this.enabled) return;
    this.enabled = on;
    if (!on) {
      this.finishAll();
    }
  }

  isEnabled() {
    return this.enabled;
  }

  setPaused(p: boolean) {
    this.paused = p;
  }

  isPaused() {
    return this.paused;
  }

  getClock() {
    return this.clock;
  }

  getHeroState() {
    return this.heroState;
  }

  setForce(section: string | null) {
    this.force = section;
  }

  isSectionDone(section: string) {
    return this.targets.filter((t) => t.section === section).every((t) => t.state === "done");
  }

  allDone() {
    return this.targets.every((t) => t.state === "done");
  }

  /** Reset all targets to pending and restart opening swarm. */
  reset() {
    for (const t of this.targets) {
      this.clearInline(t);
      t.el.removeAttribute("data-built");
      t.state = "pending";
      t.shown = 0;
    }
    for (const a of this.agents) {
      this.hideAgent(a);
    }
    this.clock = 0;
    this.heroState = "swarm";
    this.lastClaim = -1e9;
    this.force = null;
    this.lastAgentIndex = -1;
  }

  /** Instantly reveal all elements and hide all cursors without lingering artifacts. */
  finishAll() {
    this.heroState = "hero_done";
    for (const t of this.targets) {
      this.finalize(t);
    }
    for (const a of this.agents) {
      this.hideAgent(a);
    }
  }

  /* ---------- scanning ---------- */

  private scan() {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-build]"));
    this.targets = els
      .map((el, i): Target => ({
        id: el.dataset.build || `t${i}`,
        el,
        order: parseFloat(el.dataset.order || String(i)),
        kind: (el.dataset.anim as AnimKind) || "pop",
        section: el.closest<HTMLElement>("[data-section]")?.dataset.section || "page",
        state: "pending",
        visible: false,
        chars: Array.from(el.querySelectorAll<HTMLElement>(".ch")),
        shown: 0,
      }))
      .sort((a, b) => a.order - b.order);

    for (const t of this.targets) {
      this.clearInline(t);
      t.el.removeAttribute("data-built");
    }

    this.io?.disconnect();
    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const t = this.targets.find((x) => x.el === e.target);
          if (t) t.visible = e.isIntersecting;
        }
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0 },
    );
    for (const t of this.targets) this.io.observe(t.el);
  }

  private onMq = () => this.applyCount();

  private applyCount() {
    this.count = this.mq?.matches ? CONFIG.mobileAgents : CONFIG.desktopAgents;
    for (const a of this.agents) {
      const hide = a.index >= this.count;
      if (hide) {
        if (!a.hidden && a.target) {
          this.onInterrupt(a);
        }
        a.hidden = true;
        a.view.cursor.style.display = "none";
      } else {
        a.hidden = false;
        if (a.phase === "idle" && this.heroState !== "swarm") {
          a.view.cursor.style.display = "none";
        }
      }
    }
  }

  private onWindowScroll = () => {
    // When returning to top of page (Hero), re-arm lower sections so scrolling down triggers animations again
    if (typeof window !== "undefined" && window.scrollY < 20) {
      if (this.resetDebounce) clearTimeout(this.resetDebounce);
      this.resetDebounce = setTimeout(() => {
        if (typeof window !== "undefined" && window.scrollY < 20) {
          this.rearmLowerSections();
        }
      }, 400);
    }
  };

  private rearmLowerSections() {
    let rearmed = false;
    for (const t of this.targets) {
      if (t.section !== "hero" && t.state === "done") {
        this.clearInline(t);
        t.el.removeAttribute("data-built");
        t.state = "pending";
        t.shown = 0;
        rearmed = true;
      }
    }
    if (rearmed) {
      for (const a of this.agents) {
        if (a.phase !== "idle") this.onInterrupt(a);
      }
      this.lastClaim = -1e9;
      this.lastAgentIndex = -1;
    }
  }

  /* ---------- frame loop ---------- */

  private tick = (ts: number) => {
    if (!this.started) return;
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min(48, ts - this.lastTs);
    this.lastTs = ts;
    if (!this.enabled || this.paused) return;
    this.clock += dt;

    if (this.targets.length === 0) {
      this.scan();
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Phase 1: Swarm Orbit in the center
    if (this.heroState === "swarm") {
      if (this.clock < 1000) {
        this.stepSwarm(vw, vh);
        return;
      } else {
        this.startHeroBurst(vw, vh);
      }
    }

    // Lower sections scheduling when hero is done
    if (this.heroState === "hero_done") {
      this.scheduleTargets();
    }

    // Step active agents
    for (const a of this.agents) {
      if (a.hidden || a.phase === "idle") continue;
      this.stepAgent(a, dt, vw, vh);
    }
  };

  /* ---------- Hero Orchestration ---------- */

  private stepSwarm(vw: number, vh: number) {
    const cx = vw / 2;
    const cy = Math.max(160, vh * 0.44);
    const R = Math.min(vw * 0.14, 65);
    const fadeIn = clamp(this.clock / 220, 0, 1);

    for (const a of this.agents) {
      if (a.hidden) continue;
      // Clockwise orbit of 2.2s per full circle
      const theta = (2 * Math.PI * a.index) / this.count + (this.clock / 2200) * 2 * Math.PI;
      a.x = cx + R * Math.cos(theta);
      a.y = cy + R * Math.sin(theta);
      a.rotDeg = (theta * 180) / Math.PI + 90;
      a.placed = true;

      a.view.cursor.dataset.active = "1";
      a.view.cursor.style.display = "block";
      a.view.cursor.style.visibility = "visible";
      a.view.cursor.style.opacity = String(fadeIn);
      a.view.cursor.style.transform = `translate3d(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px,0) rotate(${a.rotDeg.toFixed(1)}deg)`;
    }
  }

  private startHeroBurst(_vw: number, _vh: number) {
    this.heroState = "hero_active";
    const heroTargets = this.targets.filter((t) => t.section === "hero");

    // Exact 8-agent hero target assignment matching Video A:
    const assignments: Record<string, string> = {
      motion: "hero-word",       // Giant red PORTFOLIO background text
      layout: "hero-name",       // KHADIMHUSAIN
      scout: "hero-hello",       // Hello, I'm
      typeset: "hero-role",      // FULL STACK DEVELOPER | AI ENGINEER
      copy: "hero-intro",        // High-contrast description paragraph
      render: "hero-portrait",   // Headshot photo
      deploy: "hero-cta-work",   // CTA buttons
      qa: "hero-stat-0",         // Statistics cards
    };

    for (const a of this.agents) {
      if (a.hidden) continue;
      const targetId = assignments[a.cfg.id];
      const target = heroTargets.find((t) => t.id === targetId && t.state === "pending");

      if (target) {
        target.state = "claimed";
        a.target = target;
        a.fromX = a.x;
        a.fromY = a.y;
        a.t0 = this.clock;
        a.dur = 650;
        a.phase = "move";
        a.view.cursor.dataset.active = "1";
        a.view.cursor.style.display = "block";
        a.view.cursor.style.visibility = "visible";
        a.view.cursor.style.opacity = "1";
      } else {
        this.hideAgent(a);
      }
    }
  }

  private getNextChainedTarget(a: Runtime, current: Target): Target | null {
    if (current.section !== "hero") return null;
    if (a.cfg.id === "deploy") {
      if (current.id === "hero-cta-work") {
        return this.targets.find((t) => t.id === "hero-cta-contact" && t.state === "pending") || null;
      }
      if (current.id === "hero-cta-contact") {
        return this.targets.find((t) => t.id === "hero-location" && t.state === "pending") || null;
      }
    }
    if (a.cfg.id === "qa") {
      if (current.id === "hero-stat-0") {
        return this.targets.find((t) => t.id === "hero-stat-1" && t.state === "pending") || null;
      }
      if (current.id === "hero-stat-1") {
        return this.targets.find((t) => t.id === "hero-stat-2" && t.state === "pending") || null;
      }
    }
    return null;
  }

  private chainToNextTarget(a: Runtime, next: Target) {
    next.state = "claimed";
    a.target = next;
    a.fromX = a.x;
    a.fromY = a.y;
    a.t0 = this.clock;
    a.dur = 250;
    a.phase = "move";
    a.view.sel.dataset.active = "0";
    a.view.sel.style.opacity = "0";
  }

  /* ---------- Lower Section Scheduling ---------- */

  private busy() {
    return this.agents.filter((a) => !a.hidden && a.phase !== "idle").length;
  }

  private nextTarget(): Target | null {
    for (const t of this.targets) {
      if (t.state === "pending" && (t.visible || t.section === this.force)) return t;
    }
    return null;
  }

  private preferredAgentForTarget(t: Target): string {
    const id = t.id.toLowerCase();
    if (id.includes("label") || id.includes("scout")) return "scout";
    if (t.kind === "wipe" || id.includes("title")) return "layout";
    if (t.kind === "type" || id.includes("typed") || id.includes("about-me")) {
      return (Math.floor(this.clock / 500) % 2 === 0) ? "typeset" : "copy";
    }
    if (id.includes("marquee") || id.includes("stack") || id.includes("motion")) return "motion";
    if (id.includes("project-0") || id.includes("timeline-0") || id.includes("philosophy")) return "qa";
    if (id.includes("project-1") || id.includes("timeline-1") || id.includes("resume") || id.includes("cta")) return "deploy";
    if (id.includes("skill") || id.includes("principle") || id.includes("render")) return "render";
    return AGENTS[(this.lastAgentIndex + 1) % AGENTS.length].id;
  }

  private scheduleTargets() {
    if (this.busy() >= CONFIG.maxConcurrent) return;
    if (this.clock - this.lastClaim < CONFIG.claimStaggerMs) return;

    const t = this.nextTarget();
    if (!t) return;

    const available = this.agents.filter((a) => !a.hidden && a.phase === "idle");
    if (available.length === 0) return;

    const preferredId = this.preferredAgentForTarget(t);
    let chosen = available.find((a) => a.cfg.id === preferredId);

    if (!chosen) {
      const sorted = [...available].sort((a, b) => {
        const aDist = (a.index - this.lastAgentIndex + this.count) % this.count;
        const bDist = (b.index - this.lastAgentIndex + this.count) % this.count;
        return aDist - bDist;
      });
      chosen = sorted[0];
    }

    this.lastAgentIndex = chosen.index;
    this.startAgentOnTarget(chosen, t);
  }

  private startAgentOnTarget(a: Runtime, t: Target) {
    t.state = "claimed";
    a.target = t;
    this.lastClaim = this.clock;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tl = this.corner(t, "tl");

    const onScreen = a.placed && a.x >= 0 && a.x <= vw && a.y >= 0 && a.y <= vh;
    if (!onScreen) {
      const angle = ((a.index * 45 + 20) * Math.PI) / 180;
      const flyDist = clamp(Math.min(vw, vh) * 0.35, 180, 280);
      a.fromX = clamp(tl.x + Math.cos(angle) * flyDist, 15, vw - 15);
      a.fromY = clamp(tl.y + Math.sin(angle) * flyDist, 15, vh + 60);
      a.x = a.fromX;
      a.y = a.fromY;
    } else {
      a.fromX = a.x;
      a.fromY = a.y;
    }
    a.placed = true;
    a.rotDeg = 0;

    const dist = Math.hypot(tl.x - a.fromX, tl.y - a.fromY);
    a.dur = clamp(CONFIG.moveMin + dist * 0.45, 380, 680);
    a.t0 = this.clock;
    a.phase = "move";

    this.onStart(a, t);
  }

  /* ---------- Agent State Stepping ---------- */

  private stepAgent(a: Runtime, _dt: number, vw: number, vh: number) {
    switch (a.phase) {
      case "idle":
        break;

      case "move": {
        const t = a.target!;
        const p = clamp((this.clock - a.t0) / a.dur, 0, 1);
        const e = easeInOutCubic(p);
        const tl = this.corner(t, "tl");
        a.x = a.fromX + (tl.x - a.fromX) * e;
        a.y = a.fromY + (tl.y - a.fromY) * e;

        // Smoothly return rotation to 0 as agent arrives
        const rot = a.rotDeg * (1 - e);
        a.view.cursor.style.transform = `translate3d(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px,0) rotate(${rot.toFixed(1)}deg)`;
        a.view.cursor.style.opacity = "1";

        if (p >= 1) {
          a.rotDeg = 0;
          a.phase = "select";
          a.t0 = this.clock;
          a.dur = 280;
          a.view.sel.dataset.active = "1";
        }
        break;
      }

      case "select": {
        const t = a.target!;
        const p = clamp((this.clock - a.t0) / a.dur, 0, 1);
        const e = easeOutCubic(p);
        const r = t.el.getBoundingClientRect();
        this.drawSel(a, r, e, Math.min(1, p * 3.5));
        const m = CONFIG.viewportMargin;
        a.x = clamp(r.left + r.width * e, m, vw - m);
        a.y = clamp(r.top + r.height * e, m, vh - m);
        a.view.cursor.style.transform = `translate3d(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px,0)`;

        if (p >= 1) {
          a.phase = "build";
          a.t0 = this.clock;
          a.dur = this.buildDuration(t);
        }
        break;
      }

      case "build": {
        const t = a.target!;
        const p = clamp((this.clock - a.t0) / a.dur, 0, 1);
        const r = t.el.getBoundingClientRect();
        this.drawSel(a, r, 1, 1);
        const m = CONFIG.viewportMargin;

        if (t.kind === "wipe") {
          const e = easeInOutCubic(p);
          a.x = clamp(r.left + r.width * e, m, vw - m);
          a.y = clamp(r.top + r.height * 0.45, m, vh - m);
        } else if (t.kind === "type") {
          if (t.chars.length > 0) {
            const idx = Math.min(t.chars.length - 1, Math.floor(p * t.chars.length));
            const chRect = t.chars[idx]?.getBoundingClientRect();
            if (chRect && chRect.width > 0) {
              a.x = clamp(chRect.right + 2, m, vw - m);
              a.y = clamp(chRect.bottom - 2, m, vh - m);
            } else {
              a.x = clamp(r.right, m, vw - m);
              a.y = clamp(r.bottom, m, vh - m);
            }
          } else {
            a.x = clamp(r.right, m, vw - m);
            a.y = clamp(r.bottom, m, vh - m);
          }
        } else {
          const e = easeOutCubic(p);
          a.x = clamp(r.left + r.width * (0.8 + 0.2 * e), m, vw - m);
          a.y = clamp(r.bottom - 10, m, vh - m);
        }

        a.view.cursor.style.transform = `translate3d(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px,0)`;
        this.apply(t, p);

        if (p >= 1) {
          this.finalize(t);
          const nextTarget = this.getNextChainedTarget(a, t);
          if (nextTarget) {
            this.chainToNextTarget(a, nextTarget);
          } else {
            a.phase = "release";
            a.t0 = this.clock;
            a.dur = 300;
          }
        }
        break;
      }

      case "release": {
        const t = a.target!;
        const p = clamp((this.clock - a.t0) / a.dur, 0, 1);
        const r = t.el.getBoundingClientRect();
        this.drawSel(a, r, 1, 1 - p);

        const fadeOut = Math.max(0, 1 - p);
        a.view.cursor.style.opacity = String(fadeOut);

        if (p >= 1) {
          this.onComplete(a, t);
        }
        break;
      }
    }
  }

  /* ---------- drawing & reveal ---------- */

  private corner(t: Target, which: "tl" | "br") {
    const r = t.el.getBoundingClientRect();
    const m = CONFIG.viewportMargin;
    const x = which === "tl" ? r.left : r.right;
    const y = which === "tl" ? r.top : r.bottom;
    return pt(clamp(x, m, window.innerWidth - m), clamp(y, m, window.innerHeight - m));
  }

  private buildDuration(t: Target) {
    if (t.id === "hero-word") return 1200; // Giant PORTFOLIO wipe
    if (t.id === "hero-name") return 900;  // KHADIMHUSAIN wipe
    if (t.id === "hero-hello") return 450; // Hello, I'm
    if (t.id === "hero-role") return 700;  // Role
    if (t.id === "hero-intro") return 1300; // Description paragraph
    if (t.id === "hero-portrait") return 800; // Headshot
    if (t.id.startsWith("hero-cta") || t.id === "hero-location") return 350;
    if (t.id.startsWith("hero-stat")) return 350;

    if (t.kind === "type") {
      return clamp(t.chars.length * CONFIG.typeMsPerChar, CONFIG.typeMin, CONFIG.typeMax);
    }
    return t.kind === "wipe" ? CONFIG.wipeMs : CONFIG.popMs;
  }

  private drawSel(a: Runtime, r: DOMRect, grow: number, opacity: number) {
    const s = a.view.sel.style;
    const w = Math.max(1, r.width * grow);
    const h = Math.max(1, r.height * grow);
    s.transform = `translate3d(${r.left.toFixed(1)}px,${r.top.toFixed(1)}px,0)`;
    s.width = `${w.toFixed(1)}px`;
    s.height = `${h.toFixed(1)}px`;
    s.opacity = String(opacity);
    const badge = a.view.sel.querySelector("b");
    if (badge) {
      badge.textContent = `${a.cfg.name} [${Math.round(w)} × ${Math.round(h)}]`;
    }
  }

  private onStart(a: Runtime, _t: Target) {
    a.view.cursor.style.display = "block";
    a.view.cursor.style.visibility = "visible";
    a.view.cursor.style.opacity = "0";
    a.view.cursor.dataset.active = "1";
    a.view.sel.dataset.active = "0";
    a.view.sel.style.opacity = "0";
  }

  private onComplete(a: Runtime, t: Target) {
    this.finalize(t);
    this.hideAgent(a);
    if (this.heroState === "hero_active") {
      const heroPending = this.targets.some((x) => x.section === "hero" && x.state !== "done");
      if (!heroPending) {
        this.heroState = "hero_done";
        for (const agent of this.agents) {
          if (agent.phase === "idle") this.hideAgent(agent);
        }
      }
    }
  }

  private onInterrupt(a: Runtime) {
    if (a.target && a.target.state === "claimed") {
      a.target.state = "pending";
    }
    this.hideAgent(a);
  }

  private hideAgent(a: Runtime) {
    a.phase = "idle";
    a.target = null;
    a.placed = false;
    a.rotDeg = 0;
    a.view.sel.style.opacity = "0";
    a.view.sel.dataset.active = "0";
    a.view.cursor.style.opacity = "0";
    a.view.cursor.style.visibility = "hidden";
    a.view.cursor.style.display = "none";
    a.view.cursor.dataset.active = "0";
  }

  private apply(t: Target, p: number) {
    const s = t.el.style;
    if (t.kind === "wipe") {
      s.opacity = "1";
      s.clipPath = `inset(-12% ${((1 - easeInOutCubic(p)) * 100).toFixed(2)}% -12% -12%)`;
    } else if (t.kind === "pop") {
      s.opacity = String(Math.min(1, p * 2.4));
      s.scale = String(0.9 + 0.1 * easeOutBack(p));
    } else {
      const n = Math.floor(p * t.chars.length);
      for (let i = t.shown; i < n; i++) t.chars[i].style.opacity = "1";
      t.shown = Math.max(t.shown, n);
    }
  }

  private clearInline(t: Target) {
    const s = t.el.style;
    s.opacity = "";
    s.clipPath = "";
    s.scale = "";
    for (const c of t.chars) c.style.opacity = "";
  }

  private finalize(t: Target) {
    this.clearInline(t);
    t.el.setAttribute("data-built", "1");
    t.state = "done";
    t.shown = t.chars.length;
  }
}
