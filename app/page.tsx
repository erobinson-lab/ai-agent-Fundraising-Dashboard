import { VENTURE_LIST } from "@/lib/ventures-data";
import { VentureCard } from "@/components/venture-card";
import { NavBar } from "@/components/nav-bar";
import { Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-widest text-indigo-400 font-semibold mb-2">
            Trinity IR
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Fundraising AI Agent Console
          </h1>
          <p className="text-slate-400 mt-3 max-w-2xl leading-relaxed">
            One agent, three sector-tuned personas. Fields investor questions, drafts investment
            memos, and tracks deck engagement across NILVault, DentalPass Pro, and Midwest Budz —
            each with its own knowledge base, objection library, and compliance guardrails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {VENTURE_LIST.map((v) => (
            <VentureCard key={v.id} venture={v} />
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex gap-3 items-start">
          <Shield className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-400 leading-relaxed">
            The investor Q&A agent runs on a real LLM backend when an API key is configured
            (Anthropic or OpenAI — see <code className="text-slate-300">lib/llm.ts</code>), and
            falls back to a curated rule-based engine otherwise. Hot-lead alerts (escalated
            questions, high deck engagement) push to GoHighLevel or any webhook you configure.
            Compliance guardrails (accredited-investor gating, valuation/term escalation,
            cannabis solicitation restrictions) are pre-wired per venture — have securities
            counsel review before any real investor uses this.
          </p>
        </div>
      </div>
    </div>
  );
}
