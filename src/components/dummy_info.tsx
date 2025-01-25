// ./dummyInfo.ts
import { TextAa, Heart, Heartbeat, Briefcase, BabyCarriage, Coins, User, Star, Island } from "@phosphor-icons/react";

export interface Aspect {
  id: number;
  name: string;
  importance: number;
  color: string;
  icon: React.ElementType;
}

export interface LifeStage {
  startAge: number;
  endAge: number;
  aspects: Aspect[];
}

export interface UserProfile {
  birthYear: number;
  lifeExpectancy: number;
  pictures: {
    young: string;
    adult: string;
    middleAged: string;
    senior: string;
  };
  lifeStages: LifeStage[];
}

export const userProfile: UserProfile = {
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
  ],
};

export const aspectInfo: Record<string, string> = {
  Education: "Focus on learning and personal development.",
  Family: "Nurture relationships with loved ones.",
  Health: "Maintain physical and mental well-being.",
  Career: "Pursue professional growth and accomplishments.",
  Relationships: "Build and maintain meaningful connections.",
  Finance: "Manage and grow your financial resources.",
  "Personal Growth": "Continuous self-improvement and exploration.",
  Leisure: "Enjoy recreational activities and relaxation.",
};