"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const StatsSection = () => {
  const [timeFilter, setTimeFilter] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "wpm" | "accuracy">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const getStoredResults = useCallback(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("typingResults");
    if (!stored) return [];
    const results = JSON.parse(stored);
    const uniqueMap = new Map();
    results.forEach((result: any) => {
      uniqueMap.set(result.date, result);
    });
    const uniqueResults = Array.from(uniqueMap.values());
    if (uniqueResults.length !== results.length) {
      localStorage.setItem("typingResults", JSON.stringify(uniqueResults));
    }
    return uniqueResults;
  }, []);

  const [results, setResults] = useState<
    Array<{
      date: string;
      wpm: number;
      accuracy: number;
      mistakes: number;
      duration: number;
    }>
  >(getStoredResults);

  useEffect(() => {
    const uniqueResults = getStoredResults();
    setResults(uniqueResults);
  }, []);

  const resetAllScores = useCallback(() => {
    localStorage.removeItem("typingResults");
    setResults([]);
    setShowConfirmDialog(false);
  }, []);

  const filteredResults = useMemo(() => {
    let filtered = [...results];
    if (timeFilter !== "all") {
      filtered = filtered.filter((r) => r.duration === timeFilter);
    }
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case "wpm":
          comparison = b.wpm - a.wpm;
          break;
        case "accuracy":
          comparison = b.accuracy - a.accuracy;
          break;
      }
      return sortOrder === "asc" ? -comparison : comparison;
    });
    return filtered;
  }, [results, timeFilter, sortBy, sortOrder]);

  const averageStats = useMemo(() => {
    if (filteredResults.length === 0) return { wpm: 0, accuracy: 0 };
    const sum = filteredResults.reduce(
      (acc, curr) => ({
        wpm: acc.wpm + curr.wpm,
        accuracy: acc.accuracy + curr.accuracy,
      }),
      { wpm: 0, accuracy: 0 }
    );
    return {
      wpm: Math.round(sum.wpm / filteredResults.length),
      accuracy: Math.round(sum.accuracy / filteredResults.length),
    };
  }, [filteredResults]);

  const bestScore = useMemo(() => {
    if (filteredResults.length === 0) return { wpm: 0, accuracy: 0 };
    return filteredResults.reduce((best, curr) =>
      curr.wpm > best.wpm ? curr : best
    );
  }, [filteredResults]);

  return (
    <div className={`${raleway.className} container mx-auto px-4 pt-24 pb-16`}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Your Typing Statistics</h1>
        <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
          Track your progress and see how your typing skills improve over time.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 border border-border/40"
        >
          <h3 className="text-lg font-semibold mb-2">Tests Completed</h3>
          <div className="text-3xl font-bold text-primary">
            {filteredResults.length}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border border-border/40"
        >
          <h3 className="text-lg font-semibold mb-2">Average WPM</h3>
          <div className="text-3xl font-bold text-primary">
            {averageStats.wpm}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 border border-border/40"
        >
          <h3 className="text-lg font-semibold mb-2">Best WPM</h3>
          <div className="text-3xl font-bold text-primary">{bestScore.wpm}</div>
        </motion.div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            className="px-4 py-2 rounded-md border border-input bg-background"
            value={timeFilter}
            onChange={(e) =>
              setTimeFilter(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
          >
            <option value="all">All Durations</option>
            <option value="15">15 Seconds</option>
            <option value="30">30 Seconds</option>
            <option value="60">60 Seconds</option>
          </select>
          <select
            className="px-4 py-2 rounded-md border border-input bg-background"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "wpm" | "accuracy")
            }
          >
            <option value="date">Sort by Date</option>
            <option value="wpm">Sort by WPM</option>
            <option value="accuracy">Sort by Accuracy</option>
          </select>
          <button
            className="px-4 py-2 rounded-md border border-input bg-background"
            onClick={() =>
              setSortOrder((order) => (order === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          onClick={() => setShowConfirmDialog(true)}
        >
          Reset All Scores
        </motion.button>
      </div>
      {showConfirmDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/98 backdrop-blur-md z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-lg border border-border/40 p-6 max-w-md w-full mx-4 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Reset All Scores</h3>
            <p className="text-foreground/70 mb-6">
              Are you sure you want to reset all your typing test scores? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="cursor-pointer px-4 py-2 rounded-md border border-input bg-background hover:bg-muted transition-colors"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className="cursor-pointer px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                onClick={resetAllScores}
              >
                Reset All
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">WPM</th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Mistakes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredResults.map((result, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/50"
                >
                  <td className="px-6 py-4 text-sm">
                    {new Date(result.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">{result.duration}s</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {result.wpm}
                  </td>
                  <td className="px-6 py-4 text-sm">{result.accuracy}%</td>
                  <td className="px-6 py-4 text-sm">{result.mistakes}</td>
                </motion.tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-foreground/70"
                  >
                    No results found. Complete some typing tests to see your
                    statistics!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
