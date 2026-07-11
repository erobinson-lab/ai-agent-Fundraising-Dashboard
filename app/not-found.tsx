import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-slate-100 bg-slate-950">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">
        Back to Trinity IR
      </Link>
    </div>
  );
}
