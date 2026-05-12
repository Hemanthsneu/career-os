"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Search Builder", color: "sky" },
  { href: "/jobs", label: "Live Jobs", color: "emerald" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-100"
        >
          Career<span className="text-sky-400">OS</span>
        </Link>
        <div className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active = path === l.href;
            const activeClass =
              l.color === "emerald"
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-sky-500/15 text-sky-300";
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? activeClass
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
