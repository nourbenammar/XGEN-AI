"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { studentAPI } from "@/services/api";
import {
  History,
  Plus,
  MessageSquare,
  Calendar,
  Clock,
  Trash2,
  FileText,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatSessionListPage() {
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        setLoading(true);
        const data = await studentAPI.getChatSessions();
        setChatSessions(data.chat_sessions || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch chat sessions:", err);
        setError("Failed to load your chat sessions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatSessions();
  }, []);

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

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;

    try {
      setDeleting(true);
      await studentAPI.deleteSession(sessionToDelete.id);
      setChatSessions(
        chatSessions.filter((session) => session.id !== sessionToDelete.id)
      );
      setShowDeleteDialog(false);
      setSessionToDelete(null);
    } catch (err) {
      console.error("Failed to delete session:", err);
      // Keep the dialog open with an error message
      setError(`Failed to delete the session: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (session) => {
    setSessionToDelete(session);
    setShowDeleteDialog(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead>
                      <Skeleton className="h-4 w-32" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead className="text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i} className="hover:bg-slate-50">
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-slate-800">
            <History className="mr-3 h-8 w-8 text-red-500" />
            My Chat Sessions
          </h1>
          <p className="text-slate-500 mt-2">
            View and continue your chat sessions
          </p>
        </div>
        <Link href="/student/chat/documents">
          <Button className="bg-red-500 hover:bg-red-600">
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {chatSessions.length > 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <CardTitle className="text-xl text-slate-800">
              Recent Chat Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-semibold">
                      Session Name
                    </TableHead>
                    <TableHead className="font-semibold">Document</TableHead>
                    <TableHead className="font-semibold">Started</TableHead>
                    <TableHead className="font-semibold">
                      Last Activity
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chatSessions.map((session) => (
                    <TableRow key={session.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">
                        {session.session_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-slate-400 mr-2" />
                          <span>
                            {session.document?.title || "Unknown Document"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 mr-1" />
                          {formatDate(session.created_at)}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 text-slate-400 mr-1" />
                          {formatDate(session.last_activity)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() =>
                              router.push(`/student/chat/${session.id}`)
                            }
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />{" "}
                            Continue
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => confirmDelete(session)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                Session
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-slate-200 text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <MessageSquare className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-2xl font-medium text-slate-700 mb-2">
                No Chat Sessions Found
              </h3>
              <p className="text-slate-500 mb-6">
                You haven't started any chat sessions yet
              </p>
              <Link href="/student/chat/documents">
                <Button className="bg-red-500 hover:bg-red-600">
                  <MessageSquare className="mr-2 h-4 w-4" /> Start a Chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Delete</DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">
                &quot;{sessionToDelete?.session_name}&quot;
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
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSession}
              disabled={deleting}
            >
              {deleting ? (
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
    </div>
  );
}
