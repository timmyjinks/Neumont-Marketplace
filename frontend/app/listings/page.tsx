"use client";
import { useEffect, useState } from "react";
import Card from "@/app/componets/listing/card";
import FilterMenu from "@/app/componets/listing/filter-menu";
import { get_listings } from "@/lib/listing-actions";
import { useRouter, useSearchParams } from "next/navigation";
import Chat from "../componets/chat";
import { createClient } from "@/lib/supabase/client";

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
  const [userUuid, setUserUuid] = useState("");
  useEffect(() => {
          const getUUID = async () => {
              const supabase = createClient();
              const { data, error } = await supabase.auth.getUser();
              if (data?.user) {
                  setUserUuid(data.user.id);
              } else {
                  console.error('Failed to get user UUID:', error);
                  setError('Unable to authenticate user.');
              }
          };
          getUUID();
      }, []);

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
        console.log(data);
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
                  price={card.price}
                  category={card.category}
                  description={card.description}
                  payment_methods={card.payment_methods}
                  onDelete={null}
                  onMessage={()=>{
                    createChat(card.item_name,[card.user_id,userUuid])
                  }}
                  id={card.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>Error</p>
        )}
      </main>
      <Chat />
    </div>
  );
}


async function createChat(itemName: string, participantIds: string[]) {
    const response = await fetch('http://0.0.0.:10101/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: itemName,
        participants: participantIds,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create chat');
    }

}

