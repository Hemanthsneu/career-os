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
    description: "Top public + private companies",
    enabledByDefault: true,
  },
  ashby: {
    id: "ashby",
    label: "Ashby",
    description: "Vercel, Linear, Cursor, Notion + more",
    enabledByDefault: true,
  },
  lever: {
    id: "lever",
    label: "Lever",
    description: "Netflix, Spotify, Shopify, Plaid + more",
    enabledByDefault: true,
  },
  workable: {
    id: "workable",
    label: "Workable",
    description: "Curated Workable-hosted careers",
    enabledByDefault: true,
  },
};

/**
 * Companies tracked on Greenhouse. Public job board endpoints:
 * `https://boards-api.greenhouse.io/v1/boards/<token>/jobs`
 *
 * Token = the slug used in the public Greenhouse board URL.
 * Example: boards.greenhouse.io/stripe → token "stripe".
 */
export const GREENHOUSE_COMPANIES: { token: string; name: string }[] = [
  // Top startups & unicorns
  { token: "stripe", name: "Stripe" },
  { token: "airbnb", name: "Airbnb" },
  { token: "discord", name: "Discord" },
  { token: "robinhood", name: "Robinhood" },
  { token: "dropbox", name: "Dropbox" },
  { token: "instacart", name: "Instacart" },
  { token: "doordash", name: "DoorDash" },
  { token: "duolingo", name: "Duolingo" },
  { token: "asana", name: "Asana" },
  { token: "pinterest", name: "Pinterest" },
  { token: "lyft", name: "Lyft" },
  { token: "reddit", name: "Reddit" },
  { token: "squareup", name: "Block (Square)" },
  { token: "twilio", name: "Twilio" },
  { token: "samsara", name: "Samsara" },

  // AI labs
  { token: "anthropic", name: "Anthropic" },
  { token: "openai", name: "OpenAI" },
  { token: "scale", name: "Scale AI" },
  { token: "perplexityai", name: "Perplexity" },

  // Data / infra
  { token: "databricks", name: "Databricks" },
  { token: "snowflake", name: "Snowflake" },
  { token: "fivetran", name: "Fivetran" },
  { token: "dbtlabsinc", name: "dbt Labs" },
  { token: "elastic", name: "Elastic" },
  { token: "mongodb", name: "MongoDB" },
  { token: "hashicorp", name: "HashiCorp" },
  { token: "gitlab", name: "GitLab" },
  { token: "cloudflare", name: "Cloudflare" },
  { token: "datadog", name: "Datadog" },
  { token: "intercom", name: "Intercom" },
  { token: "zendesk", name: "Zendesk" },
  { token: "okta", name: "Okta" },
  { token: "segment", name: "Segment" },
  { token: "mixpanel", name: "Mixpanel" },
  { token: "amplitudeinc", name: "Amplitude" },
  { token: "retool", name: "Retool" },
  { token: "webflowinc", name: "Webflow" },
  { token: "hubspot", name: "HubSpot" },
  { token: "peloton", name: "Peloton" },
  { token: "vimeo", name: "Vimeo" },
  { token: "zoom", name: "Zoom" },

  // Fintech
  { token: "coinbase", name: "Coinbase" },
  { token: "rippling", name: "Rippling" },
  { token: "mercury", name: "Mercury" },
  { token: "ramp", name: "Ramp" },
  { token: "brex", name: "Brex" },
  { token: "chime", name: "Chime" },
  { token: "gusto", name: "Gusto" },
  { token: "affirm", name: "Affirm" },
  { token: "nubank", name: "Nubank" },
  { token: "gemini", name: "Gemini" },
  { token: "kraken", name: "Kraken" },
  { token: "fireblocks", name: "Fireblocks" },

  // Defense / hardware / consumer
  { token: "anduril", name: "Anduril" },
  { token: "spacex", name: "SpaceX" },
  { token: "opendoor", name: "Opendoor" },
  { token: "benchling", name: "Benchling" },
  { token: "faire", name: "Faire" },
  { token: "gong", name: "Gong" },
  { token: "calendly", name: "Calendly" },
  { token: "monday", name: "Monday.com" },
  { token: "sigmacomputing", name: "Sigma Computing" },
  { token: "replicate", name: "Replicate" },
];

/**
 * Companies tracked on Ashby. Endpoint:
 * `https://api.ashbyhq.com/posting-api/job-board/<org>?includeCompensation=true`
 *
 * Org = the slug in the public Ashby URL.
 * Example: jobs.ashbyhq.com/Vercel → org "Vercel".
 */
export const ASHBY_COMPANIES: { org: string; name: string }[] = [
  // Modern dev tools / infra
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
  { org: "Pulumi", name: "Pulumi" },
  { org: "Statsig", name: "Statsig" },
  { org: "Hex", name: "Hex" },

  // AI
  { org: "Cohere", name: "Cohere" },
  { org: "Together-Ai", name: "Together AI" },
  { org: "Modal", name: "Modal" },
  { org: "Captions", name: "Captions" },
  { org: "CommonRoom", name: "Common Room" },

  // SaaS / productivity
  { org: "Loom", name: "Loom" },
  { org: "Oyster", name: "Oyster HR" },
  { org: "Deliveroo", name: "Deliveroo" },
  { org: "FlockSafety", name: "Flock Safety" },
  { org: "JuniperSquare", name: "Juniper Square" },
  { org: "AuroraSolar", name: "Aurora Solar" },
  { org: "MercuryFinancial", name: "Mercury (Ashby)" },
];

/**
 * Companies tracked on Lever. Endpoint:
 * `https://api.lever.co/v0/postings/<token>?mode=json`
 *
 * Token = the slug in the public jobs.lever.co URL.
 * Example: jobs.lever.co/netflix → token "netflix".
 */
export const LEVER_COMPANIES: { token: string; name: string }[] = [
  { token: "netflix", name: "Netflix" },
  { token: "spotify", name: "Spotify" },
  { token: "figma", name: "Figma" },
  { token: "shopify", name: "Shopify" },
  { token: "plaid", name: "Plaid" },
  { token: "github", name: "GitHub" },
  { token: "palantir", name: "Palantir" },
  { token: "khanacademy", name: "Khan Academy" },
  { token: "1password", name: "1Password" },
  { token: "calendly", name: "Calendly (Lever)" },
  { token: "outreach", name: "Outreach" },
  { token: "mistral", name: "Mistral AI" },
  { token: "mux", name: "Mux" },
  { token: "eventbrite", name: "Eventbrite" },
  { token: "automattic", name: "Automattic" },
  { token: "braze", name: "Braze" },
  { token: "twitch", name: "Twitch" },
  { token: "gettyimages", name: "Getty Images" },
  { token: "tinder", name: "Tinder" },
  { token: "klarna", name: "Klarna" },
];

/**
 * Companies tracked on Workable. Endpoint:
 * `https://apply.workable.com/api/v3/accounts/<account>/jobs`
 *
 * Account = the slug in the apply.workable.com URL.
 */
export const WORKABLE_COMPANIES: { account: string; name: string }[] = [
  { account: "neuralink", name: "Neuralink" },
];
