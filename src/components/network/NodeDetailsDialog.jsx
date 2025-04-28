import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Users, Briefcase } from "lucide-react";

export function NodeDetailsDialog({ node, isOpen, onClose }) {
  if (!node) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{node.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="mr-2 h-4 w-4" />
            {node.company}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="mr-2 h-4 w-4" />
            {node.role}
          </div>
          {node.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              {node.location}
            </div>
          )}
          {node.mutualConnections && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              {node.mutualConnections} mutual connections
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}