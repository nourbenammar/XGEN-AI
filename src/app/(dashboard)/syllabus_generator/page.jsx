"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function CreateSyllabusPage() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [heHours, setHeHours] = useState("");
  const [hneHours, setHneHours] = useState("");
  const [ectsCredits, setEctsCredits] = useState("");
  const [moduleManager, setmoduleManager] = useState("");
  const [teachers, setTeachers] = useState("");
  const [pedagogicalUnit, setpedagogicalUnit] = useState("");
  const [courseUnit, setcourseUnit] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [gradeandoptions, setGradeandoptions] = useState("");
  const [evaluationMethod, setevaluationMethod] = useState("");
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSyllabus, setGeneratedSyllabus] = useState(null); // To store backend response
  const [error, setError] = useState(null); // For error handling
  const router = useRouter();



  const handleFileChange = (event) => {
    if (event.target.files) {
      setPdfFiles(Array.from(event.target.files));
    }
  };

  const handleGenerateSyllabus = async () => {
    setIsGenerating(true); // Optional: Indicate progress
  
    const formData = new FormData();
    formData.append("courseTitle", courseTitle);
    formData.append("courseCode", courseCode);
    formData.append("heHours", heHours);
    formData.append("hneHours", hneHours);
    formData.append("ectsCredits", ectsCredits);
    formData.append("moduleManager", moduleManager);
    formData.append("teachers", teachers);
    formData.append("pedagogicalUnit", pedagogicalUnit);
    formData.append("courseUnit", courseUnit);
    formData.append("prerequisites", prerequisites);
    formData.append("gradeandoptions", gradeandoptions);
    formData.append("evaluationMethod", evaluationMethod);
  
    pdfFiles.forEach((file) => {
      formData.append("pdfFiles", file);
    });
  
    try {
      const response = await fetch("http://127.0.0.1:5000/syllabusgen", {
        method: "POST",
        body: formData, // No need to set Content-Type; browser does it automatically
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate syllabus");
      }
  
      const result = await response.json();
      setGeneratedSyllabus(result); // Store result
      setError(null);

      // Store form data in localStorage
      localStorage.setItem("syllabusData", JSON.stringify({
        courseTitle,
        courseCode,
        heHours,
        hneHours,
        ectsCredits,
        moduleManager,
        teachers,
        pedagogicalUnit,
        courseUnit,
        prerequisites,
        gradeandoptions,
        evaluationMethod,
        pdfFiles
      }));
      
      router.push("/syllabus_generator/details");



    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsGenerating(false); // Reset loading state
    }
    
  };
  
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Syllabus Generator</h1>
          <p className="text-muted-foreground">Enter the following information to get started</p>
        </div>
      </div>

      {/* Progress Bar (Consider removing if not actually tracking progress) */}
      <div className="mt-8">
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div className="bg-gradient-to-r from-red-500 to-red-500 h-4 rounded-full" style={{ width: isGenerating ? "100%" : "25%" }}></div>
        </div>
      </div>

      {/* Form */}
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
        <Card className="w-full max-w-4xl border shadow-md p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-700 mb-6 text-center">
              Create New Syllabus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-red-500 rounded-lg p-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  name="courseTitle"
                  placeholder="Enter course title"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="border-2 border-red-500 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    name="courseCode"
                    placeholder="e.g., CS101"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">HE</label>
                  <input
                    type="number"
                    name="heHours"
                    placeholder="Hours"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                    value={heHours}
                    onChange={(e) => setHeHours(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">HNE</label>
                  <input
                    type="number"
                    name="hneHours"
                    placeholder="Hours"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                    value={hneHours}
                    onChange={(e) => setHneHours(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ECTS</label>
                  <input
                    type="number"
                    name="ectsCredits"
                    placeholder="Credits"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                    value={ectsCredits}
                    onChange={(e) => setEctsCredits(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="border-2 border-red-500 rounded-lg p-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Module Manager</label>
                <input
                  type="text"
                  name="moduleManager"
                  placeholder="Enter module manager"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                  value={moduleManager}
                  onChange={(e) => setmoduleManager(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Teachers</label>
                <input
                  type="text"
                  name="teachers"
                  placeholder="Enter teacher names separated by commas"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                  value={teachers}
                  onChange={(e) => setTeachers(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pedagogical Unit</label>
                <input
                  type="text"
                  name="pedagogicalUnit"
                  placeholder="Enter pedagogical unit name"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                  value={pedagogicalUnit}
                  onChange={(e) => setpedagogicalUnit(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Unit</label>
                <input
                  type="text"
                  name="courseUnit"
                  placeholder="Enter course unit name"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                  value={courseUnit}
                  onChange={(e) => setcourseUnit(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Prerequisites</label>
                <input
                  type="text"
                  name="prerequisites"
                  placeholder="Enter course prerequisites"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                  value={prerequisites}
                  onChange={(e) => setPrerequisites(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Grade and Options</label>
                <input
                  type="text"
                  name="gradeandoptions"
                  placeholder="Enter grade and options"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                  value={gradeandoptions}
                  onChange={(e) => setGradeandoptions(e.target.value)}
                />
              </div>
            </div>

            <div className="border-2 border-red-500 rounded-lg p-4 mb-6"> 
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Evaluation Method</label>
              <textarea
                name="evaluationMethod"
                placeholder="Provide the evaluation method of the course..."
                className="w-full rounded-lg border border-gray-300 p-3 h-32 resize-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                required
                value={evaluationMethod}
                onChange={(e) => setevaluationMethod(e.target.value)}
              />
            </div>
          </div>


            <div className="border-2 border-red-500 rounded-lg p-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Supporting PDF Files</label>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white text-lg rounded-lg shadow-md"
                onClick={handleGenerateSyllabus}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating Syllabus..." : "Generate Syllabus"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}