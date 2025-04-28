import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, BookOpen } from "lucide-react";
import { ScheduleSessionDialog } from "./ScheduleSessionDialog";

export function MentorCard({ mentor, onRequestSession }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={mentor.image} />
              <AvatarFallback>
                {mentor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{mentor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {mentor.role} at {mentor.company}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
            <Star className="h-4 w-4 fill-current" />
            <span>{mentor.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {mentor.expertise.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-black dark:bg-gray-200 text-gray-200 dark:text-black"
            >
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          {mentor.availability}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="mr-2 h-4 w-4" />
          {mentor.sessions} sessions completed
        </div>
        <ScheduleSessionDialog mentor={mentor} onSchedule={onRequestSession} />
      </CardContent>
    </Card>
  );
}