"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { teacherAPI } from "@/services/api";
import {
  Upload,
  X,
  FileText,
  Info,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DocumentUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [processNow, setProcessNow] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is too large (50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        setFileError("File is too large. Maximum size is 50MB.");
        setSelectedFile(null);
        e.target.value = "";
        return;
      }

      // Check if file is PDF
      if (file.type !== "application/pdf") {
        setFileError("Only PDF files are supported.");
        setSelectedFile(null);
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
      setFileError("");

      // Auto-fill title with filename if empty
      if (!title) {
        // Extract filename without extension
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      // Check if file is PDF
      if (file.type !== "application/pdf") {
        setFileError("Only PDF files are supported.");
        return;
      }

      // Check file size
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        setFileError("File is too large. Maximum size is 50MB.");
        return;
      }

      setSelectedFile(file);
      setFileError("");

      // Auto-fill title with filename if empty
      if (!title) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setFileError("Please select a PDF document to upload.");
      return;
    }

    if (!title.trim()) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }

    try {
      setIsUploading(true);
      setServerError("");
      setUploadProgress(0);

      // Create FormData object
      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("title", title.trim());

      if (processNow) {
        formData.append("process_now", "on");
      }

      // Setup progress tracking simulation
      const uploadProgressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.random() * 10;
          const newValue = prev + increment;
          return newValue >= 100 ? 99 : newValue; // Cap at 99% until complete
        });
      }, 300);

      // Send upload request using our API service
      const response = await teacherAPI.uploadDocument(formData);

      clearInterval(uploadProgressInterval);
      setUploadProgress(100);

      // Wait a moment before redirecting
      setTimeout(() => {
        if (response.document) {
          if (response.document.processing_started) {
            // If processing was started, go to the document view page
            router.push(`/teacher/documents/${response.document.id}`);
          } else {
            // Otherwise, go to documents list
            router.push("/teacher/documents");
          }
        } else {
          // Fallback if response format is unexpected
          router.push("/teacher/documents");
        }
      }, 1000);
    } catch (err) {
      console.error("Document upload failed:", err);
      setServerError(`Upload failed: ${err.message}`);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  // Reset progress when file changes
  useEffect(() => {
    setUploadProgress(0);
  }, [selectedFile]);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center text-slate-800">
          <Upload className="mr-3 h-8 w-8 text-red-500" />
          Upload Document
        </h1>
        <p className="text-slate-500 mt-2">
          Upload a PDF document to process and analyze with AI
        </p>
      </div>

      {serverError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="border-slate-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-xl text-red-800">
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700">
                Document Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for the document"
                className="border-slate-300 focus-visible:ring-red-500"
              />
              <p className="text-sm text-slate-500">
                Enter a descriptive title for the document
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document" className="text-slate-700">
                Select PDF Document
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer ${
                  fileError ? "border-red-300 bg-red-50" : "border-slate-300"
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-red-500 mr-3" />
                        <div className="text-left">
                          <p
                            className="font-medium text-slate-800 truncate max-w-sm"
                            title={selectedFile.name}
                          >
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                    >
                      <X className="h-5 w-5 text-slate-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-1">
                      <span className="font-medium">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-sm text-slate-500">
                      PDF files only (max. 50MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  id="document"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
              {fileError && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {fileError}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="process_now"
                checked={processNow}
                onCheckedChange={setProcessNow}
                className="text-red-500 border-slate-300 data-[state=checked]:bg-red-500"
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="process_now"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Process document immediately after upload
                </Label>
                <p className="text-sm text-slate-500">
                  Extract chapters, create chunks, and generate embeddings
                </p>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">
                Processing Information
              </AlertTitle>
              <AlertDescription className="text-blue-700">
                <p className="mb-2">Document processing has several steps:</p>
                <ol className="list-decimal pl-6 space-y-1 mb-4">
                  <li>
                    Chapter extraction - identifies logical chapters in the
                    document
                  </li>
                  <li>
                    Text chunking - breaks chapters into manageable text
                    segments
                  </li>
                  <li>
                    Embedding generation - creates vector representations for AI
                    retrieval
                  </li>
                  <li>
                    Index creation - builds search indices for fast retrieval
                  </li>
                </ol>
                <p className="text-sm">
                  Processing may take a few minutes depending on document size.
                </p>
              </AlertDescription>
            </Alert>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Uploading...</span>
                  <span className="text-slate-600">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className="bg-red-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 gap-2 justify-end">
            <Link href="/teacher/documents">
              <Button
                variant="outline"
                className="text-slate-700"
                disabled={isUploading}
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!selectedFile || isUploading}
              className={`bg-red-500 hover:bg-red-600 ${
                isUploading ? "opacity-80 cursor-not-allowed" : ""
              }`}
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
                  <Upload className="mr-2 h-4 w-4" /> Upload Document
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
