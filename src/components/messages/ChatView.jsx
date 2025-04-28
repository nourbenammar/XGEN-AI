// src/components/messages/ChatView.jsx
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Send,
  MoreVertical,
  Image as ImageIcon,
  File,
  Smile,
  Star,
  UserPlus,
  Video,
  Phone,
  Pin,
  Flag,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockMessages = [
  {
    id: 1,
    content: "Hey! How's your project coming along?",
    timestamp: "10:30 AM",
    sender: {
      id: 1,
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
    },
    type: "text",
  },
  {
    id: 2,
    content:
      "Great! Just finished the main features. Would you like to review it?",
    timestamp: "10:32 AM",
    sender: {
      id: 2,
      name: "You",
      avatar: "/avatars/you.jpg",
    },
    type: "text",
  },
  {
    id: 3,
    content: "Here's the documentation I mentioned",
    timestamp: "10:33 AM",
    sender: {
      id: 2,
      name: "You",
      avatar: "/avatars/you.jpg",
    },
    type: "file",
    fileDetails: {
      name: "project_docs.pdf",
      size: "2.4 MB",
      type: "application/pdf",
    },
  },
];

export function ChatView({ chat }) {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: {
        id: 2,
        name: "You",
        avatar: "/avatars/you.jpg",
      },
      type: "text",
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const renderMessage = (message) => {
    const isOwnMessage = message.sender.id === 2;

    return (
      <div
        key={message.id}
        className={cn(
          "flex gap-3 mx-4",
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        )}
      >
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={message.sender.avatar} />
          <AvatarFallback>
            {message.sender.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "flex max-w-[70%] flex-col gap-2",
            isOwnMessage ? "items-end" : "items-start"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{message.sender.name}</span>
            <span className="text-xs text-muted-foreground">
              {message.timestamp}
            </span>
          </div>

          {message.type === "text" ? (
            <div
              className={cn(
                "rounded-lg px-4 py-2 text-sm",
                isOwnMessage
                  ? "bg-gradient-to-r from-red-800 to-red-500 text-white"
                  : "bg-muted"
              )}
            >
              {message.content}
            </div>
          ) : message.type === "file" ? (
            <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
              <File className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm font-medium">
                  {message.fileDetails.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {message.fileDetails.size}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Header */}
      <div className="border-b p-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chat.avatar} />
            <AvatarFallback>
              {chat.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">{chat.name}</h2>
              {chat.online && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  Online
                </Badge>
              )}
            </div>
            {chat.type === "generation" && (
              <p className="text-sm text-muted-foreground">
                {chat.memberCount} members • Class of {chat.graduation}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start audio call</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start video call</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Users className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View members</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                Star conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin className="mr-2 h-4 w-4" />
                Pin to top
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                Add members
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Flag className="mr-2 h-4 w-4" />
                Report issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 w-full">
        <div className="space-y-6 w-full">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4 w-full">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 w-full"
        >
          <Button type="button" variant="ghost" size="icon">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <File className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-red-800 to-red-600"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}