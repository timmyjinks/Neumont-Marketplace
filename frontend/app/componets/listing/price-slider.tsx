"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

export type PriceRangeHandle = {
  getRange: () => [number, number];
};

type DragTarget = "min" | "max" | null;

type Props = {
  value: [number, number];
  onChange?: (range: [number, number]) => void;
};

const PriceRangeSlider = forwardRef<PriceRangeHandle, Props>(({ value, onChange }, ref) => {
  const [isDragging, setIsDragging] = useState<DragTarget>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [min, max] = value;

  useImperativeHandle(ref, () => ({
    getRange: () => value,
  }));

  const getValueFromPosition = useCallback((clientX: number): number => {
    if (!sliderRef.current) return 0;
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(percentage * 100);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const valueFromPos = getValueFromPosition(e.clientX);
      if (isDragging === "min") {
        const newMin = Math.min(valueFromPos, max - 1);
        if (onChange) onChange([newMin, max]);
      } else {
        const newMax = Math.max(valueFromPos, min + 1);
        if (onChange) onChange([min, newMax]);
      }
    },
    [isDragging, min, max, getValueFromPosition, onChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMouseDown = (thumb: DragTarget) => (e: React.MouseEvent) => {
    setIsDragging(thumb);
    e.preventDefault();
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    const valueFromPos = getValueFromPosition(e.clientX);
    const distanceToMin = Math.abs(valueFromPos - min);
    const distanceToMax = Math.abs(valueFromPos - max);
    if (distanceToMin < distanceToMax) {
      const newMin = Math.min(valueFromPos, max - 1);
      if (onChange) onChange([newMin, max]);
    } else {
      const newMax = Math.max(valueFromPos, min + 1);
      if (onChange) onChange([min, newMax]);
    }
  };

  const handleMinChange = (valueNum: number) => {
    const newMin = Math.min(valueNum, max - 1);
    if(newMin < 0) return
    if (onChange) onChange([newMin, max]);
  };

  const handleMaxChange = (valueNum: number) => {
    const newMax = Math.max(valueNum, min + 1);
    if(newMax > 100) return
    if (onChange) onChange([min, newMax]);
  };

  return (
    <div className="mt-6 mb-6">
      <label className="block text-sm font-medium text-zinc-300 mb-6">
        Price Range: ${min} - ${max}
      </label>
      <div className="relative mb-8">
        <div
          ref={sliderRef}
          className="relative h-2 bg-zinc-700 rounded-full cursor-pointer"
          onClick={handleTrackClick}
        >
          <div
            className="absolute h-2 bg-[#fedc04] rounded-full pointer-events-none"
            style={{ left: `${min}%`, width: `${max - min}%` }}
          />
          <div
            className={`absolute w-5 h-5 bg-zinc-900 border-2 border-[#fedc04] rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1.5 transition-transform duration-150 hover:scale-110 shadow-lg z-10 ${
              isDragging === "min" ? "scale-110 cursor-grabbing shadow-xl" : ""
            }`}
            style={{ left: `${min}%` }}
            onMouseDown={handleMouseDown("min")}
          />
          <div
            className={`absolute w-5 h-5 bg-zinc-900 border-2 border-[#fedc04] rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1.5 transition-transform duration-150 hover:scale-110 shadow-lg z-10 ${
              isDragging === "max" ? "scale-110 cursor-grabbing shadow-xl" : ""
            }`}
            style={{ left: `${max}%` }}
            onMouseDown={handleMouseDown("max")}
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1">Min</label>
          <input
            type="number"
            value={min}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="w-full rounded-lg px-3 py-2 bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            min={0}
            max={500}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1">Max</label>
          <input
            type="number"
            value={max}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="w-full rounded-lg px-3 py-2 bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            min={0}
            max={500}
          />
        </div>
      </div>
    </div>
  );
});

PriceRangeSlider.displayName = "PriceRangeSlider";
export default PriceRangeSlider;
