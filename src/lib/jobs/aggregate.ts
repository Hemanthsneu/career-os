import { FETCHERS } from "./fetchers";
import { SOURCE_META } from "./sources";
import type { Job, JobSource, JobsResponse } from "./types";

export async function aggregateJobs(sources?: JobSource[]): Promise<JobsResponse> {
  const enabled =
    sources && sources.length
      ? sources
      : (Object.values(SOURCE_META)
          .filter((s) => s.enabledByDefault)
          .map((s) => s.id) as JobSource[]);

  const results = await Promise.allSettled(
    enabled.map(async (s) => ({ source: s, jobs: await FETCHERS[s]() }))
  );

  const sourceStats: JobsResponse["sources"] = [];
  const allJobs: Job[] = [];

  for (let i = 0; i < results.length; i++) {
    const s = enabled[i]!;
    const r = results[i]!;
    if (r.status === "fulfilled") {
      sourceStats.push({ source: s, count: r.value.jobs.length, ok: true });
      allJobs.push(...r.value.jobs);
    } else {
      sourceStats.push({
        source: s,
        count: 0,
        ok: false,
        error: r.reason instanceof Error ? r.reason.message : String(r.reason),
      });
    }
  }

  // Newest first
  allJobs.sort((a, b) => b.publishedAtTs - a.publishedAtTs);

  return {
    jobs: allJobs,
    total: allJobs.length,
    sources: sourceStats,
    fetchedAt: new Date().toISOString(),
  };
}
