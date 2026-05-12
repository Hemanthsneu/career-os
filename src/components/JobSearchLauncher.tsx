"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BOARDS,
  RECOMMENDED_BOARD_IDS,
  ATS_BOARD_IDS,
  STARTUP_VC_BOARD_IDS,
  REMOTE_BOARD_IDS,
  type Board,
} from "@/lib/job-search/boards";
import {
  GOOGLE_LIMITS,
  TIME_FILTERS,
  type TimeFilter,
  buildQuery,
  googleSearchUrl,
  measure,
  splitIntoQueries,
  withinGoogleLimits,
} from "@/lib/job-search/build-query";

const STORAGE_KEY = "career-os-search-v1";

type Stored = {
  rolesText: string;
  locationsText: string;
  extra: string;
  selectedIds: string[];
  timeFilter?: TimeFilter;
};

function loadStored(): Partial<Stored> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Stored;
  } catch {
    return {};
  }
}

function saveStored(data: Stored) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const CATEGORY_LABELS: Record<Board["category"], string> = {
  ats: "🏢 ATS Platforms (Company Career Pages)",
  startup: "🚀 Startup Job Boards",
  vc: "💼 VC Portfolio Jobs",
  tech: "💻 Tech-Focused Boards",
  general: "🌐 General Job Boards",
};

const CATEGORY_ORDER: Board["category"][] = ["ats", "startup", "vc", "tech", "general"];

export function JobSearchLauncher() {
  const [rolesText, setRolesText] = useState("");
  const [locationsText, setLocationsText] = useState("");
  const [extra, setExtra] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("w");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    BOARDS.forEach((b) => {
      if (RECOMMENDED_BOARD_IDS.has(b.id)) s.add(b.id);
    });
    return s;
  });
  const [hydrated, setHydrated] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(["ats", "startup", "vc"])
  );

  useEffect(() => {
    const d = loadStored();
    if (d.rolesText != null) setRolesText(d.rolesText);
    if (d.locationsText != null) setLocationsText(d.locationsText);
    if (d.extra != null) setExtra(d.extra);
    if (d.selectedIds?.length) setSelectedIds(new Set(d.selectedIds));
    if (d.timeFilter) setTimeFilter(d.timeFilter);
    setHydrated(true);
  }, []);

  const hosts = useMemo(
    () => BOARDS.filter((b) => selectedIds.has(b.id)).map((b) => b.host),
    [selectedIds]
  );

  const state = useMemo(
    () => ({
      rolesText,
      locationsText,
      extra,
      hosts,
    }),
    [rolesText, locationsText, extra, hosts]
  );

  const query = useMemo(() => buildQuery(state), [state]);
  const stats = useMemo(() => measure(query), [query]);
  const ok =
    stats.words <= GOOGLE_LIMITS.MAX_WORDS &&
    stats.chars <= GOOGLE_LIMITS.MAX_CHARS;
  const warn =
    !ok ||
    stats.words > GOOGLE_LIMITS.MAX_WORDS - 6 ||
    stats.chars > 1700;

  useEffect(() => {
    if (!hydrated) return;
    saveStored({
      rolesText,
      locationsText,
      extra,
      selectedIds: [...selectedIds],
      timeFilter,
    });
  }, [hydrated, rolesText, locationsText, extra, selectedIds, timeFilter]);

  const toggleBoard = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const selectBySet = useCallback((idSet: Set<string>) => {
    setSelectedIds(new Set(idSet));
  }, []);

  const openGoogle = useCallback(() => {
    if (!hosts.length) {
      window.alert("Select at least one job board.");
      return;
    }
    if (!query) {
      window.alert("Add roles, locations, or an extra query.");
      return;
    }
    if (!withinGoogleLimits(query)) {
      if (
        !window.confirm(
          "This query may exceed Google's usual limits. Continue, or cancel and use Open split."
        )
      ) {
        return;
      }
    }
    window.open(googleSearchUrl(query, timeFilter), "_blank", "noopener,noreferrer");
  }, [hosts.length, query, timeFilter]);

  const copyQuery = useCallback(async () => {
    if (!query) {
      window.alert("Nothing to copy.");
      return;
    }
    try {
      await navigator.clipboard.writeText(query);
    } catch {
      window.prompt("Copy this query:", query);
    }
  }, [query]);

  const openSplit = useCallback(() => {
    if (!hosts.length) {
      window.alert("Select at least one job board.");
      return;
    }
    const queries = splitIntoQueries(hosts, {
      rolesText,
      locationsText,
      extra,
    }).filter(Boolean);
    if (!queries.length) {
      window.alert("Could not build queries.");
      return;
    }
    if (queries.some((q) => !withinGoogleLimits(q))) {
      window.alert(
        "Your role, location, or extra text is too long for a single Google query. Shorten those fields and try again."
      );
      return;
    }
    queries.forEach((q, i) => {
      window.setTimeout(
        () => window.open(googleSearchUrl(q, timeFilter), "_blank", "noopener,noreferrer"),
        i * 400
      );
    });
  }, [hosts, rolesText, locationsText, extra, timeFilter]);

  const boardsByCategory = useMemo(() => {
    const grouped: Record<string, Board[]> = {};
    for (const cat of CATEGORY_ORDER) {
      grouped[cat] = BOARDS.filter((b) => b.category === cat);
    }
    return grouped;
  }, []);

  const selectedCount = selectedIds.size;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-500/90">
          Career OS · v0.2
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Job Search Launcher
        </h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          Build Google{" "}
          <code className="rounded bg-zinc-800 px-1 py-0.5 text-sky-400">
            site:
          </code>{" "}
          queries across 70+ job sources — ATS platforms, startup boards, VC portfolios, and tech job sites.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-sm backdrop-blur">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Titles / roles
        </label>
        <textarea
          className="min-h-[5.5rem] w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          placeholder={"One per line or comma-separated\ne.g. data scientist, ML engineer, product manager"}
          value={rolesText}
          onChange={(e) => setRolesText(e.target.value)}
        />
        <p className="mt-1 text-xs text-zinc-500">
          Each line becomes <code className="text-zinc-400">OR</code> inside one
          quoted group.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Locations
        </label>
        <textarea
          className="min-h-[4rem] w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          placeholder={"San Francisco\nNYC\nRemote\nAustin, TX"}
          value={locationsText}
          onChange={(e) => setLocationsText(e.target.value)}
        />
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Extra query (optional)
        </label>
        <input
          type="text"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          placeholder='e.g. "senior staff" AND NOT intern NOT junior'
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
        />
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Posted within
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TIME_FILTERS.map((tf) => (
            <button
              key={tf.value}
              type="button"
              onClick={() => setTimeFilter(tf.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                timeFilter === tf.value
                  ? "bg-sky-500 text-zinc-950"
                  : "border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          Uses Google&apos;s{" "}
          <code className="text-zinc-400">tbs=qdr</code> filter — most reliable for
          ATS pages with publish dates.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Job boards{" "}
            <span className="text-zinc-600">({selectedCount} selected)</span>
          </label>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            className="rounded-md border border-zinc-700 bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
            onClick={() => selectBySet(new Set(BOARDS.map((b) => b.id)))}
          >
            All
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-700 bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
            onClick={() => setSelectedIds(new Set())}
          >
            None
          </button>
          <button
            type="button"
            className="rounded-md border border-sky-500/50 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400 hover:bg-sky-500/20"
            onClick={() => selectBySet(RECOMMENDED_BOARD_IDS)}
          >
            Recommended
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-700 bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
            onClick={() => selectBySet(ATS_BOARD_IDS)}
          >
            ATS Only
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-700 bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
            onClick={() => selectBySet(STARTUP_VC_BOARD_IDS)}
          >
            Startup + VC
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-700 bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
            onClick={() => selectBySet(REMOTE_BOARD_IDS)}
          >
            Remote Focus
          </button>
        </div>

        <div className="space-y-3">
          {CATEGORY_ORDER.map((cat) => {
            const boards = boardsByCategory[cat] || [];
            const expanded = expandedCategories.has(cat);
            const selectedInCat = boards.filter((b) => selectedIds.has(b.id)).length;

            return (
              <div key={cat} className="border border-zinc-800 rounded-lg overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/50 hover:bg-zinc-900"
                  onClick={() => toggleCategory(cat)}
                >
                  <span className="text-sm font-medium text-zinc-300">
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">
                      {selectedInCat}/{boards.length}
                    </span>
                    <span className="text-zinc-500">
                      {expanded ? "−" : "+"}
                    </span>
                  </div>
                </button>

                {expanded && (
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {boards.map((b) => (
                      <label
                        key={b.id}
                        className="flex cursor-pointer items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50"
                        title={b.description}
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 size-4 rounded border-zinc-600 bg-zinc-900 text-sky-500 focus:ring-sky-500/30"
                          checked={selectedIds.has(b.id)}
                          onChange={() => toggleBoard(b.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{b.label}</div>
                          <div className="text-xs text-zinc-500 truncate">
                            {b.host}
                          </div>
                          {b.description && (
                            <div className="text-xs text-zinc-600 truncate">
                              {b.description}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-sky-400"
            onClick={openGoogle}
          >
            Open in Google
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
            onClick={copyQuery}
          >
            Copy query
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
            onClick={openSplit}
          >
            Open split
          </button>
        </div>
        <div
          className={`mt-3 rounded-lg border px-3 py-2 font-mono text-xs ${
            ok && !warn
              ? "border-emerald-500/30 text-emerald-400"
              : ok
                ? "border-amber-500/40 text-amber-300"
                : "border-red-500/40 text-red-300"
          }`}
        >
          Words: {stats.words} / {GOOGLE_LIMITS.MAX_WORDS} · Chars:{" "}
          {stats.chars.toLocaleString()} /{" "}
          {GOOGLE_LIMITS.MAX_CHARS.toLocaleString()}
        </div>
        <p className="mt-2 text-xs text-zinc-500">Query preview</p>
        <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-zinc-950 p-3 font-mono text-[11px] leading-relaxed text-zinc-400">
          {query || "(add roles or locations and pick boards)"}
        </pre>
      </section>

      <footer className="text-xs text-zinc-500">
        <p className="mb-2">
          <strong className="text-zinc-400">Pro tips:</strong>
        </p>
        <ul className="space-y-1 list-disc pl-4">
          <li>
            <strong className="text-zinc-400">ATS platforms</strong> — Search company career pages directly (3-7 days before they appear on LinkedIn)
          </li>
          <li>
            <strong className="text-zinc-400">Startup + VC boards</strong> — High-growth companies, faster hiring, equity opportunities
          </li>
          <li>
            <strong className="text-zinc-400">Use "Open split"</strong> — Opens multiple tabs when your query exceeds Google's limits
          </li>
        </ul>
        <p className="mt-3">
          Google limits are approximate. Next up: Supabase auth + saved presets in
          the cloud.
        </p>
      </footer>
    </div>
  );
}
