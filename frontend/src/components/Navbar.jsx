function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-800">
        Medical AI System
      </h1>

      <div className="flex gap-6">
        <button
          onClick={() => setActiveTab("heart")}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "heart"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Heart disease Prediction
        </button>

        <button
          onClick={() => setActiveTab("oral")}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "oral"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Oral Cancer Detection
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
