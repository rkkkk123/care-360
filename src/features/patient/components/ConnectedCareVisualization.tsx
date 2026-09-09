import * as React from "react";
import { User, Sparkles, Stethoscope, Pill, Store, Clock } from "lucide-react";
import { motion } from "motion/react";
import { motionConfig } from "@/lib/motion";

export function ConnectedCareVisualization() {
  const nodes = [
    { id: "patient", icon: User, label: "You", color: "text-primary" },
    { id: "ai", icon: Sparkles, label: "CARE360", color: "text-primary" },
    { id: "doctor", icon: Stethoscope, label: "Provider", color: "text-blue-500" },
    { id: "prescription", icon: Pill, label: "Rx", color: "text-orange-500" },
    { id: "pharmacy", icon: Store, label: "Pharmacy", color: "text-orange-500" },
    { id: "timeline", icon: Clock, label: "History", color: "text-muted-foreground" },
  ];

  return (
    <div className="bg-secondary/30 rounded-3xl p-6 border border-border overflow-hidden relative">
      <div className="text-center mb-6">
        <h3 className="text-sm font-medium text-foreground">Your Connected Network</h3>
        <p className="text-xs text-muted-foreground mt-1">Information flows securely across your care team.</p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 relative">
        {/* Subtle connecting line behind */}
        <div className="absolute top-1/2 left-4 right-4 h-px bg-border -translate-y-1/2 z-0 hidden sm:block" />
        
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...motionConfig.transition, delay: i * 0.1 }}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
              <node.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${node.color}`} />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">{node.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
