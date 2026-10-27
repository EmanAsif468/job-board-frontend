import Link from "next/link";
import { notFound } from "next/navigation";
import ApplyForm from "../../../components/ApplyForm";
import ApplicationsList from "../../../components/ApplicationsList";
import OwnerActions from "../../../components/OwnerActions";
import { API_URL } from "@/lib/config";

async function getJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`, { cache: "no-store" });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to fetch job");
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

export default async function JobDetailPage({ params }) {
  const { id } = await params;
  const job = await getJob(id);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to all jobs
        </Link>

        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
              {job.company.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="mt-1 text-lg text-gray-700">{job.company}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-600">{job.location}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeStyle(
                job.type
              )}`}
            >
              {job.type}
            </span>
            <span className="text-sm text-gray-400">
              Posted on {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <ApplyForm jobId={job.id} />
        <ApplicationsList jobId={job.id} />
        <OwnerActions jobId={job.id} ownerId={job.user_id} />
      </div>
    </main>
  );
}