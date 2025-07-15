interface TabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Tab({ activeTab, onTabChange }: TabProps) {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "eq", label: "EQ" },
    { id: "preset", label: "Preset" },
  ];

  return (
    <div>
      <div className="absolute top-0 left-0 w-64 h-full bg-stone-900/50">
        <div className="flex columns-1">
          <div className="pt-10 m-10 text-1xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`mb-4 block w-full text-left transition-colors ${
                  activeTab === tab.id
                    ? "text-white "
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
