"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Loader2 } from "lucide-react";

interface SessionSummary {
  id: string;
  investorName: string;
  firm: string;
  ventureId: string;
}

export function MemoPanel({ sessions }: { sessions: SessionSummary[] }) {
  const [selected, setSelected] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch("/api/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: selected }),
      });
      const data = await res.json();
      setMemo(data.memo || data.error);
    } finally {
      setLoading(false);
    }
  }

  function download() {
    const blob = new Blob([memo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "investment-memo.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" /> Investment Memo Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-500">No investor sessions yet.</p>
        ) : (
          <>
            <select
              className="w-full rounded-md bg-slate-800 border border-slate-700 text-sm px-3 py-2"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">Select an investor session...</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.investorName} {s.firm ? `(${s.firm})` : ""}
                </option>
              ))}
            </select>
            <Button onClick={generate} disabled={!selected || loading} size="sm">
              {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
              Generate Memo
            </Button>
          </>
        )}
        {memo && (
          <div className="space-y-2">
            <pre className="text-xs bg-slate-950 border border-slate-800 rounded-lg p-3 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {memo}
            </pre>
            <Button variant="outline" size="sm" onClick={download}>
              <Download className="h-4 w-4 mr-1" /> Download memo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
