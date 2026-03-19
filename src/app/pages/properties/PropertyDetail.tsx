import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Save, Trash2, Download, Plus, X, FileText, ExternalLink, Zap
} from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { properties, landlords, tenants, activeRentals } from "../../data/mockData";
import {
  FormField, UpgradeSection, StatusBadge,
  RadioGroup, FileUploadButton, FileAttachmentList,
} from "../../components/WireframeTag";

type TabId = "propertyInfo" | "landlordInfo" | "condition" | "socialApp" | "contract" | "attachments" | "matching";

/* ── 委託契約類型 ── */
const DELEGATION_TYPES = [
  { id: "general-delegation", label: "一般租案委託約", desc: "一般住宅出租委託" },
];
const UPGRADE_DELEGATION_TYPES = [
  { id: "social-rent-delegation", label: "社宅委託租賃", desc: "社會住宅委託租賃" },
  { id: "social-lease", label: "社宅包租", desc: "社會住宅包租模式" },
  { id: "social-management", label: "社宅委託管理", desc: "社會住宅委託管理" },
];

/* ── 委託契約類型選擇 Modal ── */
function DelegationContractModal({ onClose, existingTypeIds, onSelect }: {
  onClose: () => void;
  existingTypeIds: string[];
  onSelect: (typeId: string, label: string) => void;
}) {
  const { isUpgrade } = useVersion();
  const [selected, setSelected] = useState<string | null>(null);
  const allTypes = [...DELEGATION_TYPES, ...(isUpgrade ? UPGRADE_DELEGATION_TYPES : [])];
  const selectedLabel = allTypes.find((t) => t.id === selected)?.label ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[520px] max-h-[70vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-gray-800">選擇委託契約類型</h2>
            <p className="text-xs text-gray-400 mt-0.5">已使用的類別將標記說明</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {DELEGATION_TYPES.map((type) => {
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
              {UPGRADE_DELEGATION_TYPES.map((type) => {
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
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100">取消</button>
          <button
            disabled={!selected}
            onClick={() => selected && onSelect(selected, selectedLabel)}
            className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            建立契約
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 契約編輯 Dialog (4步驟) ── */
function ContractEditDialog({ contractType, onClose }: { contractType: string; onClose: () => void }) {
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
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= i ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-400"}`}>{i + 1}</div>
                  {i < steps.length - 1 && <div className={`w-6 h-px ${step > i ? "bg-gray-800" : "bg-gray-200"}`} />}
                </div>
              ))}
              <span className="text-xs text-gray-400 ml-1">{steps[step]}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X size={18} /></button>
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
              <button onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2 | 3)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100">上一步</button>
            )}
          </div>
          <div className="flex gap-3">
            {step === 3 ? (
              <>
                <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                  <Download size={14} />下載 PDF
                </button>
                <button onClick={onClose} className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700">儲存並關閉</button>
              </>
            ) : (
              <button onClick={() => setStep((s) => (s + 1) as 0 | 1 | 2 | 3)} className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700">下一步</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 查看承租人 Dialog ── */
function TenantViewDialog({ tenant, onClose }: { tenant: typeof tenants[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[480px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-gray-800">承租人資料</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-400 text-xs">姓名</span><p className="text-gray-800 mt-0.5">{tenant.name}</p></div>
            <div><span className="text-gray-400 text-xs">電話</span><p className="text-gray-800 mt-0.5">{tenant.phone}</p></div>
            <div><span className="text-gray-400 text-xs">Email</span><p className="text-gray-800 mt-0.5">{tenant.email}</p></div>
            <div><span className="text-gray-400 text-xs">類別</span><p className="mt-0.5"><StatusBadge status={tenant.category} /></p></div>
            <div className="col-span-2"><span className="text-gray-400 text-xs">期望地區</span><p className="text-gray-800 mt-0.5">{tenant.preferredDistrict}</p></div>
            <div><span className="text-gray-400 text-xs">期望租金</span><p className="text-gray-800 mt-0.5">NT$ {tenant.preferredRent.min.toLocaleString()} ~ {tenant.preferredRent.max.toLocaleString()}</p></div>
            <div><span className="text-gray-400 text-xs">期望房型</span><p className="text-gray-800 mt-0.5">{tenant.preferredRoomType}</p></div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-100">關閉</button>
        </div>
      </div>
    </div>
  );
}

/* ── 配對轉出租 Alert ── */
function ConvertToRentalAlert({ tenant, onClose, onConfirm }: {
  tenant: typeof tenants[0];
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] p-6">
        <h2 className="text-gray-800 mb-2">確認配對轉出租？</h2>
        <p className="text-sm text-gray-500 mb-5">
          將此物件與承租人「{tenant.name}」配對，並建立出租中物件紀錄。此操作將無法撤銷。
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-100">取消</button>
          <button onClick={onConfirm} className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700">確認轉出租</button>
        </div>
      </div>
    </div>
  );
}

/* ── 選擇出租人 Dialog ── */
function SelectLandlordDialog({ onClose, onSelect }: {
  onClose: () => void;
  onSelect: (landlord: typeof landlords[0]) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[520px] max-h-[70vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-gray-800">選擇已建立的屋主資料</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {landlords.map((l) => (
            <button
              key={l.id}
              onClick={() => { onSelect(l); onClose(); }}
              className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 text-left transition-colors"
            >
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                {l.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{l.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{l.phone}</p>
              </div>
              <StatusBadge status={l.type} />
              <ExternalLink size={14} className="text-gray-300" />
            </button>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-100">取消</button>
        </div>
      </div>
    </div>
  );
}

/* ══ PropertyDetail ══ */
export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUpgrade } = useVersion();
  const isNew = id === "new";
  const property = isNew ? null : properties.find((p) => p.id === id) ?? properties[0];
  const defaultLandlord = property ? landlords.find((l) => l.id === property.landlordId) ?? null : null;

  const [activeTab, setActiveTab] = useState<TabId>("propertyInfo");
  const [linkedLandlord, setLinkedLandlord] = useState<typeof landlords[0] | null>(defaultLandlord);
  const [showLandlordDialog, setShowLandlordDialog] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [editingContract, setEditingContract] = useState<{ typeId: string; label: string } | null>(null);
  const [viewingTenant, setViewingTenant] = useState<typeof tenants[0] | null>(null);
  const [convertingTenant, setConvertingTenant] = useState<typeof tenants[0] | null>(null);

  // Matching: tenants whose preferredRent.max >= property.rent AND district matches, AND not already in activeRentals
  const activeRentalTenantIds = new Set(activeRentals.map((ar) => ar.tenantId));
  const matchedTenants = property
    ? tenants.filter((t) =>
        t.preferredRent.max >= property.rent &&
        t.preferredDistrict === property.district &&
        !activeRentalTenantIds.has(t.id)
      )
    : [];

  const tabs = [
    { id: "propertyInfo" as TabId, label: "物件資訊" },
    { id: "landlordInfo" as TabId, label: "出租人資訊" },
    { id: "condition" as TabId, label: "屋況" },
    ...(isUpgrade ? [{ id: "socialApp" as TabId, label: "社宅申請" }] : []),
    { id: "contract" as TabId, label: "委託契約" },
    { id: "attachments" as TabId, label: "附加檔案" },
    { id: "matching" as TabId, label: "承租人配對" },
  ];

  const existingContractTypeIds = (property?.delegationContracts ?? []).map((c) => c.typeId);

  return (
    <div className="p-6">
      {/* Dialogs */}
      {showLandlordDialog && (
        <SelectLandlordDialog
          onClose={() => setShowLandlordDialog(false)}
          onSelect={(l) => setLinkedLandlord(l)}
        />
      )}
      {showContractModal && (
        <DelegationContractModal
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
      {viewingTenant && (
        <TenantViewDialog tenant={viewingTenant} onClose={() => setViewingTenant(null)} />
      )}
      {convertingTenant && (
        <ConvertToRentalAlert
          tenant={convertingTenant}
          onClose={() => setConvertingTenant(null)}
          onConfirm={() => {
            setConvertingTenant(null);
            navigate("/active-rentals/AR001");
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/properties")}
            className="p-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-gray-800 text-lg">{isNew ? "新增委託出租物件" : property?.name}</h1>
            {!isNew && property && (
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status={property.status} />
                {isUpgrade && <StatusBadge status={property.applied ? "通過" : "未通過"} />}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <button className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-500 text-sm rounded hover:bg-red-50">
              <Trash2 size={14} />刪除
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">
            <Save size={14} />{isNew ? "建立" : "儲存"}
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-0 border-b border-gray-200 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm border-b-2 transition-colors ${
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
                  <input type="radio" name="rentalType" className="w-4 h-4" defaultChecked={property?.rentalType === "一般租案" || !property} readOnly />
                  一般租案
                </label>
                {isUpgrade && (
                  <>
                    <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <input type="radio" name="rentalType" className="w-4 h-4" defaultChecked={property?.rentalType === "社宅包租案"} readOnly />
                      社宅包租案
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <input type="radio" name="rentalType" className="w-4 h-4" defaultChecked={property?.rentalType === "社宅代租案"} readOnly />
                      社宅代租案
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">案件基本資訊</h2>
              <div className="grid grid-cols-2 gap-4">
                {isUpgrade && (
                  <div className="col-span-2">
                    <FormField label="物件編號" placeholder={property?.caseNo || "請輸入物件編號"} />
                  </div>
                )}
                <div className="col-span-2">
                  <FormField label="案名" placeholder={property?.name || "請輸入案名"} required />
                </div>
                <div className="col-span-2">
                  <FormField label="地址" placeholder={property?.address || "請輸入物件地址"} required />
                </div>
                <FormField label="房型" placeholder={property?.type || "請選擇"} type="select" />
                <FormField label="樓層" placeholder={property?.floor ? `${property.floor}樓` : "請輸入"} />
                <FormField label="坪數（建坪）" placeholder={property?.size ? `${property.size}` : ""} />
                <FormField label="坪數（實坪）" placeholder="請輸入實際坪數" />
                <FormField label="月租金（元）" placeholder={property?.rent ? `${property.rent.toLocaleString()}` : ""} required />
                <FormField label="押金（月）" placeholder="請選擇" type="select" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">負責營業員</h2>
              <FormField label="營業員" placeholder={property?.agentName || "請選擇負責營業員"} type="select" />
            </div>

            <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <ExternalLink size={15} />
              591 一鍵拋轉
            </button>
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">狀態設定</h2>
              <div className="space-y-3">
                <FormField label="出租狀態" placeholder={property?.status || "待出租"} type="select" />
                {isUpgrade && (
                  <FormField label="申請狀態" placeholder={property?.applied ? "通過" : "未通過"} type="select" />
                )}
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
          {!linkedLandlord ? (
            <div className="bg-white border border-gray-200 rounded-lg p-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText size={22} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">尚未建立出租人資訊</p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/landlords/new")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
                >
                  <Plus size={14} />新增出租人
                </button>
                <button
                  onClick={() => setShowLandlordDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50"
                >
                  選擇已建立的屋主資料
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={linkedLandlord.type} />
                  <span className="text-sm text-gray-700">{linkedLandlord.name}</span>
                </div>
                <button
                  onClick={() => setShowLandlordDialog(true)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50"
                >
                  更改出租人
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">出租人資料</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <FormField label="姓名／名稱" placeholder={linkedLandlord.name} />
                  </div>
                  <FormField label="身份類型" placeholder={linkedLandlord.type} type="select" />
                  <FormField label="聯絡電話" placeholder={linkedLandlord.phone} />
                  <div className="col-span-2">
                    <FormField label="Email" placeholder={linkedLandlord.email} />
                  </div>
                  <FormField label="銀行" placeholder={linkedLandlord.bank} />
                  <FormField label="帳號" placeholder={linkedLandlord.account} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: 屋況 ── */}
      {activeTab === "condition" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
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
                      { key: "ac", label: "冷氣" },
                      { key: "waterHeater", label: "熱水器" },
                      { key: "fridge", label: "冰箱" },
                      { key: "washer", label: "洗衣機" },
                      { key: "gasStove", label: "瓦斯爐" },
                      { key: "inductionCooker", label: "電磁爐" },
                      { key: "internet", label: "網路" },
                      { key: "cableTV", label: "第四台" },
                    ].map((item) => {
                      const checked = property?.houseCondition?.appliances?.[item.key as keyof typeof property.houseCondition.appliances];
                      return (
                        <label key={item.key} className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" className="w-3 h-3" defaultChecked={!!checked} readOnly />
                          {item.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="房間數" placeholder="0" />
                  <FormField label="廳數" placeholder="0" />
                  <FormField label="衛浴數" placeholder="0" />
                </div>
              </div>
            </div>

            {isUpgrade && (
              <UpgradeSection label="社宅安全檢測">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500">是否為海砂屋</label>
                    <RadioGroup
                      name="seaSand"
                      options={["否", "是"]}
                      defaultValue={property?.houseCondition?.socialCheck?.seaSand ? "是" : "否"}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">是否為輻射屋</label>
                    <RadioGroup
                      name="radiation"
                      options={["否", "是"]}
                      defaultValue={property?.houseCondition?.socialCheck?.radiation ? "是" : "否"}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">消防安全</label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-1.5 text-sm text-gray-700">
                        <input type="checkbox" className="w-4 h-4" defaultChecked={!!property?.houseCondition?.socialCheck?.fireExtinguisher} readOnly />
                        具備滅火器
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">有無定期消防安全檢查</label>
                    <RadioGroup
                      name="fireInspection"
                      options={["無", "有"]}
                      defaultValue={property?.houseCondition?.socialCheck?.fireInspection ? "有" : "無"}
                    />
                  </div>
                </div>
              </UpgradeSection>
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">備註</h2>
              <FormField label="" placeholder="請輸入屋況備註..." type="textarea" />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: 社宅申請（升級版） ── */}
      {activeTab === "socialApp" && isUpgrade && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">社宅申請資料</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="出租人編號" placeholder={property?.socialHousingApp?.landlordCode || "請輸入出租人編號"} />
              <FormField label="虛擬碼" placeholder={property?.socialHousingApp?.virtualCode || "請輸入虛擬碼"} />
            </div>
            <div className="mt-4 p-4 border border-dashed border-gray-300 rounded text-sm text-gray-400 text-center">
              其他申請欄位之後補充
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-amber-400 bg-amber-50 text-amber-700 text-sm rounded hover:bg-amber-100">
            <Download size={14} />下載申請書
          </button>
        </div>
      )}

      {/* ── Tab: 委託契約 ── */}
      {activeTab === "contract" && (
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-gray-700">委託契約清單</h2>
            <button
              onClick={() => setShowContractModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
            >
              <Plus size={14} />新增委託契約
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
                {(property?.delegationContracts ?? []).map((c) => (
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
            {(property?.delegationContracts ?? []).length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">尚未建立委託契約</div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: 附加檔案 ── */}
      {activeTab === "attachments" && (
        <div className="max-w-2xl space-y-4">
          <FileAttachmentList attachments={property?.attachments ?? []} />
          <FileUploadButton label="上傳附加檔案" />
        </div>
      )}

      {/* ── Tab: 承租人配對 ── */}
      {activeTab === "matching" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm text-gray-700">符合條件的承租人</h2>
              <p className="text-xs text-gray-400 mt-0.5">依租金與地區自動配對</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">承租人</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">電話</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">類別</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">期望租金</th>
                  <th className="px-4 py-3 text-right text-xs text-gray-500 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {matchedTenants.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{t.name}</td>
                    <td className="px-4 py-3 text-gray-500">{t.phone}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.category} /></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">NT$ {t.preferredRent.min.toLocaleString()} ~ {t.preferredRent.max.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewingTenant(t)}
                          className="text-xs text-gray-500 px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"
                        >
                          查看承租人
                        </button>
                        <button
                          onClick={() => setConvertingTenant(t)}
                          className="text-xs text-gray-800 px-2 py-1 border border-gray-800 rounded hover:bg-gray-50"
                        >
                          配對轉出租
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {matchedTenants.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">暫無符合條件的承租人</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
