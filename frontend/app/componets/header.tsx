"use client";
import Link from "next/link";
import Image from "next/image";
import profile from "@/public/profile-t.png";
import chat from "@/public/chat-bubble.png";
import logo from "@/public/logo.png";

export default function Header() {
  return (
    <header className="bg-zinc-900 text-white px-6 py-4 shadow-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Left: Logo & Text */}
        <div className="flex items-center gap-4">
          <Link href="/listings" className="shrink-0">
            <Image
              src={logo}
              alt="Logo"
              width={48}
              height={48}
              className="rounded-full object-contain"
            />
          </Link>
          <div className="leading-tight">
            <h1 className="text-2xl font-bold text-[#fedc04]">Neumont Marketplace</h1>
            <p className="text-sm text-zinc-400 hidden sm:block">
              Buy, sell, and thrive with your campus crew
            </p>
          </div>
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/chat">
            <Image
              src={chat}
              alt="Chat"
              width={40}
              height={40}
              className="p-1 rounded-full border border-[#fedc04] bg-zinc-800 hover:bg-[#fedc04] transition duration-300 ease-in-out"
            />
          </Link>
          <Link href="/profile" className="shrink-0">
            <Image
              src={profile}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border border-[#fedc04] bg-zinc-800 hover:bg-[#fedc04] transition duration-300 ease-in-out"
            />
          </Link>
        </div>

      </div>
    </header>
  );
}