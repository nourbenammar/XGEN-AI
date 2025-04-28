import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ChatDialog({ session }) {
  const [message, setMessage] = useState("");

  const messages = [
    {
      sender: "mentor",
      message: "Hello! Looking forward to our session.",
      time: "10:00 AM",
    },
    {
      sender: "you",
      message: "Hi! Yes, I have prepared some questions.",
      time: "10:02 AM",
    },
    {
      sender: "mentor",
      message: "Great! Feel free to share them now so I can prepare.",
      time: "10:03 AM",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chat with {session.mentor}</DialogTitle>
          <DialogDescription>Session: {session.topic}</DialogDescription>
        </DialogHeader>
        <div className="h-[400px] space-y-4 overflow-y-auto p-4 border rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "you" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "you"
                    ? "bg-gradient-to-r from-red-800 to-red-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <Input
            placeholder="Type your message..."
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                // Handle send message
                setMessage("");
              }
            }}
          />
          <Button
            size="icon"
            className="bg-gradient-to-r from-red-800 to-red-600"
            onClick={() => {
              // Handle send message
              setMessage("");
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}