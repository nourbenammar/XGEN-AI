"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        selectedFile.type === "application/msword")
    ) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PDF or DOC file.");
      setFile(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type === "application/pdf" ||
        droppedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        droppedFile.type === "application/msword")
    ) {
      setFile(droppedFile);
    } else {
      alert("Please drop a valid PDF or DOC file.");
      setFile(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      console.log("File submitted:", file.name);
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
<div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#3b0000] via-[#4d0000] to-[#4e0000]">
    

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center px-4 pt-2 pb-10">
      <h1 className="text-5xl font-extrabold mb-12 leading-tight text-white drop-shadow-lg text-center">
          <span className="text-white">Syllabus</span> <span className="text-red-300">Extraction</span>
        </h1>

        <Card className="w-full max-w-2xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-300 dark:border-gray-700 shadow-lg rounded-2xl">
          <CardHeader className="pb-2">
            <p className="text-center text-gray-800 dark:text-gray-200 text-lg font-medium">
              Upload your syllabus in PDF or DOC format
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div
                className={`flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${
                  isDragging
                    ? "border-red-400 bg-red-100 dark:bg-red-900/30"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-full"
                >
                  <div className="flex flex-col items-center space-y-4">
                    {file ? (
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    ) : (
                      <Upload className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                    )}
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 uppercase">
                      {file ? file.name : "Upload PDF or DOC file"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click to browse or drag and drop
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <Button
                type="submit"
                disabled={!file}
                className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white text-lg py-6 rounded-full shadow-2xl transition-transform transform hover:scale-105 uppercase"
              >
                Extract Syllabus
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
