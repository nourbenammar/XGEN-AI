"use client";

import { useState, useEffect, useCallback, use } from "react"; // Added 'use'
import { useRouter } from "next/navigation";
import { courseGeneratorAPI } from "@/services/api";
import {
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function CourseStatusPage({ params: paramsFromProps }) {
  // Renamed params
  const router = useRouter();
  // Correctly use `use` to unwrap params if it's a Promise-like object
  const resolvedParams = use(paramsFromProps);
  const courseId = resolvedParams.courseId;

  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshIntervalId, setRefreshIntervalId] = useState(null);
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!courseId) {
      setLoading(false); // Stop loading if no courseId
      return;
    }
    // For manual refresh, set loading true. For interval, it's a background update.
    // setLoading(manualRefreshing || !statusData); // Show loading if manual or no data yet

    try {
      const data = await courseGeneratorAPI.getCourseStatus(courseId);
      setStatusData(data);
      setError(null);

      if (data.status === "completed" || data.status === "failed") {
        if (refreshIntervalId) {
          clearInterval(refreshIntervalId);
          setRefreshIntervalId(null);
        }
        if (data.status === "completed") {
          setTimeout(() => {
            // Check if router is available (it should be)
            if (router && typeof router.push === "function") {
              router.push(`/teacher/course-generator/${courseId}`);
            } else {
              console.warn("Router not available for redirection.");
            }
          }, 3000);
        }
      }
    } catch (err) {
      console.error("Failed to fetch status for course " + courseId + ":", err);
      setError(`Failed to load course status: ${err.message}`);
    } finally {
      setLoading(false);
      setManualRefreshing(false);
    }
  }, [courseId, router, refreshIntervalId]); // refreshIntervalId is needed to clear it

  useEffect(() => {
    if (courseId) {
      setLoading(true); // Initial loading state
      fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      setRefreshIntervalId(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      setLoading(false); // No courseId, not loading
      setError("Course ID is missing.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]); // fetchStatus is memoized, so only courseId change re-runs this effect.

  const handleManualRefresh = () => {
    if (!courseId) return;
    setManualRefreshing(true);
    setLoading(true);
    fetchStatus();
  };

  const getProgressValue = (currentStatus) => {
    switch (currentStatus) {
      case "completed":
        return 100;
      case "failed":
        return 100;
      case "generating_materials":
        return 70;
      case "analyzing_syllabus":
        return 40;
      case "extracting_text":
        return 20;
      case "queued":
        return 5;
      case "started":
        return 10; // Added 'started' which was in the original code
      default:
        return 0;
    }
  };

  const getStatusDetails = (currentStatus) => {
    switch (currentStatus) {
      case "completed":
        return {
          title: "Generation Complete",
          description: "Your course materials are ready.",
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          color: "text-green-700 bg-green-50 border-green-200",
        };
      case "failed":
        return {
          title: "Generation Failed",
          description:
            statusData?.error || "An error occurred during generation.",
          icon: <XCircle className="h-6 w-6 text-red-500" />,
          color: "text-red-700 bg-red-50 border-red-200",
        };
      case "generating_materials":
        return {
          title: "Generating Materials",
          description: "Creating lectures, slides, and assessments.",
          icon: (
            <GraduationCap className="h-6 w-6 text-purple-500 animate-pulse" />
          ),
          color: "text-purple-700 bg-purple-50 border-purple-200",
        };
      case "analyzing_syllabus":
        return {
          title: "Analyzing Syllabus",
          description: "Understanding the syllabus structure.",
          icon: <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />,
          color: "text-indigo-700 bg-indigo-50 border-indigo-200",
        };
      case "extracting_text":
        return {
          title: "Extracting Text",
          description: "Reading the syllabus PDF.",
          icon: <FileText className="h-6 w-6 text-blue-500 animate-pulse" />,
          color: "text-blue-700 bg-blue-50 border-blue-200",
        };
      case "queued":
        return {
          title: "Queued",
          description: "Generation will start shortly.",
          icon: <Clock className="h-6 w-6 text-amber-500" />,
          color: "text-amber-700 bg-amber-50 border-amber-200",
        };
      case "started":
        return {
          title: "Started",
          description: "Generation process initiated.",
          icon: <Clock className="h-6 w-6 text-amber-500" />,
          color: "text-amber-700 bg-amber-50 border-amber-200",
        }; // Added 'started'
      default:
        return {
          title: "Processing",
          description: "Status unknown or processing.",
          icon: <Clock className="h-6 w-6 text-slate-500" />,
          color: "text-slate-700 bg-slate-50 border-slate-200",
        };
    }
  };

  if (loading && !statusData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-20 w-full rounded-lg mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-full rounded-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDisplayStatus = statusData?.status || "started";
  const statusDetailsToDisplay = getStatusDetails(currentDisplayStatus);
  const progressValue = getProgressValue(currentDisplayStatus);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/teacher/course-generator"
          className="text-slate-600 hover:text-red-600 flex items-center mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:text-red-500" /> Back
          to Course Generator
        </Link>
        <h1 className="text-3xl font-bold flex items-center text-slate-800">
          <GraduationCap className="mr-3 h-8 w-8 text-red-500" /> Course
          Generation Status
        </h1>
        <p className="text-slate-500 mt-2">
          Track the progress for course ID:{" "}
          <span className="font-mono text-sm text-slate-600">
            {courseId || "N/A"}
          </span>
        </p>
      </div>

      {error && !manualRefreshing && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" /> <AlertTitle>Error</AlertTitle>{" "}
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6 overflow-hidden shadow-md">
        <CardContent className="p-0">
          <div className={`p-6 ${statusDetailsToDisplay.color}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4 pt-0.5">
                {statusDetailsToDisplay.icon}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-1">
                  {statusDetailsToDisplay.title}
                </h3>
                <p className="text-sm">{statusDetailsToDisplay.description}</p>
                {currentDisplayStatus === "failed" && statusData?.error && (
                  <p className="text-xs mt-1 opacity-80">
                    Details: {statusData.error}
                  </p>
                )}
              </div>
              {currentDisplayStatus !== "completed" &&
                currentDisplayStatus !== "failed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto bg-white border-slate-300 hover:bg-slate-50 text-slate-700"
                    onClick={handleManualRefresh}
                    disabled={manualRefreshing || (loading && !statusData)}
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 mr-1.5 ${
                        manualRefreshing || (loading && !statusData)
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                    Refresh
                  </Button>
                )}
            </div>
          </div>

          <div className="p-6">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">
                Progress
              </span>
              <span className="text-sm font-medium text-slate-700">
                {progressValue}%
              </span>
            </div>
            <Progress
              value={progressValue}
              className="h-2.5 mb-4"
              indicatorClassName={
                currentDisplayStatus === "failed"
                  ? "bg-red-500"
                  : "bg-green-500"
              }
            />

            <div className="space-y-3 mt-6 text-sm">
              {[
                "extracting_text",
                "analyzing_syllabus",
                "generating_materials",
                "completed",
              ].map((stage) => {
                const stageProgress = getProgressValue(stage);
                // isActive means this stage is the current one, or we've passed it (unless failed)
                const isActive =
                  progressValue >= stageProgress ||
                  (currentDisplayStatus === stage &&
                    currentDisplayStatus !== "failed");
                // isDone means we've passed this stage and not failed
                const isDone =
                  progressValue >= stageProgress &&
                  currentDisplayStatus !== "failed" &&
                  stage !== currentDisplayStatus;
                const isCurrent =
                  currentDisplayStatus === stage &&
                  currentDisplayStatus !== "failed";

                let stageText = "Unknown Stage";
                if (stage === "extracting_text")
                  stageText = "Extracting text from PDF";
                if (stage === "analyzing_syllabus")
                  stageText = "Analyzing syllabus structure";
                if (stage === "generating_materials")
                  stageText = "Generating course materials";
                if (stage === "completed")
                  stageText = "Course generation complete";

                let iconColorClass = "bg-slate-100 text-slate-400"; // Default for pending
                if (
                  isDone ||
                  (stage === "completed" &&
                    currentDisplayStatus === "completed")
                ) {
                  iconColorClass = "bg-green-100 text-green-600";
                } else if (isCurrent) {
                  iconColorClass = "bg-blue-100 text-blue-600 animate-pulse";
                } else if (
                  currentDisplayStatus === "failed" &&
                  progressValue >= stageProgress
                ) {
                  // If failed, but this stage was theoretically reached or passed
                  iconColorClass = "bg-red-100 text-red-500";
                }

                return (
                  <div key={stage} className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${iconColorClass}`}
                    >
                      {isDone ||
                      (stage === "completed" &&
                        currentDisplayStatus === "completed") ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : currentDisplayStatus === "failed" &&
                        progressValue >= stageProgress &&
                        stage !== "completed" ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                      )}
                    </div>
                    <span
                      className={`${
                        isActive || isDone ? "text-slate-800" : "text-slate-500"
                      }`}
                    >
                      {stageText}
                    </span>
                  </div>
                );
              })}
            </div>

            {currentDisplayStatus === "completed" && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={() =>
                    router.push(`/teacher/course-generator/${courseId}`)
                  }
                >
                  <GraduationCap className="mr-2 h-4 w-4" /> View Generated
                  Course
                </Button>
              </div>
            )}
            {currentDisplayStatus === "failed" && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <Button
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white"
                  onClick={() =>
                    router.push("/teacher/course-generator/upload")
                  }
                >
                  <FileText className="mr-2 h-4 w-4" /> Upload New Syllabus &
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
