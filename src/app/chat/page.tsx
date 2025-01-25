"use client";

import { useState, useEffect } from 'react';
import { BasicChat } from "@/components/Chat";
import { Navbar } from "@/components/Navbar";

export default function ChatPage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#B9C7DC]">
      <Navbar />
      <main className="flex-grow">
        <div className="flex flex-col items-start justify-start min-h-screen p-4 overflow-hidden">
          <BasicChat userData={userData} />
        </div>
      </main>
    </div>
  );
}
