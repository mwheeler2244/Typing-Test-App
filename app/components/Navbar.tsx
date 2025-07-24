"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Keyboard, BarChart, Share, Clock } from "lucide-react";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const logoVariants = {
  hover: { rotate: 10, scale: 1.1 },
  tap: { scale: 0.95 },
};
const listItemVariants = {
  hover: { y: -2, color: "var(--color-primary)" },
  tap: { scale: 0.95 },
};
const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
  tap: { scale: 0.95 },
};

const Link = memo(
  ({
    onClick,
    children,
    ...props
  }: {
    onClick?: () => void;
    children: React.ReactNode;
    [key: string]: any;
  }) => (
    <a onClick={onClick} className="cursor-pointer" {...props}>
      {children}
    </a>
  )
);

type NavigationProps = {
  onNavigate: (target: "home" | "test" | "stats") => void;
  onPractice: () => void;
};

const Navbar = memo(({ onNavigate, onPractice }: NavigationProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showShareAlert, setShowShareAlert] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = useCallback(
    () => setMobileMenuOpen((prev) => !prev),
    []
  );
  const handleShare = useCallback(() => {
    setShowShareAlert(true);
    setMobileMenuOpen(false);
    setTimeout(() => setShowShareAlert(false), 3000);
  }, []);
  const handleNavHome = useCallback(() => {
    onNavigate("home");
    setMobileMenuOpen(false);
  }, [onNavigate]);
  const handlePractice = useCallback(() => {
    onPractice();
    setMobileMenuOpen(false);
  }, [onPractice]);
  const handleStats = useCallback(() => {
    onNavigate("stats");
    setMobileMenuOpen(false);
  }, [onNavigate]);
  const handleTest = useCallback(() => {
    onNavigate("test");
    setMobileMenuOpen(false);
  }, [onNavigate]);

  const navItems = [
    { delay: 0.1, icon: Keyboard, text: "Practice", action: handlePractice },
    { delay: 0.2, icon: BarChart, text: "Stats", action: handleStats },
    { delay: 0.3, icon: Share, text: "Share", action: handleShare },
  ];

  return (
    <motion.header
      className={`${
        raleway.className
      } fixed top-0 w-full z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/95 border-border/40 shadow-md backdrop-blur-md"
          : "bg-background/90 border-transparent backdrop-blur-md"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {showShareAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg text-sm font-medium"
        >
          Check your email for the share link!
        </motion.div>
      )}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link onClick={handleNavHome} className="cursor-pointer">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            variants={logoVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.div
              className="text-primary"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              <Keyboard className="h-6 w-6" />
            </motion.div>
            <motion.span
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              TypingMaster
            </motion.span>
          </motion.div>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navItems.map((item, i) => (
              <motion.li
                key={i}
                className="cursor-pointer"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay }}
              >
                <motion.div
                  className="cursor-pointer"
                  variants={listItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    onClick={item.action}
                    className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.text}</span>
                  </Link>
                </motion.div>
              </motion.li>
            ))}
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link onClick={handleTest} className="cursor-pointer">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="cursor-pointer px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1 transition cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  <span>Start Test</span>
                </motion.button>
              </Link>
            </motion.li>
          </ul>
        </nav>
        <div className="md:hidden flex items-center">
          <motion.button
            onClick={toggleMobileMenu}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            className="p-2 rounded-md focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="8" x2="20" y2="8"></line>
                <line x1="4" y1="16" x2="20" y2="16"></line>
              </svg>
            )}
          </motion.button>
        </div>
      </div>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/40 py-4"
        >
          <div className="container mx-auto px-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  onClick={item.action}
                  className="flex items-center gap-2 py-2 text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.text}</span>
                </Link>
              ))}
              <Link
                onClick={handleTest}
                className="flex items-center gap-2 py-2 w-full cursor-pointer"
              >
                <motion.button className="cursor-pointer w-full px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1 justify-center">
                  <Clock className="h-4 w-4" />
                  <span>Start Test</span>
                </motion.button>
              </Link>
            </nav>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
});

export default Navbar;
