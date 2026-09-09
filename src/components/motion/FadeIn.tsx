"use client";

import { motion, HTMLMotionProps } from "motion/react";
import * as React from "react";
import { motionConfig } from "@/lib/motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        }}
        transition={{ ...motionConfig.transition, delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

FadeIn.displayName = "FadeIn";
