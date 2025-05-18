"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { courseGeneratorAPI } from "@/services/api";
import {
  GraduationCap,
  Upload,
  ArrowLeft,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function UploadSyllabusPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      // 10MB
      setError("File size should be less than 10MB.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024).toFixed(1) + " KB";
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const result = await courseGeneratorAPI.uploadSyllabus(file);
      setUploadResult(result);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(`Failed to upload syllabus: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!uploadResult || !uploadResult.file_id) {
      setError("Please upload a syllabus first.");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const result = await courseGeneratorAPI.generateCourse(
        uploadResult.file_id
      );

      // Redirect to the status page
      if (result && result.course_id) {
        router.push(`/teacher/course-generator/${result.course_id}/status`);
      }
    } catch (err) {
      console.error("Generation failed:", err);
      setError(`Failed to start course generation: ${err.message}`);
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/teacher/course-generator"
          className="text-slate-600 hover:text-slate-800 flex items-center mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Course Generator
        </Link>

        <h1 className="text-3xl font-bold flex items-center text-slate-800">
          <GraduationCap className="mr-3 h-8 w-8 text-red-500" />
          Upload Syllabus
        </h1>
        <p className="text-slate-500 mt-2">
          Upload a syllabus PDF file to generate complete course materials
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload PDF Syllabus</CardTitle>
          <CardDescription>
            Select and upload a PDF document containing your course syllabus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer ${
              file ? "bg-slate-50 border-slate-200" : "border-slate-200"
            }`}
            onClick={handleUploadClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />

            {!file ? (
              <div className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-slate-500" />
                </div>
                <h3 className="font-medium text-slate-700 mb-1">
                  Choose a PDF file
                </h3>
                <p className="text-sm text-slate-500 mb-3">or drag and drop</p>
                <p className="text-xs text-slate-400">PDF files up to 10MB</p>
              </div>
            ) : (
              <div className="relative">
                <button
                  className="absolute top-0 right-0 p-1 bg-white rounded-full text-slate-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex flex-col items-center justify-center">
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                    <File className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="font-medium text-slate-700 mb-1 line-clamp-1">
                    {file.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!uploadResult && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="bg-slate-800 hover:bg-slate-700"
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Upload Syllabus
                  </>
                )}
              </Button>
            </div>
          )}

          {uploadResult && (
            <Alert className="mt-4 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Upload Successful</AlertTitle>
              <AlertDescription>
                Your syllabus has been uploaded successfully and is ready for
                processing.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        {uploadResult && (
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setUploadResult(null);
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-red-500 hover:bg-red-600"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Starting Generation...
                </>
              ) : (
                <>
                  <GraduationCap className="mr-2 h-4 w-4" /> Generate Course
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
