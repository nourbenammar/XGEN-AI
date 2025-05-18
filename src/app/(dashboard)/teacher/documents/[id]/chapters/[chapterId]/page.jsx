"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Book,
  FileText,
  Puzzle,
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
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { teacherAPI } from "@/services/api";

export default function ChapterViewPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id;
  const chapterId = params.chapterId;

  const [document, setDocument] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAccordions, setOpenAccordions] = useState([]);

  useEffect(() => {
    const fetchChapterDetails = async () => {
      try {
        setLoading(true);
        const data = await teacherAPI.getChapter(documentId, chapterId);
        setDocument(data.document || null);
        setChapter(data.chapter || null);
        setChunks(data.chunks || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch chapter details:", err);
        setError("Failed to load chapter details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (documentId && chapterId) {
      fetchChapterDetails();
    }
  }, [documentId, chapterId]);

  const handleAccordionChange = (value) => {
    const MAX_OPEN = 5;
    setOpenAccordions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        const newOpenList = [...prev, value];
        if (newOpenList.length > MAX_OPEN) {
          return newOpenList.slice(1);
        }
        return newOpenList;
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-80 mb-4" />
          <Skeleton className="h-10 w-1/2 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
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
              <BreadcrumbLink href={`/teacher/documents/${documentId}`}>
                {document?.title || "Document"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{chapter?.title || "Chapter"}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {error && (
          <div className="mt-4 mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4">
          <h1 className="text-3xl font-bold flex items-center text-slate-800">
            <Book className="mr-3 h-8 w-8 text-red-500" />
            {chapter?.title || "Chapter Details"}
          </h1>
          {chapter && (
            <p className="text-slate-500 mt-2">
              Pages {chapter.start_page} - {chapter.end_page} | Document:{" "}
              {document?.title || "Document"}
            </p>
          )}
        </div>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Puzzle className="mr-2 h-5 w-5 text-slate-400" />
            Text Chunks
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {chunks?.length || 0} chunks
          </Badge>
        </CardHeader>
        <CardContent>
          {chunks && chunks.length > 0 ? (
            <Accordion
              type="multiple"
              value={openAccordions}
              onValueChange={(value) => setOpenAccordions(value)}
              className="space-y-2"
            >
              {chunks.map((chunk) => (
                <AccordionItem
                  key={chunk.id}
                  value={`chunk-${chunk.id}`}
                  className="border border-slate-200 rounded-md overflow-hidden"
                >
                  <AccordionTrigger
                    onClick={() => handleAccordionChange(`chunk-${chunk.id}`)}
                    className="px-4 py-3 hover:bg-slate-50 hover:no-underline"
                  >
                    <div className="flex w-full justify-between items-center text-left">
                      <span className="font-medium text-slate-700">
                        Chunk #{chunk.sequence}
                      </span>
                      <span className="text-sm text-slate-500">
                        Page {chunk.page_number}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 px-0">
                    <div className="bg-slate-50 p-4 rounded-b-md border-t border-slate-200">
                      <div className="bg-white p-4 rounded-md border border-slate-200 mb-3">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700">
                          {chunk.text}
                        </pre>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-slate-600">
                            Embedding Status:{" "}
                          </span>
                          {chunk.embedding ? (
                            <span className="text-green-600 font-medium">
                              Generated
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium">
                              Not Generated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <Puzzle className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-medium text-slate-700 mb-2">
                No Chunks Found
              </h3>
              <p className="text-slate-500 mb-6">
                This chapter has no text chunks extracted yet
              </p>

              {document && !document.processed && (
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={() =>
                    router.push(`/teacher/documents/${documentId}`)
                  }
                >
                  <FileText className="mr-2 h-4 w-4" /> Return to Document
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button
          variant="outline"
          className="text-slate-700"
          onClick={() => router.push(`/teacher/documents/${documentId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Document
        </Button>
      </div>
    </div>
  );
}
