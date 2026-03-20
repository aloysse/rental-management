import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavBarProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onTabChange: (id: string) => void;
  nextLabel?: string;
}

export function StepNavBar({ tabs, activeTab, onTabChange, nextLabel }: StepNavBarProps) {
  const currentIndex = tabs.findIndex((t) => t.id === activeTab);
  const prevTab = tabs[currentIndex - 1] ?? null;
  const nextTab = tabs[currentIndex + 1] ?? null;

  return (
    <div className="mt-8 pt-5 border-t border-gray-200 flex items-center justify-between">
      <div className="min-w-[140px]">
        {prevTab && (
          <button
            onClick={() => onTabChange(prevTab.id)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={14} />
            {prevTab.label}
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        步驟 {currentIndex + 1} / {tabs.length}
      </p>

      <div className="min-w-[140px] flex justify-end">
        {nextTab && (
          <button
            onClick={() => onTabChange(nextTab.id)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            {nextLabel ?? nextTab.label}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
