"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

export default function ApplicationsList({ jobId }) {
  const [applications, setApplications] = useState(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const res = await fetch(`${API_URL}/jobs/${jobId}/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          return;
        }

        setApplications(await res.json());
      } catch (err) {
        // ignore network errors
      }
    }

    load();
  }, [jobId]);

  if (applications === null) {
    return null;
  }

  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Applications ({applications.length})
      </h2>

      {applications.length === 0 ? (
        <p className="mt-2 text-gray-500">No applications yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {applications.map((app) => (
            <li key={app.id} className="rounded border border-gray-100 p-3">
              <p className="font-medium text-gray-900">{app.applicant_name}</p>
              <p className="text-sm text-gray-600">{app.applicant_email}</p>
              {app.message && (
                <p className="mt-1 text-sm text-gray-700">{app.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                {new Date(app.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}