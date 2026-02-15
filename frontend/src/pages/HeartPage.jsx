import { useState } from "react";
import { predictHeart } from "../services/api";

/* ---------------------------
   Reusable Input Components
---------------------------- */

const InputField = ({ label, name, type = "number", onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      onChange={onChange}
      className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const SelectField = ({ label, name, options, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      onChange={onChange}
      className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

/* ---------------------------
   Default Neutral Values
---------------------------- */

const defaultValues = {
  age: 60,
  anaemia: 0,
  creatinine_phosphokinase: 250,
  diabetes: 0,
  ejection_fraction: 45,
  high_blood_pressure: 0,
  platelets: 250000,
  serum_creatinine: 1.1,
  serum_sodium: 137,
  sex: 1,
  smoking: 0,
};

/* ---------------------------
   Heart Page Component
---------------------------- */

function HeartPage({ setContext }) {
  const [formData, setFormData] = useState(defaultValues);
  const [modifiedFields, setModifiedFields] = useState([]);
  const [result, setResult] = useState(null);
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const finalValue =
      value === "" ? defaultValues[name] : Number(value);

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    setModifiedFields((prev) =>
      prev.includes(name) ? prev : [...prev, name]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await predictHeart(formData);
      const risk = response.data.risk_percentage;

      setResult(risk);

      // If any field was not modified
      if (modifiedFields.length < Object.keys(defaultValues).length) {
        setWarning(true);
      } else {
        setWarning(false);
      }

      // Send input + output directly to chatbot
// Send structured medical report to chatbot
const report = `
You are a professional cardiologist.

Patient Clinical Summary:

- Age: ${formData.age} years
- Ejection Fraction: ${formData.ejection_fraction}%
- CPK Level: ${formData.creatinine_phosphokinase}
- Platelets Count: ${formData.platelets}
- Serum Creatinine: ${formData.serum_creatinine}
- Serum Sodium: ${formData.serum_sodium}
- Anaemia: ${formData.anaemia ? "Yes" : "No"}
- Diabetes: ${formData.diabetes ? "Yes" : "No"}
- High Blood Pressure: ${formData.high_blood_pressure ? "Yes" : "No"}
- Smoking: ${formData.smoking ? "Yes" : "No"}
- Gender: ${formData.sex ? "Male" : "Female"}

AI Predicted Heart Failure Risk: ${risk}%

Please provide:

1. A short professional medical interpretation.
2. Possible contributing factors.
3. General lifestyle recommendations.

End your response with this exact sentence:
"Consult a qualified doctor for appropriate diagnosis. Do not conclude based on AI prediction alone."
`;


      setContext(report);

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
        Heart Failure Risk Prediction
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-2 gap-6">

        <InputField label="Age (years)" name="age" onChange={handleChange} />
        <InputField label="Ejection Fraction (%)" name="ejection_fraction" onChange={handleChange} />
        <InputField label="CPK Level" name="creatinine_phosphokinase" onChange={handleChange} />
        <InputField label="Platelets Count" name="platelets" onChange={handleChange} />
        <InputField label="Serum Creatinine" name="serum_creatinine" onChange={handleChange} />
        <InputField label="Serum Sodium" name="serum_sodium" onChange={handleChange} />

        <SelectField
          label="Anaemia"
          name="anaemia"
          onChange={handleChange}
          options={[
            { value: 0, label: "No" },
            { value: 1, label: "Yes" },
          ]}
        />

        <SelectField
          label="Diabetes"
          name="diabetes"
          onChange={handleChange}
          options={[
            { value: 0, label: "No" },
            { value: 1, label: "Yes" },
          ]}
        />

        <SelectField
          label="High Blood Pressure"
          name="high_blood_pressure"
          onChange={handleChange}
          options={[
            { value: 0, label: "No" },
            { value: 1, label: "Yes" },
          ]}
        />

        <SelectField
          label="Smoking"
          name="smoking"
          onChange={handleChange}
          options={[
            { value: 0, label: "No" },
            { value: 1, label: "Yes" },
          ]}
        />

        <SelectField
          label="Gender"
          name="sex"
          onChange={handleChange}
          options={[
            { value: 1, label: "Male" },
            { value: 0, label: "Female" },
          ]}
        />

      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        {loading ? "Analyzing..." : "Predict Risk"}
      </button>

      {result !== null && (
        <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center">

          <h3 className="text-lg font-semibold">
            Predicted Heart Failure Risk
          </h3>

          <p className={`text-4xl font-bold ${getColor()}`}>
            {result}%
          </p>

          {warning && (
            <p className="text-yellow-600 mt-3 text-sm">
              Due to missing field(s), the prediction may not be fully accurate.
            </p>
          )}

        </div>
      )}

    </div>
  );
}

export default HeartPage;
