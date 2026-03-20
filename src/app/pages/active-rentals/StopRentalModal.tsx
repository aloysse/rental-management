import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface StopRentalModalProps {
  propertyName: string;
  tenantName: string;
  landlordName: string;
  startDate: string;
  endDate: string;
  onClose: () => void;
  onConfirm: (terminationDate: string, reason: string) => void;
}

export function StopRentalModal({
  propertyName, tenantName, landlordName, startDate, endDate,
  onClose, onConfirm,
}: StopRentalModalProps) {
  const [step, setStep] = useState(1);
  const [terminationDate, setTerminationDate] = useState("");
  const [reason, setReason] = useState("");
  const [checks, setChecks] = useState({ landlord: false, tenant: false, date: false, deposit: false });

  const allChecked = Object.values(checks).every(Boolean);
  const canProceed = terminationDate && reason;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[520px] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-gray-800">{step === 1 ? "停止租賃" : "確認停止租賃"}</h2>
            <div className="flex items-center gap-2 mt-1">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center border-2 ${s < step ? "bg-gray-800 border-gray-800 text-white" : s === step ? "border-gray-800 text-gray-800 bg-white" : "border-gray-300 text-gray-400 bg-white"}`}>
                    {s}
                  </div>
                  <span className={`text-xs ${s === step ? "text-gray-800" : "text-gray-400"}`}>
                    {s === 1 ? "填寫資訊" : "最終確認"}
                  </span>
                  {s < 2 && <div className="w-6 h-px bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex-1 overflow-y-auto space-y-4">
          {step === 1 && (
            <>
              {/* 目前租約 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1.5 text-sm">
                <p className="text-xs text-gray-500 font-medium mb-2">目前租約</p>
                <div className="flex justify-between"><span className="text-gray-400">物件</span><span className="text-gray-700">{propertyName}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">承租人</span><span className="text-gray-700">{tenantName}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">原始租期</span><span className="text-gray-700 text-xs">{startDate} ~ {endDate}</span></div>
              </div>

              {/* 終止設定 */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    終止生效日 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    max={endDate}
                    value={terminationDate}
                    onChange={(e) => setTerminationDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">終止日後物件將恢復待出租狀態</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    停止原因 <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
                  >
                    <option value="">請選擇原因</option>
                    <option>承租人申請提前終止</option>
                    <option>出租人申請提前終止</option>
                    <option>雙方合意提前終止</option>
                    <option>其他</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">備註說明（選填）</label>
                  <textarea
                    rows={2}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:border-gray-400"
                    placeholder="請輸入備註..."
                  />
                </div>
              </div>

              {/* 警示 */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={15} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-orange-700 font-medium mb-1.5">以下為不可逆操作</p>
                    <ul className="text-xs text-orange-600 space-y-1">
                      <li>• 物件狀態 → 待出租（終止日起）</li>
                      <li>• 承租人狀態 → 待租</li>
                      <li>• 所有生效中契約 → 已終止</li>
                      <li>• 案件保留為歷史紀錄</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1.5 text-sm">
                <p className="text-xs text-gray-500 font-medium mb-2">確認停止資訊</p>
                <div className="flex justify-between"><span className="text-gray-400">物件</span><span className="text-gray-700">{propertyName}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">承租人</span><span className="text-gray-700">{tenantName}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">終止日期</span><span className="text-orange-600 font-medium">{terminationDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">停止原因</span><span className="text-gray-700">{reason}</span></div>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs text-gray-500">請確認以下所有事項後才能執行：</p>
                {[
                  { key: "landlord" as const, label: `已通知出租人（${landlordName}）提前終止事宜` },
                  { key: "tenant" as const, label: `已通知承租人（${tenantName}）提前終止事宜` },
                  { key: "date" as const, label: `終止日期（${terminationDate}）雙方均已確認` },
                  { key: "deposit" as const, label: "退押金、交屋事宜已確認" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      checked={checks[key]}
                      onChange={(e) => setChecks((prev) => ({ ...prev, [key]: e.target.checked }))}
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          {step === 1 ? (
            <>
              <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100">取消</button>
              <button
                disabled={!canProceed}
                onClick={() => setStep(2)}
                className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                下一步 →
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100">← 上一步</button>
              <button
                disabled={!allChecked}
                onClick={() => onConfirm(terminationDate, reason)}
                className="px-5 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                確認停止
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
