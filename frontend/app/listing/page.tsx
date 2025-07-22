"use client";
import { useState } from "react";
import Card from "@/app/componets/card";
import ProfileSide, { profileSide } from "@/app/componets/profile-side";

const data = [
  {
    src: "/image1.jpg",
    category: "Tech",
    description: "First image in the flow",
  },
  {
    src: "/image2.jpg",
    category: "Design",
    description: "Second image doin its thing",
  },
  {
    src: "/image3.jpg",
    category: "Motion",
    description: "Third one peeking in",
  },
  {
    src: "/image4.jpg",
    category: "Flow",
    description: "Fourth and wild",
  },
];

export default function CardCarousel() {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  const next = () =>
    setIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));

  const getCardStyle = (i: number) => {
    const offset = i - index;
    return `
      absolute transition-all duration-500 ease-in-out
      ${offset === 0 ? "z-20 scale-100" : "z-10 scale-90 opacity-60"}
      ${offset === -1 ? "-translate-x-40" : ""}
      ${offset === 1 ? "translate-x-40" : ""}
      ${Math.abs(offset) > 1 ? "opacity-0 scale-75" : ""}
    `;
  };

  return (
    <div className="relative w-full h-96 flex items-center justify-center overflow-hidden">
      <ProfileSide />
      <div className="relative w-72 h-full">
        {data.map((card, i) => (
          <div key={i} className={getCardStyle(i)}>
            <Card {...card} />
          </div>
        ))}
      </div>
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <button onClick={prev} className="text-3xl text-yellow-400">←</button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button onClick={next} className="text-3xl text-yellow-400">→</button>
      </div>
    </div>
  );
}
