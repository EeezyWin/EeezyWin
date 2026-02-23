"use client";

import React, { useRef, useState, useCallback } from "react";
import { Camera, Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DocumentUploadProps {
  onImageSelected: (dataUrl: string) => void;
  disabled?: boolean;
}

export function DocumentUpload({ onImageSelected, disabled }: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        alert("Please select an image or PDF file.");
        return;
      }

      // Limit to 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Maximum size is 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onImageSelected(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  if (preview) {
    return (
      <div className="relative w-full max-w-lg mx-auto">
        <div className="relative rounded-2xl overflow-hidden border-2 border-blue-200 bg-white shadow-sm">
          <img
            src={preview}
            alt="Document preview"
            className="w-full h-auto max-h-[400px] object-contain"
          />
          <button
            onClick={clearPreview}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            disabled={disabled}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <ImageIcon size={28} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Drop a financial document here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Earnings reports, balance sheets, income statements, investor slides
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled}
        >
          <Camera size={18} className="mr-2" />
          Take Photo
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Upload size={18} className="mr-2" />
          Upload File
        </Button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
