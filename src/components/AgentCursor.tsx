"use client";

import { useEffect, useRef } from "react";
import type { AgentConfig } from "@/lib/animation-config";
import type { AgentView } from "@/lib/agent-engine";

/** One robot agent: a pointer + little robot head with a name tag, and its blue selection frame. */
export default function AgentCursor({
  agent, register,
}: { agent: AgentConfig; register: (v: AgentView) => void }) {
  const cursor = useRef<HTMLDivElement>(null);
  const sel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cursor.current && sel.current) register({ cursor: cursor.current, sel: sel.current });
    // register is stable per index; run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vars = { "--c": agent.color } as React.CSSProperties;
  return (
    <>
      <div
        ref={sel}
        className="agent-sel"
        style={vars}
        data-active="0"
      >
        <i /><i /><i /><i />
        <b>{agent.name}</b>
      </div>
      <div
        ref={cursor}
        className="agent-cursor"
        style={vars}
        data-active="0"
        aria-hidden="true"
      >
        <svg className="agent-arrow" viewBox="0 0 18 22">
          <path d="M1 1 L1 17 L5.2 13 L8.4 20.4 L11.2 19.2 L8 12 L14 12 Z" fill={agent.color} stroke="#09090b" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
        <div className="agent-bot">
          <div className="agent-antenna" />
          <div className="agent-head"><span className="agent-eye l" /><span className="agent-eye r" /></div>
        </div>
        <div className="agent-shadow" />
        <span className="agent-tag">{agent.name}</span>
      </div>
    </>
  );
}
