"use client";
import { useState, useEffect } from "react";

export default function Message() {
    const [theme, setTheme] = useState("dark");
    
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) setTheme(storedTheme);
    }, []);

    return (
        <div
        className={`relative flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${
            theme === "dark" ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
        }`}
        >
            <aside className="w-32"></aside>
            <aside className="w-64">
                <div className="p-2">
                    <button className="w-full bg-zinc-700 text-white px-32 py-4 rounded-md shadow hover:bg-zinc-600 transition flex items-center justify-center gap-2">Username</button>
                </div>
                <div className="p-2">
                    <button className="w-full bg-zinc-700 text-white px-32 py-4 rounded-md shadow hover:bg-zinc-600 transition flex items-center justify-center gap-2">Username</button>
                </div>
            </aside>
            <main></main>
        </div>
    );
}