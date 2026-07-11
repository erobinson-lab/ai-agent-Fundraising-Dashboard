"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", background: "#020617", color: "#f1f5f9", fontFamily: "sans-serif" }}>
          <h1>Something went wrong</h1>
          <button onClick={() => reset()} style={{ color: "#818cf8" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
