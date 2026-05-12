import type { JobSource } from "./types";

export type SourceMeta = {
  id: JobSource;
  label: string;
  description: string;
  /** Whether this source can be enabled by default in the dashboard. */
  enabledByDefault: boolean;
};

export const SOURCE_META: Record<JobSource, SourceMeta> = {
  remotive: {
    id: "remotive",
    label: "Remotive",
    description: "Curated remote jobs",
    enabledByDefault: true,
  },
  themuse: {
    id: "themuse",
    label: "The Muse",
    description: "Tech and creative jobs",
    enabledByDefault: true,
  },
  arbeitnow: {
    id: "arbeitnow",
    label: "Arbeitnow",
    description: "EU + Remote jobs",
    enabledByDefault: true,
  },
  remoteok: {
    id: "remoteok",
    label: "RemoteOK",
    description: "Remote tech jobs",
    enabledByDefault: true,
  },
  greenhouse: {
    id: "greenhouse",
    label: "Greenhouse",
    description: "Tracked YC + top startups",
    enabledByDefault: true,
  },
  ashby: {
    id: "ashby",
    label: "Ashby",
    description: "Linear, Vercel, Clerk and more",
    enabledByDefault: true,
  },
  lever: {
    id: "lever",
    label: "Lever",
    description: "Curated Lever-hosted careers",
    enabledByDefault: true,
  },
  workable: {
    id: "workable",
    label: "Workable",
    description: "Curated Workable-hosted careers",
    enabledByDefault: false,
  },
};

/**
 * Companies tracked on Greenhouse. These are public job board endpoints
 * (`https://boards-api.greenhouse.io/v1/boards/<token>/jobs`).
 * Add or edit company tokens to expand coverage.
 */
export const GREENHOUSE_COMPANIES: { token: string; name: string }[] = [
  { token: "stripe", name: "Stripe" },
  { token: "airbnb", name: "Airbnb" },
  { token: "discord", name: "Discord" },
  { token: "robinhood", name: "Robinhood" },
  { token: "dropbox", name: "Dropbox" },
  { token: "instacart", name: "Instacart" },
  { token: "doordash", name: "DoorDash" },
  { token: "anthropic", name: "Anthropic" },
  { token: "openai", name: "OpenAI" },
  { token: "scale", name: "Scale AI" },
  { token: "databricks", name: "Databricks" },
  { token: "snowflake", name: "Snowflake" },
  { token: "coinbase", name: "Coinbase" },
  { token: "rippling", name: "Rippling" },
  { token: "mercury", name: "Mercury" },
  { token: "ramp", name: "Ramp" },
  { token: "brex", name: "Brex" },
  { token: "cloudflare", name: "Cloudflare" },
  { token: "datadog", name: "Datadog" },
  { token: "asana", name: "Asana" },
  { token: "pinterest", name: "Pinterest" },
  { token: "lyft", name: "Lyft" },
  { token: "reddit", name: "Reddit" },
  { token: "squareup", name: "Block (Square)" },
  { token: "twilio", name: "Twilio" },
  { token: "samsara", name: "Samsara" },
  { token: "duolingo", name: "Duolingo" },
];

/**
 * Companies tracked on Ashby. Endpoint:
 * `https://api.ashbyhq.com/posting-api/job-board/<org>?includeCompensation=true`
 */
export const ASHBY_COMPANIES: { org: string; name: string }[] = [
  { org: "Vercel", name: "Vercel" },
  { org: "Linear", name: "Linear" },
  { org: "Notion", name: "Notion" },
  { org: "Ashby", name: "Ashby" },
  { org: "Posthog", name: "PostHog" },
  { org: "Clerk", name: "Clerk" },
  { org: "Replit", name: "Replit" },
  { org: "Resend", name: "Resend" },
  { org: "Cursor", name: "Cursor" },
  { org: "Browserbase", name: "Browserbase" },
  { org: "Cohere", name: "Cohere" },
  { org: "Together-Ai", name: "Together AI" },
  { org: "Modal", name: "Modal" },
  { org: "MercuryFinancial", name: "Mercury (Ashby)" },
];

/**
 * Companies tracked on Lever. Endpoint:
 * `https://api.lever.co/v0/postings/<token>?mode=json`
 */
export const LEVER_COMPANIES: { token: string; name: string }[] = [
  { token: "netflix", name: "Netflix" },
  { token: "spotify", name: "Spotify" },
  { token: "figma", name: "Figma" },
  { token: "shopify", name: "Shopify" },
  { token: "plaid", name: "Plaid" },
  { token: "github", name: "GitHub" },
  { token: "rippling", name: "Rippling (Lever)" },
  { token: "palantir", name: "Palantir" },
  { token: "khanacademy", name: "Khan Academy" },
  { token: "1password", name: "1Password" },
];

/**
 * Companies tracked on Workable. Endpoint:
 * `https://apply.workable.com/api/v3/accounts/<account>/jobs`
 */
export const WORKABLE_COMPANIES: { account: string; name: string }[] = [
  { account: "neuralink", name: "Neuralink" },
];
