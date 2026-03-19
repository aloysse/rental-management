import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Save, Download, Plus, X, FileText, Zap, CheckCircle, ChevronRight
} from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { activeRentals, properties, landlords, tenants } from "../../data/mockData";
import {
  FormField, UpgradeSection, StatusBadge,
  RadioGroup, FileAttachmentList, FileUploadButton,
} from "../../components/WireframeTag";

type TabId =
  | "propertyInfo" | "landlordInfo" | "condition" | "tenantInfo"
  | "socialMatch" | "contracts" | "payments" | "attachments" | "realPrice";

/* ── 契約類型 ── */
const BASE_CONTRACT_TYPES = [
  { id: "residential", label: "住宅租賃契約書", desc: "一般住宅出租使用" },
  { id: "parking", label: "車位租約", desc: "停車位、車庫租賃" },
];
const UPGRADE_CONTRACT_TYPES = [
  { id: "social-residential", label: "社會住宅租賃契約書", desc: "社會住宅標準租賃契約", upgrade: true },
  { id: "social-delegate-rent", label: "社宅代租代管－委託租賃契約書", desc: "委託機構代為出租", upgrade: true },
  { id: "social-lease", label: "社會住宅－包租契約書", desc: "社會住宅包租模式", upgrade: true },
];
const DELEGATION_CONTRACT_TYPES = [
  { id: "general-delegation", label: "一般租案委託約", desc: "一般住宅出租委託" },
];
const UPGRADE_DELEGATION_CONTRACT_TYPES = [
  { id: "social-rent-delegation", label: "社宅委託租賃", desc: "社宅委託租賃約", upgrade: true },
  { id: "social-lease-delegation", label: "社宅包租", desc: "社宅包租委託約", upgrade: true },
  { id: "social-management-delegation", label: "社宅委託管理", desc: "社宅委託管理約", upgrade: true },
];

/* ── 契約類型選擇 Modal ── */
function ContractTypeModal({ onClose, existingTypeIds, onSelect }: {
  onClose: () => void;
  existingTypeIds: string[];
  onSelect: (typeId: string, label: string) => void;
}) {
  const { isUpgrade } = useVersion();
  const [selected, setSelected] = useState<string | null>(null);
  const allTypes = [
    ...BASE_CONTRACT_TYPES,
    ...(isUpgrade ? UPGRADE_CONTRACT_TYPES : []),
    ...DELEGATION_CONTRACT_TYPES,
    ...(isUpgrade ? UPGRADE_DELEGATION_CONTRACT_TYPES : []),
  ];
  const selectedLabel = allTypes.find((t) => t.id === selected)?.label ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[520px] max-h-[70vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-gray-800">選擇合約類型</h2>
            <p className="text-xs text-gray-400 mt-0.5">已使用的類別將標記說明</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {BASE_CONTRACT_TYPES.map((type) => {
            const isUsed = existingTypeIds.includes(type.id);
            return (
              <button
                key={type.id}
                disabled={isUsed}
                onClick={() => setSelected(type.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
                  isUsed ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50" :
                  selected === type.id ? "border-gray-800 bg-gray-50 ring-1 ring-gray-800" :
                  "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${selected === type.id && !isUsed ? "bg-gray-800" : "bg-gray-100"}`}>
                  <FileText size={15} className={selected === type.id && !isUsed ? "text-white" : "text-gray-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{type.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                </div>
                {isUsed
                  ? <span className="text-xs text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">已使用</span>
                  : <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selected === type.id ? "border-gray-800 bg-gray-800" : "border-gray-300"}`}>{selected === type.id && <div className="w-full h-full flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>}</div>
                }
              </button>
            );
          })}
          {isUpgrade && (
            <>
              <div className="flex items-center gap-2 pt-2 pb-1">
                <div className="flex-1 h-px bg-amber-200" />
                <span className="flex items-center gap-1 text-xs text-amber-600 px-1"><Zap size={11} />升級版專屬</span>
                <div className="flex-1 h-px bg-amber-200" />
              </div>
              {UPGRADE_CONTRACT_TYPES.map((type) => {
                const isUsed = existingTypeIds.includes(type.id);
                return (
                  <button
                    key={type.id}
                    disabled={isUsed}
                    onClick={() => setSelected(type.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
                      isUsed ? "opacity-50 cursor-not-allowed border-amber-200 bg-amber-50/40" :
                      selected === type.id ? "border-amber-500 bg-amber-50 ring-1 ring-amber-400" :
                      "border-amber-200 bg-amber-50/40 hover:border-amber-300 hover:bg-amber-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${selected === type.id && !isUsed ? "bg-amber-500" : "bg-amber-100"}`}>
                      <FileText size={15} className={selected === type.id && !isUsed ? "text-white" : "text-amber-600"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{type.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                    </div>
                    {isUsed
                      ? <span className="text-xs text-amber-600 bg-amber-100 rounded px-1.5 py-0.5">已使用</span>
                      : <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selected === type.id ? "border-amber-500 bg-amber-500" : "border-amber-300"}`}>{selected === type.id && <div className="w-full h-full flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>}</div>
                    }
                  </button>
                );
              })}
            </>
          )}
          {/* 委託用分隔線 */}
          <div className="flex items-center gap-2 pt-2 pb-1">
            <div className="flex-1 h-px bg-blue-200" />
            <span className="flex items-center gap-1 text-xs text-blue-600 px-1">委託用</span>
            <div className="flex-1 h-px bg-blue-200" />
          </div>
          {DELEGATION_CONTRACT_TYPES.map((type) => {
            const isUsed = existingTypeIds.includes(type.id);
            return (
              <button
                key={type.id}
                disabled={isUsed}
                onClick={() => setSelected(type.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
                  isUsed ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50" :
                  selected === type.id ? "border-gray-800 bg-gray-50 ring-1 ring-gray-800" :
                  "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${selected === type.id && !isUsed ? "bg-gray-800" : "bg-gray-100"}`}>
                  <FileText size={15} className={selected === type.id && !isUsed ? "text-white" : "text-gray-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm text-gray-700">{type.label}</p>
                    <span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">委託用</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                </div>
                {isUsed
                  ? <span className="text-xs text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">已使用</span>
                  : <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selected === type.id ? "border-gray-800 bg-gray-800" : "border-gray-300"}`}>{selected === type.id && <div className="w-full h-full flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>}</div>
                }
              </button>
            );
          })}
          {isUpgrade && (
            <>
              {UPGRADE_DELEGATION_CONTRACT_TYPES.map((type) => {
                const isUsed = existingTypeIds.includes(type.id);
                return (
                  <button
                    key={type.id}
                    disabled={isUsed}
                    onClick={() => setSelected(type.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
                      isUsed ? "opacity-50 cursor-not-allowed border-amber-200 bg-amber-50/40" :
                      selected === type.id ? "border-amber-500 bg-amber-50 ring-1 ring-amber-400" :
                      "border-amber-200 bg-amber-50/40 hover:border-amber-300 hover:bg-amber-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${selected === type.id && !isUsed ? "bg-amber-500" : "bg-amber-100"}`}>
                      <FileText size={15} className={selected === type.id && !isUsed ? "text-white" : "text-amber-600"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm text-gray-700">{type.label}</p>
                        <span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">委託用</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                    </div>
                    {isUsed
                      ? <span className="text-xs text-amber-600 bg-amber-100 rounded px-1.5 py-0.5">已使用</span>
                      : <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selected === type.id ? "border-amber-500 bg-amber-500" : "border-amber-300"}`}>{selected === type.id && <div className="w-full h-full flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>}</div>
                    }
                  </button>
                );
              })}
            </>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100">取消</button>
          <button
            disabled={!selected}
            onClick={() => selected && onSelect(selected, selectedLabel)}
            className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 契約編輯 Dialog ── */
function ContractEditDialog({ contractType, onClose }: { contractType: string; onClose: () => void }) {
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
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${i < step ? "bg-gray-800 border-gray-800 text-white" : i === step ? "border-gray-800 bg-white text-gray-800" : "border-gray-300 bg-white text-gray-400"}`}>
                      {i < step ? <CheckCircle size={12} /> : i + 1}
                    </div>
                    <span className={`text-xs whitespace-nowrap ${i === step ? "text-gray-800" : i < step ? "text-gray-600" : "text-gray-400"}`}>{s}</span>
                  </button>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-gray-800" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X size={18} /></button>
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
                      <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
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
                        <div className="h-14 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-300">簽名區域</div>
                      </div>
                      <div className="border-2 border-dashed border-gray-200 rounded p-4 text-center">
                        <p className="text-xs text-gray-400 mb-2">承租人簽名</p>
                        <div className="h-14 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-300">簽名區域</div>
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
                  <button onClick={onClose} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">
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

/* ══ ActiveRentalDetail ══ */
export function ActiveRentalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUpgrade } = useVersion();

  const isNew = id === "new";
  const rental = isNew ? null : (activeRentals.find((ar) => ar.id === id) ?? activeRentals[0]);
  const property = rental ? properties.find((p) => p.id === rental.propertyId) ?? null : null;
  const landlord = rental ? landlords.find((l) => l.id === rental.landlordId) ?? null : null;
  const tenant = rental ? tenants.find((t) => t.id === rental.tenantId) ?? null : null;

  const [activeTab, setActiveTab] = useState<TabId>("propertyInfo");
  const [showContractModal, setShowContractModal] = useState(false);
  const [editingContract, setEditingContract] = useState<{ typeId: string; label: string } | null>(null);

  const existingContractTypeIds = (rental?.contracts ?? []).map((c) => c.typeId);

  const tabs = [
    { id: "propertyInfo" as TabId, label: "物件資訊" },
    { id: "landlordInfo" as TabId, label: "出租人資訊" },
    { id: "condition" as TabId, label: "屋況" },
    { id: "tenantInfo" as TabId, label: "承租人資訊" },
    ...(isUpgrade ? [{ id: "socialMatch" as TabId, label: "社宅媒合申請" }] : []),
    { id: "contracts" as TabId, label: "契約文件" },
    { id: "payments" as TabId, label: "繳費紀錄" },
    { id: "attachments" as TabId, label: "附加檔案" },
    { id: "realPrice" as TabId, label: "實價登錄登記" },
  ];

  return (
    <div className="p-6">
      {showContractModal && (
        <ContractTypeModal
          onClose={() => setShowContractModal(false)}
          existingTypeIds={existingContractTypeIds}
          onSelect={(typeId, label) => {
            setShowContractModal(false);
            setEditingContract({ typeId, label });
          }}
        />
      )}
      {editingContract && (
        <ContractEditDialog
          contractType={editingContract.label}
          onClose={() => setEditingContract(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/active-rentals")}
            className="p-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-gray-800 text-lg">{isNew ? "新增出租中物件" : (property?.name ?? "出租中物件")}</h1>
            {!isNew && (
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status="出租中" />
                <StatusBadge status={rental?.rentalType ?? "一般租案"} />
              </div>
            )}
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">
          <Save size={14} />儲存
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-0 border-b border-gray-200 mb-5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-gray-800 text-gray-800 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: 物件資訊 ── */}
      {activeTab === "propertyInfo" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租案類型</h2>
              <div className="flex gap-6">
                <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                  <input type="radio" name="rentalType" className="w-4 h-4" defaultChecked={rental?.rentalType === "一般租案"} readOnly />
                  一般租案
                </label>
                {isUpgrade && (
                  <>
                    <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <input type="radio" name="rentalType" className="w-4 h-4" defaultChecked={rental?.rentalType === "社宅包租案"} readOnly />
                      社宅包租案
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <input type="radio" name="rentalType" className="w-4 h-4" defaultChecked={rental?.rentalType === "社宅代租案"} readOnly />
                      社宅代租案
                    </label>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">建物基本資訊</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormField label="物件名稱" placeholder={property?.name} />
                </div>
                <div className="col-span-2">
                  <FormField label="地址" placeholder={property?.address} />
                </div>
                <FormField label="房型" placeholder={property?.type} type="select" />
                <FormField label="樓層" placeholder={property?.floor ? `${property.floor}樓` : ""} />
                <FormField label="坪數（建坪）" placeholder={property?.size ? `${property.size}` : ""} />
                <FormField label="坪數（實坪）" placeholder="" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租賃內容</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="租賃起始日" placeholder={rental?.startDate} />
                <FormField label="租賃終止日" placeholder={rental?.endDate} />
                <FormField label="月租金（元）" placeholder={property?.rent ? `${property.rent.toLocaleString()}` : ""} />
                <FormField label="押金（月）" placeholder={rental?.depositMonths ? `${rental.depositMonths}` : ""} />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">負責營業員</h2>
              <FormField label="營業員" placeholder={rental?.agentName} type="select" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">案件資訊</h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-gray-400">案號</span><span className="text-gray-700 font-mono">{rental?.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">物件編號</span><span className="text-gray-700 font-mono">{property?.caseNo}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">出租人</span><span className="text-gray-700">{landlord?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">承租人</span><span className="text-gray-700">{tenant?.name}</span></div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">備註</h2>
              <FormField label="" placeholder="請輸入備註說明..." type="textarea" />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: 出租人資訊 ── */}
      {activeTab === "landlordInfo" && (
        <div className="max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-sm text-gray-700">出租人資訊</h2>
              <StatusBadge status={landlord?.type ?? "自然人"} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField label="姓名／名稱" placeholder={landlord?.name} />
              </div>
              <FormField label="聯絡電話" placeholder={landlord?.phone} />
              <div className="col-span-2">
                <FormField label="Email" placeholder={landlord?.email} />
              </div>
              <FormField label="銀行名稱" placeholder={landlord?.bank} />
              <FormField label="帳號" placeholder={landlord?.account} />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: 屋況 ── */}
      {activeTab === "condition" && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">設備條件</h2>
            <div className="space-y-5">
              <div>
                <label className="text-xs text-gray-500">車位</label>
                <RadioGroup
                  name="parking"
                  options={["無", "有"]}
                  defaultValue={property?.houseCondition?.parking ? "有" : "無"}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">家電設備</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "ac", label: "冷氣" }, { key: "waterHeater", label: "熱水器" },
                    { key: "fridge", label: "冰箱" }, { key: "washer", label: "洗衣機" },
                    { key: "gasStove", label: "瓦斯爐" }, { key: "inductionCooker", label: "電磁爐" },
                    { key: "internet", label: "網路" }, { key: "cableTV", label: "第四台" },
                  ].map((item) => {
                    const checked = property?.houseCondition?.appliances?.[item.key as keyof typeof property.houseCondition.appliances];
                    return (
                      <label key={item.key} className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 bg-white">
                        <input type="checkbox" className="w-3 h-3" defaultChecked={!!checked} readOnly />
                        {item.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {isUpgrade && (
            <UpgradeSection label="社宅安全檢測">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500">是否為海砂屋</label>
                  <RadioGroup name="seaSand" options={["否", "是"]} defaultValue={property?.houseCondition?.socialCheck?.seaSand ? "是" : "否"} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">是否為輻射屋</label>
                  <RadioGroup name="radiation" options={["否", "是"]} defaultValue={property?.houseCondition?.socialCheck?.radiation ? "是" : "否"} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">有無定期消防安全檢查</label>
                  <RadioGroup name="fireInspection" options={["無", "有"]} defaultValue={property?.houseCondition?.socialCheck?.fireInspection ? "有" : "無"} />
                </div>
              </div>
            </UpgradeSection>
          )}
        </div>
      )}

      {/* ── Tab: 承租人資訊 ── */}
      {activeTab === "tenantInfo" && (
        <div className="max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">承租人基本資訊</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="姓名" placeholder={tenant?.name} required />
              <FormField label="身分證字號" placeholder={tenant?.idNo} required />
              <FormField label="電話" placeholder={tenant?.phone} />
              <FormField label="Email" placeholder={tenant?.email} type="email" />
              <div className="col-span-2">
                <FormField label="戶籍地址" placeholder={tenant?.address} />
              </div>
              <FormField label="出生日期" placeholder="YYYY-MM-DD" />
              <FormField label="緊急聯絡人" placeholder="請輸入緊急聯絡人姓名" />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: 社宅媒合申請（升級版）── */}
      {activeTab === "socialMatch" && isUpgrade && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">社宅媒合申請</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">申請類型</label>
                <RadioGroup
                  name="matchType"
                  options={["包租", "代租"]}
                  defaultValue={rental?.socialHousingMatch?.applicationType ?? "代租"}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="出租人編號" placeholder={rental?.socialHousingMatch?.landlordCode} />
                <FormField label="承租人編號" placeholder={rental?.socialHousingMatch?.tenantCode} />
              </div>
              <div className="p-4 border border-dashed border-gray-300 rounded text-sm text-gray-400 text-center">
                其他申請欄位之後補充
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-amber-400 bg-amber-50 text-amber-700 text-sm rounded hover:bg-amber-100">
            <Zap size={14} />同步申請欄位
          </button>
        </div>
      )}

      {/* ── Tab: 契約文件 ── */}
      {activeTab === "contracts" && (
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-gray-700">契約清單</h2>
            <button
              onClick={() => setShowContractModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
            >
              <Plus size={14} />新增契約
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">契約類型</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">建立日期</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">狀態</th>
                  <th className="px-4 py-3 text-right text-xs text-gray-500 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(rental?.contracts ?? []).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{c.type}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.createdAt}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="flex items-center gap-1 text-xs text-gray-500 px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">
                          <Download size={11} />下載
                        </button>
                        <button
                          onClick={() => setEditingContract({ typeId: c.typeId, label: c.type })}
                          className="text-xs text-gray-500 px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"
                        >
                          編輯
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(rental?.contracts ?? []).length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">尚未建立契約</div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: 繳費紀錄 ── */}
      {activeTab === "payments" && (
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-gray-700">繳費紀錄</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50">
              <Plus size={14} />新增繳費紀錄
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">月份</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">金額（元）</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">繳費日期</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">狀態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(rental?.paymentRecords ?? []).map((pr) => (
                  <tr key={pr.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{pr.month}</td>
                    <td className="px-4 py-3 text-gray-700">NT$ {pr.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{pr.paidAt ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={pr.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(rental?.paymentRecords ?? []).length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">尚無繳費紀錄</div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: 附加檔案 ── */}
      {activeTab === "attachments" && (
        <div className="max-w-3xl space-y-6">
          <div>
            <h3 className="text-sm text-gray-700 mb-3">承租人附加檔案</h3>
            <FileAttachmentList attachments={tenant?.attachments ?? []} />
          </div>
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm text-gray-700 mb-3">委託物件附加檔案</h3>
            <FileAttachmentList attachments={property?.attachments ?? []} />
          </div>
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm text-gray-700 mb-3">其他附加檔案</h3>
            <FileAttachmentList attachments={rental?.otherAttachments ?? []} />
            <div className="mt-3">
              <FileUploadButton label="上傳附加檔案" />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: 實價登錄登記 ── */}
      {activeTab === "realPrice" && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">申報人基本資料</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="申報人姓名" placeholder={rental?.realPriceRegistration?.declarantName} />
              <FormField label="申報人身分證字號" placeholder={rental?.realPriceRegistration?.declarantId} />
              <FormField label="聯絡電話" placeholder="" />
              <div className="col-span-2">
                <FormField label="地址" placeholder="" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">申報代理人基本資料</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="代理人姓名" placeholder={rental?.realPriceRegistration?.agentName} />
              <FormField label="代理人身分證字號" placeholder={rental?.realPriceRegistration?.agentId} />
              <FormField label="聯絡電話" placeholder="" />
              <div className="col-span-2">
                <FormField label="地址" placeholder="" />
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50">
            <Download size={14} />下載 JSON 檔
          </button>
        </div>
      )}
    </div>
  );
}
