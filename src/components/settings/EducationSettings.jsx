"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function EducationSettings() {
  const [education, setEducation] = useState([
    {
      institution: "ESPRIT",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      graduationYear: "2020",
      description:
        "Studied core computer science subjects and specialized in software engineering.",
    },
  ]);

  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    graduationYear: "",
    description: "",
  });

  const handleAddEducation = () => {
    setEducation([...education, newEducation]);
    setNewEducation({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      graduationYear: "",
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Education</h3>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="space-y-2">
                <Label>{edu.institution}</Label>
                <p className="text-sm text-muted-foreground">
                  {edu.degree} in {edu.fieldOfStudy} ({edu.graduationYear})
                </p>
                <p className="text-sm">{edu.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Add New Education</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={newEducation.institution}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    institution: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input
                id="fieldOfStudy"
                value={newEducation.fieldOfStudy}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    fieldOfStudy: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                value={newEducation.graduationYear}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    graduationYear: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEducation.description}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    description: e.target.value,
                  })
                }
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleAddEducation}
              className="bg-gradient-to-r from-red-900 to-red-500 text-white"
            >
              Add Education
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}