"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EngagementEvent } from "@/types";
import { cn } from "@/lib/utils";

export function EngagementHeatmap({ ventureId, slideCount }: { ventureId: string; slideCount: number }) {
  const [events, setEvents] = useState<EngagementEvent[]>([]);

  useEffect(() => {
    const fetchData = () =>
      fetch(`/api/engagement?ventureId=${ventureId}`)
        .then((r) => r.json())
        .then(setEvents)
        .catch(() => {});
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [ventureId]);

  const dwellBySlide = new Array(slideCount).fill(0);
  for (const e of events) {
    if (e.slideIndex >= 0 && e.slideIndex < slideCount) {
      dwellBySlide[e.slideIndex] += e.dwellMs;
    }
  }
  const max = Math.max(1, ...dwellBySlide);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-base">Slide Engagement Heatmap</CardTitle>
        <p className="text-xs text-slate-500">
          Aggregate dwell time across all investors who viewed this deck.
        </p>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500">No engagement recorded yet — open the Investor Room and view the deck to generate data.</p>
        ) : (
          <div className="space-y-1.5">
            {dwellBySlide.map((ms, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-14 shrink-0">Slide {i + 1}</span>
                <div className="flex-1 h-4 rounded bg-slate-800 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded",
                      ms / max > 0.66
                        ? "bg-rose-500"
                        : ms / max > 0.33
                        ? "bg-amber-500"
                        : "bg-indigo-500"
                    )}
                    style={{ width: `${Math.max(2, (ms / max) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-12 text-right shrink-0">
                  {(ms / 1000).toFixed(1)}s
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
