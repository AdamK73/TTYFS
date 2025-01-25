"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Equals } from "@phosphor-icons/react";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="w-full p-4">
      <div className="flex justify-center items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Life Aspects Logo"
            width={60}
            height={60}
          />
        </Link>
      </div>
    </nav>
  );
}
