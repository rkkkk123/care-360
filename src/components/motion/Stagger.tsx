"use client";

import { motion, HTMLMotionProps } from "motion/react";
import * as React from "react";

interface StaggerProps extends HTMLMotionProps<"div"> {
  staggerDelay?: number;
}

export const StaggerContext = React.createContext({ stagger: false });

export const Stagger = React.forwardRef<HTMLDivElement, StaggerProps>(
  ({ children, staggerDelay = 0.1, ...props }, ref) => {
    return (
      <StaggerContext.Provider value={{ stagger: true }}>
        <motion.div
          ref={ref}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            initial: {},
            animate: {
              transition: {
                staggerChildren: staggerDelay,
              },
            },
          }}
          {...props}
        >
          {children}
        </motion.div>
      </StaggerContext.Provider>
    );
  }
);

Stagger.displayName = "Stagger";

type StaggerItemProps = HTMLMotionProps<"div">;

export const StaggerItem = React.forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, ...props }, ref) => {
    const context = React.useContext(StaggerContext);
    
    // If used outside Stagger, just render normally or use basic fade in
    if (!context.stagger) {
      return <div ref={ref} {...(props as any)}>{children as React.ReactNode}</div>;
    }

    return (
      <motion.div
        ref={ref}
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerItem.displayName = "StaggerItem";
