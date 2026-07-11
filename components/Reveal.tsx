"use client";

import React from "react";
import { motion } from "motion/react";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Delay before the reveal starts, in seconds. */
  delay?: number;
  /** Vertical travel distance for the reveal, in px. */
  y?: number;
}

/**
 * Scroll-triggered entrance wrapper. Fades + lifts its children into view the
 * first time the block enters the viewport. Used to give the homepage sections
 * a staggered, cinematic reveal rhythm.
 */
const Reveal = ({ children, className, delay = 0, y = 32 }: Props) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
