"use client";
import Image from "next/image";
import bgImg from "@/public/Neumontt.jpg";
import { useState } from "react";
import PriceRangeSlider from "./price-slider";

const categories = ["Electronics", "Clothing", "Books", "Other"];
const conditions = ["New", "Used"];
const sortOptions = ["Default", "Price: Low to High", "Price: High to Low"];

export default function FilterMenu() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleMinChange = (value: number) => {
    if (value <= maxPrice) setMinPrice(value);
  };

  const handleMaxChange = (value: number) => {
    if (value >= minPrice) setMaxPrice(value);
  };

  return (
    <aside className="w-64 bg-zinc-900 flex flex-col justify-between p-6 border-r border-zinc-800 shadow-lg">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-[#fedc04]">Filters</h2>
        <PriceRangeSlider />
        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Price Range</label>

          <div className="flex items-center justify-between gap-2 mb-3">
            <input
              type="number"
              value={minPrice}
              onChange={e => handleMinChange(Number(e.target.value))}
              className="w-1/2 rounded-md px-2 py-1 bg-zinc-800 text-white border border-zinc-600 focus:outline-none"
              min={0}
            />
            <span className="text-white">-</span>
            <input
              type="number"
              value={maxPrice}
              onChange={e => handleMaxChange(Number(e.target.value))}
              className="w-1/2 rounded-md px-2 py-1 bg-zinc-800 text-white border border-zinc-600 focus:outline-none"
              min={0}
            />
          </div>

          <div className="relative h-6 mt-2">
            <input
              type="range"
              min={0}
              max={1000}
              value={minPrice}
              onChange={e => handleMinChange(Number(e.target.value))}
              className="absolute w-full h-2 bg-gray-700 appearance-none pointer-events-auto z-10"
            />
            <input
              type="range"
              min={0}
              max={1000}
              value={maxPrice}
              onChange={e => handleMaxChange(Number(e.target.value))}
              className="absolute w-full h-2 bg-gray-700 appearance-none pointer-events-auto z-10"
            />
          </div>
        </div>

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
