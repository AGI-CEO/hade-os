"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

export const Messaging = ({ messages, requestId, currentUser }: any) => {
  const [newMessage, setNewMessage] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState(messages);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempId = Date.now().toString();
    const messageData = {
      id: tempId,
      content: newMessage,
      createdAt: new Date().toISOString(),
      user: currentUser,
    };

    setOptimisticMessages([...optimisticMessages, messageData]);
    setNewMessage("");

    try {
      const res = await fetch(`/api/maintenance/${requestId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const actualMessage = await res.json();
      setOptimisticMessages((prevMessages: any[]) =>
        prevMessages.map((msg: any) =>
          msg.id === tempId ? actualMessage : msg
        )
      );
    } catch (error) {
      console.error(error);
      setOptimisticMessages((prevMessages: any[]) =>
        prevMessages.filter((msg: any) => msg.id !== tempId)
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4">Messages</h3>
      <ScrollArea className="flex-grow border rounded-lg p-4">
        <div className="space-y-4">
          {optimisticMessages.map((message: any) => (
            <div key={message.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={message.user?.image || ""} />
                <AvatarFallback>
                  {message.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{message.user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.createdAt), "p")}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};
