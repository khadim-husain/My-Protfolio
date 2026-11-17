import { techStack } from "@/lib/portfolio-data";
import { B, SectionHeading } from "./Build";

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="marquee-group" aria-hidden={hidden || undefined}>
      {techStack.map((t) => (
        <li key={t} className="flex items-center gap-3 rounded-full border border-white/10 bg-card px-5 py-3 font-mono text-sm text-white sm:px-7 sm:py-4 sm:text-lg">
          <span className="h-2 w-2 rounded-full bg-accent" />
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function TechStack() {
  return (
    <section id="stack" data-section="stack" className="relative overflow-hidden bg-raised py-24 lg:py-32">
      <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-12">
        <SectionHeading index="02" label="Stack" title="Tools I build with." order={11} />
      </div>
      <B id="stack-marquee" kind="pop" order={11.2} className="marquee-mask mt-14">
        <div className="marquee-track">
          <Group />
          <Group hidden />
        </div>
      </B>
    </section>
  );
}
