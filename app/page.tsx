"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import TypingTest from "./components/TypingTest";
import StatsSection from "./components/StatsSection";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const customStyles = `
  :root {
    // Color palette for light mode
    --background: #ffffff;
    --foreground: #171717;
    --card: #ffffff;
    --card-foreground: #171717;
    --popover: #ffffff;
    --popover-foreground: #171717;
    --primary: #2563eb;
    --primary-foreground: #ffffff;
    --secondary: #f1f5f9;
    --secondary-foreground: #171717;
    --muted: #f1f5f9;
    --muted-foreground: #64748b;
    --accent: #f1f5f9;
    --accent-foreground: #171717;
    --destructive: #ef4444;
    --destructive-foreground: #ffffff;
    --border: #e2e8f0;
    --input: #e2e8f0;
    --ring: #2563eb;
    --indigo: #6366f1;
    --radius: 0.5rem;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      // Dark mode overrides
      --background: #0a0a0a;
      --foreground: #ededed;
      --card: #171717;
      --card-foreground: #ededed;
      --popover: #171717;
      --popover-foreground: #ededed;
      --primary: #2563eb;
      --primary-foreground: #ffffff;
      --secondary: #27272a;
      --secondary-foreground: #ededed;
      --muted: #27272a;
      --muted-foreground: #a1a1aa;
      --accent: #27272a;
      --accent-foreground: #ededed;
      --destructive: #ef4444;
      --destructive-foreground: #ffffff;
      --border: #27272a;
      --input: #27272a;
      --ring: #2563eb;
      --indigo: #818cf8;
    }
  }
  // Animations
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .animate-pulse { animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  @keyframes fade-in-left {
    0% { opacity: 0; transform: translateX(-20px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  .animate-fade-in-left { animation: fade-in-left 0.8s ease-out forwards; }
  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
`;

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [testTime, setTestTime] = useState<number>(30);
  const [isPractice, setIsPractice] = useState(false);

  useEffect(() => {
    const handleSwitchToRealTest = () => {
      setIsPractice(false);
    };
    const handleViewStats = () => {
      setCurrentPage("stats");
    };
    window.addEventListener("switchToRealTest", handleSwitchToRealTest);
    window.addEventListener("viewStats", handleViewStats);
    return () => {
      window.removeEventListener("switchToRealTest", handleSwitchToRealTest);
      window.removeEventListener("viewStats", handleViewStats);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const goToPage = useCallback((target: "home" | "test" | "stats") => {
    setCurrentPage(target);
    setIsPractice(false);
  }, []);

  const startPractice = useCallback(() => {
    setIsPractice(true);
    setCurrentPage("test");
  }, []);

  const pickTestDuration = useCallback((newDuration: number) => {
    setTestTime(newDuration);
  }, []);

  const saveTestResult = useCallback(
    (result: {
      wpm: number;
      accuracy: number;
      mistakes: number;
      duration: number;
    }) => {
      if (isPractice) return;
      const newResult = {
        ...result,
        date: new Date().toISOString(),
      };
      const stored = localStorage.getItem("typingResults");
      const results = stored ? JSON.parse(stored) : [];
      results.push(newResult);
      localStorage.setItem("typingResults", JSON.stringify(results));
    },
    [isPractice]
  );

  return (
    <div
      className={`${raleway.className} min-h-screen flex flex-col bg-background text-foreground`}
    >
      <style jsx global>
        {customStyles}
      </style>
      <Navbar onNavigate={goToPage} onPractice={startPractice} />
      <main className="flex-grow pt-16">
        {currentPage === "home" && (
          <>
            <HeroSection onNavigate={goToPage} onPractice={startPractice} />
            <FeaturesSection />
          </>
        )}
        {currentPage === "test" && (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                {isPractice ? "Practice Mode" : "Typing Test"}
              </h1>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                {isPractice
                  ? "Practice mode - results won't be saved to your stats."
                  : "Start typing in the input field below. The timer will begin as soon as you start typing."}
              </p>
              {isPractice && (
                <button
                  onClick={() => {
                    setIsPractice(false);
                  }}
                  className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Switch to Test Mode
                </button>
              )}
            </div>
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-4 p-3 rounded-full bg-secondary">
                {[15, 30, 60].map((d) => (
                  <button
                    key={d}
                    onClick={() => pickTestDuration(d)}
                    className={`px-4 py-2 rounded-full flex items-center gap-1 cursor-pointer shadow-sm border ${
                      testTime === d
                        ? "bg-primary text-primary-foreground border-primary/30"
                        : "bg-transparent hover:bg-background/50 border-secondary/30"
                    } hover:shadow-md`}
                  >
                    <span>{d}s</span>
                  </button>
                ))}
              </div>
            </div>
            <TypingTest
              duration={testTime}
              onTestComplete={saveTestResult}
              isPractice={isPractice}
            />
          </div>
        )}
        {currentPage === "stats" && <StatsSection />}
      </main>
      <Footer onNavigate={goToPage} onPractice={startPractice} />
    </div>
  );
}
