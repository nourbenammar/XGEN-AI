// src/components/messages/StarredMessagesView.jsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, File } from "lucide-react";

export function StarredMessagesView() {
  const starredMessages = [
    {
      id: 1,
      content: "Here's the documentation for the new project structure",
      timestamp: "2024-02-20 14:30",
      type: "file",
      fileDetails: {
        name: "project_docs.pdf",
        size: "2.4 MB",
      },
      from: {
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
        channel: "GL4 2024-2025",
      },
    },
    {
      id: 2,
      content:
        "Important announcement regarding the upcoming alumni meetup! Please mark your calendars for March 15th. We'll be hosting a networking event with industry leaders.",
      timestamp: "2024-02-19 11:20",
      type: "text",
      from: {
        name: "Alumni Committee",
        avatar: "/logos/alumni.png",
        channel: "Announcements",
      },
    },
    {
      id: 3,
      content:
        "Sharing these interview preparation resources that helped me land my job at Google",
      timestamp: "2024-02-18 09:15",
      type: "text",
      from: {
        name: "Mohammed Ali",
        avatar: "/avatars/mohammed.jpg",
        channel: "Job Opportunities",
      },
    },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Starred Messages</h3>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            {starredMessages.length} messages
          </Badge>
        </div>

        <div className="grid gap-4">
          {starredMessages.map((message) => (
            <Button
              key={message.id}
              variant="outline"
              className="h-auto p-4 flex items-start gap-4 hover:bg-accent"
            >
              <Avatar className="h-10 w-10 mt-1">
                <AvatarImage src={message.from.avatar} />
                <AvatarFallback>
                  {message.from.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-left space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.from.name}</span>
                    <span className="text-sm text-muted-foreground">
                      in {message.from.channel}
                    </span>
                  </div>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>

                {message.type === "text" ? (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.content}
                  </p>
                ) : message.type === "file" ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <File className="h-4 w-4" />
                    <span>{message.fileDetails.name}</span>
                    <span>({message.fileDetails.size})</span>
                  </div>
                ) : null}

                <p className="text-xs text-muted-foreground">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}