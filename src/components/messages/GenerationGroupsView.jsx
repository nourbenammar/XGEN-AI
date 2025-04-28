// src/components/messages/GenerationGroupsView.jsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, ArrowRight } from "lucide-react";

export function GenerationGroupsView() {
  const generations = [
    {
      year: "2025",
      groups: [
        {
          id: 1,
          name: "GL4 2024-2025",
          members: 156,
          lastActive: "2 min ago",
          avatar: "/logos/gl4.png",
        },
        {
          id: 2,
          name: "TWIN 2024-2025",
          members: 98,
          lastActive: "5 min ago",
          avatar: "/logos/twin.png",
        },
      ],
    },
    {
      year: "2024",
      groups: [
        {
          id: 3,
          name: "GL Alumni 2024",
          members: 145,
          lastActive: "1 hour ago",
          avatar: "/logos/gl.png",
        },
      ],
    },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="space-y-8 p-4">
        {generations.map((gen) => (
          <div key={gen.year} className="space-y-4">
            <h3 className="font-semibold text-lg sticky top-0 bg-background/95 backdrop-blur">
              Class of {gen.year}
            </h3>
            <div className="grid gap-4">
              {gen.groups.map((group) => (
                <Button
                  key={group.id}
                  variant="outline"
                  className="h-auto p-4 flex items-center justify-between hover:bg-accent"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>
                        <Users className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <h4 className="font-medium">{group.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">
                          {group.members} members
                        </Badge>
                        <span>•</span>
                        <span>Active {group.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}