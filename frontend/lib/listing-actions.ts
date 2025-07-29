"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function deleteItem(item_id: string) {
  console.log(item_id);
  const supabase = await createClient();
  const formData = new FormData();
  formData.append("item_id", item_id);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { error } = await supabase.functions.invoke("delete-item", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: formData,
  });

  if (error) {
    redirect("/error");
  }
}
export async function get_listings(
  category: string,
  minPrice: string,
  maxPrice: string,
  condition: string,
) {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const response = await fetch(
    `https://ksumsqqkkkopawmtjzvz.supabase.co/functions/v1/get-all-items?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&condition=${condition}`,
    {
      headers: {
        Authorization: `Bearer ${session.data?.session?.access_token}`,
      },
    },
  );
  const data = await response.json();
  return data;
}
