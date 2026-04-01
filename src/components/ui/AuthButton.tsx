"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("discord")}
        className="px-3 py-1.5 rounded-md text-sm font-medium bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors duration-200 cursor-pointer"
      >
        Sign in with Discord
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 cursor-pointer"
      >
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-sm text-white hidden sm:inline">
          {session.user.name}
        </span>
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#010090] rounded-md shadow-lg py-1 z-50">
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-800 cursor-pointer"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
