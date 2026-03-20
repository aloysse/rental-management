import { useState } from "react";
import { X, CheckCircle, ChevronRight } from "lucide-react";

interface LeaseRenewalModalProps {
  propertyName: string;
  tenantName: string;
  landlordName: string;
  currentStartDate: string;
  currentEndDate: string;
  currentRent: number;
  currentDepositMonths: number;
  onClose: () => void;
  onConfirm: (newEndDate: string, newRent: number) => void;
}

export function LeaseRenewalModal({
  propertyName, tenantName, landlordName,
  currentStartDate, currentEndDate, currentRent, currentDepositMonths,
  onClose, onConfirm,
}: LeaseRenewalModalProps) {
  const [step, setStep] = useState(0);
  const STEPS = ["確認續約條件", "建立續約契約", "確認完成"];

  // Compute default new start date (currentEndDate + 1 day)
  const defaultNewStart = (() => {
    const d = new Date(currentEndDate);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();
  const defaultNewEnd = (() => {
    const d = new Date(defaultNewStart);
    d.setFullYear(d.getFullYear() + 1);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  })();

  const [newStartDate, setNewStartDate] = useState(defaultNewStart);
  const [newEndDate, setNewEndDate] = useState(defaultNewEnd);
  const [newRent, setNewRent] = useState(String(currentRent));
  const [depositMonths, setDepositMonths] = useState(String(currentDepositMonths));
  const [contractType, setContractType] = useState("住宅租賃契約書");
  const [checks1, setChecks1] = useState({ landlord: false, tenant: false, rent: false });
  const [finalConfirm, setFinalConfirm] = useState(false);

  const allChecks1 = Object.values(checks1).every(Boolean);
  const canFinish = finalConfirm;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[720px] max-h-[88vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-gray-800">續約</h2>
            <div className="flex items-center mt-1.5">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${i < step ? "bg-gray-800 border-gray-800 text-white" : i === step ? "border-gray-800 bg-white text-gray-800" : "border-gray-300 bg-white text-gray-400"}`}>
                      {i < step ? <CheckCircle size={12} /> : i + 1}
                    </div>
                    <span className={`text-xs whitespace-nowrap ${i === step ? "text-gray-800" : i < step ? "text-gray-600" : "text-gray-400"}`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-gray-800" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-0 h-full">

            {/* Left content */}
            <div className="col-span-2 p-6 border-r border-gray-100 space-y-4">
              {step === 0 && (
                <>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租賃期間</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">新起始日 <span className="text-red-400">*</span></label>
                        <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">新終止日 <span className="text-red-400">*</span></label>
                        <input type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租金調整</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">現行月租金</label>
                        <div className="px-3 py-2 border border-gray-200 rounded text-sm text-gray-400 bg-gray-50">
                          NT$ {currentRent.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">新月租金（元）<span className="text-red-400">*</span></label>
                        <input type="number" value={newRent} onChange={(e) => setNewRent(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">押金（月）</label>
                        <select value={depositMonths} onChange={(e) => setDepositMonths(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
                          {[1, 2, 3].map((n) => <option key={n} value={n}>{n} 個月</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-3 pb-2 border-b border-gray-100">特殊約定</h3>
                    <textarea rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-gray-400" placeholder="請輸入特殊約定事項（選填）..." />
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
                  <h3 className="text-sm text-gray-700 mb-2 pb-2 border-b border-gray-100">契約文件</h3>
                  <p className="text-xs text-gray-400">請確認以下新契約資訊，完成後將建立新的租賃契約記錄。</p>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">選擇契約類型</label>
                    <select value={contractType} onChange={(e) => setContractType(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
                      <option>住宅租賃契約書</option>
                      <option>車位租約</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">契約起始日</label>
                      <div className="px-3 py-2 border border-gray-200 rounded text-sm text-gray-600 bg-gray-50">{newStartDate}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">契約終止日</label>
                      <div className="px-3 py-2 border border-gray-200 rounded text-sm text-gray-600 bg-gray-50">{newEndDate}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-600 space-y-1">
                    <p className="font-medium text-gray-700">新契約預覽</p>
                    <p>類型：{contractType}</p>
                    <p>期間：{newStartDate} ~ {newEndDate}</p>
                    <p>月租：NT$ {Number(newRent).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">本次操作將執行以下變更</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" />建立新租賃契約（{newStartDate} ~ {newEndDate}，NT$ {Number(newRent).toLocaleString()}/月）</li>
                      <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" />原契約狀態 → 已續約</li>
                      <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" />出租中案件終止日更新為 {newEndDate}</li>
                      <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" />物件維持「出租中」狀態</li>
                      <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" />承租人維持「承租中」狀態</li>
                    </ul>
                  </div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 mt-0.5 flex-shrink-0"
                      checked={finalConfirm} onChange={(e) => setFinalConfirm(e.target.checked)} />
                    <span className="text-sm text-gray-700">確認所有變更正確，不可撤銷</span>
                  </label>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="p-5 space-y-4">
              {/* 原始租賃資料 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-xs">
                <p className="text-gray-500 font-medium">原始租賃資料</p>
                <div className="flex justify-between"><span className="text-gray-400">承租人</span><span className="text-gray-700">{tenantName}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">出租人</span><span className="text-gray-700">{landlordName}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">原始起始</span><span className="text-gray-700">{currentStartDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">原始終止</span><span className="text-gray-700">{currentEndDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">原月租</span><span className="text-gray-700">NT$ {currentRent.toLocaleString()}</span></div>
              </div>

              {/* Step 1 confirmation checks */}
              {step === 1 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2.5">
                  <p className="text-xs text-gray-500 font-medium">確認事項</p>
                  {[
                    { key: "landlord" as const, label: `已與出租人（${landlordName}）確認續約意願` },
                    { key: "tenant" as const, label: `已與承租人（${tenantName}）確認續約意願` },
                    { key: "rent" as const, label: "租金條件雙方同意" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        checked={checks1[key]} onChange={(e) => setChecks1((prev) => ({ ...prev, [key]: e.target.checked }))} />
                      <span className="text-xs text-gray-600">{label}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex flex-col gap-2">
                <button
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="px-3 py-2 border border-gray-300 text-xs text-gray-600 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← 上一步
                </button>
                {step < 2 ? (
                  <button
                    disabled={step === 1 && !allChecks1}
                    onClick={() => setStep((s) => s + 1)}
                    className="px-3 py-2 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    下一步 <ChevronRight size={12} />
                  </button>
                ) : (
                  <button
                    disabled={!canFinish}
                    onClick={() => onConfirm(newEndDate, Number(newRent))}
                    className="px-3 py-2 bg-green-700 text-white text-xs rounded hover:bg-green-800 flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={12} />完成續約
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
