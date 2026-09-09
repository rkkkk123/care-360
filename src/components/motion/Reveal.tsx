"use client";

import { motion, HTMLMotionProps } from "motion/react";
import * as React from "react";
import { motionConfig } from "@/lib/motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  ({ children, delay = 0, direction = "up", ...props }, ref) => {
    const yOffset = direction === "up" ? 30 : direction === "down" ? -30 : 0;
    const xOffset = direction === "left" ? 30 : direction === "right" ? -30 : 0;

    return (
      <motion.div
        ref={ref}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          initial: { opacity: 0, y: yOffset, x: xOffset },
          animate: { opacity: 1, y: 0, x: 0 },
        }}
        transition={{ ...motionConfig.transition, delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Reveal.displayName = "Reveal";
