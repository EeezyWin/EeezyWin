"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  Trash2,
  Building2,
  FileText,
  ChevronRight,
  Camera,
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { scanHistory, removeScan, clearHistory } = useStore();

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  if (scanHistory.length === 0) {
    return (
      <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan History</h1>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Clock size={28} className="text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">No scans yet</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Your analyzed documents will appear here
            </p>
            <Button variant="primary" onClick={() => router.push("/scan")}>
              <Camera size={16} className="mr-2" />
              Scan Your First Document
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
            <p className="text-sm text-gray-500">
              {scanHistory.length} scan{scanHistory.length !== 1 ? "s" : ""}
            </p>
          </div>
          {scanHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Clear all scan history?")) clearHistory();
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={14} className="mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {scanHistory.map((scan) => (
            <button
              key={scan.id}
              onClick={() => router.push(`/results?id=${scan.id}`)}
              className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {scan.companyName || "Unknown Company"}
                    </h3>
                    {scan.ticker && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                        {scan.ticker}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {scan.industry && (
                      <span className="flex items-center gap-1">
                        <Building2 size={10} />
                        {scan.industry}
                      </span>
                    )}
                    {scan.documentType && (
                      <span className="flex items-center gap-1">
                        <FileText size={10} />
                        {scan.documentType}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {formatDate(scan.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {scan.kpis.length} metrics extracted
                    {scan.period ? ` | ${scan.period}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Remove this scan?")) removeScan(scan.id);
                    }}
                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 group-hover:text-gray-500 transition-colors"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
