"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Dashboard" },
  { href: "/capture", label: "Capture" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/arbitration", label: "Arbitration" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav aria-label="Primary" className="border-t border-ink/10">
      <ul className="mx-auto flex max-w-6xl gap-1 px-3">
        {TABS.map((t) => {
          const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-b-2 border-ink text-ink"
                    : "border-b-2 border-transparent text-ink/70 hover:text-ink"
                }`}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
