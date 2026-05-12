const MAX_WORDS = 32;
const MAX_CHARS = 2024;

export function tokenize(block: string): string[] {
  return block
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeQuotes(s: string): string {
  return s.replace(/"/g, '\\"');
}

export function orGroup(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return `"${escapeQuotes(items[0])}"`;
  const inner = items.map((s) => `"${escapeQuotes(s)}"`).join(" OR ");
  return `(${inner})`;
}

export function buildSiteClause(hosts: string[]): string {
  if (hosts.length === 0) return "";
  const parts = hosts.map((h) => `site:${h}`);
  return hosts.length === 1 ? parts[0]! : `(${parts.join(" OR ")})`;
}

export type SearchFormState = {
  rolesText: string;
  locationsText: string;
  extra: string;
  hosts: string[];
};

export function buildQuery(state: SearchFormState): string {
  const roles = tokenize(state.rolesText);
  const locs = tokenize(state.locationsText);
  const extra = state.extra.trim();
  const bits: string[] = [];
  const site = buildSiteClause(state.hosts);
  if (site) bits.push(site);
  const rg = orGroup(roles);
  if (rg) bits.push(rg);
  const lg = orGroup(locs);
  if (lg) bits.push(lg);
  if (extra) bits.push(`(${extra})`);
  return bits.join(" AND ").trim();
}

export function countWords(s: string): number {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

export function measure(q: string): { words: number; chars: number } {
  return { words: countWords(q), chars: q.length };
}

export function withinGoogleLimits(q: string): boolean {
  const { words, chars } = measure(q);
  return words <= MAX_WORDS && chars <= MAX_CHARS;
}

export function splitIntoQueries(hosts: string[], state: Omit<SearchFormState, "hosts">): string[] {
  const batches: string[][] = [];
  let batch: string[] = [];

  for (const h of hosts) {
    const trial = buildQuery({ ...state, hosts: [...batch, h] });
    const m = measure(trial);
    if (m.words > MAX_WORDS || m.chars > MAX_CHARS) {
      if (batch.length) {
        batches.push([...batch]);
        batch = [h];
        const one = buildQuery({ ...state, hosts: batch });
        const m2 = measure(one);
        if (m2.words > MAX_WORDS || m2.chars > MAX_CHARS) {
          batches.push([h]);
          batch = [];
        }
      } else {
        batches.push([h]);
      }
    } else {
      batch.push(h);
    }
  }
  if (batch.length) batches.push(batch);
  return batches.map((b) => buildQuery({ ...state, hosts: b })).filter(Boolean);
}

export const GOOGLE_LIMITS = { MAX_WORDS, MAX_CHARS } as const;

export function googleSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
