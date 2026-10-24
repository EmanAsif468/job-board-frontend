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
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      <Link href="/" className="text-lg font-bold text-gray-900">
        Job Board
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === "company" && (
              <Link
                href="/post-job"
                className="text-sm text-blue-600 hover:underline"
              >
                Post a job
              </Link>
            )}
            <span className="text-sm text-gray-700">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              Login
            </Link>
            <Link href="/register" className="text-sm text-blue-600 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}