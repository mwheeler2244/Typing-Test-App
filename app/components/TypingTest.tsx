"use client";

import React, { useState, useCallback, useMemo, useEffect, memo } from "react";
import { motion } from "framer-motion";
import {
  Timer,
  RefreshCw,
  Keyboard,
  Trophy,
  ArrowRight,
  BarChart,
} from "lucide-react";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const typingTexts = [
  "The quick brown fox jumps over the lazy dog. Programming is the process of creating a set of instructions that tell a computer how to perform a task. Computer programming is essential in our world today, as software controls everything from microwave ovens to nuclear power plants. The art of programming requires logical thinking, problem-solving abilities, and attention to detail. Modern programming languages offer various paradigms including object-oriented, functional, and procedural approaches. As technology evolves, programmers must continuously adapt and learn new skills to stay relevant in this rapidly changing field. Software development lifecycle typically includes requirements analysis, design, implementation, testing, deployment, and maintenance phases.",
  "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. This famous opening line from Jane Austen's Pride and Prejudice introduces themes of marriage, wealth, and social status that pervade the novel. The Bennet family, with their five unmarried daughters, becomes entangled with the wealthy Mr. Bingley and the proud Mr. Darcy when they move to the neighborhood. Through witty dialogue and keen observation, Austen criticizes the emphasis on marriage for economic security rather than for love. Elizabeth Bennet, the second daughter, serves as a heroine ahead of her time, valuing personal happiness and respect above material considerations when considering marriage prospects.",
  "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. This soliloquy from Shakespeare's Hamlet explores the existential questions of life and death. Hamlet contemplates suicide but worries about the unknown afterlife, comparing death to sleep and wondering about what dreams may come. His philosophical musings reveal a deep intellectual nature and his struggle with melancholy. The prince of Denmark faces the moral dilemma of avenging his father's murder while maintaining his integrity. Throughout the play, Hamlet's psychological complexity and introspection demonstrate Shakespeare's unprecedented character development and insight into human nature.",
  "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. Herman Melville begins Moby-Dick with this casual introduction to his narrator. The novel chronicles the obsessive quest of Captain Ahab to hunt down the white whale that took his leg. Melville's masterpiece blends adventure, philosophy, and detailed descriptions of the whaling industry. Through complex symbolism and allegory, the story explores themes of obsession, fate, and man's relationship with nature. The diverse crew of the Pequod represents a microcosm of humanity, with various races, religions, and backgrounds brought together under Ahab's maniacal leadership.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair. Charles Dickens begins A Tale of Two Cities with this famous paradoxical passage, setting the stage for a novel that contrasts London and Paris during the French Revolution. The story follows Dr. Manette, his daughter Lucie, and the sacrifices made by Sydney Carton and Charles Darnay. Dickens masterfully depicts the violence and unrest of the revolution while exploring themes of resurrection, sacrifice, and justice. The novel's intricate plot weaves together personal stories against the backdrop of significant historical events.",
];

const getRandomPrompt = () =>
  typingTexts[Math.floor(Math.random() * typingTexts.length)];

const TypingTest = memo(
  ({
    duration,
    onTestComplete,
    isPractice,
  }: {
    duration: number;
    onTestComplete: (result: {
      wpm: number;
      accuracy: number;
      mistakes: number;
      duration: number;
    }) => void;
    isPractice: boolean;
  }) => {
    const [promptText, setPromptText] = useState(getRandomPrompt());
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [wpm, setwpm] = useState(0);
    const [typingAccuracy, setTypingAccuracy] = useState(0);
    const [mistakeCount, setMistakeCount] = useState(0);
    const [testStarted, setTestStarted] = useState(false);
    const [testDone, setTestDone] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const getWords = useCallback((str: string) => str.trim().split(/\s+/), []);

    const restartTest = useCallback(() => {
      setPromptText(getRandomPrompt());
      setUserInput("");
      setStartTime(null);
      setTimeLeft(duration);
      setwpm(0);
      setTypingAccuracy(0);
      setMistakeCount(0);
      setTestStarted(false);
      setTestDone(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
    }, [duration]);

    const finishTest = useCallback(() => {
      setTestDone(true);
      const promptWords = getWords(promptText);
      const inputWords = getWords(userInput);
      let correctWords = 0;
      let incorrectWords = 0;
      for (let i = 0; i < inputWords.length; i++) {
        if (inputWords[i] === promptWords[i]) correctWords++;
        else incorrectWords++;
      }
      const elapsedMinutes = (duration - timeLeft) / 60;
      const calculatedWpm =
        elapsedMinutes > 0 ? Math.round(correctWords / elapsedMinutes) : 0;
      const calculatedTypingAccuracy =
        inputWords.length > 0
          ? Math.round((correctWords / inputWords.length) * 100)
          : 100;
      setwpm(calculatedWpm);
      setTypingAccuracy(calculatedTypingAccuracy);
      setMistakeCount(incorrectWords);
      onTestComplete({
        wpm: calculatedWpm,
        accuracy: calculatedTypingAccuracy,
        mistakes: incorrectWords,
        duration: duration,
      });
    }, [duration, userInput, getWords, promptText, timeLeft, onTestComplete]);

    const finishTestRef = React.useRef(finishTest);
    React.useEffect(() => {
      finishTestRef.current = finishTest;
    }, [finishTest]);

    useEffect(() => {
      if (!testStarted || testDone) return;
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finishTestRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, [testStarted, testDone]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!testDone) setUserInput(e.target.value);
      },
      [testDone]
    );

    useEffect(() => {
      if (!testStarted) setTimeLeft(duration);
    }, [duration, testStarted]);

    useEffect(() => {
      if (userInput.length > 0 && !testStarted) {
        setTestStarted(true);
        setStartTime(Date.now());
      }
    }, [userInput, testStarted]);

    useEffect(() => {
      if (testStarted && !testDone && userInput.length === promptText.length) {
        finishTest();
      }
    }, [userInput, promptText, testStarted, testDone, finishTest]);

    useEffect(() => {
      if (!testStarted || testDone) return;
      const promptWords = getWords(promptText);
      const inputWords = getWords(userInput);
      let correctWords = 0;
      let incorrectWords = 0;
      for (let i = 0; i < inputWords.length; i++) {
        if (i < promptWords.length && inputWords[i] === promptWords[i]) {
          correctWords++;
        } else {
          incorrectWords++;
        }
      }
      const elapsedMinutes = (startTime ? Date.now() - startTime : 0) / 60000;
      if (elapsedMinutes > 0) {
        setwpm(Math.round(correctWords / elapsedMinutes));
      }
      setTypingAccuracy(
        inputWords.length > 0
          ? Math.round((correctWords / inputWords.length) * 100)
          : 100
      );
      setMistakeCount(incorrectWords);
    }, [userInput, startTime, promptText, testStarted, testDone, getWords]);

    const renderText = useMemo(() => {
      const promptWords = getWords(promptText);
      const inputWords = getWords(userInput);
      return promptWords.map((word: string, idx: number) => {
        let className = "";
        if (idx < inputWords.length) {
          className =
            inputWords[idx] === word
              ? "text-green-500 bg-green-100 dark:bg-green-900/30"
              : "text-red-500 bg-red-100 dark:bg-red-900/30";
        } else {
          className = "text-foreground/70";
        }
        return (
          <motion.span
            key={idx}
            className={
              className + " ${raleway.className} px-1 rounded mr-1 inline-block"
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05, delay: idx * 0.01 }}
          >
            {word}
          </motion.span>
        );
      });
    }, [promptText, userInput, getWords]);

    const renderedResults = useMemo(() => {
      const promptWords = getWords(promptText);
      const inputWords = getWords(userInput);
      let correctWords = 0;
      let incorrectWords = 0;
      for (let i = 0; i < inputWords.length; i++) {
        if (inputWords[i] === promptWords[i]) correctWords++;
        else incorrectWords++;
      }
      const elapsedMinutes = (duration - timeLeft) / 60;
      const calculatedWpm =
        elapsedMinutes > 0 ? Math.round(correctWords / elapsedMinutes) : 0;
      const calculatedTypingAccuracy =
        inputWords.length > 0
          ? Math.round((correctWords / inputWords.length) * 100)
          : 100;
      const stats = [
        { label: "Words Per Minute", value: calculatedWpm },
        { label: "Accuracy", value: `${calculatedTypingAccuracy}%` },
        { label: "Errors", value: incorrectWords },
      ];
      return (
        <motion.div
          className={`${raleway.className} text-center p-8 bg-card rounded-xl border border-border/40 mb-8`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="mx-auto w-20 h-20 mb-6 bg-primary/10 rounded-full flex items-center justify-center"
          >
            <Trophy className="h-10 w-10 text-primary" />
          </motion.div>
          <motion.h2
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isPractice ? "Practice Complete!" : "Test Complete!"}
          </motion.h2>
          <motion.div
            className="grid grid-cols-3 gap-6 my-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-2 cursor-pointer"
              >
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          <motion.p
            className="text-foreground/70 mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            You typed {inputWords.length} words in {duration - timeLeft}{" "}
            seconds. That&apos;s {calculatedWpm} WPM with {incorrectWords}{" "}
            errors.
            {isPractice && (
              <span className="block mt-2 text-primary font-medium">
                This was a practice test - results won&apos;t be saved to your
                stats.
              </span>
            )}
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium cursor-pointer shadow-sm border border-secondary/30 hover:shadow-md"
              onClick={restartTest}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, delay: 0.6 }}
            >
              Try Again
            </motion.button>
            {isPractice ? (
              <motion.button
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium cursor-pointer shadow-sm border border-primary/30 hover:shadow-md flex items-center gap-2"
                onClick={() => {
                  restartTest();
                  window.dispatchEvent(new CustomEvent("switchToRealTest"));
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, delay: 0.7 }}
              >
                <span>Start Real Test</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.button
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium cursor-pointer shadow-sm border border-primary/30 hover:shadow-md flex items-center gap-2"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("viewStats"))
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, delay: 0.7 }}
              >
                <span>View Stats</span>
                <BarChart className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      );
    }, [
      duration,
      userInput,
      restartTest,
      getWords,
      promptText,
      timeLeft,
      isPractice,
    ]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${raleway.className} w-full max-w-4xl mx-auto`}
      >
        {!testDone ? (
          <>
            <motion.div
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Timer className="h-5 w-5 text-primary" />
                <motion.span
                  className="text-2xl font-bold tabular-nums"
                  animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
                  transition={{
                    repeat: timeLeft <= 10 ? Infinity : 0,
                    duration: 0.5,
                  }}
                  style={{
                    color: timeLeft <= 10 ? "var(--color-red-500)" : "inherit",
                  }}
                >
                  {timeLeft}s
                </motion.span>
              </motion.div>
              <motion.button
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors cursor-pointer shadow-sm border border-secondary/30 hover:shadow-md"
                onClick={restartTest}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </motion.button>
            </motion.div>
            <motion.div
              className="rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="p-6">
                <motion.div
                  className="font-mono text-base mb-6 leading-relaxed max-h-48 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {renderText}
                  {!testDone && (
                    <motion.span
                      className="ml-0.5"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      |
                    </motion.span>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Start typing..."
                    disabled={testDone}
                    autoFocus
                  />
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="grid grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {[
                { icon: Keyboard, label: "WPM", value: wpm, delay: 0 },
                {
                  icon: Trophy,
                  label: "Accuracy",
                  value: `${typingAccuracy}%`,
                  delay: 0.3,
                },
                {
                  icon: RefreshCw,
                  label: "Errors",
                  value: mistakeCount,
                  delay: 0.6,
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center justify-center p-4 bg-card rounded-xl border border-border/40 cursor-pointer"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="h-5 w-5 text-primary mb-1" />
                  <motion.span
                    className="text-3xl font-bold text-primary tabular-nums"
                    animate={{
                      scale: testStarted && !testDone ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      repeat: testStarted && !testDone ? Infinity : 0,
                      duration: 2,
                      delay: stat.delay,
                    }}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-sm text-foreground/70">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          renderedResults
        )}
      </motion.div>
    );
  }
);
TypingTest.displayName = "TypingTest";

export default TypingTest;
