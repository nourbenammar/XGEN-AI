"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { studentAPI } from "@/services/api";
import { MessageSquare, FileText, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatDocumentListPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const data = await studentAPI.getChatDocuments();
        setDocuments(data.documents || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch chat documents:", err);
        setError("Failed to load available documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-slate-200">
              <CardHeader>
                <Skeleton className="h-6 w-4/5 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
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
            <MessageSquare className="mr-3 h-8 w-8 text-red-500" />
            Chat with Documents
          </h1>
          <p className="text-slate-500 mt-2">
            Select a processed document to start chatting
          </p>
        </div>
        <Link href="/student/chat/sessions">
          <Button variant="outline" className="text-slate-700 border-slate-300">
            <MessageSquare className="mr-2 h-4 w-4" /> My Chat Sessions
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
              className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow"
            >
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle
                    className="text-lg font-semibold text-slate-800 truncate pr-2"
                    title={document.title}
                  >
                    {document.title}
                  </CardTitle>
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Processed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex items-center text-slate-600">
                    <FileText className="h-4 w-4 mr-2 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Pages</p>
                      <p>{document.page_count || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Uploaded</p>
                      <p>{formatDate(document.upload_date)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 pt-3 pb-3">
                <Button
                  className="w-full bg-red-500 hover:bg-red-600"
                  onClick={() =>
                    router.push(`/student/chat/start/${document.id}`)
                  }
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> Start Chat
                </Button>
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
                No Documents Available
              </h3>
              <p className="text-slate-500 mb-6">
                There are no processed documents available for chat yet.
              </p>
              <p className="text-slate-500">
                Please contact your teacher to upload and process documents.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}