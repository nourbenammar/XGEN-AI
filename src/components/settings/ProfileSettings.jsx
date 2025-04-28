"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Loader2 } from "lucide-react";

const statuses = [
  { label: "Open to Work", color: "bg-green-500", border: "border-green-500" },
  { label: "Hiring", color: "bg-purple-500", border: "border-purple-500" },
  { label: "Open to Mentor", color: "bg-blue-500", border: "border-blue-500" },
  { label: "Looking for Collaboration", color: "bg-yellow-500", border: "border-yellow-500" },
];

export function ProfileSettings() {
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    avatar: "/placeholder-avatar.jpg",
    fullName: "Nour Ben Ammar",
    headline: "AI Engineer Student| ESPRIT ",
    email: "nour.benammar@esprit.tn",
    phone: "+216 51938388",
    location: "Tunis, Tunisia",
    bio: "AI Engineer Student at Esprit",
    linkedin: "https://www.linkedin.com/in/nour-ben-ammar-1a7a5424b/",
    facebook: "https://www.facebook.com/ben.ammar.nour",
    github: "https://github.com/nourbenammar",
    website: "",
    visibility: "public",
  });

  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);

  const handleUploadClick = () => {
    setUploading(true);
    setTimeout(() => setUploading(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Profile Photo */}
      <Card className="shadow-lg rounded-lg">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white rounded-full shadow-md">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.fullName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white shadow-lg hover:bg-blue-200 transition"
              onClick={handleUploadClick}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              ) : (
                <Camera className="h-5 w-5 text-blue-500" />
              )}
            </Button>
          </div>
          <span className={`mt-4 px-3 py-1 text-xs text-white font-bold rounded-full shadow-lg ${selectedStatus.color}`}>
            {selectedStatus.label}
          </span>
        </CardContent>
      </Card>

      {/* Status Selection */}
      <div className="flex flex-wrap justify-center gap-2">
        {statuses.map((status) => (
          <Button
            key={status.label}
            variant={selectedStatus.label === status.label ? "default" : "outline"}
            className={`px-4 py-2 text-sm rounded-full ${selectedStatus.label === status.label ? status.color + " text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setSelectedStatus(status)}
          >
            {status.label}
          </Button>
        ))}
      </div>

      {/* Basic Information */}
      <Card className="shadow-lg rounded-lg">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="focus:outline-none focus:ring-2 focus:ring-Red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Professional Headline</Label>
              <Input
                id="headline"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="shadow-lg rounded-lg">
        <CardContent className="p-6">
          <h3 className="font-medium text-xl mb-4">Social Links</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub Profile</Label>
              <Input
                id="github"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook Profile</Label>
              <Input
                id="facebook"
                value={profile.facebook}
                onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Personal Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Visibility */}
      <Card className="shadow-lg rounded-lg">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="visibility">Profile Visibility</Label>
              <Select
                value={profile.visibility}
                onValueChange={(value) => setProfile({ ...profile, visibility: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="alumni">Alumni Only</SelectItem>
                  <SelectItem value="connections">Connections Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Control who can see your profile information.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end gap-6">
        <Button variant="outline" className="hover:bg-gray-200 transition">
          Cancel
        </Button>
        <Button className="bg-gradient-to-r from-red-900 to-red-500 text-white hover:opacity-90 transition">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
