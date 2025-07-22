"use client";
import { useState } from "react";
import PriceRangeSlider from "./price-slider";

const categories = ["Electronics", "Clothing", "Books", "Other"];
const conditions = ["New", "Used"];
const sortOptions = ["Default", "Price: Low to High", "Price: High to Low"];

export default function FilterMenu() {
  const [externalRange, setExternalRange] = useState<[number, number]>([15, 65]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <aside className="w-64 bg-zinc-900 flex flex-col justify-between p-6 border-r border-zinc-800 shadow-lg">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-[#fedc04]">Filters</h2>

        <PriceRangeSlider onChange={(range) => setExternalRange(range)}/>

        {/* Category (Multi-Select) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
          <div className="space-y-2">
            {categories.map(cat => (
              <label key={cat} className="flex items-center text-sm text-white">
                <input
                  type="checkbox"
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="mr-2 accent-[#fedc04]"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Condition</label>
          <select className="block w-full rounded-md bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#fedc04]">
            <option value="">All</option>
            {conditions.map(cond => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Sort by</label>
          <select className="block w-full rounded-md bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#fedc04]">
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Apply Filters */}
        <div className="mt-4">
          <button className="w-full py-2 px-4 bg-[#fedc04] text-black font-bold rounded-md hover:bg-yellow-400 transition">
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
