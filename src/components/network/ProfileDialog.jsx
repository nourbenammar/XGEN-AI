"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Users, Briefcase, Mail, Link } from "lucide-react";

export function ProfileDialog({ isOpen, onClose, profile }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <div>
              <DialogTitle className="text-xl">{profile?.name}</DialogTitle>
              <p className="text-muted-foreground">{profile?.role}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center text-sm">
            <Building className="mr-2 h-4 w-4" />
            <span className="font-medium">Company:</span>
            <span className="ml-2">{profile?.company}</span>
          </div>

          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="font-medium">Location:</span>
            <span className="ml-2">{profile?.location}</span>
          </div>

          <div className="flex items-center text-sm">
            <Briefcase className="mr-2 h-4 w-4" />
            <span className="font-medium">Department:</span>
            <span className="ml-2">{profile?.department}</span>
          </div>

          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4" />
            <span className="font-medium">Network:</span>
            <span className="ml-2">
              {profile?.connections} connections ({profile?.mutualConnections}{" "}
              mutual)
            </span>
          </div>

          <div className="pt-4 flex space-x-2">
            <Button className="flex-1" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-red-800 to-red-600 text-white">
              <Link className="mr-2 h-4 w-4" />
              Connect
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}