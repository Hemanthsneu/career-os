export type Board = {
  id: string;
  host: string;
  label: string;
};

export const BOARDS: Board[] = [
  { id: "gh", host: "boards.greenhouse.io", label: "Greenhouse" },
  { id: "lv", host: "jobs.lever.co", label: "Lever" },
  { id: "ic", host: "careers.icims.com", label: "iCIMS" },
  { id: "jv", host: "jobs.jobvite.com", label: "Jobvite" },
  { id: "wd", host: "wd1.myworkdayjobs.com", label: "Workday" },
  { id: "bh", host: "jobs.bamboohr.com", label: "BambooHR" },
  { id: "sr", host: "jobs.smartrecruiters.com", label: "SmartRecruiters" },
  { id: "jz", host: "apply.jazz.co", label: "JazzHR" },
  { id: "wk", host: "careers.workable.com", label: "Workable" },
];

/** Sensible default subset for day-one searches */
export const RECOMMENDED_BOARD_IDS = new Set([
  "gh",
  "lv",
  "wd",
  "sr",
  "jv",
]);
