"use client";
import { useState } from "react";
import Card from "@/app/componets/listing/card";
import FilterMenu from "@/app/componets/listing/filter-menu";

const data = [
  {
    src: "/image1.jpg",
    category: "Tech",
    description: "First image in the flow",
  },
  {
    src: "/image2.jpg",
    category: "Design",
    description: "Second image doin its thing",
  },
  {
    src: "/image3.jpg",
    category: "Motion",
    description: "Third one peeking in",
  },
  {
    src: "/image4.jpg",
    category: "Flow",
    description: "Fourth and wild",
  },
  {
    src: "/image1.jpg",
    category: "Tech",
    description: "Remix this one",
  },
  {
    src: "/image2.jpg",
    category: "Design",
    description: "Doubling down",
  },
];

export default function ListingPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // For future filter logic

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <FilterMenu />

      {/* Listings Grid */}
      <main className="flex-grow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#fedc04]">Featured Listings</h1>
          <p className="text-zinc-400">{data.length} items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((card, i) => (
            <div
              key={i}
              className="hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <Card {...card} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
