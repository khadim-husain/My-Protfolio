"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { AgentEngine, AgentView } from "@/lib/agent-engine";

export interface AgentAnimation {
  engineRef: MutableRefObject<AgentEngine | null>;
  agentsOn: boolean;
  ready: boolean;
}

export function useAgentAnimation(views: MutableRefObject<AgentView[]>): AgentAnimation {
  const engineRef = useRef<AgentEngine | null>(null);
  const [agentsOn, setAgentsOn] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Reset scroll restoration so every page refresh begins at the top for a fresh cinematic experience
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const on = !prefersReducedMotion;
    document.documentElement.dataset.agents = on ? "on" : "off";
    setAgentsOn(on);

    const engine = new AgentEngine();
    engineRef.current = engine;
    (window as unknown as { __agentEngine?: AgentEngine }).__agentEngine = engine;

    engine.init(views.current);
    engine.setEnabled(on);
    engine.start();
    setReady(true);

    return () => {
      engine.destroy();
      engineRef.current = null;
      delete (window as unknown as { __agentEngine?: AgentEngine }).__agentEngine;
    };
  }, [views]);

  return { engineRef, agentsOn, ready };
}
