"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';


// Dummy icon component
const AiGenerateIcon = () => <span>✨</span>;

export default function SyllabusDetailsPage() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [heHours, setHeHours] = useState("");
  const [hneHours, setHneHours] = useState("");
  const [ectsCredits, setEctsCredits] = useState("");
  const [moduleManager, setModuleManager] = useState("");
  const [teachers, setTeachers] = useState("");
  const [pedagogicalUnit, setPedagogicalUnit] = useState("");
  const [courseUnit, setCourseUnit] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [gradeandoptions, setGradeAndOptions] = useState("");
  const [evaluationMethod, setEvaluationMethod] = useState("");

  const [courseDescription, setCourseDescription] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [topics, setTopics] = useState("");
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loadingOutcomes, setLoadingOutcomes] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [generatedSyllabus, setGeneratedSyllabus] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState("0%");

  useEffect(() => {
    // Retrieve data from localStorage and set state values
    const syllabusData = localStorage.getItem("syllabusData");
    if (syllabusData) {
      const data = JSON.parse(syllabusData);
      setCourseTitle(data.courseTitle || "");
      setCourseCode(data.courseCode || "");
      setHeHours(data.heHours || "");
      setHneHours(data.hneHours || "");
      setEctsCredits(data.ectsCredits || "");
      setModuleManager(data.moduleManager || "");
      setTeachers(data.teachers || "");
      setPedagogicalUnit(data.pedagogicalUnit || "");
      setCourseUnit(data.courseUnit || "");
      setPrerequisites(data.prerequisites || "");
      setGradeAndOptions(data.gradeandoptions || "");
      setEvaluationMethod(data.evaluationMethod || "");
    }
  }, []);

  const handleAiGenerate = async (label, setLoading, setValue) => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:5000/syllabusgen/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ label }),
      });

      const data = await response.json();
      setValue(data.content || "No content returned.");
    } catch (error) {
      console.error("Error generating content:", error);
      setValue("Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSyllabus = () => {
    setIsGenerating(true);
    setProgressBarWidth("100%");
    setTimeout(() => {
      setGeneratedSyllabus({
        "Course Description": courseDescription,
        "Learning Outcomes": learningOutcomes,
        "Topics": topics,
      });
      setIsGenerating(false);
    }, 1500);
  };

  // Reusable AI-powered text area component
  function TextAreaWithAI({ label, value, setValue, onGenerate, loading }) {
    return (
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <div className="relative">
          <textarea
            placeholder={`Enter ${label.toLowerCase()}...`}
            className="w-full rounded-lg border border-gray-300 p-3 h-28 resize-none pr-20 focus:ring-red-500 focus:border-red-500"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 bottom-2 px-3 py-1.5 bg-red-500 text-white text-xs rounded shadow"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? "Loading..." : <AiGenerateIcon />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Syllabus Generator</h1>
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="h-2 bg-red-500 rounded-full transition-all duration-700"
          style={{ width: progressBarWidth }}
        ></div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section */}
        <div className="w-full md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-700 text-center">Enter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <TextAreaWithAI
                label="Course Description"
                value={courseDescription}
                setValue={setCourseDescription}
                loading={loadingDescription}
                onGenerate={() =>
                  handleAiGenerate("Course Description", setLoadingDescription, setCourseDescription)
                }
              />

              <TextAreaWithAI
                label="Learning Outcomes"
                value={learningOutcomes}
                setValue={setLearningOutcomes}
                loading={loadingOutcomes}
                onGenerate={() =>
                  handleAiGenerate("Learning Outcomes", setLoadingOutcomes, setLearningOutcomes)
                }
              />

              <TextAreaWithAI
                label="Topics"
                value={topics}
                setValue={setTopics}
                loading={loadingTopics}
                onGenerate={() => handleAiGenerate("Topics", setLoadingTopics, setTopics)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
<div className="w-full md:w-1/2">
  <Card className="h-full flex flex-col justify-between">
    <CardHeader>
      <CardTitle className="text-xl text-red-700 text-center">Generate Syllabus</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      {isGenerating ? (
        <p className="text-center text-gray-500">Generating syllabus...</p>
      ) : generatedSyllabus ? (
        <div className="space-y-3 text-sm">
          {Object.entries(generatedSyllabus).map(([key, val]) => (
            <div key={key}>
              <strong className="text-red-600">{key}</strong>
              <pre className="whitespace-pre-wrap">{val}</pre>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          {/* Displaying form data */}
          <div>
            <strong className="text-red-600">Course Title:</strong>
            <pre className="whitespace-pre-wrap">{courseTitle}</pre>
          </div>
          <div>
            <strong className="text-red-600">Course Code:</strong>
            <pre className="whitespace-pre-wrap">{courseCode}</pre>
          </div>
          <div>
            <strong className="text-red-600">HE Hours:</strong>
            <pre className="whitespace-pre-wrap">{heHours}</pre>
          </div>
          <div>
            <strong className="text-red-600">HNE Hours:</strong>
            <pre className="whitespace-pre-wrap">{hneHours}</pre>
          </div>
          <div>
            <strong className="text-red-600">ECTS Credits:</strong>
            <pre className="whitespace-pre-wrap">{ectsCredits}</pre>
          </div>
          <div>
            <strong className="text-red-600">Module Manager:</strong>
            <pre className="whitespace-pre-wrap">{moduleManager}</pre>
          </div>
          <div>
            <strong className="text-red-600">Teachers:</strong>
            <pre className="whitespace-pre-wrap">{teachers}</pre>
          </div>
          <div>
            <strong className="text-red-600">Pedagogical Unit:</strong>
            <pre className="whitespace-pre-wrap">{pedagogicalUnit}</pre>
          </div>
          <div>
            <strong className="text-red-600">Course Unit:</strong>
            <pre className="whitespace-pre-wrap">{courseUnit}</pre>
          </div>
          <div>
            <strong className="text-red-600">Prerequisites:</strong>
            <pre className="whitespace-pre-wrap">{prerequisites}</pre>
          </div>
          <div>
            <strong className="text-red-600">Grade and Options:</strong>
            <pre className="whitespace-pre-wrap">{gradeandoptions}</pre>
          </div>
          <div>
            <strong className="text-red-600">Evaluation Method:</strong>
            <pre className="whitespace-pre-wrap">{evaluationMethod}</pre>
          </div>
        </div>
      )}
      
      <Button
        className="w-full mt-4 bg-red-600 hover:bg-red-700"
        onClick={handleGenerateSyllabus}
        disabled={isGenerating}
      >
        Generate Syllabus
      </Button>
    </CardContent>
  </Card>
</div>



        {/**/}
      </div>
    </div>
  );
}
