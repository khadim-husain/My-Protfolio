import { ArrowUp } from "lucide-react";
import { profile } from "@/lib/portfolio-data";
import { B } from "./Build";

export default function Footer() {
  return (
    <footer data-section="contact" className="relative bg-base px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12">
      <B id="footer" kind="pop" order={16}
         className="mx-auto flex max-w-[1300px] flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 font-mono text-xs uppercase tracking-widest text-muted sm:flex-row sm:items-center">
        <p>© 2026 {profile.fullName} · {profile.location}</p>
        <a href="#top" className="inline-flex min-h-11 items-center gap-2 text-white transition-colors hover:text-accent">
          Back to top <ArrowUp size={14} />
        </a>
      </B>
    </footer>
  );
}
