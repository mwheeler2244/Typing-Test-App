"use client";

import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Keyboard, Clock, BarChart2, ArrowRight } from "lucide-react";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

type NavigationProps = {
  onNavigate: (target: "home" | "test" | "stats") => void;
  onPractice: () => void;
};

const HeroSection = memo(({ onNavigate, onPractice }: NavigationProps) => {
  type Star = {
    opacity: number;
    x: number;
    y: number;
    scale: number;
    duration: number;
    width: number;
    height: number;
    left: number;
    top: number;
  };
  const [floatingStars, setFloatingStars] = useState<Star[]>([]);
  useEffect(() => {
    const generateStars = () =>
      Array.from({ length: 20 }).map(() => ({
        opacity: Math.random() * 0.5 + 0.3,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 5 + 10,
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
      }));
    setFloatingStars(generateStars());
  }, []);
  return (
    <section
      className={`${raleway.className} relative min-h-[90vh] flex items-center justify-center overflow-hidden`}
    >
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl"
        />
      </div>
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col space-y-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit"
          >
            <span>Type faster. Type better.</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className=" text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          >
            Master the{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-600 to-violet-600 font-extrabold">
              keyboard
            </span>{" "}
            at your fingertips
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-foreground/70 text-lg max-w-md"
          >
            Improve your typing speed and accuracy with our modern, interactive
            typing tests. Challenge yourself and track your progress.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <a onClick={() => onNavigate("test")} className="cursor-pointer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium flex items-center gap-2 shadow-lg shadow-primary/20 transition cursor-pointer"
              >
                Start Typing Test
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </a>
            <a onClick={onPractice} className="cursor-pointer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-background border border-border text-foreground font-medium transition cursor-pointer flex items-center gap-2"
              >
                Practice Mode
                <Keyboard className="h-4 w-4" />
              </motion.button>
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, staggerChildren: 0.1 }}
            className="grid grid-cols-3 gap-4 pt-8"
          >
            {[
              {
                icon: Keyboard,
                title: "Realistic",
                desc: "Natural typing experience",
              },
              { icon: Clock, title: "Timed", desc: "15s, 30s, or 60s tests" },
              {
                icon: BarChart2,
                title: "Analytics",
                desc: "Track your progress",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-center"
              >
                <div className="rounded-full bg-primary/10 p-3 mb-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-xs text-foreground/70 text-center">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative"
        >
          <motion.div
            whileHover={{
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative rounded-xl overflow-hidden border border-border/40 bg-background/95 backdrop-blur-md shadow-xl"
          >
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                  {[
                    { color: "bg-red-500" },
                    { color: "bg-yellow-500" },
                    { color: "bg-green-500" },
                  ].map((btn, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2 }}
                      className={`w-3 h-3 rounded-full ${btn.color}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-foreground/60">00:30</div>
              </div>
              <div className="space-y-4">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="font-mono text-sm text-foreground/90 bg-background/95 p-4 rounded-md border border-border/40"
                >
                  <span className="text-primary">
                    The quick brown fox jumps over the lazy dog.
                  </span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    |
                  </motion.span>
                </motion.div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="grid grid-cols-3 gap-4 text-center text-sm"
                >
                  {[
                    { value: "68", label: "WPM" },
                    { value: "97%", label: "Accuracy" },
                    { value: "1", label: "Errors" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-background/95 p-3 rounded-md border border-border/40"
                    >
                      <div className="text-xl font-bold">{stat.value}</div>
                      <div className="text-foreground/60 text-xs">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/30 rounded-full blur-3xl -z-10"
          />
        </motion.div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {floatingStars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            initial={{
              opacity: star.opacity,
              x: star.x,
              y: star.y,
              scale: star.scale,
            }}
            animate={{ y: [0, -50, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
});
HeroSection.displayName = "HeroSection";

export default HeroSection;
