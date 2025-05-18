"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { studentAPI } from "@/services/api";
import {
  MessageSquare,
  FileText,
  Calendar,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function StartChatPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId;

  const [document, setDocument] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        // Fetch document details for chat using our API
        const data = await studentAPI.getDocumentForChat(documentId);
        setDocument(data.document || null);

        // Set default session name based on document title
        if (data.document && data.document.title) {
          setSessionName(`Chat about ${data.document.title}`);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch document:", err);
        setError("Failed to load document information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionName.trim()) {
      setError("Please enter a session name");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Create new chat session using our API
      const result = await studentAPI.startChat(documentId, sessionName);

      // Navigate to the chat interface with the new session ID
      if (result && result.session_id) {
        router.push(`/student/chat/${result.session_id}`);
      } else {
        throw new Error("Failed to create chat session - invalid response");
      }
    } catch (err) {
      console.error("Failed to start chat session:", err);
      setError("Failed to create chat session. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-10 w-72" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-64 mt-1" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/student/chat/documents">
                Chat Documents
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Start Chat</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold mt-4 flex items-center text-slate-800">
          <MessageSquare className="mr-3 h-8 w-8 text-red-500" />
          Start Chat
        </h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {document ? (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-xl text-slate-800">
              Chat with &quot;{document.title}&quot;
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="flex-shrink-0 p-4 bg-red-50 rounded-lg">
                <FileText className="h-10 w-10 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {document.title}
                </h2>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-slate-600 text-sm">
                    <FileText className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{document.page_count || "Unknown"} pages</span>
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    <span>Uploaded on {formatDate(document.upload_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session_name" className="text-slate-700">
                    Chat Session Name
                  </Label>
                  <Input
                    id="session_name"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="border-slate-300 focus-visible:ring-red-500"
                    required
                  />
                  <p className="text-sm text-slate-500">
                    Give this chat session a descriptive name
                  </p>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <Link href="/student/chat/documents">
                    <Button
                      variant="outline"
                      className="text-slate-700"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
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
                        Creating Session...
                      </span>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" /> Start Chat
                        Session
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-2xl font-medium text-slate-700 mb-2">
                Document Not Found
              </h3>
              <p className="text-slate-500 mb-6">
                The document you're trying to chat with doesn't exist or isn't
                available.
              </p>
              <Link href="/student/chat/documents">
                <Button className="bg-red-500 hover:bg-red-600">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}