import type { Job, JobSource } from "./types";
import {
  ASHBY_COMPANIES,
  GREENHOUSE_COMPANIES,
  LEVER_COMPANIES,
  WORKABLE_COMPANIES,
} from "./sources";

const FETCH_TIMEOUT_MS = 8000;

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: ctrl.signal,
      headers: {
        "User-Agent": "career-os/0.2 (+https://github.com/Hemanthsneu/career-os)",
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      throw new Error(`${url} → ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

function safeId(source: JobSource, raw: string | number): string {
  return `${source}:${String(raw)}`;
}

function safeDate(input: unknown): { iso: string; ts: number } {
  const ts = (() => {
    if (!input) return Date.now();
    if (typeof input === "number") {
      return input < 1e12 ? input * 1000 : input;
    }
    const t = Date.parse(String(input));
    return Number.isFinite(t) ? t : Date.now();
  })();
  return { iso: new Date(ts).toISOString(), ts };
}

function trimText(s: string | undefined | null, n = 280): string | undefined {
  if (!s) return undefined;
  const clean = s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= n) return clean;
  return `${clean.slice(0, n).trim()}…`;
}

// ----- Remotive: https://remotive.com/api/remote-jobs -----
type RemotiveJob = {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string | null;
  company_logo_url?: string | null;
  category?: string;
  job_type?: string;
  publication_date: string;
  candidate_required_location?: string;
  salary?: string;
  description?: string;
  tags?: string[];
};
type RemotivePayload = { jobs: RemotiveJob[] };

export async function fetchRemotive(): Promise<Job[]> {
  const data = await fetchJson<RemotivePayload>(
    "https://remotive.com/api/remote-jobs?limit=120"
  );
  return (data.jobs ?? []).map((j) => {
    const d = safeDate(j.publication_date);
    return {
      id: safeId("remotive", j.id),
      source: "remotive",
      sourceLabel: "Remotive",
      title: j.title,
      company: j.company_name,
      companyLogo: j.company_logo_url || j.company_logo || null,
      location: j.candidate_required_location || "Remote",
      remote: true,
      url: j.url,
      applyUrl: j.url,
      description: trimText(j.description),
      tags: [
        ...(j.tags ?? []),
        ...(j.category ? [j.category] : []),
        ...(j.job_type ? [j.job_type] : []),
      ].filter(Boolean),
      salary: j.salary || null,
      publishedAt: d.iso,
      publishedAtTs: d.ts,
    } satisfies Job;
  });
}

// ----- The Muse: https://www.themuse.com/api/public/jobs -----
type MuseJob = {
  id: number;
  name: string;
  contents?: string;
  publication_date: string;
  refs?: { landing_page?: string };
  company?: { name?: string };
  locations?: { name: string }[];
  categories?: { name: string }[];
  levels?: { name: string }[];
  type?: string;
};
type MusePayload = { results: MuseJob[]; page_count?: number };

export async function fetchTheMuse(): Promise<Job[]> {
  const url =
    "https://www.themuse.com/api/public/jobs?descending=true&category=Software%20Engineering&category=Data%20Science&category=Product&category=Design&page=0";
  const data = await fetchJson<MusePayload>(url);
  return (data.results ?? []).map((j) => {
    const d = safeDate(j.publication_date);
    const loc = (j.locations ?? []).map((l) => l.name).join(", ") || "Unspecified";
    return {
      id: safeId("themuse", j.id),
      source: "themuse",
      sourceLabel: "The Muse",
      title: j.name,
      company: j.company?.name ?? "Unknown",
      companyLogo: null,
      location: loc,
      remote: /remote/i.test(loc),
      url: j.refs?.landing_page ?? "",
      applyUrl: j.refs?.landing_page ?? "",
      description: trimText(j.contents),
      tags: [
        ...(j.categories ?? []).map((c) => c.name),
        ...(j.levels ?? []).map((l) => l.name),
        ...(j.type ? [j.type] : []),
      ],
      salary: null,
      publishedAt: d.iso,
      publishedAtTs: d.ts,
    } satisfies Job;
  });
}

// ----- Arbeitnow: https://arbeitnow.com/api/job-board-api -----
type ArbeitnowJob = {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
};
type ArbeitnowPayload = { data: ArbeitnowJob[] };

export async function fetchArbeitnow(): Promise<Job[]> {
  const data = await fetchJson<ArbeitnowPayload>(
    "https://arbeitnow.com/api/job-board-api"
  );
  return (data.data ?? []).map((j) => {
    const d = safeDate(j.created_at);
    return {
      id: safeId("arbeitnow", j.slug),
      source: "arbeitnow",
      sourceLabel: "Arbeitnow",
      title: j.title,
      company: j.company_name,
      companyLogo: null,
      location: j.location || (j.remote ? "Remote" : "Unspecified"),
      remote: !!j.remote,
      url: j.url,
      applyUrl: j.url,
      description: trimText(j.description),
      tags: [...(j.tags ?? []), ...(j.job_types ?? [])],
      salary: null,
      publishedAt: d.iso,
      publishedAtTs: d.ts,
    } satisfies Job;
  });
}

// ----- RemoteOK: https://remoteok.com/api -----
type RemoteOkJob = {
  id?: string | number;
  slug?: string;
  position?: string;
  company?: string;
  company_logo?: string;
  location?: string;
  date?: string;
  url?: string;
  apply_url?: string;
  description?: string;
  tags?: string[];
  salary_min?: number;
  salary_max?: number;
};

export async function fetchRemoteOk(): Promise<Job[]> {
  const raw = await fetchJson<unknown[]>("https://remoteok.com/api");
  const arr = Array.isArray(raw) ? (raw.slice(1) as RemoteOkJob[]) : [];
  return arr
    .filter((j) => j && j.position && j.company)
    .map((j) => {
      const d = safeDate(j.date);
      const id = j.id ?? j.slug ?? `${j.company}-${j.position}`;
      return {
        id: safeId("remoteok", String(id)),
        source: "remoteok",
        sourceLabel: "RemoteOK",
        title: j.position!,
        company: j.company!,
        companyLogo: j.company_logo ?? null,
        location: j.location || "Remote",
        remote: true,
        url: j.url ?? "",
        applyUrl: j.apply_url ?? j.url ?? "",
        description: trimText(j.description),
        tags: j.tags ?? [],
        salary:
          j.salary_min && j.salary_max
            ? `$${j.salary_min.toLocaleString()} – $${j.salary_max.toLocaleString()}`
            : null,
        publishedAt: d.iso,
        publishedAtTs: d.ts,
      } satisfies Job;
    });
}

// ----- Greenhouse per-company: https://boards-api.greenhouse.io/v1/boards/<token>/jobs -----
type GhJob = {
  id: number;
  absolute_url: string;
  title: string;
  location?: { name: string };
  updated_at: string;
  content?: string;
  metadata?: unknown;
  departments?: { name: string }[];
};
type GhPayload = { jobs: GhJob[] };

export async function fetchGreenhouse(): Promise<Job[]> {
  const results = await Promise.allSettled(
    GREENHOUSE_COMPANIES.map(async (c) => {
      const data = await fetchJson<GhPayload>(
        `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(c.token)}/jobs?content=true`
      );
      return (data.jobs ?? []).map((j) => {
        const d = safeDate(j.updated_at);
        const loc = j.location?.name || "Unspecified";
        return {
          id: safeId("greenhouse", `${c.token}-${j.id}`),
          source: "greenhouse",
          sourceLabel: `Greenhouse · ${c.name}`,
          title: j.title,
          company: c.name,
          companyLogo: null,
          location: loc,
          remote: /remote/i.test(loc),
          url: j.absolute_url,
          applyUrl: j.absolute_url,
          description: trimText(j.content),
          tags: (j.departments ?? []).map((d) => d.name),
          salary: null,
          publishedAt: d.iso,
          publishedAtTs: d.ts,
        } satisfies Job;
      });
    })
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

// ----- Ashby per-company: https://api.ashbyhq.com/posting-api/job-board/<org> -----
type AshbyJob = {
  id: string;
  title: string;
  location?: string;
  isRemote?: boolean;
  jobUrl?: string;
  applyUrl?: string;
  publishedAt?: string;
  descriptionPlain?: string;
  team?: string;
  department?: string;
  employmentType?: string;
  compensation?: { compensationTierSummary?: string };
};
type AshbyPayload = { jobs: AshbyJob[] };

export async function fetchAshby(): Promise<Job[]> {
  const results = await Promise.allSettled(
    ASHBY_COMPANIES.map(async (c) => {
      const data = await fetchJson<AshbyPayload>(
        `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(c.org)}?includeCompensation=true`
      );
      return (data.jobs ?? []).map((j) => {
        const d = safeDate(j.publishedAt);
        return {
          id: safeId("ashby", `${c.org}-${j.id}`),
          source: "ashby",
          sourceLabel: `Ashby · ${c.name}`,
          title: j.title,
          company: c.name,
          companyLogo: null,
          location: j.location || (j.isRemote ? "Remote" : "Unspecified"),
          remote: !!j.isRemote || /remote/i.test(j.location ?? ""),
          url: j.jobUrl ?? j.applyUrl ?? "",
          applyUrl: j.applyUrl ?? j.jobUrl ?? "",
          description: trimText(j.descriptionPlain),
          tags: [j.team, j.department, j.employmentType].filter(
            (t): t is string => !!t
          ),
          salary: j.compensation?.compensationTierSummary ?? null,
          publishedAt: d.iso,
          publishedAtTs: d.ts,
        } satisfies Job;
      });
    })
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

// ----- Lever per-company: https://api.lever.co/v0/postings/<token>?mode=json -----
type LeverJob = {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl?: string;
  categories?: {
    location?: string;
    team?: string;
    department?: string;
    commitment?: string;
  };
  createdAt?: number;
  descriptionPlain?: string;
};

export async function fetchLever(): Promise<Job[]> {
  const results = await Promise.allSettled(
    LEVER_COMPANIES.map(async (c) => {
      const arr = await fetchJson<LeverJob[]>(
        `https://api.lever.co/v0/postings/${encodeURIComponent(c.token)}?mode=json`
      );
      return (arr ?? []).map((j) => {
        const d = safeDate(j.createdAt);
        const loc = j.categories?.location || "Unspecified";
        return {
          id: safeId("lever", `${c.token}-${j.id}`),
          source: "lever",
          sourceLabel: `Lever · ${c.name}`,
          title: j.text,
          company: c.name,
          companyLogo: null,
          location: loc,
          remote: /remote/i.test(loc),
          url: j.hostedUrl,
          applyUrl: j.applyUrl ?? j.hostedUrl,
          description: trimText(j.descriptionPlain),
          tags: [
            j.categories?.team,
            j.categories?.department,
            j.categories?.commitment,
          ].filter((t): t is string => !!t),
          salary: null,
          publishedAt: d.iso,
          publishedAtTs: d.ts,
        } satisfies Job;
      });
    })
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

// ----- Workable per-company: https://apply.workable.com/api/v3/accounts/<account>/jobs -----
type WorkableJob = {
  id: string;
  title: string;
  shortcode: string;
  url: string;
  application_url: string;
  description?: string;
  remote?: boolean;
  state?: string;
  city?: string;
  country?: string;
  published_on?: string;
  department?: string;
  employment_type?: string;
};
type WorkablePayload = { jobs?: WorkableJob[]; results?: WorkableJob[] };

export async function fetchWorkable(): Promise<Job[]> {
  const results = await Promise.allSettled(
    WORKABLE_COMPANIES.map(async (c) => {
      const data = await fetchJson<WorkablePayload>(
        `https://apply.workable.com/api/v3/accounts/${encodeURIComponent(c.account)}/jobs`
      );
      const arr = data.jobs ?? data.results ?? [];
      return arr.map((j) => {
        const d = safeDate(j.published_on);
        const loc =
          [j.city, j.state, j.country].filter(Boolean).join(", ") ||
          (j.remote ? "Remote" : "Unspecified");
        return {
          id: safeId("workable", `${c.account}-${j.id ?? j.shortcode}`),
          source: "workable",
          sourceLabel: `Workable · ${c.name}`,
          title: j.title,
          company: c.name,
          companyLogo: null,
          location: loc,
          remote: !!j.remote || /remote/i.test(loc),
          url: j.url,
          applyUrl: j.application_url ?? j.url,
          description: trimText(j.description),
          tags: [j.department, j.employment_type].filter(
            (t): t is string => !!t
          ),
          salary: null,
          publishedAt: d.iso,
          publishedAtTs: d.ts,
        } satisfies Job;
      });
    })
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

export const FETCHERS: Record<JobSource, () => Promise<Job[]>> = {
  remotive: fetchRemotive,
  themuse: fetchTheMuse,
  arbeitnow: fetchArbeitnow,
  remoteok: fetchRemoteOk,
  greenhouse: fetchGreenhouse,
  ashby: fetchAshby,
  lever: fetchLever,
  workable: fetchWorkable,
};
