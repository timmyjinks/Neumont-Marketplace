import Image from "next/image";
import {ListingItems} from "@/app/components/listingItems";
import { AlignCenter, AlignLeft } from "lucide-react";

export default function Home() {
  return (
    // <div className="flex flex-col md:flex-row h-screen bg-gray-100">
    //   <aside className="w-full md:w-1/5 bg-gray-400 p-4 flex flex-col gap-4">
    //     <div className="bg-white h-8 rounded-sm" />
    //     <div className="bg-white h-6 rounded-full" />

    //     <div className="flex flex-col gap-2 mt-4">
    //       <div className="bg-white h-4 w-3/4 rounded-sm" />
    //       <div className="bg-white h-4 w-3/4 rounded-sm" />
    //       <div className="bg-white h-4 w-3/4 rounded-sm" />
    //     </div>

    //     <div className="flex flex-col gap-2 mt-4">
    //       <div className="bg-white h-5 rounded-sm" />
    //       <div className="bg-white h-5 rounded-sm" />
    //       <div className="bg-white h-5 rounded-sm" />
    //     </div>
    //   </aside>

    <main className="flex p-4 grid grid-cols-1 gap-4 AlignCenter">

        {/* {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-blue-400 h-48 flex items-end justify-center rounded overflow-hidden"
          >
            <div className="bg-gray-400 h-6 w-full" />
          </div>
        ))} */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}
            className="bg-black h-100 flex items-end justify-center AlignCenter rounded overflow-hidden w-200" >
            <ListingItems></ListingItems>
          </div>
        ))}
      </main>
    // </div>
  );
}