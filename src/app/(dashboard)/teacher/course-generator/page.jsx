"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { courseGeneratorAPI } from "@/services/api";
import {
  GraduationCap,
  Upload,
  Trash2,
  Eye,
  AlertTriangle,
  Check,
  Clock,
  Download,
  Calendar,
  Layers,
  FileText,
  AlertCircle,
  RefreshCw,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function CourseGeneratorPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseGeneratorAPI.getCourses();
      setCourses(data.courses || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchCourses();
    } catch (err) {
      console.error("Failed to refresh courses:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsDeleting(true);
      await courseGeneratorAPI.deleteCourse(courseToDelete.course_id);
      setCourses(
        courses.filter(
          (course) => course.course_id !== courseToDelete.course_id
        )
      );
      setShowDeleteDialog(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error("Failed to delete course:", err);
      setError(`Failed to delete course: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (course) => {
    setCourseToDelete(course);
    setShowDeleteDialog(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "N/A";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Date parsing error:", e);
      return "N/A";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            <Check size={14} className="mr-1" /> Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <AlertTriangle size={14} className="mr-1" /> Failed
          </Badge>
        );
      case "extracting_text":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300"
          >
            <Clock size={14} className="mr-1" /> Extracting Text
          </Badge>
        );
      case "analyzing_syllabus":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300"
          >
            <Clock size={14} className="mr-1" /> Analyzing Syllabus
          </Badge>
        );
      case "generating_materials":
        return (
          <Badge
            variant="outline"
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-300"
          >
            <Clock size={14} className="mr-1" /> Generating Materials
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-300"
          >
            <Clock size={14} className="mr-1" /> In Progress
          </Badge>
        );
    }
  };

  const getProgressValue = (status) => {
    switch (status) {
      case "completed":
        return 100;
      case "failed":
        return 100;
      case "extracting_text":
        return 20;
      case "analyzing_syllabus":
        return 40;
      case "generating_materials":
        return 70;
      default:
        return 10;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-10 w-44" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="overflow-hidden transition-all border-slate-200"
            >
              <CardHeader className="bg-slate-50 pb-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Skeleton className="h-4 w-full mb-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between pt-3 pb-3">
                <Skeleton className="h-9 w-28" />
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-slate-800">
            <GraduationCap className="mr-3 h-8 w-8 text-red-500" />
            Course Generator
          </h1>
          <p className="text-slate-500 mt-2">
            Generate complete course materials from syllabus documents
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-slate-300"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Link href="/teacher/course-generator/upload">
            <Button className="bg-red-500 hover:bg-red-600">
              <Upload className="mr-2 h-4 w-4" /> Upload Syllabus
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.course_id}
              className="overflow-hidden transition-all hover:shadow-lg border-slate-200"
            >
              <CardHeader className="bg-slate-50 pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle
                    className="text-xl font-semibold text-slate-800 truncate pr-2"
                    title={course.course_title}
                  >
                    {course.course_title}
                  </CardTitle>
                  {getStatusBadge(course.status)}
                </div>
                {course.status !== "completed" &&
                  course.status !== "failed" && (
                    <div className="mt-3">
                      <Progress
                        value={getProgressValue(course.status)}
                        className="h-2"
                      />
                    </div>
                  )}
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-slate-600">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Created</p>
                      <p>{formatDate(course.started_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Layers className="h-4 w-4 mr-2 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Modules</p>
                      <p>{course.modules_count || "0"}</p>
                    </div>
                  </div>
                </div>

                {course.status === "failed" && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Error: Generation failed. Please try again.
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between pt-3 pb-3">
                {course.status === "completed" ? (
                  <Button
                    variant="outline"
                    className="text-slate-700 border-slate-300"
                    onClick={() =>
                      router.push(
                        `/teacher/course-generator/${course.course_id}`
                      )
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" /> View Materials
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="text-slate-700 border-slate-300"
                    onClick={() =>
                      router.push(
                        `/teacher/course-generator/${course.course_id}/status`
                      )
                    }
                  >
                    <Clock className="h-4 w-4 mr-2" /> View Status
                  </Button>
                )}
                <div className="flex space-x-2">
                  {course.status === "completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      onClick={() =>
                        courseGeneratorAPI.downloadCourse(course.course_id)
                      }
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => confirmDelete(course)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-slate-200 text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <GraduationCap className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-2xl font-medium text-slate-700 mb-2">
                No Courses Found
              </h3>
              <p className="text-slate-500 mb-6">
                Upload a syllabus to generate your first course
              </p>
              <Link href="/teacher/course-generator/upload">
                <Button className="bg-red-500 hover:bg-red-600">
                  <Upload className="mr-2 h-4 w-4" /> Upload Syllabus
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Delete</DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">
                "{courseToDelete?.course_title}"
              </span>
              ?
              <p className="mt-2 text-red-600">
                This will permanently remove the course and all generated
                materials.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCourse}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center">
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
                  Deleting...
                </div>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Course
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
