import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function SuggestionCard({ suggestion, onConnect }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img
          src={suggestion.image}
          alt={suggestion.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">{suggestion.name}</h4>
            <p className="text-sm text-muted-foreground">
              {suggestion.role} at {suggestion.company}
            </p>
          </div>
          <Button
            className="bg-gradient-to-r bg-red-500 text-white"
            onClick={() => onConnect(suggestion)}
          >
            Connect
          </Button>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          {suggestion.mutualConnections} mutual connections
        </div>
        <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
      </div>
    </div>
  );
}