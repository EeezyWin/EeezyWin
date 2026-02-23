"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Camera,
  Sparkles,
  BarChart3,
  BookOpen,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
      {/* Hero */}
      <section className="px-4 pt-12 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full text-xs font-medium text-blue-700 mb-6">
            <Sparkles size={12} />
            AI-Powered Financial Analysis
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Snap a financial document.
            <br />
            <span className="text-blue-600">Understand it instantly.</span>
          </h1>

          <p className="text-base text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
            Photograph any earnings report, balance sheet, or financial statement.
            Get every key metric extracted, explained in plain English, and
            benchmarked against industry standards.
          </p>

          <Button
            variant="primary"
            size="lg"
            className="px-8"
            onClick={() => router.push("/scan")}
          >
            <Camera size={18} className="mr-2" />
            Scan a Document
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-8">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 bg-blue-100">
                <Camera size={22} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
                1. Capture
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Take a photo or upload an image of any financial document — earnings releases, 10-Ks, investor slides.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 bg-violet-100">
                <Sparkles size={22} className="text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
                2. Extract
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                AI identifies and extracts every financial KPI: revenue, margins, growth rates, ratios, and more.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 bg-emerald-100">
                <BarChart3 size={22} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
                3. Understand
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                See each metric explained in plain English, color-coded by health, and compared against industry benchmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-10 bg-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-8">
            Built for clarity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Instant Analysis</h3>
                <p className="text-xs text-gray-500 mt-0.5">Results in under 5 seconds. Powered by state-of-the-art vision AI.</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Plain English</h3>
                <p className="text-xs text-gray-500 mt-0.5">Every metric explained like a financial advisor is sitting next to you.</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Industry Benchmarks</h3>
                <p className="text-xs text-gray-500 mt-0.5">Automatic comparison against 20+ industry sector medians and percentiles.</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Privacy-First</h3>
                <p className="text-xs text-gray-500 mt-0.5">Your documents go directly to the AI provider. We never store your data.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported documents */}
      <section className="px-4 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Works with any financial document
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Earnings Releases",
              "Income Statements",
              "Balance Sheets",
              "Cash Flow Statements",
              "Investor Presentations",
              "10-K / 10-Q Filings",
              "Annual Reports",
              "Quarterly Results",
            ].map((doc) => (
              <span
                key={doc}
                className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-10">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Ready to try it?
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Configure your API key in Settings and scan your first document.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={() => router.push("/scan")}>
              <Camera size={16} className="mr-2" />
              Start Scanning
            </Button>
            <Button variant="secondary" onClick={() => router.push("/settings")}>
              Configure API Key
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
