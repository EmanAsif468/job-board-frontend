"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    } catch (error) {
      setUser(null);
    }
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Job Board
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <>
              {user.role === "company" && (
                <Link
                  href="/post-job"
                  className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                >
                  Post a job
                </Link>
              )}

              <span className="text-sm text-gray-700">{user.name}</span>

              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.role === "company"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.role}
              </span>

              <button
                onClick={handleLogout}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-2 py-1.5 text-sm text-gray-700 hover:underline"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}