import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Users, Briefcase, Linkedin, Facebook } from "lucide-react";


export function ConnectionCard({ connection, onMessage, onViewProfile }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* Left Side: Profile Picture & Details */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={connection.image}
                alt={connection.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-lg">{connection.name}</CardTitle>
              <CardDescription>{connection.role}</CardDescription>
            </div>
          </div>

          {/* Right Side: Social Icons */}
          <div className="flex space-x-2">
            <a
              href={connection.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-300"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={connection.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-300"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Building className="mr-2 h-4 w-4" />
          {connection.company}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4" />
          {connection.location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          {connection.mutualConnections} mutual connections
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Briefcase className="mr-2 h-4 w-4" />
          Class of {connection.graduated} • {connection.department}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onMessage(connection)}
          >
            Message
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r bg-red-800 text-white"
            onClick={() => onViewProfile(connection)}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
