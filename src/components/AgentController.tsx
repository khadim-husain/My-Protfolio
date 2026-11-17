"use client";

import { ReactNode, useRef } from "react";
import { AGENTS } from "@/lib/animation-config";
import type { AgentView } from "@/lib/agent-engine";
import { useAgentAnimation } from "@/hooks/useAgentAnimation";
import AgentCursor from "./AgentCursor";

export default function AgentController({ children }: { children: ReactNode }) {
  const views = useRef<AgentView[]>([]);
  const anim = useAgentAnimation(views);

  return (
    <>
      {children}
      <div className="agent-layer" aria-hidden="true">
        {AGENTS.map((agent, i) => (
          <AgentCursor
            key={agent.id}
            agent={agent}
            register={(v) => {
              views.current[i] = v;
              anim.engineRef.current?.registerView(i, v);
            }}
          />
        ))}
      </div>
    </>
  );
}
