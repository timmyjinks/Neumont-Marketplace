"use server";
import { createClient } from "@/lib/supabase/server";

export async function get_listings(category: string, minPrice: string, maxPrice: string, condition: string) {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const response = await fetch(`https://ksumsqqkkkopawmtjzvz.supabase.co/functions/v1/get-all-items?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&condition=${condition}`, {
    headers: {
      "Authorization": `Bearer ${session.data?.session?.access_token}`,
    },
  });
  const data = await response.json();
  return data;
}
