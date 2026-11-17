import { createElement, CSSProperties, ReactNode } from "react";
import type { AnimKind } from "@/lib/animation-config";

type BuildProps = {
  id: string;
  kind: AnimKind;
  order: number;
  as?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [attr: string]: unknown;
};

/** Marks an element as something the robot agents construct. */
export function B({ id, kind, order, as = "div", className, style, children, ...rest }: BuildProps) {
  return createElement(
    as,
    { id, "data-build": id, "data-anim": kind, "data-order": order, className, style, ...rest },
    children,
  );
}

/** Text that agents type out letter by letter. Layout is reserved up front, so nothing shifts. */
export function Typed({
  id, order, text, as = "p", className, style,
}: { id: string; order: number; text: string; as?: string; className?: string; style?: CSSProperties }) {
  const words = text.split(" ");
  return (
    <B id={id} kind="type" order={order} as={as} className={className} style={style}>
      <span className="sr-only-text">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="word">
              {Array.from(w).map((c, ci) => (
                <span key={ci} className="ch">{c}</span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </B>
  );
}

export function SectionHeading({
  index, label, title, order, className = "",
}: { index: string; label: string; title: string; order: number; className?: string }) {
  return (
    <div className={className}>
      <B id={`${label}-label`} kind="pop" order={order} as="p"
         className="mb-4 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        <span className="h-px w-8 bg-accent" />
        {index} / {label}
      </B>
      <div>
        <B id={`${label}-title`} kind="wipe" order={order + 0.01} as="h2"
           className="inline-block font-display text-[clamp(2.6rem,9vw,6.5rem)] uppercase leading-[0.95] text-white">
          {title}
        </B>
      </div>
    </div>
  );
}
