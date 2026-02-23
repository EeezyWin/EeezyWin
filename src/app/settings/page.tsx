"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Key, Cpu, Check } from "lucide-react";

export default function SettingsPage() {
  const { apiKey, apiProvider, setApiKey, setApiProvider } = useStore();
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(localKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 md:pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-sm text-gray-500 mb-8">
          Configure your API provider and key for document analysis
        </p>

        {/* API Provider */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={18} className="text-gray-600" />
            <h2 className="font-semibold text-gray-900">AI Provider</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setApiProvider("gemini")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                apiProvider === "gemini"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <h3 className="font-semibold text-gray-900 text-sm">
                Google Gemini
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Gemini 2.0 Flash — fast and cost-effective
              </p>
              {apiProvider === "gemini" && (
                <span className="inline-block mt-2 text-xs text-blue-600 font-medium">
                  Selected
                </span>
              )}
            </button>

            <button
              onClick={() => setApiProvider("openai")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                apiProvider === "openai"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <h3 className="font-semibold text-gray-900 text-sm">OpenAI</h3>
              <p className="text-xs text-gray-500 mt-1">
                GPT-4o — high accuracy on complex documents
              </p>
              {apiProvider === "openai" && (
                <span className="inline-block mt-2 text-xs text-blue-600 font-medium">
                  Selected
                </span>
              )}
            </button>
          </div>
        </div>

        {/* API Key */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Key size={18} className="text-gray-600" />
            <h2 className="font-semibold text-gray-900">API Key</h2>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            {apiProvider === "gemini"
              ? "Get a free API key from Google AI Studio (aistudio.google.com)"
              : "Get an API key from OpenAI (platform.openai.com)"}
          </p>

          <div className="relative mb-3">
            <input
              type={showKey ? "text" : "password"}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder={
                apiProvider === "gemini"
                  ? "AIza..."
                  : "sk-..."
              }
              className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            className="w-full"
          >
            {saved ? (
              <>
                <Check size={16} className="mr-2" />
                Saved!
              </>
            ) : (
              "Save API Key"
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Privacy Notice
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your API key is stored locally in your browser and never sent to our
            servers. Document images are sent directly from your browser to the
            AI provider for analysis. We do not store or process your financial
            documents.
          </p>
        </div>
      </div>
    </div>
  );
}
