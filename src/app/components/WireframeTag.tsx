import { Zap } from "lucide-react";

export function UpgradeTag() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[10px] rounded border border-amber-300">
      <Zap size={9} />
      升級版
    </span>
  );
}

export function UpgradeSection({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="border border-amber-300 rounded-lg bg-amber-50 p-4 relative">
      <div className="absolute -top-2.5 left-3 bg-amber-50 px-1">
        <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
          <Zap size={11} />
          {label || "升級版功能"}
        </span>
      </div>
      {children}
    </div>
  );
}

export function ImageUploadBox({ label }: { label: string }) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-white cursor-pointer hover:bg-gray-50">
      <div className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center bg-gray-100">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="12" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
          <circle cx="7" cy="9" r="1.5" stroke="#9ca3af" strokeWidth="1.5"/>
          <path d="M2 14l4-4 3 3 3-4 4 5" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="text-xs text-gray-500 text-center">{label}</p>
      <p className="text-[10px] text-gray-400">點擊或拖曳上傳</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "出租中": "bg-green-100 text-green-700 border-green-300",
    "待出租": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "生效中": "bg-green-100 text-green-700 border-green-300",
    "草稿": "bg-gray-100 text-gray-600 border-gray-300",
    "通過": "bg-green-100 text-green-700 border-green-300",
    "未通過": "bg-red-100 text-red-600 border-red-300",
    "申請中": "bg-blue-100 text-blue-700 border-blue-300",
    "弱勢": "bg-purple-100 text-purple-700 border-purple-300",
    "一般": "bg-gray-100 text-gray-600 border-gray-300",
    "自然人": "bg-blue-100 text-blue-700 border-blue-300",
    "法人": "bg-indigo-100 text-indigo-700 border-indigo-300",
    "住宅租賃": "bg-teal-100 text-teal-700 border-teal-300",
    "商業租賃": "bg-orange-100 text-orange-700 border-orange-300",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs rounded border ${styles[status] || "bg-gray-100 text-gray-600 border-gray-300"}`}>
      {status}
    </span>
  );
}

export function FormField({ label, placeholder, type = "text", required }: { label: string; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white resize-none h-20 focus:outline-none focus:border-gray-400"
          placeholder={placeholder || `請輸入${label}`}
          readOnly
        />
      ) : type === "select" ? (
        <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400 bg-white flex items-center justify-between">
          <span>{placeholder || `請選擇${label}`}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      ) : (
        <input
          type={type}
          className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-400"
          placeholder={placeholder || `請輸入${label}`}
          readOnly
        />
      )}
    </div>
  );
}
