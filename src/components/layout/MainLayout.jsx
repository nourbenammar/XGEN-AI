import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function MainLayout({ children }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="alumni-verse-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}