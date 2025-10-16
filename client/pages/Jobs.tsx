import { useEffect, useState } from "react";
import { ExternalLink, MapPin, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  applyLink: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error("Failed to load jobs");
        const data = await res.json();
        setJobs(data);
      } catch (e: any) {
        setError(e.message || "Error loading jobs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-16">Loading jobs…</div>;
  if (error)
    return (
      <div className="container mx-auto px-4 py-16 text-red-600">{error}</div>
    );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Job Posts</h1>
      {jobs.length === 0 ? (
        <p className="text-foreground/70">
          No jobs yet. Ask the admin to add job posts or configure the database connection.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <article key={job._id} className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
              <p className="text-sm text-foreground/70 mb-4">{job.company}</p>
              <div className="space-y-2 text-sm mb-4">
                {job.location && (
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{job.location}</div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-2"><IndianRupee className="h-4 w-4" />{job.salary}</div>
                )}
              </div>
              <p className="text-sm text-foreground/80 line-clamp-4 mb-4">{job.description}</p>
              <a href={job.applyLink} target="_blank" rel="noreferrer">
                <Button size="sm" className="w-full">Apply Now <ExternalLink className="ml-2 h-4 w-4" /></Button>
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
