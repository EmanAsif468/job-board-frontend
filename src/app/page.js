import Link from "next/link";

const API_URL = "http://localhost:3000";

async function getJobs() {
  const res = await fetch(`${API_URL}/jobs`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

export default async function Home() {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
      <p className="mt-2 text-gray-600">Find your next job.</p>

      <ul className="mt-6 space-y-4">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <Link href={`/jobs/${job.id}`}>
              <h2 className="text-lg font-semibold text-blue-700 hover:underline">
                {job.title}
              </h2>
            </Link>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">
              {job.location} | {job.type}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}