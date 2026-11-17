import { ArrowUpRight, FileDown, Mail } from "lucide-react";
import { profile } from "@/lib/portfolio-data";
import { B, SectionHeading } from "./Build";
import { GithubIcon, LinkedinIcon } from "./Icons";

const links = [
  { id: "email", label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail, ext: false },
  { id: "github", label: "GitHub", value: profile.githubLabel, href: profile.github, icon: GithubIcon, ext: true },
  { id: "linkedin", label: "LinkedIn", value: profile.linkedinLabel, href: profile.linkedin, icon: LinkedinIcon, ext: true },
];

export default function Contact() {
  return (
    <section id="contact" data-section="contact" className="relative overflow-hidden bg-base px-5 pb-10 pt-24 sm:px-8 lg:px-12 lg:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(60%_80%_at_50%_100%,rgba(255,59,47,0.22),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1300px]">
        <SectionHeading index="05" label="Contact" title="Have an idea? Let's build it." order={15} />

        <div className="mt-12 flex flex-wrap gap-3">
          <B id="contact-cta" kind="pop" order={15.2} as="a" href={`mailto:${profile.email}`}
             className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-white transition-[filter,box-shadow] hover:brightness-110 hover:shadow-[0_0_30px_rgba(255,59,47,0.45)]">
            Say hello
            <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </B>
          <B id="contact-resume-sde" kind="pop" order={15.3} as="a" href={profile.resumeSde} download="Khadimhusain-Software-Engineer-Resume.pdf"
             className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-black/30 px-6 text-sm font-semibold text-white transition-[background-color,border-color] hover:border-white/60 hover:bg-white/10">
            <FileDown size={16} />
            Software Engineer Resume
          </B>
          <B id="contact-resume-ai" kind="pop" order={15.35} as="a" href={profile.resumeAi} download="Khadimhusain-AI-Engineer-Resume.pdf"
             className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-black/30 px-6 text-sm font-semibold text-white transition-[background-color,border-color] hover:border-white/60 hover:bg-white/10">
            <FileDown size={16} />
            AI Engineer Resume
          </B>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {links.map((l, i) => (
            <B key={l.id} id={`contact-${l.id}`} kind="pop" order={15.4 + i / 10} as="a" href={l.href}
               {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
               className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-card p-5 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-accent/50">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 text-accent">
                <l.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{l.label}</span>
                <span className="block break-all text-sm text-white">{l.value}</span>
              </span>
              <ArrowUpRight size={18} className="ml-auto shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </B>
          ))}
        </div>
      </div>
    </section>
  );
}
