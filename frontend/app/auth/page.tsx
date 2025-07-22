"use client"
import { useSearchParams } from "next/navigation";

export default function Confirm() {
    const token_hash = useSearchParams().get("token_hash");
    return (
        <div>
            <h2>Confirm your signup</h2>
            <p>Follow this link to confirm your user:</p>
            <p><a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/confirm?token_hash=${token_hash}&type=email`}>Confirm your mail</a></p>
        </div>
    )
}