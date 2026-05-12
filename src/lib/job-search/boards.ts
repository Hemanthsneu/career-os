export type Board = {
  id: string;
  host: string;
  label: string;
  category: "ats" | "startup" | "vc" | "tech" | "general";
  description?: string;
};

/**
 * Comprehensive job board list for Career OS
 * Organized by: ATS Platforms, Startup/VC Boards, Tech Boards, General
 */
export const BOARDS: Board[] = [
  // ========== ATS PLATFORMS ==========
  // These host career pages for thousands of companies
  { id: "gh", host: "boards.greenhouse.io", label: "Greenhouse", category: "ats", description: "Most popular ATS - Airbnb, Stripe, Netflix, Dropbox" },
  { id: "gh2", host: "job-boards.greenhouse.io", label: "Greenhouse v2", category: "ats", description: "Alternate Greenhouse domain" },
  { id: "lv", host: "jobs.lever.co", label: "Lever", category: "ats", description: "YC companies, startups - Figma, Notion, Scale" },
  { id: "ash", host: "jobs.ashbyhq.com", label: "Ashby", category: "ats", description: "Modern ATS for startups - Linear, Vercel, Clerk" },
  { id: "wd", host: "wd1.myworkdayjobs.com", label: "Workday", category: "ats", description: "Enterprise: Amazon, Adobe, Salesforce, Disney" },
  { id: "wd2", host: "wd5.myworkdayjobs.com", label: "Workday v2", category: "ats", description: "Enterprise variant" },
  { id: "wd3", host: "careers.workday.com", label: "Workday Careers", category: "ats", description: "Workday company careers" },
  { id: "ic", host: "careers.icims.com", label: "iCIMS", category: "ats", description: "Enterprise companies" },
  { id: "ic2", host: "icims.com/jobs", label: "iCIMS v2", category: "ats", description: "Alternate iCIMS domain" },
  { id: "jv", host: "jobs.jobvite.com", label: "Jobvite", category: "ats", description: "Mid-market companies" },
  { id: "sr", host: "jobs.smartrecruiters.com", label: "SmartRecruiters", category: "ats", description: "Uber, Visa, Square" },
  { id: "wk", host: "careers.workable.com", label: "Workable", category: "ats", description: "SMB and startups" },
  { id: "jz", host: "apply.jazz.co", label: "JazzHR", category: "ats", description: "Small business ATS" },
  { id: "jz2", host: "applytojob.com", label: "JazzHR Apply", category: "ats", description: "JazzHR application domain" },
  { id: "bh", host: "jobs.bamboohr.com", label: "BambooHR", category: "ats", description: "Small to mid-size companies" },
  { id: "brz", host: "breezy.hr", label: "Breezy HR", category: "ats", description: "Startup-friendly ATS" },
  { id: "tal", host: "taleo.net", label: "Taleo/Oracle", category: "ats", description: "Oracle's ATS - Apple, Cisco, many enterprises" },
  { id: "ef", host: "eightfold.ai", label: "Eightfold", category: "ats", description: "AI-powered ATS - AirAsia, Capital One, Tata" },
  { id: "ph", host: "phenom.com", label: "Phenom", category: "ats", description: "Enterprise talent experience - L'Oréal, Southwest, Newell" },
  { id: "be", host: "jobs.beesite.com", label: "BeeSite", category: "ats", description: "European ATS" },
  { id: "rec", host: "recruitee.com", label: "Recruitee", category: "ats", description: "European ATS popular with startups" },
  { id: "team", host: "teamtailor.com", label: "Teamtailor", category: "ats", description: "European ATS - Spotify, Klarna" },
  { id: "tr", host: "theresumator.com", label: "The Resumator", category: "ats", description: "Startup ATS (older)" },
  { id: "pay", host: "paylocity.com", label: "Paylocity", category: "ats", description: "HR and ATS platform" },
  { id: "adp", host: "adp.com", label: "ADP", category: "ats", description: "Enterprise HR/ATS" },
  { id: "sf", host: "successfactors.com", label: "SAP SuccessFactors", category: "ats", description: "SAP's ATS platform" },

  // ========== STARTUP JOB BOARDS ==========
  { id: "yc", host: "ycombinator.com/jobs", label: "Y Combinator", category: "startup", description: "All YC companies hiring - Airbnb, Stripe, Dropbox, Instacart alumni" },
  { id: "wats", host: "workatastartup.com", label: "Work at a Startup", category: "startup", description: "YC's dedicated startup job board" },
  { id: "wf", host: "wellfound.com", label: "Wellfound (AngelList)", category: "startup", description: "150K+ startup jobs, equity transparency - formerly AngelList" },
  { id: "ang", host: "angel.co", label: "AngelList Talent", category: "startup", description: "Legacy AngelList domain" },
  { id: "key", host: "keyvalues.com", label: "Key Values", category: "startup", description: "Engineer-focused startup jobs with culture filters" },
  { id: "under", host: "underdog.io", label: "Underdog.io", category: "startup", description: "Curated startup jobs, weekly matching" },
  { id: "start", host: "startup.jobs", label: "Startup.Jobs", category: "startup", description: "Global startup job board" },
  { id: "nodes", host: "nodesk.co", label: "NoDesk", category: "startup", description: "Remote startup jobs" },
  { id: "wh", host: "whoishiring.io", label: "Who is Hiring", category: "startup", description: "HN 'Who is Hiring' aggregator" },
  { id: "luna", host: "lunarcrush.com/careers", label: "LunarCrush", category: "startup", description: "Crypto/web3 startup jobs" },
  { id: "web3", host: "web3.career", label: "Web3 Career", category: "startup", description: "Web3 and blockchain jobs" },

  // ========== VENTURE CAPITAL PORTFOLIO BOARDS ==========
  { id: "a16z", host: "portfoliojobs.a16z.com", label: "a16z Portfolio", category: "vc", description: "Andreessen Horowitz portfolio - 1000+ companies" },
  { id: "seq", host: "jobs.sequoiacap.com", label: "Sequoia Capital", category: "vc", description: "Sequoia portfolio - Apple, Google, WhatsApp, Airbnb, Zoom" },
  { id: "grey", host: "jobs.greylock.com", label: "Greylock", category: "vc", description: "Greylock portfolio - LinkedIn, Facebook, Workday, Airbnb" },
  { id: "khos", host: "jobs.khoslaventures.com", label: "Khosla Ventures", category: "vc", description: "Khosla portfolio - OpenAI, DoorDash, Instacart" },
  { id: "lsvp", host: "jobs.lsvp.com", label: "Lightspeed", category: "vc", description: "Lightspeed portfolio - Snap, Affirm, Epic Games" },
  { id: "accel", host: "jobs.accel.com", label: "Accel", category: "vc", description: "Accel portfolio - Facebook, Slack, Spotify, Dropbox" },
  { id: "insight", host: "jobs.insightpartners.com", label: "Insight Partners", category: "vc", description: "Insight portfolio - Shopify, DocuSign, Monday.com" },
  { id: "gc", host: "jobs.generalcatalyst.com", label: "General Catalyst", category: "vc", description: "GC portfolio - Airbnb, HubSpot, Stripe, Snap" },
  { id: "bvp", host: "jobs.bvp.com", label: "Bessemer", category: "vc", description: "Bessemer portfolio - LinkedIn, Pinterest, Shopify, Twilio" },
  { id: "kleiner", host: "jobs.kleinerperkins.com", label: "Kleiner Perkins", category: "vc", description: "KP portfolio - Amazon, Google, Intuit, Airbnb" },
  { id: "nea", host: "jobs.nea.com", label: "NEA", category: "vc", description: "NEA portfolio - Salesforce, Workday, Tableau, Databricks" },
  { id: "benchmark", host: "jobs.benchmark.com", label: "Benchmark", category: "vc", description: "Benchmark portfolio - Uber, Twitter, Snapchat, eBay" },
  { id: "index", host: "jobs.indexventures.com", label: "Index Ventures", category: "vc", description: "Index portfolio - Discord, Slack, Figma, Notion" },
  { id: "craft", host: "jobs.craft.co", label: "Craft Ventures", category: "vc", description: "Craft portfolio - Tesla, SpaceX, Bird, Reddit" },
  { id: "techstars", host: "jobs.techstars.com", label: "Techstars", category: "vc", description: "Techstars portfolio companies" },
  { id: "500", host: "jobs.500.co", label: "500 Startups", category: "vc", description: "500 Startups portfolio" },
  { id: "greenrobot", host: "jobsearch.greenrobot.com", label: "GreenRobot VC Jobs", category: "vc", description: "Aggregated 229K+ jobs at 4,285+ VC-backed companies" },

  // ========== TECH-SPECIFIC JOB BOARDS ==========
  { id: "builtin", host: "builtin.com", label: "Built In", category: "tech", description: "Tech hubs: NYC, SF, Austin, Boston, Chicago, LA, Seattle, Denver" },
  { id: "dice", host: "dice.com", label: "Dice", category: "tech", description: "200K+ tech jobs monthly, 5K+ companies" },
  { id: "so", host: "stackoverflow.com/jobs", label: "Stack Overflow", category: "tech", description: "Developer-focused, high quality" },
  { id: "ghjobs", host: "github.com/jobs", label: "GitHub Jobs", category: "tech", description: "GitHub's job board" },
  { id: "hacker", host: "news.ycombinator.com/jobs", label: "HN Jobs", category: "tech", description: "Hacker News jobs thread" },
  { id: "rep", host: "replit.com/jobs", label: "Replit Jobs", category: "tech", description: "Tech jobs from Replit community" },
  { id: "dev", host: "dev.to/jobs", label: "DEV Community", category: "tech", description: "Developer community jobs" },
  { id: "daily", host: "daily.dev", label: "daily.dev", category: "tech", description: "Developer news and jobs" },
  { id: "hash", host: "hashnode.com/jobs", label: "Hashnode", category: "tech", description: "Developer blogging platform jobs" },
  { id: "product", host: "producthunt.com/jobs", label: "Product Hunt", category: "tech", description: "Product/startup jobs" },
  { id: "indie", host: "indiehackers.com/jobs", label: "Indie Hackers", category: "tech", description: "Bootstrapped/SaaS founder jobs" },
  { id: "hired", host: "hired.com", label: "Hired", category: "tech", description: "Reverse recruiting - companies apply to you" },
  { id: "vettery", host: "vettery.com", label: "Vettery", category: "tech", description: "Tech and finance, talent marketplace" },
  { id: "triple", host: "triplebyte.com", label: "Triplebyte", category: "tech", description: "Engineer-focused, technical screening" },
  { id: " interviewing", host: "interviewing.io", label: "Interviewing.io", category: "tech", description: "Anonymous technical interviews" },
  { id: "moon", host: "moonshot.jobs", label: "Moonshot", category: "tech", description: "High-growth tech companies" },
  { id: "techstars", host: "techstars.com/jobs", label: "Techstars Jobs", category: "tech", description: "Techstars network jobs" },
  { id: "f6s", host: "f6s.com/jobs", label: "F6S", category: "tech", description: "Startup programs and jobs" },
  { id: "gust", host: "gust.com", label: "Gust", category: "tech", description: "Startup platform jobs" },

  // ========== GENERAL JOB BOARDS ==========
  { id: "li", host: "linkedin.com/jobs", label: "LinkedIn", category: "general", description: "Largest professional network - must include" },
  { id: "indeed", host: "indeed.com", label: "Indeed", category: "general", description: "#1 job site in US by volume" },
  { id: "zip", host: "ziprecruiter.com", label: "ZipRecruiter", category: "general", description: "AI-powered matching, #1 G2 rating" },
  { id: "glass", host: "glassdoor.com", label: "Glassdoor", category: "general", description: "Reviews + jobs" },
  { id: "simply", host: "simplyhired.com", label: "SimplyHired", category: "general", description: "Job search engine" },
  { id: "monster", host: "monster.com", label: "Monster", category: "general", description: "Legacy job board" },
  { id: "career", host: "careerbuilder.com", label: "CareerBuilder", category: "general", description: "Enterprise job board" },
  { id: " snag", host: "snagajob.com", label: "Snagajob", category: "general", description: "Hourly and part-time jobs" },
  { id: "flex", host: "flexjobs.com", label: "FlexJobs", category: "general", description: "Remote and flexible jobs (paid)" },
  { id: "remote", host: "remote.co", label: "Remote.co", category: "general", description: "Remote-only jobs" },
  { id: "wework", host: "weworkremotely.com", label: "We Work Remotely", category: "general", description: "Remote jobs board" },
  { id: "remotive", host: "remotive.com", label: "Remotive", category: "general", description: "Remote tech jobs" },
  { id: "just", host: "justremote.co", label: "JustRemote", category: "general", description: "Remote job search" },
  { id: "dynamite", host: "dynamitejobs.com", label: "Dynamite Jobs", category: "general", description: "Remote-first companies" },
  { id: "arc", host: "arc.dev", label: "Arc.dev", category: "general", description: "Remote developer jobs" },
  { id: "talent", host: "talent.io", label: "Talent.io", category: "general", description: "European tech recruitment" },
  { id: "landing", host: "landing.jobs", label: "Landing.jobs", category: "general", description: "European tech jobs" },
  { id: "honeypot", host: "honeypot.io", label: "Honeypot", category: "general", description: "European developer-focused" },
];

/** Sensible default subset for day-one searches - covers 80% of quality listings */
export const RECOMMENDED_BOARD_IDS = new Set([
  // Top ATS (most company coverage)
  "gh",      // Greenhouse - largest ATS
  "gh2",     // Greenhouse alternate
  "lv",      // Lever - popular with startups
  "ash",     // Ashby - modern, growing fast
  "wd",      // Workday - enterprise
  "wd2",     // Workday variant
  "sr",      // SmartRecruiters
  "jv",      // Jobvite
  "wk",      // Workable

  // Startup/VC (high quality, early access)
  "yc",      // Y Combinator
  "wats",    // Work at a Startup
  "wf",      // Wellfound/AngelList
  "a16z",    // a16z portfolio
  "seq",     // Sequoia
  "grey",    // Greylock
  "khos",    // Khosla
  "lsvp",    // Lightspeed

  // Tech boards
  "builtin", // Built In - tech hubs
  "dice",    // Dice - tech focused
  "so",      // Stack Overflow
  "hacker",  // HN Jobs
  "key",     // Key Values - culture fit
  "under",   // Underdog.io

  // General (volume)
  "li",      // LinkedIn
]);

/** ATS-only boards for direct company career page searches */
export const ATS_BOARD_IDS = new Set([
  "gh", "gh2", "lv", "ash", "wd", "wd2", "wd3",
  "ic", "ic2", "jv", "sr", "wk", "jz", "jz2",
  "bh", "brz", "tal", "ef", "ph", "be", "rec",
  "team", "tr", "pay", "adp", "sf"
]);

/** Startup and VC boards for high-growth opportunities */
export const STARTUP_VC_BOARD_IDS = new Set([
  "yc", "wats", "wf", "ang", "key", "under", "start",
  "nodes", "wh", "a16z", "seq", "grey", "khos", "lsvp",
  "accel", "insight", "gc", "bvp", "kleiner", "nea",
  "benchmark", "index", "craft", "techstars", "500",
  "greenrobot", "moon"
]);

/** Remote-focused boards */
export const REMOTE_BOARD_IDS = new Set([
  "nodes", "flex", "remote", "wework", "remotive",
  "just", "dynamite", "arc"
]);
