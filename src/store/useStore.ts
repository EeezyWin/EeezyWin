import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ScanResult } from "@/types";

interface AppState {
  scanHistory: ScanResult[];
  currentScan: ScanResult | null;
  isProcessing: boolean;
  apiProvider: "gemini" | "openai";
  apiKey: string;

  addScan: (scan: ScanResult) => void;
  removeScan: (id: string) => void;
  clearHistory: () => void;
  setCurrentScan: (scan: ScanResult | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setApiProvider: (provider: "gemini" | "openai") => void;
  setApiKey: (key: string) => void;
  getScanById: (id: string) => ScanResult | undefined;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      scanHistory: [],
      currentScan: null,
      isProcessing: false,
      apiProvider: "gemini",
      apiKey: "",

      addScan: (scan) =>
        set((state) => ({
          scanHistory: [scan, ...state.scanHistory].slice(0, 50), // Keep last 50
          currentScan: scan,
        })),

      removeScan: (id) =>
        set((state) => ({
          scanHistory: state.scanHistory.filter((s) => s.id !== id),
        })),

      clearHistory: () => set({ scanHistory: [] }),

      setCurrentScan: (scan) => set({ currentScan: scan }),

      setIsProcessing: (isProcessing) => set({ isProcessing }),

      setApiProvider: (provider) => set({ apiProvider: provider }),

      setApiKey: (key) => set({ apiKey: key }),

      getScanById: (id) => get().scanHistory.find((s) => s.id === id),
    }),
    {
      name: "kpi-identifier-storage",
      partialize: (state) => ({
        scanHistory: state.scanHistory,
        apiProvider: state.apiProvider,
        apiKey: state.apiKey,
      }),
    }
  )
);
