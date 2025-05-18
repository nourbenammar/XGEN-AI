"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { studentAPI } from "@/services/api";
import {
  MessageSquare,
  ExternalLink,
  Trash2,
  Send,
  ThumbsUp,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Smile,
  Check,
  X,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ChatInterfacePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId;
  const messagesEndRef = useRef(null);

  const [chatSession, setChatSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [currentMessageForFeedback, setCurrentMessageForFeedback] =
    useState(null);
  const [showSourceMappings, setShowSourceMappings] = useState({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState({});
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [feedbackData, setFeedbackData] = useState({
    relevance: null,
    clarity: null,
    length: null,
    irrelevant_chunks: [],
  });

  // Fetch chat session details and messages
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);

        // Fetch session details
        const sessionData = await studentAPI.getChatSession(sessionId);
        setChatSession(sessionData.chat_session);

        // Fetch messages
        const messagesData = await studentAPI.getChatMessages(sessionId);
        setMessages(messagesData.messages || []);

        // Initialize feedback submitted state for messages
        const feedbackState = {};
        messagesData.messages?.forEach((msg) => {
          if (
            !msg.is_user &&
            (msg.feedback.relevance !== null ||
              msg.feedback.clarity !== null ||
              msg.feedback.length !== null)
          ) {
            feedbackState[msg.id] = true;
          }
        });
        setFeedbackSubmitted(feedbackState);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch chat data:", err);
        setError("Failed to load chat. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchChatData();
    }
  }, [sessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user message to UI immediately
    const userMessage = {
      id: `temp-${Date.now()}`,
      is_user: true,
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, userMessage]);
    setQuestion("");
    setIsThinking(true);

    try {
      // Send question to backend
      const data = await studentAPI.askQuestion(sessionId, question.trim());

      // Add system message from response
      const aiResponse = {
        id: data.message_id,
        is_user: false,
        content: data.content,
        timestamp: new Date().toISOString(),
        error: data.error,
        source_mappings: data.mappings || [],
        feedback: data.feedback || {
          relevance: null,
          clarity: null,
          length: null,
        },
      };

      // Replace temp message and add AI response
      setMessages((prevMessages) => {
        const filteredMessages = prevMessages.filter(
          (m) => !m.id.startsWith("temp-")
        );
        return [...filteredMessages, userMessage, aiResponse];
      });
    } catch (err) {
      console.error("Failed to get answer:", err);

      // Add error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        is_user: false,
        content:
          "Sorry, an error occurred while processing your question. Please try again.",
        timestamp: new Date().toISOString(),
        error: true,
      };

      setMessages((prevMessages) => {
        const filteredMessages = prevMessages.filter(
          (m) => !m.id.startsWith("temp-")
        );
        return [...filteredMessages, userMessage, errorMessage];
      });

      setError("Failed to get a response. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toggleSourceMappings = (messageId) => {
    setShowSourceMappings((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const handleDeleteSession = async () => {
    if (!chatSession) return;

    try {
      setIsDeleting(true);
      await studentAPI.deleteSession(sessionId);

      // Redirect to sessions list on successful deletion
      router.push("/student/chat/sessions");
    } catch (err) {
      console.error("Failed to delete session:", err);
      setError("Failed to delete the chat session. Please try again.");
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const openFeedbackDialog = (message) => {
    setCurrentMessageForFeedback(message);
    setFeedbackData({
      relevance: null,
      clarity: null,
      length: null,
      irrelevant_chunks: [],
    });
    setShowFeedbackDialog(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!currentMessageForFeedback) return;

    try {
      setIsSubmittingFeedback(true);

      // Prepare feedback payload
      const feedbackPayload = { ...feedbackData };

      // Convert string 'true'/'false' to actual boolean if needed
      if (typeof feedbackPayload.relevance === "string") {
        feedbackPayload.relevance = feedbackPayload.relevance === "true";
      }

      if (typeof feedbackPayload.clarity === "string") {
        feedbackPayload.clarity = feedbackPayload.clarity === "true";
      }

      // Send feedback to backend
      await studentAPI.provideFeedback(
        sessionId,
        currentMessageForFeedback.id,
        feedbackPayload
      );

      // Update UI to show feedback was submitted
      setFeedbackSubmitted((prev) => ({
        ...prev,
        [currentMessageForFeedback.id]: true,
      }));

      // Update message with feedback
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === currentMessageForFeedback.id
            ? {
                ...msg,
                feedback: {
                  relevance: feedbackData.relevance,
                  clarity: feedbackData.clarity,
                  length: feedbackData.length,
                },
              }
            : msg
        )
      );

      setShowFeedbackDialog(false);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleIrrelevantChunkToggle = (chunkId) => {
    setFeedbackData((prev) => {
      const updatedChunks = prev.irrelevant_chunks.includes(chunkId)
        ? prev.irrelevant_chunks.filter((id) => id !== chunkId)
        : [...prev.irrelevant_chunks, chunkId];

      return {
        ...prev,
        irrelevant_chunks: updatedChunks,
      };
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <Skeleton className="h-8 w-96 mb-2" />
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100">
            <Skeleton className="h-6 w-64" />
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </CardHeader>

          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
            <Skeleton className="h-5 w-72" />
          </div>

          <div className="flex flex-col h-[calc(100vh-320px)] min-h-[500px]">
            {/* Chat Messages Skeleton */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <Skeleton className="w-2/3 h-24 rounded-2xl rounded-tl-none" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="w-1/2 h-16 rounded-2xl rounded-tr-none" />
                </div>
                <div className="flex justify-start">
                  <Skeleton className="w-3/4 h-32 rounded-2xl rounded-tl-none" />
                </div>
              </div>
            </div>

            {/* Input Area Skeleton */}
            <CardFooter className="p-4 border-t border-slate-200 bg-white">
              <div className="w-full flex gap-2">
                <Skeleton className="flex-1 h-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/student/chat/documents">
                Chat Documents
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/student/chat/sessions">
                My Sessions
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                {chatSession?.session_name || "Chat Session"}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100">
          <CardTitle className="text-xl text-slate-800">
            {chatSession?.session_name || "Chat Session"}
          </CardTitle>
          <div className="flex space-x-2">
            {chatSession?.document?.id && (
              <Link
                href={`/teacher/documents/${chatSession.document.id}`}
                target="_blank"
              >
                <Button variant="outline" size="sm" className="text-slate-700">
                  <ExternalLink className="h-4 w-4 mr-1" /> View Document
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete Session
            </Button>
          </div>
        </CardHeader>

        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center text-sm text-slate-600">
            <FileText className="h-4 w-4 mr-2 text-slate-500" />
            <strong className="mr-2">
              {chatSession?.document?.title || "Document"}
            </strong>
            <span className="text-slate-500 ml-2">
              {chatSession?.document?.page_count || "?"} pages
            </span>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100vh-320px)] min-h-[500px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>No messages yet. Start by asking a question below.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.is_user ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`
                        max-w-3xl rounded-2xl p-4 shadow-sm
                        ${
                          message.is_user
                            ? "bg-red-500 text-white rounded-tr-none"
                            : "bg-white border border-slate-200 rounded-tl-none"
                        }
                        ${
                          message.error
                            ? "bg-red-100 text-red-800 border-red-200"
                            : ""
                        }
                      `}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>

                      <div
                        className={`text-xs mt-2 ${
                          message.is_user ? "text-red-100" : "text-slate-500"
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                      </div>

                      {/* Source Mappings for AI messages */}
                      {!message.is_user &&
                        message.source_mappings &&
                        message.source_mappings.length > 0 && (
                          <div className="mt-4 pt-2 border-t border-slate-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 p-0 h-auto text-xs flex items-center"
                              onClick={() => toggleSourceMappings(message.id)}
                            >
                              {showSourceMappings[message.id] ? (
                                <>
                                  <ChevronUp className="h-3 w-3 mr-1" /> Hide
                                  Sources
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3 mr-1" /> Show
                                  Sources
                                </>
                              )}
                            </Button>

                            {showSourceMappings[message.id] && (
                              <div className="mt-2 space-y-2">
                                {message.source_mappings.map(
                                  (source, index) => (
                                    <div
                                      key={index}
                                      className="bg-slate-50 p-3 rounded-md border border-slate-200 text-sm"
                                    >
                                      <div className="text-slate-700 border-l-2 border-red-400 pl-2 italic text-xs mb-2">
                                        &quot;{source.sentence}&quot;
                                      </div>
                                      <div className="text-xs text-slate-600">
                                        From:{" "}
                                        <span className="font-medium">
                                          {source.chapter_title}
                                        </span>{" "}
                                        (Page {source.chunk_page})
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                            {/* Feedback container */}
                            <div className="mt-3 pt-2 border-t border-slate-200">
                              {feedbackSubmitted[message.id] ||
                              (message.feedback &&
                                (message.feedback.relevance !== null ||
                                  message.feedback.clarity !== null ||
                                  message.feedback.length !== null)) ? (
                                <div className="flex items-center text-xs text-green-600">
                                  <Check className="h-3 w-3 mr-1" />
                                  Feedback submitted
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-600 p-0 h-auto text-xs flex items-center"
                                  onClick={() => openFeedbackDialog(message)}
                                >
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  Provide Feedback
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}

                {/* Thinking indicator */}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 max-w-3xl shadow-sm">
                      <div className="flex space-x-1 items-center">
                        <div className="h-2 w-2 bg-slate-300 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-slate-300 rounded-full animate-pulse delay-150"></div>
                        <div className="h-2 w-2 bg-slate-300 rounded-full animate-pulse delay-300"></div>
                        <span className="ml-2 text-slate-500 text-sm">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <CardFooter className="p-4 border-t border-slate-200 bg-white">
            <form onSubmit={handleQuestionSubmit} className="w-full flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Ask a question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isThinking}
                  className="pr-10 focus-visible:ring-red-500 border-slate-300"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        disabled={isThinking}
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add emoji</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-600"
                disabled={!question.trim() || isThinking}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </div>
      </Card>

      {/* Delete Session Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Delete</DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">
                &quot;{chatSession?.session_name}&quot;
              </span>
              ?
              <p className="mt-2 text-red-600">
                This will permanently remove all messages in this chat session.
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
              onClick={handleDeleteSession}
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
                  Delete Session
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Provide Feedback</DialogTitle>
            <DialogDescription className="pt-2">
              Your feedback helps improve the AI's responses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-2">
            <div className="space-y-3">
              <Label className="text-base">
                Was the response relevant to your question?
              </Label>
              <RadioGroup
                value={
                  feedbackData.relevance !== null
                    ? feedbackData.relevance.toString()
                    : undefined
                }
                onValueChange={(value) =>
                  setFeedbackData({
                    ...feedbackData,
                    relevance: value === "true",
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="relevance-yes" />
                  <Label htmlFor="relevance-yes">Yes, it was relevant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="relevance-no" />
                  <Label htmlFor="relevance-no">No, it was not relevant</Label>
                </div>
              </RadioGroup>
            </div>

            {feedbackData.relevance === false &&
              currentMessageForFeedback?.source_mappings?.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base">
                    Select which parts were not relevant:
                  </Label>
                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-md p-3 space-y-3">
                    {currentMessageForFeedback.source_mappings.map(
                      (source, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Checkbox
                            id={`chunk-${source.chunk_id}`}
                            checked={feedbackData.irrelevant_chunks.includes(
                              source.chunk_id
                            )}
                            onCheckedChange={() =>
                              handleIrrelevantChunkToggle(source.chunk_id)
                            }
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <Label
                              htmlFor={`chunk-${source.chunk_id}`}
                              className="leading-tight"
                            >
                              <div className="text-slate-700 border-l-2 border-red-400 pl-2 italic text-sm">
                                &quot;{source.sentence}&quot;
                              </div>
                              <div className="text-xs text-slate-600 mt-1">
                                From: {source.chapter_title} (Page{" "}
                                {source.chunk_page})
                              </div>
                            </Label>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="space-y-3">
              <Label className="text-base">
                Was the response clear and understandable?
              </Label>
              <RadioGroup
                value={
                  feedbackData.clarity !== null
                    ? feedbackData.clarity.toString()
                    : undefined
                }
                onValueChange={(value) =>
                  setFeedbackData({
                    ...feedbackData,
                    clarity: value === "true",
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="clarity-yes" />
                  <Label htmlFor="clarity-yes">Yes, it was clear</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="clarity-no" />
                  <Label htmlFor="clarity-no">No, it was unclear</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base">
                How was the length of the response?
              </Label>
              <RadioGroup
                value={feedbackData.length || undefined}
                onValueChange={(value) =>
                  setFeedbackData({
                    ...feedbackData,
                    length: value,
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="length-good" />
                  <Label htmlFor="length-good">Good length</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="too_long" id="length-too-long" />
                  <Label htmlFor="length-too-long">Too long</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="too_short" id="length-too-short" />
                  <Label htmlFor="length-too-short">Too short</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowFeedbackDialog(false)}
              disabled={isSubmittingFeedback}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={handleFeedbackSubmit}
              disabled={
                isSubmittingFeedback ||
                feedbackData.relevance === null ||
                feedbackData.clarity === null ||
                feedbackData.length === null
              }
            >
              {isSubmittingFeedback ? (
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
                  Submitting...
                </div>
              ) : (
                <>Submit Feedback</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
