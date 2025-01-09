"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Chat from "./chat";
import { Button } from "~/components/ui/button";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <div>
      <Button
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        Chat
      </Button>
      {isOpen && user && (
        <div className="fixed bottom-16 right-4 z-50 h-96 w-80 rounded-lg bg-white p-4 shadow-lg">
          <Chat user={user} />
        </div>
      )}
    </div>
  );
}
