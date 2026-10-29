"use client";

import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";

export default function ApplyForm({ jobId }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
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

      const formData = new FormData();
      formData.append("applicant_name", user.name);
      formData.append("applicant_email", user.email);
      formData.append("message", message);

      if (resume) {
        formData.append("resume", resume);
      }

      const res = await fetch(`${API_URL}/jobs/${jobId}/applications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        clearSession();
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not apply");
        return;
      }

      setSuccess(true);
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
      <p className="mt-6 text-gray-700">
        Please{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          login
        </Link>{" "}
        to apply.
      </p>
    );
  }

  if (user.role !== "candidate") {
    return <p className="mt-6 text-gray-500">Only candidates can apply.</p>;
  }

  if (success) {
    return (
      <p className="mt-6 rounded bg-green-50 p-3 text-green-700">
        Your application was submitted.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-3 rounded-lg border border-gray-200 bg-white p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900">Apply for this job</h2>
      <p className="text-sm text-gray-600">
        Applying as {user.name} ({user.email})
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a short message (optional)"
        rows={4}
        className="w-full rounded border border-gray-300 p-2 text-gray-900"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Resume (PDF or Word, optional, max 5 MB)
        </label>
        <input
          type="file"
          accept=".pdf,.doc"
          onChange={(e) => setResume(e.target.files[0] || null)}
          className="mt-1 block w-full text-sm text-gray-700"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}