"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BOARDS,
  RECOMMENDED_BOARD_IDS,
} from "@/lib/job-search/boards";
import {
  GOOGLE_LIMITS,
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

export function JobSearchLauncher() {
  const [rolesText, setRolesText] = useState("");
  const [locationsText, setLocationsText] = useState("");
  const [extra, setExtra] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    BOARDS.forEach((b) => {
      if (RECOMMENDED_BOARD_IDS.has(b.id)) s.add(b.id);
    });
    return s;
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const d = loadStored();
    if (d.rolesText != null) setRolesText(d.rolesText);
    if (d.locationsText != null) setLocationsText(d.locationsText);
    if (d.extra != null) setExtra(d.extra);
    if (d.selectedIds?.length) setSelectedIds(new Set(d.selectedIds));
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
    });
  }, [hydrated, rolesText, locationsText, extra, selectedIds]);

  const toggleBoard = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
          "This query may exceed Google’s usual limits. Continue, or cancel and use Open split."
        )
      ) {
        return;
      }
    }
    window.open(googleSearchUrl(query), "_blank", "noopener,noreferrer");
  }, [hosts.length, query]);

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
        () => window.open(googleSearchUrl(q), "_blank", "noopener,noreferrer"),
        i * 400
      );
    });
  }, [hosts, rolesText, locationsText, extra]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-500/90">
          Career OS · v0.1
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          ATS job search
        </h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          Build a Google{" "}
          <code className="rounded bg-zinc-800 px-1 py-0.5 text-sky-400">
            site:
          </code>{" "}
          query for boards like Greenhouse and Lever — lower competition than
          LinkedIn-only discovery.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-sm backdrop-blur">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Titles / roles
        </label>
        <textarea
          className="min-h-[5.5rem] w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          placeholder={"One per line or comma-separated\ne.g. data scientist, ML engineer"}
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
          placeholder={"NYC\nNew York\nRemote"}
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
          placeholder='e.g. senior AND NOT intern'
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
        />
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Job boards
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BOARDS.map((b) => (
            <label
              key={b.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/50"
            >
              <input
                type="checkbox"
                className="size-4 rounded border-zinc-600 bg-zinc-900 text-sky-500 focus:ring-sky-500/30"
                checked={selectedIds.has(b.id)}
                onChange={() => toggleBoard(b.id)}
              />
              <span>
                {b.label}{" "}
                <span className="text-xs text-zinc-500">· {b.host}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
            onClick={() =>
              setSelectedIds(new Set(BOARDS.map((b) => b.id)))
            }
          >
            All
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
            onClick={() => setSelectedIds(new Set())}
          >
            None
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
            onClick={() =>
              setSelectedIds(new Set(BOARDS.filter((b) => RECOMMENDED_BOARD_IDS.has(b.id)).map((b) => b.id)))
            }
          >
            Recommended
          </button>
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
        Google limits are approximate. Next up: Supabase auth + saved presets in
        the cloud. Early-stage roles:{" "}
        <a
          href="https://lnkd.in/gfgRTgrm"
          className="text-sky-400 underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          a16z Speedrun talent network
        </a>
        .
      </footer>
    </div>
  );
}
