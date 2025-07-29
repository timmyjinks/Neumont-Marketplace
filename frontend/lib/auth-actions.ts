"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/listings");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  if (formData.get("password") !== formData.get("confirmPassword")) {
    return;
  }
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/listings");
}

export async function getUserInfo() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  return user.data.user;
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
}

export async function signInWithDiscord() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: process.env.NEXT_PUBLIC_SUPABASE_CALLBACK!,
    },
  });

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  redirect("/");
}
