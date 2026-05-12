import { aggregateJobs } from "@/lib/jobs/aggregate";
import type { JobSource } from "@/lib/jobs/types";

export const revalidate = 600;

const VALID_SOURCES: ReadonlySet<JobSource> = new Set([
  "remotive",
  "themuse",
  "arbeitnow",
  "remoteok",
  "greenhouse",
  "ashby",
  "lever",
  "workable",
]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sourcesParam = url.searchParams.get("sources");
  const sources = sourcesParam
    ? (sourcesParam
        .split(",")
        .map((s) => s.trim())
        .filter((s): s is JobSource =>
          VALID_SOURCES.has(s as JobSource)
        ))
    : undefined;

  try {
    const data = await aggregateJobs(sources);
    return Response.json(data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
