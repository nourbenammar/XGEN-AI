"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { teacherAPI } from "@/services/api";
import {
  FileText,
  Upload,
  Cog,
  Trash2,
  Eye,
  AlertTriangle,
  Check,
  Clock,
  FileIcon,
  Calendar,
  HardDrive,
  AlertCircle,
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

export default function DocumentListPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [processingDocId, setProcessingDocId] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const data = await teacherAPI.getDocuments();
        setDocuments(data.documents || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError("Failed to load documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      setIsDeleting(true);
      await teacherAPI.deleteDocument(documentToDelete.id);
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete.id));
      setShowDeleteDialog(false);
      setDocumentToDelete(null);
    } catch (err) {
      console.error("Failed to delete document:", err);
      setError(`Failed to delete document: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProcessDocument = async (documentId) => {
    try {
      setProcessingDocId(documentId);
      await teacherAPI.processDocument(documentId);
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === documentId
            ? { ...doc, processing_status: "processed" }
            : doc
        )
      );
    } catch (err) {
      console.error("Failed to process document:", err);
      setError(`Failed to process document: ${err.message}`);
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                processing_status: "error",
                processing_error: err.message,
              }
            : doc
        )
      );
    } finally {
      setProcessingDocId(null);
    }
  };

  const confirmDelete = (document) => {
    setDocumentToDelete(document);
    setShowDeleteDialog(true);
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
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-10 w-44" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
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
            <FileText className="mr-3 h-8 w-8 text-red-500" />
            Document Library
          </h1>
          <p className="text-slate-500 mt-2">
            Manage uploaded documents and their processing status
          </p>
        </div>
        <Link href="/teacher/documents/upload">
          <Button className="bg-red-500 hover:bg-red-600">
            <Upload className="mr-2 h-4 w-4" /> Upload New Document
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <Card
              key={document.id}
              className="overflow-hidden transition-all hover:shadow-lg border-slate-200"
            >
              <CardHeader className="bg-slate-50 pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle
                    className="text-xl font-semibold text-slate-800 truncate pr-2"
                    title={document.title}
                  >
                    {document.title}
                  </CardTitle>
                  {getStatusBadge(document.processing_status)}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-slate-600">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Uploaded</p>
                      <p>{formatDate(document.upload_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <HardDrive className="h-4 w-4 mr-2 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Size</p>
                      <p>{formatFileSize(document.file_size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <FileIcon className="h-4 w-4 mr-2 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Pages</p>
                      <p>{document.page_count || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <div className="truncate w-full">
                      <p className="text-xs text-slate-500">Filename</p>
                      <p className="truncate" title={document.filename}>
                        {document.filename}
                      </p>
                    </div>
                  </div>
                </div>

                {document.processing_error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Error: {document.processing_error}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between pt-3 pb-3">
                <Button
                  variant="outline"
                  className="text-slate-700 border-slate-300"
                  onClick={() =>
                    router.push(`/teacher/documents/${document.id}`)
                  }
                >
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </Button>
                <div className="flex space-x-2">
                  {document.processing_status !== "processed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => handleProcessDocument(document.id)}
                      disabled={processingDocId === document.id}
                    >
                      {processingDocId === document.id ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                          <Cog className="h-4 w-4 mr-1" /> Process
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => confirmDelete(document)}
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
              <FileText className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-2xl font-medium text-slate-700 mb-2">
                No Documents Found
              </h3>
              <p className="text-slate-500 mb-6">
                Upload your first document to get started
              </p>
              <Link href="/teacher/documents/upload">
                <Button className="bg-red-500 hover:bg-red-600">
                  <Upload className="mr-2 h-4 w-4" /> Upload Document
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
                "{documentToDelete?.title}"
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