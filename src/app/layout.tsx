import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "KPI Identifier — AI Financial Document Analysis",
  description:
    "Photograph any financial document and instantly extract, explain, and benchmark key financial metrics using AI.",
  keywords: [
    "KPI",
    "financial analysis",
    "document scanner",
    "earnings report",
    "AI finance",
    "financial metrics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
