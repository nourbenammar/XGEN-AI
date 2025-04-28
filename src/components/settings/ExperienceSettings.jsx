"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ExperienceSettings() {
  const [experience, setExperience] = useState([
    {
      company: "Tech Innovators",
      role: "Software Engineer",
      startDate: "2020",
      endDate: "Present",
      description:
        "Developed and maintained web applications using modern technologies.",
    },
  ]);

  const [newExperience, setNewExperience] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleAddExperience = () => {
    setExperience([...experience, newExperience]);
    setNewExperience({
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Experience</h3>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="space-y-2">
                <Label>{exp.company}</Label>
                <p className="text-sm text-muted-foreground">
                  {exp.role} ({exp.startDate} - {exp.endDate})
                </p>
                <p className="text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Add New Experience</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={newExperience.role}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, role: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="month"
                value={newExperience.startDate}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="month"
                value={newExperience.endDate}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    endDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleAddExperience}
              className="bg-gradient-to-r from-red-900 to-red-500 text-white"
            >
              Add Experience
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}