"use client";
import { useEffect, useState } from "react";
import Card from "@/app/componets/listing/card";
import FilterMenu from "@/app/componets/listing/filter-menu";
import { get_listings } from "@/lib/listing-actions";
import { useRouter, useSearchParams } from "next/navigation";

export default function ListingPage() {
  const router = useRouter();
  const params = useSearchParams();

  // Initialize state from query params
  const [filters, setFilters] = useState({
    category: params.get("category") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    condition: params.get("condition") || "",
  });
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Update URL when filters change
  useEffect(() => {
    const query = new URLSearchParams(
      filters as Record<string, string>,
    ).toString();
    router.push(`?${query}`);
  }, [filters, router]);

  // Fetch listings when filters change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await get_listings(
          filters.category,
          filters.minPrice,
          filters.maxPrice,
          filters.condition,
        );
        setListings(data.data || []);
        setError("");
      } catch (err) {
        setError("Failed to Load Listings...");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filters]);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <FilterMenu filters={filters} setFilters={setFilters} />

      {/* Listings Grid */}
      <main className="flex-grow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#fedc04]">
            Featured Listings
          </h1>
          <p className="text-zinc-400">{listings.length} items</p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-zinc-400">Loading...</p>
          </div>
        ) : !error ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((card, i) => (
              <div
                key={i}
                className="hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <Card
                  image_url={card.image_url}
                  item_name={card.item_name}
                  price={card.price}
                  category={card.category}
                  description={card.description}
                  payment_methods={card.payment_methods}
                  onDelete={null} // This codebase is on hopes and prayers
                  id={card.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>Error</p>
        )}
      </main>
    </div>
  );
}
