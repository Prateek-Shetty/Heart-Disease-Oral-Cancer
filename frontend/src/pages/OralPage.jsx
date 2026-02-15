import { useState } from "react";
import { predictOral } from "../services/api";

function OralPage({ setContext }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please upload an image");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await predictOral(formData);

      const probability = response.data.cancer_probability;
      setResult(probability);
      setContext(`Oral cancer probability is ${probability}%`);

    } catch {
      alert("Prediction failed");
    }

    setLoading(false);
  };

  const getColor = () => {
    if (result > 70) return "text-red-600";
    if (result > 40) return "text-yellow-500";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-blue-800">
        Oral Cancer Detection
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center space-y-4">

        {/* Compact Upload Box */}
        <label className="w-64 h-32 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition">
          <span className="text-sm text-gray-600">
            Click to Upload Image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Preview Image */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-48 rounded-lg shadow-md border"
          />
        )}

        {/* Predict Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {loading ? "Analyzing..." : "Predict"}
        </button>

      </div>

      {/* Result Section */}
      {result !== null && (
        <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center">

          <h3 className="text-lg font-semibold">
            Cancer Probability
          </h3>

          <p className={`text-4xl font-bold ${getColor()}`}>
            {result}%
          </p>

          <p className="text-sm text-gray-500 mt-2">
            AI-based estimation. Not a medical diagnosis.
          </p>

        </div>
      )}

    </div>
  );
}

export default OralPage;
