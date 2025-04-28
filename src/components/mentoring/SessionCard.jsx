import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star } from "lucide-react";
import { ChatDialog } from "@/components/mentoring/ChatDialog";

export function SessionCard({
  session,
  type = "upcoming",
  onChat,
  onViewNotes,
}) {
  if (type === "upcoming") {
    return (
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
        <div className="space-y-1">
          <p className="font-medium">{session.topic}</p>
          <p className="text-sm text-muted-foreground">with {session.mentor}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {session.date} at {session.time}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={session.status === "confirmed" ? "success" : "warning"}
          >
            {session.status}
          </Badge>
          <ChatDialog session={session} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="space-y-1">
        <p className="font-medium">{session.topic}</p>
        <p className="text-sm text-muted-foreground">with {session.mentor}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          {session.date}
        </div>
        <p className="text-sm">{session.notes}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(session.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewNotes(session)}
        >
          View Notes
        </Button>
      </div>
    </div>
  );
}