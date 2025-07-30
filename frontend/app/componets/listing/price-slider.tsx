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

const MAX_SLIDER_LIMIT = 100;

const PriceRangeSlider = forwardRef<PriceRangeHandle, Props>(({ value, onChange }, ref) => {
  const [isDragging, setIsDragging] = useState<DragTarget>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [min, max] = value;

  const [minInputValue, setMinInputValue] = useState(String(min));
  const [maxInputValue, setMaxInputValue] = useState(String(max));

  useEffect(() => setMinInputValue(String(min)), [min]);
  useEffect(() => setMaxInputValue(String(max)), [max]);

  useImperativeHandle(ref, () => ({
    getRange: () => value,
  }));

  const getValueFromPosition = useCallback((clientX: number): number => {
    if (!sliderRef.current) return 0;
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(percentage * MAX_SLIDER_LIMIT);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const valueFromPos = getValueFromPosition(e.clientX);
      if (isDragging === "min") {
        const newMin = Math.min(valueFromPos, max - 1);
        onChange?.([newMin, max]);
      } else {
        const newMax = Math.max(valueFromPos, min + 1);
        onChange?.([min, newMax]);
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
      onChange?.([newMin, max]);
    } else {
      const newMax = Math.max(valueFromPos, min + 1);
      onChange?.([min, newMax]);
    }
  };

  // --- INPUT HANDLERS ---

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinInputValue(value);
    const num = Number(value);
    if (!isNaN(num) && num < max) {
      onChange?.([num, max]);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxInputValue(value);
    const num = Number(value);
    if (!isNaN(num) && num > min) {
      onChange?.([min, num]);
    }
  };

  const handleMinInputBlur = () => {
    let num = Number(minInputValue);
    if (isNaN(num)) num = 0;
    const clamped = Math.max(Math.min(num, max - 1), 0);
    setMinInputValue(String(clamped));
    onChange?.([clamped, max]);
  };

  const handleMaxInputBlur = () => {
    let num = Number(maxInputValue);
    if (isNaN(num)) num = min + 1;
    const clamped = Math.min(Math.max(num, min + 1), MAX_SLIDER_LIMIT);
    setMaxInputValue(String(clamped));
    onChange?.([min, clamped]);
  };

  // Clamp slider visuals ONLY (not raw values)
  const clampedMin = Math.max(0, Math.min(min, MAX_SLIDER_LIMIT));
  const clampedMax = Math.max(clampedMin + 1, Math.min(max, MAX_SLIDER_LIMIT));

  return (
    <div className="mt-6 mb-6">
      <label className="block text-sm font-medium text-zinc-300 mb-6">
        Price Range: ${min} - {max >= MAX_SLIDER_LIMIT ? `${max}+` : `$${max}`}
      </label>

      <div className="relative mb-8">
        <div
          ref={sliderRef}
          className="relative h-2 bg-zinc-700 rounded-full cursor-pointer"
          onClick={handleTrackClick}
        >
          <div
            className="absolute h-2 bg-[#fedc04] rounded-full pointer-events-none"
            style={{ left: `${clampedMin}%`, width: `${clampedMax - clampedMin}%` }}
          />

          <div
            className={`absolute w-5 h-5 bg-zinc-900 border-2 border-[#fedc04] rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1.5 transition-transform duration-150 hover:scale-110 shadow-lg z-10 ${
              isDragging === "min" ? "scale-110 cursor-grabbing shadow-xl" : ""
            }`}
            style={{ left: `${clampedMin}%` }}
            onMouseDown={handleMouseDown("min")}
          />

          <div
            className={`absolute w-5 h-5 bg-zinc-900 border-2 border-[#fedc04] rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1.5 transition-transform duration-150 hover:scale-110 shadow-lg z-10 ${
              isDragging === "max" ? "scale-110 cursor-grabbing shadow-xl" : ""
            }`}
            style={{ left: `${clampedMax}%` }}
            onMouseDown={handleMouseDown("max")}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1">Min</label>
          <input
            type="number"
            value={minInputValue}
            onChange={handleMinInputChange}
            onBlur={handleMinInputBlur}
            className="w-full rounded-lg px-3 py-2 bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            min={0}
            max={MAX_SLIDER_LIMIT}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1">Max</label>
          <input
            type="number"
            value={maxInputValue}
            onChange={handleMaxInputChange}
            onBlur={handleMaxInputBlur}
            className="w-full rounded-lg px-3 py-2 bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            min={0}
            max={MAX_SLIDER_LIMIT}
          />
        </div>
      </div>
    </div>
  );
});

PriceRangeSlider.displayName = "PriceRangeSlider";
export default PriceRangeSlider;
