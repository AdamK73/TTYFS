"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Book,
  Heart,
  Heartbeat,
  Briefcase,
  BabyCarriage,
  Coins,
  User,
  Star,
  Island,
  TextAa,
} from "@phosphor-icons/react";

interface Aspect {
  id: number;
  name: string;
  importance: number;
  color: string;
  icon: React.ElementType;
}

const userProfile = {
  birthYear: 1990,
  lifeExpectancy: 80,
  pictures: {
    young: "/baby.jpg",
    adult: "/kid.jpg",
    middleAged: "/adult.jpeg",
    senior: "/old.jpg",
  },
  lifeStages: [
    {
      startAge: 0,
      endAge: 20,
      aspects: [
        {
          id: 1,
          name: "Education",
          importance: 1,
          color: "gray-800",
          icon: TextAa,
        },
        {
          id: 2,
          name: "Family",
          importance: 0.8,
          color: "#CBD5E1",
          icon: Heart,
        },
        {
          id: 3,
          name: "Health",
          importance: 0.7,
          color: "#E2E8F0",
          icon: Heartbeat,
        },
      ],
    },
    {
      startAge: 21,
      endAge: 40,
      aspects: [
        {
          id: 1,
          name: "Career",
          importance: 0.9,
          color: "#45422F",
          icon: Briefcase,
        },
        {
          id: 2,
          name: "Relationships",
          importance: 0.8,
          color: "#371C73",
          icon: BabyCarriage,
        },
        {
          id: 3,
          name: "Finance",
          importance: 0.7,
          color: "#1D2A61",
          icon: Coins,
        },
        {
          id: 4,
          name: "Health",
          importance: 0.6,
          color: "#5A1818",
          icon: Heartbeat,
        },
        {
          id: 5,
          name: "Personal Growth",
          importance: 0.5,
          color: "gray-800",
          icon: User,
        },
      ],
    },
    {
      startAge: 41,
      endAge: 60,
      aspects: [
        {
          id: 1,
          name: "Family",
          importance: 0.9,
          color: "#A0A0A0",
          icon: BabyCarriage,
        },
        {
          id: 2,
          name: "Health",
          importance: 0.8,
          color: "#909090",
          icon: Heartbeat,
        },
        {
          id: 3,
          name: "Finance",
          importance: 0.7,
          color: "#808080",
          icon: Coins,
        },
        {
          id: 4,
          name: "Personal Growth",
          importance: 0.6,
          color: "#707070",
          icon: Star,
        },
      ],
    },
    {
      startAge: 61,
      endAge: 80,
      aspects: [
        {
          id: 1,
          name: "Health",
          importance: 1,
          color: "#909090",
          icon: Heartbeat,
        },
        {
          id: 2,
          name: "Family",
          importance: 0.9,
          color: "#808080",
          icon: BabyCarriage,
        },
        {
          id: 3,
          name: "Leisure",
          importance: 0.8,
          color: "#707070",
          icon: Island,
        },
      ],
    },
  ],
};

const aspectInfo = {
  Education: "Focus on learning and personal development.",
  Family: "Nurture relationships with loved ones.",
  Health: "Maintain physical and mental well-being.",
  Career: "Pursue professional growth and accomplishments.",
  Relationships: "Build and maintain meaningful connections.",
  Finance: "Manage and grow your financial resources.",
  "Personal Growth": "Continuous self-improvement and exploration.",
  Leisure: "Enjoy recreational activities and relaxation.",
};

export function LifeAspects({ currentYear }: { currentYear: number }) {
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [userPicture, setUserPicture] = useState<string>("");
  const [blurAmount, setBlurAmount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(0);

  useEffect(() => {
    const age = currentYear - userProfile.birthYear;
    const currentLifeStage = userProfile.lifeStages.find(
      (stage) => age >= stage.startAge && age <= stage.endAge
    );
    setAspects(currentLifeStage?.aspects || []);

    if (age <= 20) setUserPicture(userProfile.pictures.young);
    else if (age <= 40) setUserPicture(userProfile.pictures.adult);
    else if (age <= 60) setUserPicture(userProfile.pictures.middleAged);
    else setUserPicture(userProfile.pictures.senior);

    const blurStart = userProfile.lifeExpectancy - 20; 
    if (age > blurStart) {
      const maxBlur = 10;
      const blurRange = userProfile.lifeExpectancy - blurStart;
      const blurProgress = Math.min(age - blurStart, blurRange) / blurRange;
      setBlurAmount(blurProgress * maxBlur);
    } else {
      setBlurAmount(0);
    }
  }, [currentYear]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize(Math.min(width, height));
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const calculatePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = containerSize * 0.46;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className="relative w-full  aspect-square max-w-md mx-auto"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full overflow-hidden border-4 border-gray-300">
          <Image
            src={userPicture}
            alt="User Avatar"
            fill
            style={{ objectFit: "cover", filter: `blur(${blurAmount}px)` }}
          />
        </div>
        {aspects.map((aspect, index) => {
          const { x, y } = calculatePosition(index, aspects.length);
          const Icon = aspect.icon;
          const size = 60 + aspect.importance * 40;

          return (
            <Popover key={aspect.id}>
              <PopoverTrigger asChild>
                <motion.div
                  className="absolute top-1/2 left-1/2 cursor-pointer"
                  style={{
                    x,
                    y,
                    width: size,
                    height: size,
                    marginTop: -size / 2,
                    marginLeft: -size / 2,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: "#111827" }}
                  >
                    <Icon
                      weight="fill"
                      className="text-white"
                      style={{ fontSize: size * 0.5 }}
                    />
                  </div>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h3 className="font-semibold">{aspect.name}</h3>
                  <p className="text-sm text-gray-500">
                    {aspectInfo[aspect.name as keyof typeof aspectInfo]}
                  </p>
                  <p className="text-sm">
                    Importance: {aspect.importance.toFixed(2)}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
