"use client";
import Image from "next/image";
import bgImg from "@/public/Neumontt.jpg";
import SideBar from "@/app/componets/Profile-side";
import { useState, useEffect } from "react";

export default function ProfileDashboard() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      className={`relative flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
      }`}
    >
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="relative flex flex-col flex-1 overflow-y-auto p-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col items-center">
          <Image
            src={bgImg}
            alt="Profile Pic"
            width={150}
            height={150}
            className="rounded-full border-4 border-yellow-400 shadow-lg mb-4"
          />
          <h1 className="text-4xl font-extrabold text-yellow-400">John Doe</h1>
          <p className="text-zinc-400 dark:text-zinc-400 text-sm">@johndoe | johndoe@example.com</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Profile Info */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition duration-300">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">📄 Profile Info</h2>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li>Username: johndoe</li>
              <li>Email: johndoe@example.com</li>
              <li>Joined: Jan 2024</li>
            </ul>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition duration-300">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">⚙️ Preferences</h2>
            <ul className="space-y-4 text-zinc-700 dark:text-white">
              <li className="flex flex-col">
                <span className="font-medium mb-1">Theme:</span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </li>
              <li>Language: English</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}