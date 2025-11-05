export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">JFIF to JPEG Converter</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Drag and drop your .jfif files or click to upload
          </p>
        </div>

        {/* Drop zone */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-gray-400 transition"
        >
          <p className="text-gray-600">Drop files here or click to browse</p>
        </div>

        {/* Upload progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>50%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: "50%" }}
            ></div>
          </div>
        </div>

        {/* File summary */}
        <div className="text-sm text-gray-700 text-center">
          4 files selected
        </div>

        {/* Convert button */}
        <div className="text-center">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Convert Files
          </button>
        </div>

        {/* Conversion complete */}
        <div className="text-center space-y-2">
          <p className="text-green-600 font-medium">Conversion complete!</p>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Download ZIP
          </button>
        </div>

        {/* Download summary */}
        <div className="text-center text-gray-600 text-sm">
          Download started for <span className="font-medium">4 files</span>.
        </div>
      </div>
    </main>
  );
}
