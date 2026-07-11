import Link from "next/link";
import { Sparkles } from "lucide-react";

export function NavBar() {
  return (
    <div className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight group-hover:text-indigo-300 transition-colors">
            Trinity IR
          </span>
        </Link>
        <span className="text-xs text-slate-500 hidden sm:block">
          Fundraising AI Agent Console
        </span>
      </div>
    </div>
  );
}
