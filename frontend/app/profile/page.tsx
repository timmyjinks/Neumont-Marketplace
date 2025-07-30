"use client";
import Image from "next/image";
import bgImg from "@/public/Neumontt.jpg";
import SideBar from "@/app/componets/profile-side";
import { useState, useEffect } from "react";
import Card from "@/app/componets/listing/card";
import { createClient } from "@/lib/supabase/client";
import { deleteItem } from "@/lib/listing-actions";
import Header from "@/app/componets/header";

const categories = ["Electronics", "Clothing", "Books", "Other"];

export default function ProfileDashboard() {
  const [theme, setTheme] = useState("dark");
  const [modalOpen, setModalOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [user, setUser] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [price, setPrice] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
    async function getItems() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke(
        "get-items-by-user-id",
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      );
      setItems(data);
    }
    getItems();
  }, []);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      setUser(data.user);
    }
    getUser();
  }, [theme]);

  return (

    <div>
      <Header />    
      <div
      className={`relative flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
      }`}
    >
      {/* Main Content */}
      <main className="relative flex flex-col flex-1 overflow-y-auto p-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col items-center">
          <Image
            src={bgImg}
            alt="Profile Pic"
            width={150}
            height={150}
            className="rounded-full border-4 border-yellow-400 shadow-lg mb-4"
          />
          <h1 className="text-4xl font-extrabold text-yellow-400">
            {user?.name}
          </h1>
          <p className="text-zinc-400 dark:text-zinc-400 text-sm">
            {user?.email}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Profile Info */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition duration-300">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              📄 Profile Info
            </h2>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li>Username: {user?.email}</li>
              <li>Email: {user?.email}</li>
              <li>Joined: {new Date(user?.created_at).toLocaleDateString()}</li>
            </ul>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition duration-300">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              ⚙️ Preferences
            </h2>
            <ul className="space-y-4 text-zinc-700 dark:text-white">
              <li className="flex flex-col">
                <span className="font-medium mb-1">Theme:</span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </li>
              <li>Language: English</li>
            </ul>
          </div>
        </div>

        {/* User Listings */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-yellow-400">
              Your Listings
            </h2>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded-lg shadow transition"
              onClick={() => setModalOpen(true)}
            >
              + Create Listing
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((listing, idx) => (
              <div key={idx}>
                <Card {...listing} onDelete={deleteItem} />
              </div>
            ))}
          </div>
          {/* Modal with form */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 w-full max-w-lg relative">
                <button
                  className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-2xl font-bold"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">
                  Create Listing
                </h2>
                <form
                  onSubmit={async (e) => {
                    if (
                      !itemName ||
                      !description ||
                      !imageFile ||
                      !category ||
                      paymentMethods.length === 0 ||
                      !price ||
                      isNaN(Number(price)) ||
                      Number(price) <= 0
                    ) {
                      setFormError(
                        "All fields are required and price must be positive.",
                      );
                      return;
                    }
                    setFormError("");
                    setIsSubmitting(true);
                    try {
                      const supabase = createClient();
                      const {
                        data: { session },
                      } = await supabase.auth.getSession();
                      const formData = new FormData();
                      formData.append("item_name", itemName);
                      formData.append("description", description);
                      formData.append("image", imageFile);
                      formData.append("category", category);
                      formData.append(
                        "payment_methods",
                        JSON.stringify({ data: paymentMethods }),
                      );
                      formData.append("user_id", user?.id || "");
                      formData.append("price", price);
                      const response = await supabase.functions.invoke(
                        "insert-item",
                        {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${session?.access_token}`,
                          },
                          body: formData,
                        },
                      );
                      if (response.error) {
                        setFormError(
                          response.error.message || "Failed to create listing.",
                        );
                        setIsSubmitting(false);
                        return;
                      }
                      // Reset form and close modal
                      setItemName("");
                      setDescription("");
                      setImageFile(null);
                      setCategory("");
                      setPaymentMethods([]);
                      setPrice("");
                      setModalOpen(false);
                    } catch (err: any) {
                      setFormError(err?.message || "Unknown error");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white"
                      onChange={(e) => {
                        const files = e.target.files;
                        const file = files && files[0];
                        setImageFile(file || null);
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={handleConditionChange}
                      className="block w-full rounded-md bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#fedc04]"
                    >
                      {categories.map((cond) => (
                        <option key={cond} value={cond}>
                          {cond}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Payment Methods
                    </label>
                    <div className="flex gap-4">
                      {["Cash", "Venmo", "PayPal", "Other"].map((method) => (
                        <label key={method} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={paymentMethods.includes(method)}
                            onChange={() =>
                              setPaymentMethods((prev) =>
                                prev.includes(method)
                                  ? prev.filter((m) => m !== method)
                                  : [...prev, method],
                              )
                            }
                          />
                          {method}
                        </label>
                      ))}
                    </div>
                  </div>
                  {formError && (
                    <div className="text-red-500 text-sm">{formError}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-yellow-400 text-zinc-900 font-bold py-2 px-4 rounded-lg shadow hover:bg-yellow-300 transition"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Listing"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    </div>

  );
}
