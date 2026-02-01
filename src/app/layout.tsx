import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lingo - Learn Languages for Free",
  description: "The free, fun, and effective way to learn a language! Learn Spanish, French, German and more with game-like lessons.",
  keywords: ["language learning", "duolingo", "learn spanish", "learn french", "language app"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
