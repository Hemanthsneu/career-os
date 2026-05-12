import { JobSearchLauncher } from "@/components/JobSearchLauncher";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-950 bg-[radial-gradient(1200px_600px_at_20%_-10%,#1a305080_0%,transparent_50%)] px-4 py-10 sm:px-6">
      <JobSearchLauncher />
    </div>
  );
}
