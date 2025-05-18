"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  FileCheck,
  FileSearch,
  FileCog,
  BookText,
  Files,
  GraduationCap,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Syllabus",
    href: "/syllabus",
    icon: BookOpen,
    color: "text-red-500",
  },
  {
    title: "Syllabus Generator",
    href: "/syllabus_generator",
    icon: FileText,
    color: "text-red-500",
  },
  {
    title: "Exam Generation",
    href: "/exam_generation",
    icon: FileCheck,
    color: "text-red-500",
  },
  {
    title: "Exam Evaluation",
    href: "/exam_evaluation",
    icon: FileSearch,
    color: "text-red-500",
  },
  {
    title: "Alignemant Evaluation",
    href: "/alignemant_evaluation",
    icon: FileCog,
    color: "text-red-500",
  },
  {
    title: "Documents Chat",
    href: "/student/chat/documents",
    icon: Files,
    color: "text-red-500",
  },
  {
    title: "Documents Management",
    href: "/teacher/documents",
    icon: BookText,
    color: "text-red-500",
  },
  {
    title: "Course Generator",
    href: "/teacher/course-generator",
    icon: GraduationCap,
    color: "text-red-500",
  },
];

export function Sidebar({ isOpen, isMobile }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 border-r bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg transition-all duration-300",
        isMobile ? "top-0 h-screen" : "top-14 h-[calc(100vh-3.5rem)]",
        isOpen ? "w-64" : "w-20",
        !isOpen && isMobile ? "-left-full" : "left-0",
        isMobile && "z-50"
      )}
    >
      <ScrollArea className="h-full py-6">
        <div className="space-y-4 px-2">
          <nav className="space-y-2">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50",
                  isOpen ? "px-3 py-2" : "p-2 justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", item.color)} />
                {isOpen && (
                  <span className="ml-3 text-sm font-medium">{item.title}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}