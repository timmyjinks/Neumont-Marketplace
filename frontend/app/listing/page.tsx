import Image from "next/image";
import {ListingItems} from "@/app/components/listingItems";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <aside className="w-full md:w-1/5 bg-gray-400 p-4 flex flex-col gap-4">
        <div className="bg-white h-8 rounded-sm" />
        <div className="bg-white h-6 rounded-full" />

        <div className="flex flex-col gap-2 mt-4">
          <div className="bg-white h-4 w-3/4 rounded-sm" />
          <div className="bg-white h-4 w-3/4 rounded-sm" />
          <div className="bg-white h-4 w-3/4 rounded-sm" />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <div className="bg-white h-5 rounded-sm" />
          <div className="bg-white h-5 rounded-sm" />
          <div className="bg-white h-5 rounded-sm" />
        </div>
      </aside>

      <ListingItems/>
      <main className="flex-1 p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-blue-400 h-48 flex items-end justify-center rounded overflow-hidden"
          >
            <div className="bg-gray-400 h-6 w-full" />
          </div>
        ))}
      </main>
    </div>
  );
}