import { ArrowUpRight } from "lucide-react";
import { profile, projects } from "@/lib/portfolio-data";
import { B, SectionHeading } from "./Build";
import { GithubIcon } from "./Icons";

export default function Projects() {
  return (
    <section id="projects" data-section="projects" className="relative bg-base px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1300px]">
        <SectionHeading index="01" label="Projects" title="Work that ships." order={10} />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <B key={p.name} id={`project-${i}`} kind="pop" order={10.2 + i / 10} as="article"
               className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-card p-6 transition-[border-color,translate,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_60px_-20px_rgba(255,59,47,0.35)] sm:p-8">
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{p.tag}</span>
                <span className="font-display text-5xl leading-none text-white/10">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-display text-4xl uppercase leading-none sm:text-5xl">{p.name}</h3>
              <p className="mt-4 leading-relaxed text-muted">{p.description}</p>

              <div className="mt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white">Problem it solves</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.problem}</p>
              </div>

              <div className="mt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white">Main features</p>
                <ul className="mt-3 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <li key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white">
                    {t}
                  </li>
                ))}
              </ul>

              <a href={profile.github} target="_blank" rel="noopener noreferrer"
                 className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 border-b border-white/20 pb-1 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent">
                <GithubIcon className="h-4 w-4" />
                More on GitHub
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" />
              </a>
            </B>
          ))}
        </div>
      </div>
    </section>
  );
}
