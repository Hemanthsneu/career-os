export type JobSource =
  | "remotive"
  | "themuse"
  | "arbeitnow"
  | "remoteok"
  | "greenhouse"
  | "ashby"
  | "lever"
  | "workable";

export type Job = {
  id: string;
  source: JobSource;
  sourceLabel: string;
  title: string;
  company: string;
  companyLogo?: string | null;
  location: string;
  remote: boolean;
  url: string;
  applyUrl: string;
  description?: string;
  tags: string[];
  salary?: string | null;
  publishedAt: string;
  publishedAtTs: number;
};

export type JobsResponse = {
  jobs: Job[];
  total: number;
  sources: { source: JobSource; count: number; ok: boolean; error?: string }[];
  fetchedAt: string;
};

export type JobsFilter = {
  query?: string;
  remote?: boolean;
  within?: "day" | "week" | "month" | "any";
  sources?: JobSource[];
  companies?: string[];
};
