import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { profile, stats } from "@/lib/portfolio-data";
import { B, Typed } from "./Build";

export default function Hero() {
  return (
    <section id="top" data-section="hero" className="relative isolate min-h-[100svh] overflow-hidden bg-base">
      {/* Layer 1: Dark grid background and red ambient glow */}
      <div className="hero-bg absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

      {/* Layer 2: Large PORTFOLIO background typography - Motion / Layout wipes into view */}
      <div
        className="pointer-events-none absolute inset-x-0 top-2 sm:top-4 lg:top-[4vh] z-10 flex justify-center select-none overflow-hidden"
        aria-hidden="true"
      >
        <B
          id="hero-word"
          kind="wipe"
          order={1}
          as="span"
          aria-hidden="true"
          className="portfolio-word select-none"
        >
          PORTFOLIO
        </B>
      </div>

      {/* Main Content Layout: Single clean vertical flow on mobile, 3-column layout on desktop */}
      <div className="relative z-30 mx-auto grid min-h-[100svh] w-full max-w-[1500px] grid-cols-1 gap-x-6 px-4 pb-8 pt-[clamp(3.5rem,12vw,5rem)] sm:px-8 sm:pt-[clamp(4.5rem,14vw,7rem)] lg:grid-cols-[1.1fr_clamp(260px,32vw,480px)_1fr] lg:px-12 lg:pb-0 lg:pt-0">
        
        {/* Left Column / Mobile Order 1: Greeting, Name, Role, Intro, CTAs, Location */}
        <div className="flex flex-col justify-center gap-2.5 sm:gap-4 lg:col-start-1 lg:row-start-1 lg:items-start lg:pb-[12vh] lg:pt-[24vh] lg:gap-5 lg:translate-y-[80px]">
          {/* Greeting: Scout inspects greeting */}
          <Typed
            id="hero-hello"
            order={3}
            text="Hello, I'm"
            as="p"
            className="font-hand text-2xl text-accent sm:text-3xl md:text-4xl"
            style={{ rotate: "-3deg" }}
          />

          {/* Foreground Name: Kept strictly on ONE line with responsive clamp, wiped into view by Layout */}
          <div className="overflow-visible w-full">
            <B
              id="hero-name"
              kind="wipe"
              order={4}
              as="h1"
              className="inline-block whitespace-nowrap break-keep font-display text-[clamp(2.1rem,8vw,4.8rem)] uppercase leading-[0.92] text-white tracking-normal drop-shadow-md select-none lg:text-[clamp(2.3rem,4.2vw,4.8rem)]"
            >
              {profile.name}
            </B>
          </div>

          {/* Role: Typeset sets the professional role */}
          <Typed
            id="hero-role"
            order={5}
            text={profile.role}
            as="p"
            className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white sm:text-sm drop-shadow-sm"
          />

          {/* Intro Description: High contrast soft white / light grey text typed by Copy */}
          <Typed
            id="hero-intro"
            order={6}
            text={profile.intro}
            as="p"
            className="max-w-md text-[13px] leading-relaxed text-zinc-300 sm:text-[15px] drop-shadow-sm font-normal"
          />

          {/* CTA buttons: Deploy activates CTA buttons */}
          <div className="mt-0.5 flex flex-wrap items-center gap-2 sm:gap-3">
            <B
              id="hero-cta-work"
              kind="pop"
              order={7}
              as="a"
              href="#projects"
              className="group inline-flex min-h-10 sm:min-h-12 items-center gap-1.5 sm:gap-2 rounded-full bg-accent px-4 sm:px-6 text-xs sm:text-sm font-semibold text-white transition-[filter,box-shadow] hover:brightness-110 hover:shadow-[0_0_30px_rgba(255,59,47,0.45)]"
            >
              View My Work
              <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5 sm:size-4" />
            </B>
            <B
              id="hero-cta-contact"
              kind="pop"
              order={7.1}
              as="a"
              href="#contact"
              className="group inline-flex min-h-10 sm:min-h-12 items-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm px-4 sm:px-6 text-xs sm:text-sm font-semibold text-white transition-[background-color,border-color] hover:border-white/50 hover:bg-white/10"
            >
              Contact Me
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:size-4" />
            </B>
          </div>

          {/* Location */}
          <B
            id="hero-location"
            kind="pop"
            order={7.2}
            as="p"
            className="inline-flex items-center gap-1.5 sm:gap-2 font-mono text-[10.5px] sm:text-xs uppercase tracking-widest text-muted"
          >
            <MapPin size={13} className="text-accent sm:size-3.5" />
            {profile.location}
          </B>
        </div>

        {/* Profile Photograph: Sits naturally between Location and Stats on mobile, centered at bottom on desktop */}
        <div
          className="pointer-events-none relative z-20 mx-auto mt-2 sm:mt-4 flex justify-center items-end overflow-hidden h-[180px] xs:h-[220px] sm:h-[280px] md:h-[340px] w-full max-w-[340px] sm:max-w-[420px] lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:h-[min(82svh,54vw)] lg:max-w-none"
          aria-hidden="true"
        >
          <B
            id="hero-portrait"
            kind="pop"
            order={2}
            className="relative h-full w-auto aspect-square max-w-[85vw] sm:max-w-[420px] lg:max-w-none flex items-end justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/headshot.png"
              alt="Portrait of Khadimhusain Nagalpara"
              width={1000}
              height={1000}
              className="portrait-img h-full w-full object-contain object-bottom"
              fetchPriority="high"
            />
          </B>
        </div>

        {/* Statistics Cards: Clean horizontal row below photo on mobile, right column on desktop */}
        <div className="relative z-30 mt-3 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-[480px] mx-auto h-fit self-start lg:col-start-3 lg:row-start-1 lg:mt-0 lg:max-w-none lg:flex lg:flex-col lg:items-end lg:justify-center lg:gap-8 lg:pb-[12vh] lg:pt-[24vh] lg:text-right lg:self-auto lg:translate-y-[145px]">
          {stats.map((s, i) => (
            <B
              key={s.label}
              id={`hero-stat-${i}`}
              kind="pop"
              order={8 + i / 10}
              className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#121214] p-2 sm:p-3 text-center sm:text-left flex flex-col justify-between items-center sm:items-start h-full min-h-[70px] sm:min-h-[82px] lg:min-h-0 lg:border-0 lg:bg-transparent lg:p-0 lg:text-right lg:items-end shadow-sm"
            >
              <p className="font-display text-xl sm:text-3xl lg:text-7xl leading-none text-white">
                {s.value}
                <span className="text-accent">{s.suffix}</span>
              </p>
              <p className="mt-1 font-mono text-[8px] sm:text-[9.5px] lg:text-xs uppercase leading-[1.15] tracking-[0.06em] sm:tracking-[0.12em] text-muted">
                {s.label}
              </p>
            </B>
          ))}
        </div>

      </div>
    </section>
  );
}
