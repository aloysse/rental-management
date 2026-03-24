import { Zap, Plus, Download, Trash2 } from "lucide-react";

// ─── Brand Design System Components ────────────────────────────────────────

export function BrandButton({
  children,
  onClick,
  icon,
  size = "md",
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white rounded transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  onClick,
  icon,
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 border border-brand text-brand bg-white hover:bg-brand-light rounded transition-colors font-medium ${
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

export function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded border text-sm transition-colors ${
        active
          ? "bg-brand text-white border-brand"
          : "border-gray-300 text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-gray-200 overflow-hidden bg-white text-sm">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-4 py-1.5 transition-colors ${
            value === opt
              ? "bg-brand text-white font-medium"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function BrandCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}

// ─── End Brand Design System Components ────────────────────────────────────


export function UpgradeTag() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[10px] rounded border border-amber-300">
      <Zap size={9} />
      社宅
    </span>
  );
}

export function UpgradeSection({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="border border-amber-300 rounded-lg bg-amber-50 p-4 relative">
      <div className="absolute -top-2.5 left-3 bg-amber-50 px-1">
        <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
          <Zap size={11} />
          {label || "社宅功能"}
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
    "一般租案": "bg-gray-100 text-gray-600 border-gray-300",
    "社宅包租案": "bg-teal-100 text-teal-700 border-teal-300",
    "社宅代租案": "bg-blue-100 text-blue-700 border-blue-300",
    "已繳": "bg-green-100 text-green-700 border-green-300",
    "未繳": "bg-red-100 text-red-600 border-red-300",
    "未申請": "bg-gray-100 text-gray-500 border-gray-300",
    "租約到期": "bg-orange-100 text-orange-700 border-orange-300",
    "即將到期": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "已到期": "bg-orange-100 text-orange-700 border-orange-300",
    "已結束": "bg-gray-100 text-gray-500 border-gray-300",
    "已失效": "bg-gray-100 text-gray-500 border-gray-300",
    "已續約": "bg-blue-100 text-blue-700 border-blue-300",
    "已終止": "bg-red-100 text-red-600 border-red-300",
    "承租中": "bg-green-100 text-green-700 border-green-300",
    "待租": "bg-yellow-100 text-yellow-700 border-yellow-300",
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 text-xs rounded-full border ${styles[status] || "bg-gray-100 text-gray-600 border-gray-300"}`}>
      {status}
    </span>
  );
}

export function RadioGroup({ name, options, defaultValue }: { name: string; options: string[]; defaultValue?: string }) {
  return (
    <div className="flex gap-6 mt-1.5">
      {options.map((opt) => (
        <label key={opt} className="inline-flex items-center gap-1.5 text-sm text-gray-700">
          <input type="radio" name={name} className="w-4 h-4" defaultChecked={opt === defaultValue} readOnly />
          {opt}
        </label>
      ))}
    </div>
  );
}

export function SectionDivider() {
  return <div className="border-t border-dashed border-gray-200 my-5" />;
}

export function FileUploadButton({ label = "上傳檔案" }: { label?: string }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
      <Plus size={14} />
      {label}
    </button>
  );
}

export function CheckItem({ label, note, color }: { label: string; note?: string; color?: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
      <input type="checkbox" className="w-4 h-4" readOnly />
      <span>{label}</span>
      {note && <span className={`text-xs ${color === "red" ? "text-red-500" : "text-gray-400"}`}>{note}</span>}
    </label>
  );
}

export function FileAttachmentList({ attachments }: {
  attachments: Array<{ id: string; name: string; fileType: string }>;
}) {
  return (
    <div className="space-y-2">
      {attachments.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">尚無附加檔案</p>
      ) : (
        attachments.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-500 font-medium">
                {file.fileType}
              </div>
              <span className="text-sm text-gray-700">{file.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 border border-gray-200 rounded">
                <Download size={11} />下載
              </button>
              <button className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 px-2 py-1 border border-red-200 rounded">
                <Trash2 size={11} />刪除
              </button>
            </div>
          </div>
        ))
      )}
    </div>
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
