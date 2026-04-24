"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function AdminDashboard() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    axios
      .get("/api/admin/submissions")
      .then((res) => setPendingCount(res.data.length))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-[calc(100vh-6rem)] p-4 sm:p-8 font-bob">
      <h1 className="text-2xl sm:text-4xl font-bold text-yellow text-center mb-8">
        Admin Dashboard
      </h1>
      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/submissions"
          className="container-bg rounded-lg p-6 hover:border-[#fff67b] border border-transparent transition-colors"
        >
          <h2 className="text-xl font-bold text-yellow mb-2">Submissions</h2>
          <p className="text-gray-300 text-sm">
            {pendingCount} pending review
          </p>
        </Link>
        <Link
          href="/admin/content"
          className="container-bg rounded-lg p-6 hover:border-[#fff67b] border border-transparent transition-colors"
        >
          <h2 className="text-xl font-bold text-yellow mb-2">Content</h2>
          <p className="text-gray-300 text-sm">Manage strategies, methods, socks, spatulas</p>
        </Link>
        <Link
          href="/admin/users"
          className="container-bg rounded-lg p-6 hover:border-[#fff67b] border border-transparent transition-colors"
        >
          <h2 className="text-xl font-bold text-yellow mb-2">Users</h2>
          <p className="text-gray-300 text-sm">Manage user roles</p>
        </Link>
      </div>
    </div>
  );
}
