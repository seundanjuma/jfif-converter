"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const validFiles = Array.from(incoming).filter((file) =>
      file.name.toLowerCase().endsWith(".jfif")
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const convertToJpeg = async () => {
    setConverting(true);

    const zip = new JSZip();

    for (const file of files) {
      const img = new Image();
      const fileURL = URL.createObjectURL(file);
      img.src = fileURL;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.drawImage(img, 0, 0);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95)
      );

      if (blob) {
        zip.file(file.name.replace(/\.jfif$/i, ".jpg"), blob);
      }

      URL.revokeObjectURL(fileURL);
    }

    if (files.length === 1) {
      // Single file → direct download
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, files[0].name.replace(/\.jfif$/i, ".jpg"));
    } else {
      // Multiple files → zip
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "converted-images.zip");
    }

    setConverting(false);
    setFiles([]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-4">JFIF → JPEG Converter</h1>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-400 rounded-xl w-full max-w-lg h-48 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-gray-100 transition"
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <p className="text-gray-600 mb-2">
          Drag and drop your .jfif files here, or click to upload
        </p>
        <input
          id="fileInput"
          type="file"
          accept=".jfif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 w-full max-w-lg text-center">
          <p className="text-gray-700">
            {files.length} file{files.length > 1 ? "s" : ""} ready to convert.
          </p>
          <button
            onClick={convertToJpeg}
            disabled={converting}
            className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {converting ? "Converting..." : "Convert and Download"}
          </button>
        </div>
      )}
    </main>
  );
}
