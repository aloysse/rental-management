import { useState } from "react";
import { X, Download, FileText, Zap, CheckCircle, ChevronRight } from "lucide-react";
import { useVersion } from "../context/VersionContext";
import { FormField, UpgradeSection } from "./WireframeTag";

/* ── 委託契約編輯 Dialog（PropertyDetail 用）── */
export function DelegationContractEditDialog({
  contractType,
  onClose,
}: {
  contractType: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const steps = ["基本資訊", "租賃條款", "特約事項", "確認完成"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[680px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-gray-800">{contractType}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              {steps.map((s, i) => (
                <div key={i} className={`flex items-center ${i < steps.length - 1 ? "gap-2" : ""}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step >= i ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-6 h-px ${step > i ? "bg-gray-800" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
              <span className="text-xs text-gray-400 ml-1">{steps[step]}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><FormField label="案件名稱" required /></div>
              <FormField label="起始日期" type="text" placeholder="YYYY-MM-DD" />
              <FormField label="終止日期" type="text" placeholder="YYYY-MM-DD" />
              <FormField label="月租金" />
              <FormField label="押金月數" type="select" placeholder="請選擇" />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <FormField label="付款方式" type="select" placeholder="請選擇" />
              <FormField label="水費分擔" type="select" placeholder="請選擇" />
              <FormField label="電費分擔" type="select" placeholder="請選擇" />
              <FormField label="瓦斯費分擔" type="select" placeholder="請選擇" />
              <FormField label="管理費分擔" type="select" placeholder="請選擇" />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              {["飼養寵物", "轉租", "裝修"].map((item) => (
                <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">{item}</span>
                  <div className="flex gap-3">
                    {["允許", "不允許", "協議"].map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <input type="radio" name={item} className="w-3 h-3" defaultChecked={opt === "不允許"} readOnly />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <FormField label="其他特約事項" type="textarea" />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 leading-7">
                <p className="font-medium text-gray-800 mb-3">委託契約書預覽</p>
                <p>委託人（甲方）與受託人（乙方），就下列不動產之租賃委託，訂立本契約，雙方同意遵守下列條款...</p>
                <p className="mt-3 text-gray-400 text-xs">（契約內容依實際填寫資料生成）</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="w-4 h-4" readOnly />
                我已閱讀並同意上述委託契約書條款
              </label>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div>
            {step > 0 && (
              <button
                onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2 | 3)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                上一步
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {step === 3 ? (
              <>
                <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                  <Download size={14} />下載 PDF
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                  儲存並關閉
                </button>
              </>
            ) : (
              <button
                onClick={() => setStep((s) => (s + 1) as 0 | 1 | 2 | 3)}
                className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                下一步
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 租賃契約編輯 Dialog（ActiveRentalDetail 用）── */
export function RentalContractEditDialog({
  contractType,
  onClose,
}: {
  contractType: string;
  onClose: () => void;
}) {
  const { isUpgrade } = useVersion();
  const [step, setStep] = useState(0);
  const STEPS = ["基本資訊", "租賃條款", "特約事項", "確認簽署"];
  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[720px] max-h-[88vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-gray-800">{contractType}</h2>
            <div className="flex items-center mt-1.5">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <button onClick={() => setStep(i)} className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${
                        i < step
                          ? "bg-gray-800 border-gray-800 text-white"
                          : i === step
                          ? "border-gray-800 bg-white text-gray-800"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {i < step ? <CheckCircle size={12} /> : i + 1}
                    </div>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        i === step ? "text-gray-800" : i < step ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {s}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-2 ${i < step ? "bg-gray-800" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-0">
            <div className="col-span-2 p-6 border-r border-gray-100">
              {step === 0 && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">基本資訊</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2"><FormField label="案件名稱" required /></div>
                      <FormField label="合約類型" placeholder={contractType} type="select" />
                      <FormField label="物件" type="select" />
                      <FormField label="出租人" type="select" />
                      <FormField label="承租人" type="select" />
                      <FormField label="簽署日期" placeholder="YYYY-MM-DD" />
                      {isUpgrade && <FormField label="申請狀態" type="select" placeholder="未申請" />}
                    </div>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租賃期間與租金</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="租賃起始日" placeholder="YYYY-MM-DD" required />
                      <FormField label="租賃終止日" placeholder="YYYY-MM-DD" required />
                      <FormField label="月租金（元）" required />
                      <FormField label="押金（月）" type="select" placeholder="請選擇" />
                      <FormField label="付款方式" type="select" />
                      <FormField label="付款帳戶" type="select" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">費用分攤</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="水費" type="select" placeholder="請選擇" />
                      <FormField label="電費" type="select" placeholder="請選擇" />
                      <FormField label="瓦斯費" type="select" placeholder="請選擇" />
                      <FormField label="管理費" type="select" placeholder="請選擇" />
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">特約條款</h3>
                  <div className="space-y-2">
                    {["飼養寵物", "轉租", "裝修", "設置廣告", "營業登記"].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-sm text-gray-700">{item}</span>
                        <div className="flex gap-3">
                          {["允許", "不允許", "協議"].map((opt) => (
                            <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-600">
                              <input
                                type="radio"
                                name={item}
                                className="w-3 h-3"
                                defaultChecked={opt === "不允許"}
                                readOnly
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <FormField label="其他特約事項" type="textarea" />
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                      <FileText size={14} />契約確認與簽署
                    </h3>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 leading-6 mb-4">
                      <p>立契約書人出租人（甲方）與承租人（乙方），雙方同意就下列租賃標的物訂立本契約...</p>
                      <p className="mt-2 text-gray-400">（契約內容依實際填寫資料生成）</p>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="w-4 h-4" readOnly />
                      本人已詳閱並同意契約書所有條款
                    </label>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">簽署資訊</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-gray-200 rounded p-4 text-center">
                        <p className="text-xs text-gray-400 mb-2">出租人簽名</p>
                        <div className="h-14 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-300">
                          簽名區域
                        </div>
                      </div>
                      <div className="border-2 border-dashed border-gray-200 rounded p-4 text-center">
                        <p className="text-xs text-gray-400 mb-2">承租人簽名</p>
                        <div className="h-14 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-300">
                          簽名區域
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between gap-2">
                  <button
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="flex-1 px-3 py-2 border border-gray-300 text-xs text-gray-600 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← 上一步
                  </button>
                  {!isLastStep ? (
                    <button
                      onClick={() => setStep((s) => Math.min(3, s + 1))}
                      className="flex-1 px-3 py-2 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 flex items-center justify-center gap-1"
                    >
                      下一步 <ChevronRight size={12} />
                    </button>
                  ) : (
                    <button className="flex-1 px-3 py-2 bg-green-700 text-white text-xs rounded hover:bg-green-800 flex items-center justify-center gap-1">
                      <CheckCircle size={12} />完成
                    </button>
                  )}
                </div>
              </div>

              {isLastStep && (
                <>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50">
                    <Download size={14} />下載 PDF
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
                  >
                    儲存並關閉
                  </button>
                  {isUpgrade && (
                    <UpgradeSection label="升級版功能">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm rounded hover:bg-amber-600">
                        <Zap size={14} />一鍵填表申請
                      </button>
                    </UpgradeSection>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
