"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SOURCE_META } from "@/lib/jobs/sources";
import type { Job, JobSource, JobsResponse } from "@/lib/jobs/types";

const STORAGE_KEY = "career-os-dashboard-v1";

type Stored = {
  query: string;
  remoteOnly: boolean;
  within: "day" | "week" | "month" | "any";
  sources: JobSource[];
};

const WITHIN_OPTIONS: { value: Stored["within"]; label: string; ms?: number }[] = [
  { value: "day", label: "Past 24h", ms: 24 * 60 * 60 * 1000 },
  { value: "week", label: "Past week", ms: 7 * 24 * 60 * 60 * 1000 },
  { value: "month", label: "Past month", ms: 30 * 24 * 60 * 60 * 1000 },
  { value: "any", label: "Anytime" },
];

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

function saveStored(d: Stored) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

export function JobsDashboard() {
  const defaultSources = useMemo(
    () =>
      (Object.values(SOURCE_META)
        .filter((s) => s.enabledByDefault)
        .map((s) => s.id) as JobSource[]),
    []
  );

  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [within, setWithin] = useState<Stored["within"]>("week");
  const [sources, setSources] = useState<Set<JobSource>>(
    () => new Set(defaultSources)
  );
  const [hydrated, setHydrated] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const d = loadStored();
    if (d.query != null) setQuery(d.query);
    if (d.remoteOnly != null) setRemoteOnly(d.remoteOnly);
    if (d.within != null) setWithin(d.within);
    if (d.sources?.length) setSources(new Set(d.sources));
    try {
      const sav = localStorage.getItem("career-os-saved-jobs");
      if (sav) setSavedIds(new Set(JSON.parse(sav) as string[]));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStored({
      query,
      remoteOnly,
      within,
      sources: [...sources],
    });
  }, [hydrated, query, remoteOnly, within, sources]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sourcesParam = [...sources].join(",");
      const res = await fetch(`/api/jobs?sources=${sourcesParam}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as JobsResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [sources]);

  useEffect(() => {
    if (!hydrated) return;
    fetchJobs();
  }, [hydrated, fetchJobs]);

  const filtered = useMemo<Job[]>(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    const cutoff = (() => {
      const opt = WITHIN_OPTIONS.find((o) => o.value === within);
      return opt?.ms ? Date.now() - opt.ms : 0;
    })();
    return data.jobs.filter((j) => {
      if (remoteOnly && !j.remote) return false;
      if (cutoff && j.publishedAtTs < cutoff) return false;
      if (!q) return true;
      const hay = `${j.title} ${j.company} ${j.location} ${j.tags.join(" ")} ${j.description ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [data, query, remoteOnly, within]);

  const toggleSource = useCallback((s: JobSource) => {
    setSources((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(
          "career-os-saved-jobs",
          JSON.stringify([...next])
        );
      } catch {}
      return next;
    });
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/90">
            Career OS · Live Jobs
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            Live Job Dashboard
          </h1>
          <p className="text-sm leading-relaxed text-zinc-400">
            Real jobs from {Object.keys(SOURCE_META).length} sources — apply directly with one click.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchJobs}
          disabled={loading}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </header>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Search title, company, tag
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. senior react, machine learning, product"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Posted within
            </label>
            <select
              value={within}
              onChange={(e) => setWithin(e.target.value as Stored["within"])}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {WITHIN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="size-4 rounded border-zinc-600 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/30"
            />
            Remote only
          </label>
          <span className="text-xs text-zinc-500">·</span>
          <span className="text-xs text-zinc-500">Sources:</span>
          <div className="flex flex-wrap gap-1.5">
            {Object.values(SOURCE_META).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSource(s.id)}
                title={s.description}
                className={`rounded-md px-2 py-1 text-[11px] font-medium transition ${
                  sources.has(s.id)
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                    : "border border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {data && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <span>
            <strong className="text-zinc-300">{filtered.length.toLocaleString()}</strong>{" "}
            of {data.total.toLocaleString()} jobs
          </span>
          <span>·</span>
          <span>fetched {timeAgo(Date.parse(data.fetchedAt))}</span>
          {data.sources.some((s) => !s.ok) && (
            <span className="text-amber-400">
              · {data.sources.filter((s) => !s.ok).length} source(s) failed
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-400">
          Loading live jobs from all sources…
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {filtered.map((j) => {
          const saved = savedIds.has(j.id);
          return (
            <li
              key={j.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/60"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-zinc-100">
                      {j.title}
                    </h3>
                    {j.remote && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        Remote
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-zinc-300">
                    <span className="font-medium">{j.company}</span>
                    <span className="text-zinc-500"> · {j.location}</span>
                  </p>
                  {j.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-zinc-400">
                      {j.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                      {j.sourceLabel}
                    </span>
                    {j.salary && (
                      <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-300">
                        {j.salary}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-500">
                      · {timeAgo(j.publishedAtTs)}
                    </span>
                    {j.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-zinc-800/60 px-1.5 py-0.5 text-[10px] text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSaved(j.id)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                      saved
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                        : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    }`}
                    title={saved ? "Remove from saved" : "Save for later"}
                  >
                    {saved ? "★ Saved" : "☆ Save"}
                  </button>
                  <a
                    href={j.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400"
                  >
                    Apply →
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-400">
          No jobs match your filters. Try widening the time range, removing the
          remote filter, or enabling more sources.
        </div>
      )}

      {data && (
        <details className="text-xs text-zinc-500">
          <summary className="cursor-pointer hover:text-zinc-300">
            Source health
          </summary>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {data.sources.map((s) => (
              <li key={s.source} className="font-mono">
                {s.ok ? "✓" : "✗"} {SOURCE_META[s.source].label} ·{" "}
                {s.count.toLocaleString()} jobs
                {s.error && (
                  <span className="text-red-400"> · {s.error}</span>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
