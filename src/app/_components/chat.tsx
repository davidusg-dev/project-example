import { useEffect, useState, useRef } from "react";
import { supabase } from "~/lib/supabase";
import { getMessages, sendMessage } from "~/server/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { type Message } from "~/types";
import { type User } from "@clerk/nextjs/server";

export default function Chat({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages();
      setMessages(data);
      scrollToBottom();
    };

    fetchMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = {
            id: payload.new.id,
            content: payload.new.content,
            userId: payload.new.user_id,
            username: payload.new.username,
            createdAt: new Date(payload.new.created_at),
          };
          setMessages((prev) => [...prev, newMessage]);
          scrollToBottom();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage, user.id, user.username!);
    setNewMessage("");
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                msg.userId === user.id
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900",
              )}
            >
              <p className="font-bold">{msg.username}</p>
              <p className="break-words">{msg.content}</p>
              <p className="mt-1 text-xs opacity-70">
                {new Date(msg.createdAt + "Z").toLocaleString()}
              </p>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
