// src/components/layout/Header.jsx
"use client";

import {
  Bell,
  Menu,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header({ toggleSidebar, isSidebarOpen }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg">
      <div className="flex h-14 items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          )}
        </Button>

        <div className="flex items-center font-bold text-xl bg-gradient-to-r from-red-900 to-red-500 bg-clip-text text-transparent shrink-0">
          XGEN
        </div>

        <div className="flex-1 flex items-center gap-4">

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-slate-100 dark:bg-slate-800 border-0 w-full"
          />
        </div>
      </div>
    </header>
  );
}
