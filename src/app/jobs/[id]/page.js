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

export default async function JobDetailPage({ params }) {
  const { id } = await params;
  const job = await getJob(id);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        Back to all jobs
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
        <p className="mt-1 text-lg text-gray-700">{job.company}</p>
        <p className="mt-2 text-gray-500">
          {job.location} | {job.type}
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Posted on {new Date(job.created_at).toLocaleDateString()}
        </p>
      </div>

      <ApplyForm jobId={job.id} />
      <ApplicationsList jobId={job.id} />
      <OwnerActions jobId={job.id} ownerId={job.user_id} />
    </main>
  );
} 