"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { teacherAPI } from "@/services/api";
import {
  FileText,
  Trash2,
  ArrowLeft,
  Cog,
  Info,
  Book,
  FileIcon,
  Calendar,
  HardDrive,
  AlertTriangle,
  Clock,
  Check,
  Eye,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentViewPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id;

  const [document, setDocument] = useState(null);
  const [chapterInfo, setChapterInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        setLoading(true);
        const data = await teacherAPI.getDocument(documentId);
        setDocument(data.document || null);
        setChapterInfo(data.chapter_info || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch document details:", err);
        setError("Failed to load document details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocumentDetails();
    }
  }, [documentId]);

  const handleDeleteDocument = async () => {
    try {
      setIsDeleting(true);
      await teacherAPI.deleteDocument(documentId);
      router.push("/teacher/documents");
    } catch (err) {
      console.error("Failed to delete document:", err);
      setError(`Failed to delete document: ${err.message}`);
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleProcessDocument = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      await teacherAPI.processDocument(documentId);
      window.location.reload();
    } catch (err) {
      console.error("Failed to process document:", err);
      setError(`Failed to process document: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "processed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Check size={14} className="mr-1" /> Processed
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <AlertTriangle size={14} className="mr-1" /> Error
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-300"
          >
            <Clock size={14} className="mr-1" /> Pending
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-64 mb-2" />
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-10 w-1/3" />
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-slate-200">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-3 gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="col-span-2 h-4 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-slate-200">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/teacher/documents">
                Documents
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                {document?.title || "Document Details"}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {error && (
          <div className="mt-4 mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold flex items-center text-slate-800">
              <FileText className="mr-3 h-8 w-8 text-red-500" />
              {document?.title || "Document"}
            </h1>
            {document && (
              <div className="ml-4">
                {getStatusBadge(document.processing_status)}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            {document && document.processing_status !== "processed" && (
              <Button
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={handleProcessDocument}
                disabled={isProcessing}
              >
                {isProcessing ? (
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
                    Processing...
                  </>
                ) : (
                  <>
                    <Cog className="mr-2 h-4 w-4" /> Process Document
                  </>
                )}
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      </div>

      {document && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-slate-200 h-fit">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Info className="mr-2 h-5 w-5 text-slate-400" />
                Document Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-1">
                <div className="col-span-1 text-slate-500">Filename:</div>
                <div
                  className="col-span-2 truncate font-medium"
                  title={document.filename}
                >
                  {document.filename}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="col-span-1 text-slate-500">Size:</div>
                <div className="col-span-2 font-medium">
                  {formatFileSize(document.file_size)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="col-span-1 text-slate-500">Pages:</div>
                <div className="col-span-2 font-medium">
                  {document.page_count}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="col-span-1 text-slate-500">Uploaded:</div>
                <div className="col-span-2 font-medium">
                  {formatDate(document.upload_date)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="col-span-1 text-slate-500">Status:</div>
                <div className="col-span-2 font-medium">
                  <span
                    className={
                      document.processing_status === "processed"
                        ? "text-green-600"
                        : document.processing_status === "error"
                        ? "text-red-600"
                        : "text-amber-600"
                    }
                  >
                    {document.processing_status.charAt(0).toUpperCase() +
                      document.processing_status.slice(1)}
                  </span>
                </div>
              </div>

              {document.processing_error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  <strong>Error:</strong> {document.processing_error}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Book className="mr-2 h-5 w-5 text-slate-400" />
                Chapters
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chapterInfo && chapterInfo.length > 0 ? (
                <div className="overflow-hidden rounded-md border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Pages</TableHead>
                        <TableHead className="text-center">Chunks</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chapterInfo.map((info) => (
                        <TableRow key={info.chapter.id}>
                          <TableCell className="font-medium text-center">
                            {info.chapter.sequence}
                          </TableCell>
                          <TableCell>{info.chapter.title}</TableCell>
                          <TableCell>
                            {info.chapter.start_page} - {info.chapter.end_page}
                          </TableCell>
                          <TableCell className="text-center">
                            {info.chunk_count > 0 ? (
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                              >
                                {info.chunk_count}
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-slate-500"
                              >
                                0
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-slate-600"
                              onClick={() =>
                                router.push(
                                  `/teacher/documents/${document.id}/chapters/${info.chapter.id}`
                                )
                              }
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Book className="h-16 w-16 text-slate-300 mb-4" />
                  <h3 className="text-xl font-medium text-slate-700 mb-2">
                    No Chapters Found
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Document needs to be processed to extract chapters
                  </p>

                  {document && document.processing_status !== "processed" && (
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600"
                      onClick={handleProcessDocument}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
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
                          Processing...
                        </>
                      ) : (
                        <>
                          <Cog className="mr-2 h-4 w-4" /> Process Document
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8">
        <Button
          variant="outline"
          className="text-slate-700"
          onClick={() => router.push("/teacher/documents")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
        </Button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Delete</DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">
                "{document?.title}"
              </span>
              ?
              <p className="mt-2 text-red-600">
                This will permanently remove the document and all associated
                data.
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
              onClick={handleDeleteDocument}
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
                  Delete Document
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
