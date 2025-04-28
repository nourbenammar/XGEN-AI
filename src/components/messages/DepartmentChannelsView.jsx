// src/components/messages/DepartmentChannelsView.jsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, ArrowRight, Hash } from "lucide-react";

export function DepartmentChannelsView() {
  const departments = [
    {
      name: "Computer Science",
      channels: [
        {
          id: 1,
          name: "GL General",
          members: 450,
          lastActive: "1 min ago",
          description: "General discussion for GL students and alumni",
        },
        {
          id: 2,
          name: "GL Job Opportunities",
          members: 425,
          lastActive: "5 min ago",
          description: "Job postings and career opportunities",
        },
        {
          id: 3,
          name: "GL Tech Talk",
          members: 380,
          lastActive: "15 min ago",
          description: "Technical discussions and knowledge sharing",
        },
      ],
    },
    {
      name: "Business Intelligence",
      channels: [
        {
          id: 4,
          name: "BI Alumni Network",
          members: 280,
          lastActive: "10 min ago",
          description: "Networking for BI graduates",
        },
        {
          id: 5,
          name: "BI Projects",
          members: 265,
          lastActive: "30 min ago",
          description: "Project collaborations and case studies",
        },
      ],
    },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="space-y-8 p-4">
        {departments.map((dept) => (
          <div key={dept.name} className="space-y-4">
            <h3 className="font-semibold text-lg sticky top-0 bg-background/95 backdrop-blur">
              {dept.name}
            </h3>
            <div className="grid gap-4">
              {dept.channels.map((channel) => (
                <Button
                  key={channel.id}
                  variant="outline"
                  className="h-auto p-4 flex items-center justify-between hover:bg-accent"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-red-800 to-red-500 flex items-center justify-center text-white">
                      <Hash className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium">{channel.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {channel.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Badge variant="secondary">
                          {channel.members} members
                        </Badge>
                        <span>•</span>
                        <span>Active {channel.lastActive}</span>
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