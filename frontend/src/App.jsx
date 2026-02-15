import { useState } from "react";
import Navbar from "./components/Navbar";
import HeartPage from "./pages/HeartPage";
import OralPage from "./pages/OralPage";
import Chatbot from "./components/Chatbot";

function App() {
  const [activeTab, setActiveTab] = useState("heart");
  const [context, setContext] = useState("");

  return (
    <div className="min-h-screen bg-blue-50">

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex h-[calc(100vh-80px)] p-6 gap-6">

        {/* Left Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 overflow-y-auto">
          {activeTab === "heart" && (
            <HeartPage setContext={setContext} />
          )}
          {activeTab === "oral" && (
            <OralPage setContext={setContext} />
          )}
        </div>

        {/* Right Chatbot */}
        <div className="w-[350px]">
          <Chatbot context={context} />
        </div>

      </div>
    </div>
  );
}

export default App;
