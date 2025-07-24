"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import {
  Keyboard,
  Github,
  Twitter,
  Instagram,
  Youtube,
  Heart,
} from "lucide-react";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const Footer = memo(
  ({
    onNavigate,
    onPractice,
  }: {
    onNavigate: (target: "home" | "test" | "stats") => void;
    onPractice: () => void;
  }) => {
    const socialVariants = {
      hover: { y: -5, scale: 1.2, color: "var(--color-primary)" },
      tap: { scale: 0.95 },
    };
    const linkVariants = { hover: { x: 5, color: "var(--color-primary)" } };
    const [showShareAlert, setShowShareAlert] = useState(false);
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const handleNavToTest = useCallback(() => onNavigate("test"), [onNavigate]);
    const handleShare = useCallback(() => {
      setShowShareAlert(true);
      setTimeout(() => setShowShareAlert(false), 3000);
    }, []);
    const quickLinks = [
      { delay: 0.3, text: "Test", action: handleNavToTest },
      { delay: 0.35, text: "Practice", action: onPractice },
      { delay: 0.4, text: "Statistics", action: () => onNavigate("stats") },
      { delay: 0.5, text: "Share", action: handleShare },
    ];
    return (
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={`${raleway.className} relative w-full border-t border-border/40 py-6 mt-12`}
      >
        {showShareAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg text-sm font-medium"
          >
            Check your email for the share link!
          </motion.div>
        )}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8  text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <motion.div
                className="flex items-center gap-2 mb-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Keyboard className="h-5 w-5 text-primary" />
                </motion.div>
                <motion.span
                  className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  TypingMaster
                </motion.span>
              </motion.div>
              <motion.p
                className="text-sm text-foreground/70 max-w-xs mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                Improve your typing speed and accuracy with our modern,
                interactive typing tests.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <motion.h3
                className="font-medium mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Quick Links
              </motion.h3>
              <ul className="space-y-2 flex flex-col items-center">
                {quickLinks.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.delay }}
                    viewport={{ once: true }}
                    className="w-full text-center"
                  >
                    <a onClick={item.action} className="cursor-pointer">
                      <motion.span
                        className="text-sm text-foreground/70 transition-colors inline-block"
                        variants={linkVariants}
                        whileHover="hover"
                      >
                        {item.text}
                      </motion.span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <motion.h3
                className="font-medium mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Connect
              </motion.h3>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 transition-colors cursor-pointer hover:text-primary"
                  variants={socialVariants}
                  whileHover="hover"
                  whileTap="tap"
                  title="GitHub"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 transition-colors cursor-pointer hover:text-primary"
                  variants={socialVariants}
                  whileHover="hover"
                  whileTap="tap"
                  title="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 transition-colors cursor-pointer hover:text-primary"
                  variants={socialVariants}
                  whileHover="hover"
                  whileTap="tap"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 transition-colors cursor-pointer hover:text-primary"
                  variants={socialVariants}
                  whileHover="hover"
                  whileTap="tap"
                  title="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>
          </div>
          <motion.div
            className="border-t border-border/40 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-xs text-foreground/70">
              © {currentYear} TypingMaster. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-foreground/70 mt-4 md:mt-0">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    );
  }
);

export default Footer;
