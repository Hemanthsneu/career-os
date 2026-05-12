import { JobsDashboard } from "@/components/JobsDashboard";

export const metadata = {
  title: "Live Jobs · Career OS",
  description: "Aggregated, real-time tech jobs you can apply to directly.",
};

export default function JobsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-950 bg-[radial-gradient(1200px_600px_at_80%_-10%,#1a503080_0%,transparent_50%)] px-4 py-10 sm:px-6">
      <JobsDashboard />
    </div>
  );
}
