"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  discordId: string | null;
}

export default function AdminUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleRole = async (user: User) => {
    if (user.id === session?.user?.id) return;
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await axios.patch(`/api/admin/users/${user.id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch {
      // handled
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] p-4 sm:p-8 font-bob">
      <h1 className="text-2xl sm:text-4xl font-bold text-yellow text-center mb-8">
        User Management
      </h1>
      <div className="max-w-3xl mx-auto space-y-2">
        {loading && <p className="text-gray-400 text-center">Loading...</p>}
        {!loading && users.length === 0 && (
          <p className="text-gray-400 text-center">No users found.</p>
        )}
        {users.map((user) => (
          <div
            key={user.id}
            className="container-bg rounded-lg p-4 flex items-center gap-3 border border-transparent hover:border-blue-700"
          >
            {user.image && (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={36}
                height={36}
                className="rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {user.name ?? "Unknown"}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {user.email ?? "No email"}
                {user.discordId && (
                  <span className="ml-2 text-gray-500">
                    Discord: {user.discordId}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => toggleRole(user)}
              disabled={user.id === session?.user?.id}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                user.role === "admin"
                  ? "border-[#fff67b]/50 bg-[#fff67b]/10 text-[#fff67b]"
                  : "border-gray-600 text-gray-400 hover:border-[#fff67b] hover:text-[#fff67b]"
              }`}
            >
              {user.role === "admin" ? "Admin" : "User"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
