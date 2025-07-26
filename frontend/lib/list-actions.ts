"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function deleteItem(item_id: string) {
  console.log(item_id);
  const supabase = await createClient();
  const formData = new FormData();
  formData.append("item_id", item_id);

  const { data: { session } } = await supabase.auth.getSession();
  const { error } = await supabase.functions.invoke("delete-item", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${session?.access_token}`,
    },
    body: formData,
  });

  if (error) {
    redirect("/error");
  }
}