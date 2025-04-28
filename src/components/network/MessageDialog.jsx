"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Send } from "lucide-react";

export function MessageDialog({ isOpen, onClose, recipient }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Here you would typically send the message
    console.log(`Sending message to ${recipient.name}: ${message}`);
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Message {recipient?.name}</DialogTitle>
          <DialogDescription>
            Send a direct message to start a conversation
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}