"use client";
import { useState } from "react";
import PriceRangeSlider from "@/app/componets/listing/price-slider";
import { useRouter } from "next/navigation";

const categories = ["Electronics", "Clothing", "Books", "Other"];

const conditions = ["New", "Used"];

const sortOptions = ["Default", "Price: Low to High", "Price: High to Low"];
const sortOptionsValues = ["all", "false", "true"];

interface FilterMenuProps {
  filters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    condition: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      category: string;
      minPrice: string;
      maxPrice: string;
      condition: string;
    }>
  >;
}

export default function FilterMenu({ filters, setFilters }: FilterMenuProps) {
  const router = useRouter();

  // Helper for category multi-select
  const selectedCategories = filters.category
    ? filters.category.split(",")
    : [];
  const toggleCategory = (category: string) => {
    let newCategories: string[];
    if (selectedCategories.includes(category)) {
      newCategories = selectedCategories.filter((c) => c !== category);
    } else {
      newCategories = [...selectedCategories, category];
    }
    setFilters((f) => ({ ...f, category: newCategories.join(",") }));
  };

  // Price range
  const minPrice = Number(filters.minPrice) || 0;
  const maxPrice = Number (filters.maxPrice) || 1000;
  const handlePriceChange = (range: [number, number]) => {
    setFilters((f) => ({
      ...f,
      minPrice: String(range[0]),
      maxPrice: String(range[1]),
    }));
  };

  // Condition
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((f) => ({ ...f, condition: e.target.value }));
  };

  // Sort (not implemented in parent, but keep UI)
  const [sortBy, setSortBy] = useState<string>("");

  async function handleApplyFilter() {
    // No-op: parent ListingPage already syncs filters to URL and fetches data
  }

  return (
    <aside className="w-64 bg-zinc-900 flex flex-col justify-between p-6 border-r border-zinc-800 shadow-lg">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-[#fedc04]">Filters</h2>
        <PriceRangeSlider
          value={[minPrice, maxPrice]}
          onChange={handlePriceChange}
        />
        {/* Category (Multi-Select) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Category
          </label>
          <div className="space-y-2">
            {categories.map((cat) => (
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
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Condition
          </label>
          <select
            value={filters.condition}
            onChange={handleConditionChange}
            className="block w-full rounded-md bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#fedc04]"
          >
            <option value="">All</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>
        {/* Sort By */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full rounded-md bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#fedc04]"
          >
            {sortOptions.map((option, i) => (
              <option key={option} value={sortOptionsValues[i]}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {/* Apply Filters */}
        <div className="mt-4">
          <button
            onClick={handleApplyFilter}
            className="w-full py-2 px-4 bg-[#fedc04] text-black font-bold rounded-md hover:bg-yellow-400 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
