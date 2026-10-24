"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { API_URL } from "@/lib/config";

export default function PostJobPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;
      setUser(parsed);
      if (parsed) {
        setCompany(parsed.name);
      }
    } catch (err) {
      setUser(null);
    }
    setReady(true);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, company, location, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not post job");
        return;
      }

      router.push(`/jobs/${data.id}`);
    } catch (err) {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return null;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-700">
          Please{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            login
          </Link>{" "}
          to post a job.
        </p>
      </main>
    );
  }

  if (user.role !== "company") {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-500">Only companies can post jobs.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">Post a job</h1>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Job title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Karachi, Lahore, Remote..."
              className="mt-1 w-full rounded border border-gray-300 p-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-gray-900"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post job"}
          </button>
        </form>
      </div>
    </main>
  );
}