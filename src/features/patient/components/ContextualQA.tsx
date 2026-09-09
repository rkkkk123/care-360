"use client";

import * as React from "react";
import { Sparkles, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContextualQA() {
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "I've analyzed this report. Do you have any specific questions about your results?" }
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Based on this report, your Vitamin D levels are slightly low (24 ng/mL). A level between 30-100 ng/mL is considered optimal. I recommend discussing a supplement with your provider at your next visit."
      }]);
    }, 1500);
  };

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-border bg-secondary/20 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Ask CARE360</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-secondary text-foreground rounded-tl-sm'}`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="p-3 rounded-2xl bg-secondary rounded-tl-sm text-sm text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-background border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this report..."
            className="flex-1 bg-secondary/50 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
          />
          <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!input.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
