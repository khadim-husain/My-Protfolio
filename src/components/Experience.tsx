"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { timeline } from "@/lib/portfolio-data";
import { B, SectionHeading } from "./Build";

export default function Experience() {
  return (
    <section id="experience" data-section="experience" className="relative bg-base px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1000px]">
        <SectionHeading index="03" label="Journey" title="The journey so far." order={12} />

        <ol className="relative mt-16 space-y-10 pl-12 sm:pl-16">
          <motion.span
            aria-hidden="true"
            className="absolute bottom-2 left-[19px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent/40 to-transparent sm:left-[23px]"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          />
          {timeline.map((item, i) => {
            const Icon = item.kind === "work" ? Briefcase : GraduationCap;
            const current = item.note === "Currently pursuing";
            return (
              <li key={item.title} className="relative">
                <span className="absolute -left-12 top-5 flex h-10 w-10 items-center justify-center sm:-left-16 sm:h-12 sm:w-12">
                  {current && <span className="ping-soft absolute inset-0 rounded-full bg-accent/40" />}
                  <span className="relative flex h-full w-full items-center justify-center rounded-full border border-accent/60 bg-base text-accent">
                    <Icon size={18} />
                  </span>
                </span>
                <B id={`timeline-${i}`} kind="pop" order={12.2 + i / 10}
                   className="rounded-3xl border border-white/10 bg-card p-6 transition-[border-color] duration-300 hover:border-accent/40 sm:p-8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.16em]">
                    <span className="text-accent">{item.period}</span>
                    {item.note && <span className="text-muted">· {item.note}</span>}
                  </div>
                  <h3 className="mt-3 font-display text-3xl uppercase leading-tight sm:text-4xl">{item.title}</h3>
                  <p className="mt-1 text-muted">{item.org}</p>
                  {item.points && (
                    <ul className="mt-5 space-y-3">
                      {item.points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-sm leading-relaxed text-muted">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </B>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
