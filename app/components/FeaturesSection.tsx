"use client";

import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { Timer, Keyboard, BarChart2, Trophy, Share, Clock } from "lucide-react";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const FeatureCard = memo(
  ({
    icon: Icon,
    title,
    description,
    delay,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    delay: number;
  }) => {
    const animationDelay = `${delay}s`;
    return (
      <div
        className={`${raleway.className} flex flex-col items-center text-center p-6 rounded-xl bg-background/95 backdrop-blur-md border border-border/40 shadow-lg hover:-translate-y-2 transition-transform hover:shadow-xl`}
        style={{ animationDelay }}
      >
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-foreground/70">{description}</p>
      </div>
    );
  }
);

const FeaturesSection = memo(() => {
  const featureList = useMemo(
    () => [
      {
        icon: Timer,
        title: "Multiple Time Options",
        description:
          "Choose between 15, 30, or 60 second typing tests to match your practice preferences.",
        delay: 0.1,
      },
      {
        icon: Keyboard,
        title: "Realistic Typing Experience",
        description:
          "Practice with common words, phrases, and sentences to improve real-world typing skills.",
        delay: 0.2,
      },
      {
        icon: BarChart2,
        title: "Detailed Statistics",
        description:
          "Track your WPM, accuracy, and errors with detailed metrics after each test.",
        delay: 0.3,
      },
      {
        icon: Trophy,
        title: "Personal Bests",
        description:
          "Keep track of your personal records and watch yourself improve over time.",
        delay: 0.4,
      },
      {
        icon: Share,
        title: "Share Your Progress",
        description:
          "Share your typing statistics with friends and family to motivate and inspire them.",
        delay: 0.5,
      },
      {
        icon: Clock,
        title: "Real-time Feedback",
        description:
          "Get instant feedback on your typing accuracy and speed as you type.",
        delay: 0.6,
      },
    ],
    []
  );
  return (
    <section className={`${raleway.className} py-20 relative overflow-hidden`}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 right-20 w-80 h-80 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Everything you need to become a
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-600 to-violet-600 font-extrabold">
              {" "}
              typing master
            </span>
          </h2>
          <p className="text-foreground/70 text-lg">
            Our typing test platform offers all the tools you need to improve
            your typing skills and track your progress.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default FeaturesSection;
