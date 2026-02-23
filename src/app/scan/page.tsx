"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { DocumentUpload } from "@/components/DocumentUpload";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";
import { ScanResult } from "@/types";
import { Sparkles, AlertCircle } from "lucide-react";

export default function ScanPage() {
  const router = useRouter();
  const { addScan, apiKey, apiProvider, isProcessing, setIsProcessing } =
    useStore();
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleAnalyze = async () => {
    if (!imageDataUrl) return;

    if (!apiKey) {
      setError("Please configure your API key in Settings first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatus("Sending document to AI for analysis...");

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl,
          apiKey,
          provider: apiProvider,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Extraction failed");
      }

      setStatus("Organizing results...");

      const scanResult: ScanResult = {
        id: uuidv4(),
        timestamp: Date.now(),
        companyName: result.data.companyName,
        ticker: result.data.ticker,
        sector: result.data.sector,
        industry: result.data.industry,
        documentType: result.data.documentType,
        period: result.data.period,
        kpis: result.data.kpis || [],
        thumbnailUrl: imageDataUrl.substring(0, 200),
      };

      addScan(scanResult);
      router.push(`/results?id=${scanResult.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis");
    } finally {
      setIsProcessing(false);
      setStatus("");
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Scan Document</h1>
          <p className="text-sm text-gray-500 mt-1">
            Photograph or upload a financial document to extract KPIs
          </p>
        </div>

        <DocumentUpload
          onImageSelected={setImageDataUrl}
          disabled={isProcessing}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {imageDataUrl && (
          <div className="mt-6 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAnalyze}
              loading={isProcessing}
              disabled={isProcessing}
              className="w-full max-w-xs"
            >
              <Sparkles size={18} className="mr-2" />
              {isProcessing ? status || "Analyzing..." : "Analyze Document"}
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-sm text-blue-700">{status || "Processing..."}</span>
            </div>
          </div>
        )}

        {!apiKey && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <p className="text-sm text-amber-800 font-medium">
              API key not configured
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Go to{" "}
              <a href="/settings" className="underline font-medium">
                Settings
              </a>{" "}
              to add your Gemini or OpenAI API key.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
