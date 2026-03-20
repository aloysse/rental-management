interface StepTabBarProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function StepTabBar({ tabs, activeTab, onTabChange }: StepTabBarProps) {
  return (
    <div className="overflow-x-auto pb-2 mb-6">
      <div className="flex items-start justify-center min-w-max">
        {tabs.map((tab, i) => {
          const isActive = tab.id === activeTab;

          return (
            <div key={tab.id} className="flex items-start min-w-[60px]">
              {/* Step circle + label */}
              <button
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center gap-1 focus:outline-none"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-xs whitespace-nowrap ${
                    isActive ? "text-gray-800 font-medium" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>

              {/* Connector line (not after last step) */}
              {i < tabs.length - 1 && (
                <div className="flex-1 h-px mt-3.5 mx-1 min-w-[24px] bg-gray-300" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
