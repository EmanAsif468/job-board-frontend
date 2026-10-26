import Link from "next/link";
import { API_URL } from "@/lib/config";

async function getJobs(location, type) {
  const params = new URLSearchParams();

  if (location) {
    params.set("location", location);
  }

  if (type) {
    params.set("type", type);
  }

  const query = params.toString();
  const url = query ? `${API_URL}/jobs?${query}` : `${API_URL}/jobs`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

export default async function Home({ searchParams }) {
  const { location = "", type = "" } = await searchParams;
  const jobs = await getJobs(location, type);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
      <p className="mt-2 text-gray-600">Find your next job.</p>

      <form
        method="GET"
        action="/"
        className="mt-6 flex flex-wrap items-end gap-3"
      >
        <div>
          <label className="block text-sm text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            defaultValue={location}
            placeholder="Karachi, Lahore, Remote..."
            className="mt-1 rounded border border-gray-300 p-2 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Type</label>
          <select
            name="type"
            defaultValue={type}
            className="mt-1 rounded border border-gray-300 p-2 text-gray-900"
          >
            <option value="">All types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>

        <Link href="/" className="px-2 py-2 text-sm text-gray-600 hover:underline">
          Clear
        </Link>
      </form>

      {jobs.length === 0 ? (
        <p className="mt-6 text-gray-500">No jobs found.</p>
      ) : (
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
      )}
    </main>
  );
}