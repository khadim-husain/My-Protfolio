import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const anton = localFont({
  src: "../../node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2",
  variable: "--font-anton",
  weight: "400",
  display: "swap",
});
const caveat = localFont({
  src: "../../node_modules/@fontsource/caveat-brush/files/caveat-brush-latin-400-normal.woff2",
  variable: "--font-caveat",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Khadimhusain | Full Stack Developer & AI Engineer",
  description:
    "Portfolio of Khadimhusain Nagalpara: software engineer and MCA student building backend systems, REST APIs and full-stack AI apps.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Runs before first paint: ensures clean animation replay and top scroll on every refresh. */
const modeScript = `(function(){try{var d=document.documentElement;try{localStorage.removeItem('kh-agents');sessionStorage.clear();}catch(e){}var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.agents=rm?'off':'on';if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${anton.variable} ${caveat.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body className="bg-base font-sans text-white antialiased">{children}</body>
    </html>
  );
}
