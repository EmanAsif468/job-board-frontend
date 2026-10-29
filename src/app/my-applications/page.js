"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";

export default function MyApplicationsPage() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [apps, setApps] = useState([]);
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

    if (!current || current.role !== "candidate") {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/my/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setApps(res.ok ? data : []);
      } catch (err) {
        setApps([]);
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
          to see your applications.
        </p>
      </main>
    );
  }

  if (user.role !== "candidate") {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <p className="text-gray-500">Only candidates can see this page.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900">My applications</h1>
        <p className="mt-1 text-gray-600">
          Jobs you have applied to, newest first.
        </p>

        {loading ? (
          <p className="mt-6 text-gray-500">Loading...</p>
        ) : apps.length === 0 ? (
          <p className="mt-6 text-gray-500">
            You have not applied to any job yet.{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              Browse jobs
            </Link>
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {apps.map((app) => (
              <li
                key={app.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <Link href={`/jobs/${app.job_id}`} className="min-w-0 hover:underline">
                    <p className="truncate font-semibold text-gray-900">
                      {app.title}
                    </p>
                    <p className="text-sm text-gray-600">{app.company}</p>
                    <p className="text-sm text-gray-500">
                      {app.location} | {app.type}
                    </p>
                  </Link>

                  <div className="shrink-0 text-right">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      Applied
                    </span>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {app.resume_url && (
                  <a
                    href={app.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                  >
                    View resume
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}