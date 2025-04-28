// src/components/messages/ChatSidebar.jsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ChatSidebar({
  directMessages,
  groups,
  selectedView,
  onSelectChat,
  searchTerm,
}) {
  // Filter chats based on search term
  const filterChats = (chats) => {
    if (!searchTerm) return chats;
    return chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get relevant chats based on selected view
  const getRelevantChats = () => {
    switch (selectedView) {
      case "direct":
        return filterChats(directMessages);
      case "generations":
        return filterChats(groups.filter((g) => g.type === "generation"));
      case "departments":
        return filterChats(groups.filter((g) => g.type === "department"));
      case "starred":
        return filterChats(
          [...directMessages, ...groups].filter((c) => c.starred)
        );
      default:
        return [];
    }
  };

  const renderMessagePreview = (chat) => (
    <div
      className="flex w-full cursor-pointer items-center space-x-4 rounded-lg p-3 hover:bg-accent"
      onClick={() => onSelectChat(chat)}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={chat.avatar} />
          <AvatarFallback>
            {chat.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        {chat.online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className="text-sm font-medium leading-none line-clamp-1">
            {chat.name}
          </p>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {chat.timestamp}
          </span>
        </div>

        <div className="mt-1 flex justify-between items-center">
          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[180px]">
            {chat.lastMessage}
          </p>
          {chat.unread > 0 && (
            <Badge
              variant="default"
              className="ml-auto bg-gradient-to-r from-red-800 to-red-600"
            >
              {chat.unread}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  const relevantChats = getRelevantChats();

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col">
        {relevantChats.length > 0 ? (
          relevantChats.map((chat) => (
            <div key={chat.id}>{renderMessagePreview(chat)}</div>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No conversations found
          </div>
        )}
      </div>
    </ScrollArea>
  );
}