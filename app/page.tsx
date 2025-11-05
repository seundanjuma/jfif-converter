"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  type Step = "upload" | "ready" | "converting" | "done" | "downloaded";
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<Step>("upload");
  const [progress, setProgress] = useState(0);

  // Handle file selection
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileArray = Array.from(e.target.files);
    setFiles(fileArray);
    setStep("ready");
  };

  // Convert a single JFIF to JPEG blob
  const convertToJpeg = (file: File): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas error");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject("Conversion failed");
              resolve(blob);
            },
            "image/jpeg",
            0.92
          );
        };
        img.onerror = () => reject("Image load error");
        img.src = reader.result as string;
      };
      reader.onerror = () => reject("File read error");
      reader.readAsDataURL(file);
    });

  // Handle conversion
  const handleConvert = async () => {
    setStep("converting");
    setProgress(0);
    const converted: { name: string; blob: Blob }[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const blob = await convertToJpeg(files[i]);
        converted.push({
          name: files[i].name.replace(/\.jfif$/i, ".jpg"),
          blob,
        });
        setProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (err) {
        console.error("Conversion error:", err);
      }
    }

    // Create ZIP
    const zip = new JSZip();
    converted.forEach((f) => zip.file(f.name, f.blob));
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "converted.zip");

    setStep("downloaded");
  };

  // Reset
  const handleReset = () => {
    setFiles([]);
    setStep("upload");
    setProgress(0);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">JFIF to JPEG Converter</h1>
          <p className="text-gray-500 mt-1 text-sm">Drag and drop your .jfif files or click to upload</p>
        </div>

        {/* Upload Area */}
        {(step === "upload" || step === "ready") && (
          <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-gray-400 transition">
            <input
              type="file"
              multiple
              accept=".jfif"
              className="absolute w-full h-full opacity-0 cursor-pointer"
              onChange={handleFiles}
            />
            {files.length === 0 ? (
              <p className="text-gray-600">Drop files here or click to browse</p>
            ) : (
              <p className="text-gray-600">{files.length} file(s) selected</p>
            )}
          </div>
        )}

        {/* Convert Button */}
        {step === "ready" && (
          <div className="text-center">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={handleConvert}
            >
              Convert Files
            </button>
          </div>
        )}

        {/* Conversion Progress */}
        {step === "converting" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Converting...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Download / Summary */}
        {step === "downloaded" && (
          <div className="text-center space-y-2">
            <p className="text-gray-600 text-sm">
              Download started for <span className="font-medium">{files.length}</span> file(s).
            </p>
            <button
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={handleReset}
            >
              Start New Batch
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
