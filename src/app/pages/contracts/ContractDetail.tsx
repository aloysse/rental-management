import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Download, FileText, CheckCircle, ChevronRight, Zap } from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { contracts } from "../../data/mockData";
import { FormField, UpgradeSection, StatusBadge } from "../../components/WireframeTag";

const STEPS = ["基本資訊", "租賃條款", "特約事項", "確認簽署"];

export function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUpgrade } = useVersion();
  const isNew = id === "new";
  const contract = isNew ? null : contracts.find((c) => c.id === id) ?? contracts[0];
  const [step, setStep] = useState(0);

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/contracts")}
            className="p-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-gray-800 text-lg">{isNew ? "新增契約" : contract?.name}</h1>
            {!isNew && contract && (
              <div className="flex items-center gap-2 mt-0.5">
                {isUpgrade && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">媒合編號</span>
                    <input
                      className="text-xs text-gray-700 font-mono border border-gray-300 rounded px-2 py-0.5 w-48 focus:outline-none focus:border-gray-500 bg-white"
                      defaultValue="住通台北B3M105*****"
                    />
                  </div>
                )}
                <StatusBadge status={contract.status} />
                {isUpgrade && <StatusBadge status={contract.applied ? "申請中" : "未申請"} />}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {isUpgrade && (
            <button className="flex items-center gap-2 px-4 py-2 border border-blue-400 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100 transition-colors">
              <Zap size={14} />
              一鍵填表申請
            </button>
          )}
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5">
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 group transition-colors`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 transition-colors ${
                    i < step
                      ? "bg-gray-800 border-gray-800 text-white"
                      : i === step
                      ? "border-gray-800 bg-white text-gray-800"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span
                  className={`text-sm whitespace-nowrap ${
                    i === step ? "text-gray-800" : i < step ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {s}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${i < step ? "bg-gray-800" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          {step === 0 && (
            <StepBasicInfo contract={contract} isNew={isNew} isUpgrade={isUpgrade} />
          )}
          {step === 1 && (
            <StepTerms contract={contract} isUpgrade={isUpgrade} />
          )}
          {step === 2 && (
            <StepSpecialTerms />
          )}
          {step === 3 && (
            <StepConfirm contract={contract} isNew={isNew} isUpgrade={isUpgrade} />
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Navigation */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between gap-3">
              <button
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="flex-1 px-3 py-2 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← 上一步
              </button>
              {!isLastStep ? (
                <button
                  onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                  className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 flex items-center justify-center gap-1"
                >
                  下一步 <ChevronRight size={14} />
                </button>
              ) : (
                <button className="flex-1 px-3 py-2 bg-green-700 text-white text-sm rounded hover:bg-green-800 flex items-center justify-center gap-1">
                  <CheckCircle size={14} />
                  完成
                </button>
              )}
            </div>
          </div>

          {/* Contract summary */}
          {!isNew && contract && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-xs text-gray-500 mb-3">契約摘要</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">物件</span>
                  <span className="text-gray-700">{contract.propertyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">出租人</span>
                  <span className="text-gray-700">{contract.landlordName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">承租人</span>
                  <span className="text-gray-700">{contract.tenantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">月租金</span>
                  <span className="text-gray-700">NT$ {contract.rent?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">起始日</span>
                  <span className="text-gray-700">{contract.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">到期日</span>
                  <span className="text-gray-700">{contract.endDate}</span>
                </div>
              </div>
            </div>
          )}

          {/* Download (upgrade, last step) */}
          {isUpgrade && isLastStep && !isNew && (
            <div className="border border-amber-300 bg-amber-50 rounded-lg p-4">
              <p className="text-xs text-amber-700 mb-3 flex items-center gap-1">
                <Zap size={11} /> 升級版功能
              </p>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm rounded hover:bg-amber-600 transition-colors">
                <Download size={14} />
                下載契約 PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Step Components ─────────────────────────── */

function StepBasicInfo({ contract, isNew, isUpgrade }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">基本資訊</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormField label="案件名稱" placeholder={contract?.name || "請輸入案件名稱"} required />
          </div>
          <FormField label="合約類型" placeholder={contract?.type || "請選擇"} type="select" required />
          <FormField label="物件" placeholder={contract?.propertyName || "請選擇物件"} type="select" required />
          <FormField label="出租人" placeholder={contract?.landlordName || "請選擇出租人"} type="select" required />
          <FormField label="承租人" placeholder={contract?.tenantName || "請選擇承租人"} type="select" required />
          <FormField label="簽署日期" placeholder={contract?.startDate || "YYYY-MM-DD"} />
          {isUpgrade && (
            <FormField label="申請狀態" placeholder={contract?.applied ? "申請中" : "未申請"} type="select" />
          )}
        </div>
      </div>
    </div>
  );
}

function StepTerms({ contract, isUpgrade }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租賃期間與租金</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="租賃起始日" placeholder={contract?.startDate || "YYYY-MM-DD"} required />
          <FormField label="租賃終止日" placeholder={contract?.endDate || "YYYY-MM-DD"} required />
          <FormField label="月租金（元）" placeholder={`${contract?.rent?.toLocaleString() || ""}`} required />
          <FormField label="押金（月）" placeholder="2" type="select" />
          <FormField label="付款方式" placeholder="每月5日前繳付" type="select" />
          <FormField label="付款帳戶" placeholder="請選擇帳戶" type="select" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">費用分攤</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="水費" placeholder="請選擇" type="select" />
          <FormField label="電費" placeholder="請選擇" type="select" />
          <FormField label="瓦斯費" placeholder="請選擇" type="select" />
          <FormField label="網路費" placeholder="請選擇" type="select" />
          <FormField label="管理費" placeholder="請選擇" type="select" />
        </div>
      </div>
    </div>
  );
}

function StepSpecialTerms() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">特約條款</h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-3">下列事項是否允許</p>
            <div className="space-y-2">
              {["飼養寵物", "轉租", "裝修", "設置廣告", "營業登記"].map((item) => (
                <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{item}</span>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input type="radio" name={item} className="w-3 h-3" readOnly />
                      允許
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input type="radio" name={item} className="w-3 h-3" readOnly defaultChecked />
                      不允許
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input type="radio" name={item} className="w-3 h-3" readOnly />
                      協議
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <FormField label="其他特約事項" placeholder="請輸入其他雙方同意之特約條款..." type="textarea" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">提前終止條款</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="提前通知期（天）" placeholder="30" />
          <FormField label="違約金計算方式" placeholder="請選擇" type="select" />
        </div>
      </div>
    </div>
  );
}

function StepConfirm({ contract, isNew, isUpgrade }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
          <FileText size={15} />
          契約確認與簽署
        </h2>
        <div className="border border-gray-200 rounded p-4 bg-gray-50 mb-4">
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
            <FileText size={11} />
            住宅租賃契約（預覽）
          </p>
          <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
            <p>立契約書人出租人（以下簡稱甲方）：<strong>{contract?.landlordName || "___________"}</strong>，承租人（以下簡稱乙方）：<strong>{contract?.tenantName || "___________"}</strong>，雙方同意就下列租賃標的物訂立本契約，條款如下：</p>
            <p><strong>第一條【租賃標的】</strong>本契約租賃標的為：{contract?.propertyName || "___________"}，地址：台北市中正區忠孝東路1段1號3樓，建物面積約 25.5 坪。</p>
            <p><strong>第二條【租賃期間】</strong>租賃期間自 <strong>{contract?.startDate || "____年__月__日"}</strong> 起至 <strong>{contract?.endDate || "____年__月__日"}</strong> 止，共計 24 個月。</p>
            <p><strong>第三條【租金】</strong>每月租金為新臺幣 <strong>{contract?.rent?.toLocaleString() || "_______"}</strong> 元整，每月五日前繳付，不得拖欠。</p>
            <p><strong>第四條【押金】</strong>乙方應於簽約時繳交押金兩個月租金，計新臺幣 <strong>{contract ? (contract.rent * 2).toLocaleString() : "_______"}</strong> 元整。</p>
            <p><strong>第五條【費用負擔】</strong>水費、電費由乙方自行負擔，管理費由甲方負擔。</p>
            <p className="text-gray-400">...（以下條款省略，實際契約內容請下載完整版查閱）</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 border border-gray-200 rounded">
            <input type="checkbox" className="w-4 h-4 accent-gray-800" id="agree" readOnly />
            <label htmlFor="agree" className="text-xs text-gray-600 cursor-pointer">
              本人已詳閱並了解租賃契約所有條款內容，同意遵守並簽署本契約。
            </label>
          </div>
        </div>
      </div>

      {/* Signature area */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">簽署資訊</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-200 rounded p-4 text-center">
            <p className="text-xs text-gray-400 mb-2">出租人簽名</p>
            <div className="h-16 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-300">簽名區域</div>
            <p className="text-[10px] text-gray-400 mt-2">{contract?.landlordName || "出租人"}</p>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded p-4 text-center">
            <p className="text-xs text-gray-400 mb-2">承租人簽名</p>
            <div className="h-16 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-300">簽名區域</div>
            <p className="text-[10px] text-gray-400 mt-2">{contract?.tenantName || "承租人"}</p>
          </div>
        </div>
      </div>

      {isUpgrade && (
        <UpgradeSection label="一鍵填表申請">
          <p className="text-xs text-gray-600 mb-3">完成契約後，可一鍵將資料填入主管機關申請表單並送出申請。</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">申請類型</label>
              <div className="border border-gray-300 rounded px-3 py-2 text-xs text-gray-400 bg-white">住宅租賃補貼申請</div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">申請機關</label>
              <div className="border border-gray-300 rounded px-3 py-2 text-xs text-gray-400 bg-white">台北市政府都發局</div>
            </div>
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm rounded hover:bg-amber-600 transition-colors">
            <Zap size={14} />
            一鍵填表申請
          </button>
        </UpgradeSection>
      )}
    </div>
  );
}