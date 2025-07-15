"use client";

import { useState } from "react";
import Tab from "./components/tab";
import NullOtoHome from "./pages/NullOtoHome";
import NullOtoEQ from "./pages/NullOtoEQ";
import NullOtoPreset from "./pages/NullOtoPreset";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <NullOtoHome />;
      case "eq":
        return <NullOtoEQ />;
      case "preset":
        return <NullOtoPreset />;
      default:
        return <NullOtoHome />;
    }
  };

  return (
    <div>
      <Tab activeTab={activeTab} onTabChange={setActiveTab} />
      {renderPage()}
    </div>
  );
}
