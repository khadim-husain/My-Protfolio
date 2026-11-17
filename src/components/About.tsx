import { about, principles, skillGroups } from "@/lib/portfolio-data";
import { B, SectionHeading, Typed } from "./Build";

export default function About() {
  return (
    <section id="about" data-section="about" className="relative bg-raised px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1300px]">
        <SectionHeading index="04" label="About" title="Beyond the code." order={13} />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="space-y-8">
            <Typed id="about-me" order={13.1} text={about.me} className="text-lg leading-relaxed text-white/90 sm:text-xl" />
            <B id="about-interests" kind="pop" order={13.2}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Technical interests</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {about.interests.map((t) => (
                  <li key={t} className="rounded-full border border-white/10 bg-card px-4 py-2 text-sm text-white">{t}</li>
                ))}
              </ul>
            </B>
            <div className="grid gap-4 sm:grid-cols-2">
              <B id="about-philosophy" kind="pop" order={13.3} className="rounded-2xl border border-white/10 bg-card p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Development philosophy</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{about.philosophy}</p>
              </B>
              <B id="about-approach" kind="pop" order={13.4} className="rounded-2xl border border-white/10 bg-card p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Problem-solving approach</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{about.approach}</p>
              </B>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {skillGroups.map((g, i) => (
              <B key={g.label} id={`skill-${i}`} kind="pop" order={13.5 + i / 20}
                 className={`rounded-2xl border border-white/10 bg-card p-5 transition-[border-color] hover:border-accent/40 ${i === skillGroups.length - 1 ? "sm:col-span-2" : ""}`}>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white">{g.label}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <li key={s} className="rounded-md bg-white/[0.05] px-2.5 py-1 text-xs text-muted">{s}</li>
                  ))}
                </ul>
              </B>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <B key={p.title} id={`principle-${i}`} kind="pop" order={14 + i / 10}
               className="rounded-2xl border border-white/10 bg-card p-6 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-accent/50">
              <span className="font-display text-4xl text-accent">0{i + 1}</span>
              <h3 className="mt-3 font-display text-2xl uppercase">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
            </B>
          ))}
        </div>
      </div>
    </section>
  );
}
