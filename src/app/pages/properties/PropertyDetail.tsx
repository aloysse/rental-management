import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Trash2, Download, Plus, X, FileText, ExternalLink, Zap
} from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { properties, landlords, tenants, activeRentals } from "../../data/mockData";
import {
  FormField, StatusBadge,
  FileUploadButton, FileAttachmentList,
} from "../../components/WireframeTag";
import { StepNavBar } from "../../components/StepNavBar";
import { StepTabBar } from "../../components/StepTabBar";
import { ContractTypeModal } from "../../components/ContractTypeModal";
import { DelegationContractEditDialog } from "../../components/ContractEditDialog";
import {
  PropertyRentalTypeCard,
  PropertyBasicInfoCard,
  PropertyAgentCard,
  LandlordInfoCard,
  PropertyConditionSection,
} from "../../components/PropertySharedSections";

type TabId = "propertyInfo" | "landlordInfo" | "condition" | "socialApp" | "contract" | "attachments" | "matching";

/* ── 歷史租賃紀錄 Section ── */
function HistoryRentalSection({ historyRentals, onNavigate }: {
  historyRentals: Array<{ id: string; tenantName: string; startDate: string; endDate: string; terminationReason?: string }>;
  onNavigate: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50"
        onClick={() => setExpanded((v) => !v)}
      >
        <span>歷史租賃紀錄（{historyRentals.length} 筆）</span>
        <span className="text-xs text-gray-400">{expanded ? "收合" : "展開"}</span>
      </button>
      {expanded && (
        <table className="w-full text-sm border-t border-gray-100">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium">承租人</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium">租賃期間</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium">終止原因</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium">狀態</th>
              <th className="px-4 py-2.5 text-right text-xs text-gray-500 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {historyRentals.map((ar) => (
              <tr key={ar.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{ar.tenantName}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{ar.startDate} ~ {ar.endDate}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{ar.terminationReason ?? "—"}</td>
                <td className="px-4 py-3"><StatusBadge status="已結束" /></td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onNavigate(`/active-rentals/${ar.id}`)}
                    className="text-xs text-gray-500 px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"
                  >
                    查看案件
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const SOCIAL_DOCUMENT_GROUPS = [
  {
    id: "identityProof",
    label: "身分證明文件",
    items: [
      { id: "naturalPersonIdCopy", label: "國民身分證正反面影本（自然人）", note: "申請人為未成年者，得以戶口名簿或戶籍謄本替代", keywords: ["身分證"] },
      { id: "corporateRegistrationCopy", label: "公司登記事項表影本（私法人）", keywords: ["登記事項"] },
      { id: "agentIdCopy", label: "代理人國民身分證正反面影本", keywords: ["代理人", "身分證"] },
    ],
  },
  {
    id: "buildingProof",
    label: "建物證明文件",
    items: [
      { id: "firstBuildingTranscript", label: "第一類建物謄本（必要）", keywords: ["第一類建物謄本", "建物謄本"] },
      { id: "buildingOwnershipCopy", label: "建物所有權狀影本", keywords: ["所有權狀", "建物謄本"] },
      { id: "buildingUsePermitCopy", label: "建築使用執照影本", keywords: ["使用執照"] },
      { id: "surveyResultCopy", label: "測量成果圖影本", keywords: ["測量成果"] },
    ],
  },
  {
    id: "privacyConsent",
    label: "個資同意書",
    items: [
      { id: "privacyConsentDoc", label: "個人資料蒐集、處理及利用告知暨同意書（當事人簽章）", keywords: ["個資同意", "同意書"] },
    ],
  },
  {
    id: "safetyChecklist",
    label: "檢核表",
    items: [
      { id: "safetyChecklistDoc", label: "屋況及租屋安全檢核表（出租人簽章）", keywords: ["檢核表", "屋況"] },
    ],
  },
  {
    id: "bankInfo",
    label: "匯款資訊",
    items: [
      { id: "bankbookCopy", label: "出租人存摺影本", note: "須包含戶名、金融機構/分行名稱及代碼、帳戶號碼", keywords: ["存摺"] },
    ],
  },
  {
    id: "otherDocs",
    label: "其他文件",
    subtitle: "有需要時檢附",
    items: [
      { id: "rentValuationOpinion", label: "估價師租金簽註意見書", note: "若租金單價高於租金水準區間上限時適用", keywords: ["估價師", "租金簽註"] },
      { id: "agentAuthorization", label: "代理人／代表人授權書", keywords: ["代理人授權", "代表人授權", "授權書"] },
      { id: "coOwnerAuthorization", label: "共有住宅代表人授權書", keywords: ["共有住宅代表人授權書"] },
      { id: "originalLeaseCopy", label: "原租賃契約影本", note: "由租金補貼轉入本計畫時適用", keywords: ["原租賃契約", "租賃契約"] },
      { id: "specialApplicantDocs", label: "申請人為身心障礙者或65歲以上老人，申請換居並將自有住宅出租", note: "需同時檢附該申請人之表單5與承租住宅申請書影本", keywords: ["身心障礙", "65歲", "表單5"] },
    ],
  },
] as const;

const SOCIAL_APPLICATION_CONDITIONS = [
  { id: "ownerQualified", label: "出租人為出租住宅之所有權人" },
  { id: "withinCity", label: "租賃標的需坐落於當地直轄市" },
  { id: "legalUseMainPurpose", label: "主要用途登記含有「住」、「住宅」、「農舍」、「套房」、「公寓」或「宿舍」字樣" },
  { id: "legalUseBlank", label: "主要用途均為空白，依房屋稅繳款書或稅捐單位證明認定全部為住宅使用" },
  { id: "legalUseIndustrialException", label: "非位於工業區或丁種建築用地之建物，且有主管機關核可文件認定可作第一目用途" },
  { id: "legalUseOtherProof", label: "不符合前三項規定，提出合法房屋證明或主管機關認定實施建築管理前已建造完成文件" },
] as const;

function EditableCheckOption({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex items-start gap-2 text-sm text-gray-700 leading-6 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 mt-1" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
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

  // Matching: exclude tenants in active (non-ended) rentals only
  const activeTenantIds = new Set(
    activeRentals.filter((ar) => !ar.terminatedAt).map((ar) => ar.tenantId)
  );
  const matchedTenants = property
    ? tenants.filter((t) =>
        t.preferredRent.max >= property.rent &&
        t.preferredDistrict === property.district &&
        !activeTenantIds.has(t.id)
      )
    : [];

  // History rentals for this property
  const historyRentals = activeRentals
    .filter((ar) => ar.propertyId === property?.id && ar.terminatedAt)
    .map((ar) => {
      const t = tenants.find((t) => t.id === ar.tenantId);
      return { ...ar, tenantName: t?.name ?? "—" };
    });

  const tabs = [
    { id: "propertyInfo" as TabId, label: "物件資訊" },
    { id: "landlordInfo" as TabId, label: "出租人資訊" },
    { id: "condition" as TabId, label: "屋況設備" },
    ...(isUpgrade ? [{ id: "socialApp" as TabId, label: "社宅申請" }] : []),
    { id: "contract" as TabId, label: "委託契約" },
    { id: "attachments" as TabId, label: "附加檔案" },
    { id: "matching" as TabId, label: "承租人配對" },
  ];

  const activeTabIndex = tabs.findIndex((t) => t.id === activeTab);
  const landlordInfoIndex = tabs.findIndex((t) => t.id === "landlordInfo");
  const showConvertButton = !isNew || activeTabIndex > landlordInfoIndex;

  const existingContractTypeIds = (property?.delegationContracts ?? []).map((c) => c.typeId);
  const socialUploadedFileNames = (property?.attachments ?? []).map((file) => file.name);
  const isSocialDocumentUploaded = (keywords: readonly string[]) =>
    socialUploadedFileNames.some((fileName) =>
      keywords.some((keyword) => fileName.includes(keyword))
    );

  const [socialConditionChecks, setSocialConditionChecks] = useState<Record<string, boolean>>(
    () =>
      SOCIAL_APPLICATION_CONDITIONS.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = item.id === "ownerQualified" || item.id === "withinCity" ? property?.applied !== "未申請" : false;
        return acc;
      }, {})
  );

  const toggleSocialCondition = (id: string) => {
    setSocialConditionChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        <ContractTypeModal
          mode="delegation"
          onClose={() => setShowContractModal(false)}
          existingTypeIds={existingContractTypeIds}
          onSelect={(typeId, label) => {
            setShowContractModal(false);
            setEditingContract({ typeId, label });
          }}
        />
      )}
      {editingContract && (
        <DelegationContractEditDialog
          contractTypeId={editingContract.typeId}
          contractType={editingContract.label}
          property={property}
          landlord={linkedLandlord}
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
                {isUpgrade && <StatusBadge status={property.applied} />}
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
          {showConvertButton && (
            <button
              onClick={() => navigate("/active-rentals/AR001")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
            >
              轉出租中物件
            </button>
          )}
        </div>
      </div>

      {/* Tab Bar */}
      <StepTabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
      />

      {/* ── Tab: 物件資訊 ── */}
      {activeTab === "propertyInfo" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            <PropertyRentalTypeCard
              rentalType={property?.rentalType}
              isUpgrade={isUpgrade}
              defaultGeneralChecked={!property}
            />
            <PropertyBasicInfoCard property={property} />

            {/* 歷史租賃紀錄（待出租且有歷史租案時顯示） */}
            {historyRentals.length > 0 && (
              <HistoryRentalSection historyRentals={historyRentals} onNavigate={navigate} />
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">備註</h2>
              <FormField label="" placeholder="請輸入備註說明..." type="textarea" />
            </div>
            <PropertyAgentCard agentName={property?.agentName} />
            <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-white bg-gray-800 hover:bg-gray-600 transition-colors">
              <ExternalLink size={15} />
              591 一鍵拋轉
            </button>
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
              <LandlordInfoCard landlord={linkedLandlord} />
            </div>
          )}
        </div>
      )}

      {/* ── Tab: 屋況 ── */}
      {activeTab === "condition" && (
        <PropertyConditionSection property={property} />
      )}

      {/* ── Tab: 社宅申請（升級版） ── */}
      {activeTab === "socialApp" && isUpgrade && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">上傳附件</h2>
              <div className="space-y-4">
                {SOCIAL_DOCUMENT_GROUPS
                  .filter((group) => group.id === "buildingProof" || group.id === "otherDocs")
                  .map((group) => {
                    const uploadItems =
                      group.id === "buildingProof"
                        ? group.items.filter((item) => item.id !== "firstBuildingTranscript")
                        : group.items;
                    const groupUploaded = uploadItems.some((item) => isSocialDocumentUploaded(item.keywords));

                    return (
                      <div key={group.id} className="border border-gray-200 rounded-xl bg-gray-50/60 p-4 space-y-3 mb-4">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm text-gray-700">{group.label}</p>
                            {"subtitle" in group && group.subtitle && <p className="text-xs text-gray-500 mt-0.5">{group.subtitle}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {uploadItems.map((item) => {
                            const uploaded = isSocialDocumentUploaded(item.keywords);
                            return (
                              <div key={item.id} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 space-y-2">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <p className="text-sm text-gray-700 leading-6">{item.label}</p>
                                    {"note" in item && item.note && <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-flex px-2 py-0.5 text-xs rounded border ${uploaded ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                                      {uploaded ? "已上傳" : "未上傳"}
                                    </span>
                                    <FileUploadButton label="上傳檔案" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">檢附文件</h2>
              <div className="space-y-4">
                {SOCIAL_DOCUMENT_GROUPS.map((group, groupIndex) => {
                  const groupUploaded = group.items.some((item) => isSocialDocumentUploaded(item.keywords));
                  return (
                    <div key={group.id} className="border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div>
                          <h3 className="text-sm text-gray-700">{`${groupIndex + 1}. ${group.label}`}</h3>
                          {"subtitle" in group && group.subtitle && <p className="text-xs text-gray-500 mt-0.5">{group.subtitle}</p>}
                        </div>
                        {groupUploaded && (
                          <span className="inline-flex px-2 py-0.5 text-xs rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
                            已檢附
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {group.items.map((item) => {
                          const uploaded = isSocialDocumentUploaded(item.keywords);
                          return (
                            <div key={item.id} className="flex items-start gap-3 rounded border border-gray-100 px-3 py-2">
                              <span className={`inline-flex items-center justify-center w-5 h-5 mt-0.5 rounded border text-xs ${uploaded ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-transparent border-gray-300"}`}>
                                ✓
                              </span>
                              <div>
                                <p className="text-sm text-gray-700 leading-6">{item.label}</p>
                                {"note" in item && item.note && <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">申請條件</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  {SOCIAL_APPLICATION_CONDITIONS.slice(0, 2).map((item, index) => (
                    <EditableCheckOption
                      key={item.id}
                      label={`${index + 1}. ${item.label}`}
                      checked={!!socialConditionChecks[item.id]}
                      onChange={() => toggleSocialCondition(item.id)}
                    />
                  ))}
                </div>
                <div className="border border-gray-100 rounded-lg p-3 space-y-2">
                  <p className="text-sm text-gray-700">合法建物條件（四擇一）</p>
                  {SOCIAL_APPLICATION_CONDITIONS.slice(2).map((item, index) => (
                    <EditableCheckOption
                      key={item.id}
                      label={`${index + 3}. ${item.label}`}
                      checked={!!socialConditionChecks[item.id]}
                      onChange={() => toggleSocialCondition(item.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

         
          </div>
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">社宅申請資料</h2>
              <div className="space-y-4">
                <FormField label="申請狀態" placeholder={property?.applied || "未申請"} type="select" />
                <FormField label="出租人編號" placeholder={property?.socialHousingApp?.landlordCode || "請輸入出租人編號"} />
                <FormField label="虛擬碼" placeholder={property?.socialHousingApp?.virtualCode || "請輸入虛擬碼"} />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-amber-400 bg-amber-50 text-amber-700 text-sm rounded hover:bg-amber-100">
              <Download size={14} />下載申請書
          </button>
          </div>
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
          {property?.status === "出租中" && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
              此物件目前出租中，如需換租請先辦理停止租賃或不續約。
            </div>
          )}
          {/* {(property?.status === "待出租" || property?.status === "租約到期") && (
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600">
              此物件目前待出租，可重新進行承租人配對。
            </div>
          )} */}
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

      <StepNavBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
        nextLabel={isNew && activeTab === "propertyInfo" ? "建立物件後下一步" : undefined}
      />
    </div>
  );
}
