import type { Metadata } from "next";
// Self-hosted fonts (no build-time network fetch). Family names are mapped to
// the --font-plex-* CSS variables in globals.css.
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Transformation Tracker",
  description:
    "Multi-region transformation programme management — people, documents and system evidence, triangulated.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <header className="bg-header text-ink">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-sm font-medium tracking-wide">▤</span>
              <h1 className="text-lg font-semibold">Transformation Tracker</h1>
            </div>
            <p className="hidden text-sm font-medium text-ink/80 sm:block">
              People · Documents · System
            </p>
          </div>
          <Nav />
        </header>
        <main id="main" className="mx-auto max-w-6xl px-5 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
