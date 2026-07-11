"use client";

import Link from "next/link";
import { VentureProfile } from "@/types";
import { ArrowRight, Building, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function VentureCard({ venture }: { venture: VentureProfile }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-gradient-to-br p-6 flex flex-col gap-4",
        "shadow-lg shadow-black/20 hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200",
        venture.colorFrom,
        venture.colorTo
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn("h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center", venture.accent)}>
          <Building className="h-4 w-4" />
        </div>
        <span className="text-xs uppercase tracking-wide text-slate-400 font-medium">
          {venture.stage}
        </span>
      </div>
      <div>
        <h3 className="text-xl font-bold tracking-tight">{venture.name}</h3>
        <p className="text-sm text-slate-400 mt-1.5 leading-snug">{venture.tagline}</p>
      </div>
      <div className="text-sm text-slate-300">
        <span className="font-medium">{venture.sector}</span>
      </div>
      <div className="text-sm">
        <span className={cn("font-semibold", venture.accent)}>{venture.ask}</span>
      </div>
      <div className="flex gap-2 mt-auto pt-2">
        <Link
          href={`/venture/${venture.id}/room`}
          className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm font-medium transition-colors"
        >
          Investor Room <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={`/venture/${venture.id}/dashboard`}
          className="flex items-center justify-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 px-3 py-2 text-sm font-medium transition-colors"
          title="Fundraising dashboard"
        >
          <BarChart3 className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
