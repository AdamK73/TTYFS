"use client";

import React, { useRef, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const dummyUserData = {
  birthYear: 1990,
  lifeExpectancy: 80,
};

interface DateSliderProps {
  onYearChange: (year: number) => void;
}

const DateSlider: React.FC<DateSliderProps> = ({ onYearChange }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const startYear = dummyUserData.birthYear;
  const endYear = startYear + dummyUserData.lifeExpectancy;
  const totalYears = endYear - startYear;
  const ticksPerYear = 12; 
  const totalTicks = totalYears * ticksPerYear;

  useEffect(() => {
    if (sliderRef.current) {
      const yearPosition =
        ((selectedYear - startYear) / totalYears) *
        sliderRef.current.scrollWidth;
      sliderRef.current.scrollLeft =
        yearPosition - sliderRef.current.offsetWidth / 2;
    }
  }, [selectedYear, startYear, totalYears]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (sliderRef.current) {
      const scrollPosition =
        e.currentTarget.scrollLeft + e.currentTarget.offsetWidth / 2;
      const newYear = Math.round(
        startYear + (scrollPosition / e.currentTarget.scrollWidth) * totalYears
      );
      setSelectedYear(newYear);
      onYearChange(newYear);
    }
  };

  const getTickColor = (index: number) => {
    if (index % ticksPerYear === 0) return "black";
    if (index % (ticksPerYear / 2) === 0) return "rgba(0,0,0,0.5)";
    return "rgba(0,0,0,0.3)";
  };

  const currentAge = selectedYear - dummyUserData.birthYear;

  return (
    <div className="w-full bg-gray-50 py-4">
      <div className="flex justify-between text-gray-800 my-4 px-4">
        <span>{startYear}</span>
        <Badge>
          {" "}
          <span className="font-bold">{selectedYear}</span>
        </Badge>
        <span>{endYear}</span>
      </div>
      <div
        ref={sliderRef}
        className="overflow-x-auto whitespace-nowrap"
        onScroll={handleScroll}
        style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        <div
          className="inline-block"
          style={{ width: `${totalTicks * 5}px`, height: "30px" }}
        >
          {[...Array(totalTicks + 1)].map((_, index) => {
            const isMajorTick = index % ticksPerYear === 0;
            return (
              <div
                key={index}
                className={`inline-block w-[5px] ${
                  isMajorTick ? "h-full" : "h-1/2 mt-[15px]"
                }`}
                style={{
                  borderLeft: `1px solid ${getTickColor(index)}`,
                }}
              />
            );
          })}
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DateSlider;
