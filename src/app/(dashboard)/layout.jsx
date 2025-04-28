// src/app/(dashboard)/layout.jsx
"use client";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const savedState = localStorage.getItem("sidebarState");
    if (savedState) {
      setIsSidebarOpen(JSON.parse(savedState));
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="alumni-verse-theme">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex pt-14">
          {" "}
          {/* Added pt-14 to account for header height */}
          {/* Overlay for mobile sidebar */}
          {isMobile && isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} />
          <main
            className={cn(
              "flex-1 min-h-[calc(100vh-3.5rem)] transition-all duration-300",
              isSidebarOpen ? "md:pl-64" : "md:pl-20" // Use padding instead of margin
            )}
          >
            <div className="p-4 sm:p-6 max-w-full">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
