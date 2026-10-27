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

function typeStyle(type) {
  if (type === "Full-time") {
    return "bg-green-100 text-green-800";
  }

  if (type === "Part-time") {
    return "bg-amber-100 text-amber-800";
  }

  if (type === "Contract") {
    return "bg-purple-100 text-purple-800";
  }

  return "bg-gray-100 text-gray-700";
}

export default async function Home({ searchParams }) {
  const { location = "", type = "" } = await searchParams;
  const jobs = await getJobs(location, type);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-900">
            Find your next job
          </h1>
          <p className="mt-2 text-gray-600">
            Browse open roles from companies hiring now.
          </p>

          <form
            method="GET"
            action="/"
            className="mt-6 flex flex-wrap items-end gap-3"
          >
            <div className="min-w-[200px] flex-1">
              <label className="block text-sm text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                defaultValue={location}
                placeholder="Karachi, Lahore, Remote..."
                className="mt-1 w-full rounded border border-gray-300 p-2 text-gray-900"
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
              className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Search
            </button>

            <Link
              href="/"
              className="px-2 py-2 text-sm text-gray-600 hover:underline"
            >
              Clear
            </Link>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8">
        <p className="text-sm text-gray-500">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
        </p>

        {jobs.length === 0 ? (
          <p className="mt-6 text-gray-500">
            No jobs match your search. Try different filters.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/jobs/${job.id}`}
                  className="flex h-full gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                    {job.company.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-gray-900">
                      {job.title}
                    </h2>
                    <p className="text-gray-600">{job.company}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {job.location}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeStyle(
                          job.type
                        )}`}
                      >
                        {job.type}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}