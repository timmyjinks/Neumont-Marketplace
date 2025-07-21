import Image from "next/image";
import {ListingItems} from "@/app/components/listingItems";
import {AppSidebar} from "@/app/components/sideMenu"

export default function Home() {
  return (
    

    <main>
      <AppSidebar></AppSidebar>
      <div className="flex p-4 grid grid-cols-1 gap-4 AlignCenter">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}
            className="bg-black h-100 flex items-end justify-center AlignCenter rounded overflow-hidden w-200" >
            <ListingItems></ListingItems>
          </div>
        ))}
      </div>
    </main>
  );
}