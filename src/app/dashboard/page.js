"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let current = null;

    try {
      const stored = localStorage.getItem("user");
      current = stored ? JSON.parse(stored) : null;
    } catch (err) {
      current = null;
    }

    setUser(current);
    setReady(true);

    if (!current || current.role !== "company") {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`${API_URL}/jobs`, { cache: "no-store" });
        const all = await res.json();
        const mine = all.filter((job) => job.user_id === current.id);
        setJobs(mine);

        const token = localStorage.getItem("token");
        const result = {};

        for (const job of mine) {
          const appRes = await fetch(
            `${API_URL}/jobs/${job.id}/applications`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const apps = appRes.ok ? await appRes.json() : [];
          result[job.id] = apps.length;
        }

        setCounts(result);
      } catch (err) {
        // ignore network errors, the page shows what it has
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (!ready) {
    return null;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <p className="text-gray-700">
          Please{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            login
          </Link>{" "}
          to see your dashboard.
        </p>
      </main>
    );
  }

  if (user.role !== "company") {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <p className="text-gray-500">Only companies can see this page.</p>
      </main>
    );
  }

  const totalApplications = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Company dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome, {user.name}. Here is an overview of your jobs.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Jobs posted</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{jobs.length}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total applications</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {totalApplications}
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">Your jobs</h2>

        {loading ? (
          <p className="mt-3 text-gray-500">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="mt-3 text-gray-500">
            You have not posted any jobs yet.{" "}
            <Link href="/post-job" className="text-blue-600 hover:underline">
              Post one now
            </Link>
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/jobs/${job.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500">
                      {job.location} | {job.type}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {counts[job.id] ?? 0} applications
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}