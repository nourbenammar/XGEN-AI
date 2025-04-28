// src/components/messages/CreateGroupDialog.jsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

export function CreateGroupDialog({ open, onOpenChange }) {
  const [groupType, setGroupType] = useState("custom");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    year: "",
    department: "",
  });

  // Mock data for member selection
  const availableMembers = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      department: "Computer Science",
      graduation: "2020",
    },
    {
      id: 2,
      name: "Mohamed Ali",
      avatar: "/avatars/mohamed.jpg",
      department: "Software Engineering",
      graduation: "2019",
    },
    // Add more members...
  ];

  const handleAddMember = (member) => {
    if (!selectedMembers.find((m) => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleRemoveMember = (memberId) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== memberId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a group chat for collaboration and discussion
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Group Type</Label>
            <RadioGroup
              defaultValue="custom"
              value={groupType}
              onValueChange={setGroupType}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="custom"
                  id="custom"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="custom"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/50 [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <span>Custom Group</span>
                  <span className="text-xs text-muted-foreground">
                    Select specific members
                  </span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="generation"
                  id="generation"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="generation"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/50 [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <span>Generation</span>
                  <span className="text-xs text-muted-foreground">
                    Based on graduation year
                  </span>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="department"
                  id="department"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="department"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/50 [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <span>Department</span>
                  <span className="text-xs text-muted-foreground">
                    Based on department
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter group name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What's this group about?"
            />
          </div>

          {groupType === "generation" && (
            <div className="space-y-2">
              <Label>Graduation Year</Label>
              <Select
                value={formData.year}
                onValueChange={(value) =>
                  setFormData({ ...formData, year: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        Class of {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {groupType === "department" && (
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="se">Software Engineering</SelectItem>
                  <SelectItem value="ds">Data Science</SelectItem>
                  <SelectItem value="business">
                    Business Intelligence
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {groupType === "custom" && (
            <div className="space-y-4">
              <Label>Add Members</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Selected Members */}
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {member.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Available Members */}
              <ScrollArea className="h-[200px] border rounded-md">
                <div className="p-4 space-y-2">
                  {availableMembers
                    .filter((member) =>
                      member.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => handleAddMember(member)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.department} • Class of {member.graduation}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100"
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}