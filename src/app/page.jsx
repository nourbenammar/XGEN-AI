import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme/theme-provider";

export default function LandingPage() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="xgen-theme">
      <div className="min-h-screen relative bg-gradient-to-br from-red-50 to-white dark:from-slate-900 dark:to-slate-800">
        
        {/* Content */}
        <div className="relative z-10">
          <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-2xl bg-gradient-to-r from-red-800 to-red-500 bg-clip-text text-transparent">
                  XGen
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-red-600">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-red-800 to-red-600 text-white px-10 py-5 text-lg rounded-full shadow-2xl hover:from-red-800 hover:to-red-500 transition-transform transform hover:scale-110">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-6 py-24 flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)]">
            <div className="max-w-3xl">
              <h1 className="text-6xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-white drop-shadow-lg">
                <span className="text-red-700">Refine</span>, <span className="text-gray-700 dark:text-gray-100">Create</span>, and <span className="text-red-700">Simplify</span> Professors' Workflows with <span className="text-gray-700 dark:text-gray-100">XGen</span>
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 drop-shadow-md">
                Enhance your teaching experience by refining syllabi and generating customized exams for your students. Join XGen today to streamline your academic processes.
              </p>
              <div className="flex justify-center">
                <Link href="/syllabus">
                  <Button className="bg-gradient-to-r from-red-800 to-red-600 text-white px-10 py-5 text-lg rounded-full shadow-2xl hover:from-red-800 hover:to-red-500 transition-transform transform hover:scale-110">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
