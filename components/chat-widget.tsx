"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatTurn } from "@/types";

export function ChatWidget({ sessionId, ventureName }: { sessionId: string; ventureName: string }) {
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      role: "agent",
      text: `Hi, I'm the ${ventureName} investor assistant. Ask me about the market, business model, financials, or risks — anything about valuation or terms I'll route straight to the founder.`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  async function send() {
    if (!input.trim() || loading) return;
    const message = input;
    setInput("");
    setTurns((t) => [...t, { role: "investor", text: message, timestamp: Date.now() }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message }),
      });
      const data = await res.json();
      const last = data.session.transcript[data.session.transcript.length - 1];
      setTurns((t) => [...t, last]);
    } catch {
      setTurns((t) => [
        ...t,
        { role: "agent", text: "Something went wrong — please try again.", timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
        <MessageSquare className="h-4 w-4 text-indigo-400" />
        <span className="text-sm font-medium">Investor Q&A</span>
      </div>
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-3">
          {turns.map((t, i) => (
            <div key={i} className={cn("flex", t.role === "investor" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  t.role === "investor" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-100"
                )}
              >
                {t.escalated && (
                  <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
                    <AlertCircle className="h-3 w-3" /> Escalated to founder
                  </div>
                )}
                {t.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <div className="flex items-center gap-2 p-3 border-t border-slate-800">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about market, financials, risks..."
          disabled={loading}
        />
        <Button size="sm" onClick={send} disabled={loading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
