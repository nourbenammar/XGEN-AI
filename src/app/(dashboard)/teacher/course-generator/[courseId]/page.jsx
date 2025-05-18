"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react"; // Import React.use
import { courseGeneratorAPI } from "@/services/api";
import {
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  File,
  Presentation,
  BookOpen,
  Download,
  ChevronDown,
  ChevronRight,
  FileText,
  BarChart,
  ClipboardCheck,
  FileQuestion,
  BookMarked,
  ExternalLink,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PowerPointViewer } from "@/components/ui/pptx-viewer";
import ReactMarkdown from "react-markdown";

// Document Viewer component with styled markdown
function DocumentViewer({ content, isPdf = false }) {
  if (!content) return null;

  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-lead:text-slate-500 prose-a:font-semibold prose-a:underline hover:prose-a:text-blue-500 prose-pre:rounded-lg prose-img:rounded-md">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-2xl font-bold mt-6 mb-4 text-slate-900 border-b pb-2"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-xl font-bold mt-5 mb-3 text-slate-800"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-lg font-bold mt-4 mb-2 text-slate-800"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-base font-bold mt-3 mb-2 text-slate-700"
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <h5
              className="text-sm font-bold mt-3 mb-1 text-slate-700"
              {...props}
            />
          ),
          h6: ({ node, ...props }) => (
            <h6
              className="text-sm font-bold mt-3 mb-1 text-slate-700"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="my-3 leading-relaxed text-slate-600" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 hover:text-blue-800 hover:underline"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-3 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-3 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-slate-200 pl-4 italic my-4 text-slate-600"
              {...props}
            />
          ),
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code
                className="px-1 py-0.5 bg-slate-100 rounded text-sm text-red-500"
                {...props}
              />
            ) : (
              <code
                className="block p-4 bg-slate-100 rounded-md overflow-x-auto text-sm"
                {...props}
              />
            ),
          pre: ({ node, ...props }) => (
            <pre
              className="rounded-lg bg-slate-100 p-4 overflow-x-auto text-sm my-4"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table
                className="border-collapse table-auto w-full text-sm"
                {...props}
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border-b border-slate-200 p-3 text-left font-semibold text-slate-700 bg-slate-50"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="border-b border-slate-200 p-3 text-slate-600"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-slate-200" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="rounded-md my-4 max-w-full" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Helper function for icons by file type
const getFileIcon = (filename) => {
  if (filename.endsWith(".md"))
    return <FileText className="h-4 w-4 mr-2 text-blue-500" />;
  if (filename.endsWith(".pptx"))
    return <Presentation className="h-4 w-4 mr-2 text-orange-500" />;
  if (filename.endsWith(".json"))
    return <BarChart className="h-4 w-4 mr-2 text-green-500" />;
  if (filename.includes("Assessment"))
    return <FileQuestion className="h-4 w-4 mr-2 text-purple-500" />;
  if (filename.includes("Practical"))
    return <ClipboardCheck className="h-4 w-4 mr-2 text-indigo-500" />;
  if (filename.includes("Outline"))
    return <BookMarked className="h-4 w-4 mr-2 text-red-500" />;
  return <File className="h-4 w-4 mr-2 text-slate-500" />;
};

export default function CourseDetailsPage({ params }) {
  const router = useRouter();
  // Use React.use() to unwrap params
  const courseId = use(params).courseId;
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    fetchCourseDetails();

    // Add console logs to help debug
    console.log("Course ID:", courseId);
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      console.log("Fetching course details for:", courseId);
      const data = await courseGeneratorAPI.getCourseDetails(courseId);
      console.log("Course details received:", data);
      setCourseDetails(data.data);

      // Preselect the first module if available
      if (data.data && data.data.modules) {
        const firstModuleKey = Object.keys(data.data.modules)[0];
        if (firstModuleKey) {
          setSelectedModule(firstModuleKey);

          // Preload course outline by default
          loadFileContent(data.data.outline);
        }
      }

      setError(null);
    } catch (err) {
      console.error("Failed to fetch course details:", err);
      setError(`Failed to load course details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadFileContent = async (filePath) => {
    if (!filePath) {
      console.error("No file path provided to loadFileContent");
      return;
    }

    setFileLoading(true);
    setFileContent(null);

    try {
      console.log("Loading content for:", filePath);
      // Set the selected file path
      setSelectedFile(filePath);

      // If it's a pptx file, we don't need to fetch content
      if (filePath.endsWith(".pptx")) {
        setFileLoading(false);
        return;
      }

      const data = await courseGeneratorAPI.getCourseFile(courseId, filePath);
      console.log("File content received:", data);
      setFileContent(data.content);
    } catch (err) {
      console.error(`Failed to load file: ${filePath}`, err);
      setError(`Failed to load file: ${err.message}`);
    } finally {
      setFileLoading(false);
    }
  };

  const handleDownloadFile = () => {
    if (selectedFile) {
      courseGeneratorAPI.downloadFile(courseId, selectedFile);
    }
  };

  const handleDownloadAll = async () => {
    await courseGeneratorAPI.downloadCourse(courseId);
  };

  const getSelectedModuleTitle = () => {
    if (!selectedModule || !courseDetails?.modules) return "";

    const moduleInfo = courseDetails.modules[selectedModule];
    return moduleInfo.title || selectedModule.replace("_", " ");
  };

  const getDocumentTitle = () => {
    if (!selectedFile) return "Content Preview";

    // Extract filename from path
    const filename = selectedFile.split("/").pop();

    // Try to make it more readable
    let title = filename
      .replace(/_/g, " ")
      .replace(".md", "")
      .replace(".pptx", "");

    // If it's a module file, enhance the title
    if (selectedFile.includes("lectures/")) {
      title = `Lecture: ${getSelectedModuleTitle()}`;
    } else if (selectedFile.includes("practicals/")) {
      title = `Practical Exercises: ${getSelectedModuleTitle()}`;
    } else if (selectedFile.includes("slides/")) {
      title = `Slides: ${getSelectedModuleTitle()}`;
    }

    return title;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array(3)
                    .fill()
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <div className="pl-4 space-y-2">
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-4/6" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error && !courseDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/teacher/course-generator"
          className="text-slate-600 hover:text-slate-800 flex items-center mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Course Generator
        </Link>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Course</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-2xl font-medium text-slate-700 mb-2">
                We couldn't load this course
              </h3>
              <p className="text-slate-500 mb-6">
                There was a problem loading the course details. Please try again
                or contact support.
              </p>
              <Button
                onClick={fetchCourseDetails}
                className="bg-slate-800 hover:bg-slate-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/teacher/course-generator"
          className="text-slate-600 hover:text-slate-800 flex items-center mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Course Generator
        </Link>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center text-slate-800">
              <GraduationCap className="mr-3 h-8 w-8 text-red-500" />
              {courseDetails?.course_title || "Course Materials"}
            </h1>
            <p className="text-slate-500 mt-2">
              View and download generated course materials
            </p>
          </div>
          <Button
            onClick={handleDownloadAll}
            className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600"
          >
            <Download className="mr-2 h-4 w-4" /> Download All Materials
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Course Structure */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader className="bg-slate-50 pb-3">
              <CardTitle className="text-lg">Course Structure</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {/* Course outline */}
                {courseDetails?.outline && (
                  <div
                    className={`flex items-center p-2 rounded-md text-slate-800 hover:bg-slate-100 cursor-pointer ${
                      selectedFile === courseDetails.outline
                        ? "bg-slate-100 text-red-600 font-medium"
                        : ""
                    }`}
                    onClick={() => loadFileContent(courseDetails.outline)}
                  >
                    <BookMarked
                      className={`h-4 w-4 mr-2 ${
                        selectedFile === courseDetails.outline
                          ? "text-red-600"
                          : "text-red-500"
                      }`}
                    />
                    <span className="text-sm">Course Outline</span>
                  </div>
                )}

                {/* Course assessments */}
                {courseDetails?.assessments && (
                  <div
                    className={`flex items-center p-2 rounded-md text-slate-800 hover:bg-slate-100 cursor-pointer ${
                      selectedFile ===
                      `assessments/${courseDetails.assessments}`
                        ? "bg-slate-100 text-purple-600 font-medium"
                        : ""
                    }`}
                    onClick={() =>
                      loadFileContent(
                        `assessments/${courseDetails.assessments}`
                      )
                    }
                  >
                    <FileQuestion
                      className={`h-4 w-4 mr-2 ${
                        selectedFile ===
                        `assessments/${courseDetails.assessments}`
                          ? "text-purple-600"
                          : "text-purple-500"
                      }`}
                    />
                    <span className="text-sm">Assessments</span>
                  </div>
                )}

                <div className="border-t my-2"></div>

                {/* Module collapsibles */}
                {courseDetails?.modules &&
                  Object.entries(courseDetails.modules).map(
                    ([moduleKey, module]) => (
                      <Collapsible
                        key={moduleKey}
                        defaultOpen={selectedModule === moduleKey}
                        className="border border-slate-200 rounded-md overflow-hidden mb-2"
                      >
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-left bg-slate-50 hover:bg-slate-100">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-sm font-medium">
                              {module.title || moduleKey.replace("_", " ")}
                            </span>
                          </div>
                          <div>
                            {selectedModule === moduleKey ? (
                              <ChevronDown className="h-4 w-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-500" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="bg-white">
                          <div className="p-2 space-y-1 pl-4">
                            {/* Module files */}
                            {module.lecture && (
                              <div
                                className={`flex items-center p-1.5 rounded-md text-slate-700 hover:bg-slate-100 cursor-pointer ${
                                  selectedFile === `lectures/${module.lecture}`
                                    ? "bg-slate-100 text-blue-600"
                                    : ""
                                }`}
                                onClick={() =>
                                  loadFileContent(`lectures/${module.lecture}`)
                                }
                              >
                                <FileText
                                  className={`h-4 w-4 mr-2 ${
                                    selectedFile ===
                                    `lectures/${module.lecture}`
                                      ? "text-blue-600"
                                      : "text-blue-500"
                                  }`}
                                />
                                <span className="text-xs">
                                  Lecture Material
                                </span>
                              </div>
                            )}
                            {module.slides && (
                              <div
                                className={`flex items-center p-1.5 rounded-md text-slate-700 hover:bg-slate-100 cursor-pointer ${
                                  selectedFile === `slides/${module.slides}`
                                    ? "bg-slate-100 text-orange-600"
                                    : ""
                                }`}
                                onClick={() =>
                                  loadFileContent(`slides/${module.slides}`)
                                }
                              >
                                <Presentation
                                  className={`h-4 w-4 mr-2 ${
                                    selectedFile === `slides/${module.slides}`
                                      ? "text-orange-600"
                                      : "text-orange-500"
                                  }`}
                                />
                                <span className="text-xs">Slides</span>
                              </div>
                            )}
                            {module.practicals && (
                              <div
                                className={`flex items-center p-1.5 rounded-md text-slate-700 hover:bg-slate-100 cursor-pointer ${
                                  selectedFile ===
                                  `practicals/${module.practicals}`
                                    ? "bg-slate-100 text-indigo-600"
                                    : ""
                                }`}
                                onClick={() =>
                                  loadFileContent(
                                    `practicals/${module.practicals}`
                                  )
                                }
                              >
                                <ClipboardCheck
                                  className={`h-4 w-4 mr-2 ${
                                    selectedFile ===
                                    `practicals/${module.practicals}`
                                      ? "text-indigo-600"
                                      : "text-indigo-500"
                                  }`}
                                />
                                <span className="text-xs">
                                  Practical Exercises
                                </span>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader className="bg-slate-50 pb-3 flex flex-row items-center justify-between border-b flex-shrink-0">
              <CardTitle className="text-lg flex items-center">
                {selectedFile && getFileIcon(selectedFile)}
                <span>{getDocumentTitle()}</span>
              </CardTitle>

              {selectedFile && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadFile}
                    className="text-slate-600 border-slate-300"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" /> Download
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0 flex-grow flex flex-col min-h-[75vh]">
              {fileLoading ? (
                <div className="p-6 flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
                  <p className="text-slate-500">Loading content...</p>
                </div>
              ) : selectedFile ? (
                <div className="h-full flex-grow">
                  {/* If it's a PowerPoint slide */}
                  {selectedFile.endsWith(".pptx") ? (
                    <div className="p-6 h-full">
                      <PowerPointViewer
                        courseId={courseId}
                        filePath={selectedFile}
                        onDownload={handleDownloadFile}
                      />
                    </div>
                  ) : (
                    <ScrollArea className="h-full">
                      <div className="p-6">
                        <DocumentViewer content={fileContent} />
                      </div>
                    </ScrollArea>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <GraduationCap className="h-16 w-16 text-slate-300 mb-4" />
                  <h3 className="text-xl font-medium text-slate-700 mb-2">
                    Select Content to View
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-6">
                    Choose an item from the course structure menu on the left to
                    view course content.
                  </p>
                  {courseDetails?.outline && (
                    <Button
                      variant="outline"
                      className="text-slate-600 border-slate-300"
                      onClick={() => loadFileContent(courseDetails.outline)}
                    >
                      <BookMarked className="mr-2 h-4 w-4 text-red-500" /> View
                      Course Outline
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
