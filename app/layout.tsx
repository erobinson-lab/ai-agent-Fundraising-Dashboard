import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trinity IR — Fundraising AI Agent",
  description: "Investor Q&A, memo drafting, and engagement tracking for NILVault, DentalPass Pro, and Midwest Budz",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
