"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VentureId } from "@/types";

interface SlideViewerProps {
  ventureId: VentureId;
  slideCount: number;
  investorId: string;
  investorName: string;
}

export function SlideViewer({ ventureId, slideCount, investorId, investorName }: SlideViewerProps) {
  const [index, setIndex] = useState(0);
  const slideStartRef = useRef<number>(Date.now());

  const logDwell = useCallback(
    (slideIdx: number) => {
      const dwellMs = Date.now() - slideStartRef.current;
      if (dwellMs < 200) return;
      fetch("/api/engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ventureId,
          investorId,
          investorName,
          slideIndex: slideIdx,
          dwellMs,
        }),
        keepalive: true,
      }).catch(() => {});
    },
    [ventureId, investorId, investorName]
  );

  useEffect(() => {
    slideStartRef.current = Date.now();
    return () => logDwell(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    function handleUnload() {
      logDwell(index);
    }
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [index, logDwell]);

  const slideNum = String(index + 1).padStart(2, "0");
  const src = `/slides/${ventureId}/slide-${slideNum}.jpg`;

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-800 bg-black">
        <Image
          key={src}
          src={src}
          alt={`Slide ${index + 1}`}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <div className="flex items-center justify-between mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
        </Button>
        <span className="text-sm text-slate-400">
          Slide {index + 1} / {slideCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((i) => Math.min(slideCount - 1, i + 1))}
          disabled={index === slideCount - 1}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
