// app/page.tsx
"use client";

import { useState } from "react";
import DateSlider from "@/components/DateSlider";
import { Navbar } from "@/components/Navbar";
import { MenuBar } from "@/components/MenuBar";
import {AvatarScene} from "@/components/AvatarScene";

export default function HomePage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  return (
    <div className="flex overflow-hidden flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <DateSlider onYearChange={setCurrentYear} />
        <div className="flex justify-center items-start p-4">
        <AvatarScene currentYear={currentYear} />
        </div>
      </main>
      <MenuBar />
    </div>
  );
}
