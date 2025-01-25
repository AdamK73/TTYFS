"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PersonSimpleWalk } from "@phosphor-icons/react";

const Hero = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div className="relative flex flex-col justify-center items-center text-center min-h-screen bg-[#B9C7DC] text-gray-900">
      <div className="container mx-auto max-w-2xl p-8">
        <Badge variant="default" className="px-3 text-[#5E682A] bg-[#E9FF70] mb-3" >SK INNOVATIONS prototype!</Badge>
        <h1 className="text-4xl text-[#0A0B0C] font-bold mb-6">
          Shape your future{' '}
          <span className="text-4xl italic text-[#0A0B0C] font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            self
          </span>
        </h1>
        <p className="text-lg mb-4 text-[#484E57]">
          Explore and visualize your life's key aspects through AI-powered insights.
        </p>
        <Button
          onClick={() => router.push(currentUser ? '/dashboard' : '/onboarding')}
          className="bg-[#EEE7C3] text-gray-900 rounded-full py-4 px-8 font-semibold hover:bg-[#FFE7D5] transition duration-300"
          size="lg"
        >
          <PersonSimpleWalk className="mr-2 h-5 w-5" />
          Start your journey
        </Button>
       
      </div>
      <div className="mt-12 md:m-5">
        <img src="/showcase.png" alt="Showcase"  className="w-full  max-w-lg mx-auto rounded-lg " />
      </div>
    </div>
  );
};

export default Hero;
