// components/MenuBar.tsx
"use client";

import Link from "next/link";
import { House, GearFine, Chats } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MenuBar() {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-100 rounded-full shadow-xs px-8 py-3">
      <div className="flex space-x-11 items-center justify-between ">
        <Link href="/" className="flex gap-1 flex-col items-center">
          <House size={24} weight="fill" />
          <span className="text-xs">Home</span>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col gap-1 items-center p-0"
            >
              <Chats size={24} />
              <span className="text-xs">Chat</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Future You Study</DialogTitle>
              <DialogDescription>
                This chat feature is inspired by the study Future You: A
                Conversation with an AI-Generated Future Self Reduces Anxiety,
                Negative Emotions, and Increases Future Self-Continuity. Would
                you like to start a conversation with your future self?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between mt-4">

              <Button
                variant="outline"
                onClick={() =>
                  window.open("https://arxiv.org/abs/2405.12514", "_blank")
                }
              >
                Read Study
              </Button>
              <Button onClick={() =>
                window.open("/chat", "_blank")
              }>Start Chat</Button>


            </div>
          </DialogContent>
        </Dialog>
        <Link href="/settings" className="flex flex-col gap-1 items-center">
          <GearFine size={24} />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </div>
  );
}
