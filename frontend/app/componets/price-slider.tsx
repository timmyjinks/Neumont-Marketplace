"use client";
import { useEffect, useRef, useState } from "react";
import noUiSlider from "nouislider";

export default function PriceRangeSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([15, 65]);
  interface NoUiSliderElement extends HTMLDivElement {
    noUiSlider: any;
  }

  useEffect(() => {
    if (!sliderRef.current) return;

    // Only init once
    if (sliderRef.current && !(sliderRef.current as NoUiSliderElement).noUiSlider) {
        noUiSlider.create(sliderRef.current, {
        start: priceRange,
        connect: true,
        range: {
          min: 0,
          max: 100,
        },
        tooltips: [true, true],
        format: {
          to: (value) => Math.round(value),
          from: (value) => Number(value),
        },
        cssClasses: {
            target: "relative h-2 rounded-full bg-neutral/10 range-slider-disabled:pointer-events-none range-slider-disabled:opacity-50",
            base: "size-full relative z-1",
            origin: "absolute top-0 end-0 rtl:start-0 size-full origin-[0_0] rounded-full",
            handle: "absolute top-1/2 end-0 rtl:start-0 size-4 bg-base-100 border-[3px] border-primary rounded-full translate-x-2/4 -translate-y-2/4 hover:cursor-grab active:cursor-grabbing hover:ring-2 ring-primary active:ring-[3px]",
            connects: "relative z-0 w-full h-2 overflow-hidden",
            connect: "absolute top-0 end-0 rtl:start-0 z-1 size-full bg-primary origin-[0_0]",
            touchArea: "absolute -top-1 -bottom-1 -start-1 -end-1",
            tooltip: "bg-neutral text-sm text-neutral-content shadow-base-300/20 py-1 px-2 rounded-selector mb-3 absolute bottom-full start-2/4 -translate-x-2/4 rtl:translate-x-2/4 shadow-md",
            handleLower: "",
            handleUpper: "",
            horizontal: "",
            vertical: "",
            background: "",
            ltr: "",
            rtl: "",
            textDirectionLtr: "",
            textDirectionRtl: "",
            draggable: "",
            drag: "",
            tap: "",
            active: "",
            pips: "",
            pipsHorizontal: "",
            pipsVertical: "",
            marker: "",
            markerHorizontal: "",
            markerVertical: "",
            markerNormal: "",
            markerLarge: "",
            markerSub: "",
            value: "",
            valueHorizontal: "",
            valueVertical: "",
            valueNormal: "",
            valueLarge: "",
            valueSub: ""
        },
      });

      (sliderRef.current as NoUiSliderElement).noUiSlider?.on("update", (values: string[]) => {
        const min = parseInt(values[0] as string);
        const max = parseInt(values[1] as string);
        setPriceRange([min, max]);
      });
    }
  }, [sliderRef]);

  return (
    <div className="mt-6 mb-4">
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Price Range
      </label>

      <div className="flex items-center justify-between gap-2 mb-3">
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) =>
            setPriceRange([Number(e.target.value), priceRange[1]])
          }
          className="w-1/2 rounded-md px-2 py-1 bg-zinc-800 text-white border border-zinc-600 focus:outline-none"
        />
        <span className="text-white">-</span>
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
          className="w-1/2 rounded-md px-2 py-1 bg-zinc-800 text-white border border-zinc-600 focus:outline-none"
        />
      </div>

      <div ref={sliderRef} className="sm:mt-7 mt-10"></div>
    </div>
  );
}
