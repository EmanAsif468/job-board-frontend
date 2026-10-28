"use client";
import { clearSession } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";

export default function OwnerActions({ jobId, ownerId }) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      setIsOwner(
        Boolean(user) && user.role === "company" && user.id === ownerId
      );
    } catch (err) {
      setIsOwner(false);
    }
  }, [ownerId]);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this job and all its applications? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
            const data = await res.json();

      if (res.status === 401) {
        clearSession();
        router.push("/login");
        return;
      }

      if (!res.ok) {
        setError(data.message || "Could not delete job");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  if (!isOwner) {
    return null;
  }

  return (
    <div className="mt-6">
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete this job"}
      </button>
    </div>
  );
}