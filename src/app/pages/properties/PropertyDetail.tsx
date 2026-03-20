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

const RENT_INCLUDE_OPTIONS = ["管理費", "清潔費", "第四台", "網路", "水費", "電費", "瓦斯費"];
const LIVING_FEATURE_OPTIONS = ["近便利商店", "近傳統市場", "近百貨公司", "近公園綠地", "近學校", "近醫療機構", "近夜市"];
const TRANSPORT_OPTIONS = ["公車站", "捷運站", "火車站"];
const TENANT_REQUIREMENT_OPTIONS = ["學生", "上班族", "家庭"];

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

function MultiSelectPreview({ label, options, selected, required }: {
  label: string;
  options: string[];
  selected?: string[];
  required?: boolean;
}) {
  return (
    <div className="col-span-2">
      <label className="text-xs text-gray-500 block mb-2">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <label key={item} className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 bg-white">
            <input type="checkbox" className="w-3 h-3" defaultChecked={selected?.includes(item)} readOnly />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckOption({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
      <input type="checkbox" className="w-4 h-4" defaultChecked={!!checked} readOnly />
      {label}
    </label>
  );
}

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

function PhotoUploadCard({ title, count = 0 }: { title: string; count?: number }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70 flex flex-col gap-3">
      <p className="text-sm text-gray-700 leading-6">{title}</p>
      <button className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 bg-white text-gray-600 rounded hover:bg-gray-100 w-fit">
        <Plus size={14} />
        新增照片
      </button>
      <p className="text-xs text-gray-400">已上傳 {count} 張</p>
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
  const propertyInfo = property?.propertyInfo;
  const rentalAddress = propertyInfo?.rentalAddress;
  const layout = propertyInfo?.layout;
  const conditionForm = property?.conditionForm;
  const conditionAppliances = conditionForm?.conditionStatus?.accessoryItems?.appliances ?? [];
  const conditionFurniture = conditionForm?.conditionStatus?.accessoryItems?.furniture ?? [];
  const requiredPhotoItems = conditionForm?.photoAttachments?.required ?? [];
  const optionalPhotoItems = conditionForm?.photoAttachments?.optional ?? [];
  const socialUploadedFileNames = (property?.attachments ?? []).map((file) => file.name);
  const isSocialDocumentUploaded = (keywords: readonly string[]) =>
    socialUploadedFileNames.some((fileName) =>
      keywords.some((keyword) => fileName.includes(keyword))
    );

  const [socialConditionChecks, setSocialConditionChecks] = useState<Record<string, boolean>>(
    () =>
      SOCIAL_APPLICATION_CONDITIONS.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = item.id === "ownerQualified" || item.id === "withinCity" ? !!property?.applied : false;
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
                <div className="col-span-2">
                  <FormField label="案名" placeholder={property?.name || "請輸入案名"} required />
                </div>
                <div className="col-span-2">
                  <div className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                    <p className="text-xs text-gray-500 mb-3">
                      出租地址
                      <span className="text-red-400 ml-0.5">*</span>
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      <FormField label="縣市" placeholder={rentalAddress?.city || "請選擇縣市"} type="select" required />
                      <FormField label="鄉鎮區" placeholder={rentalAddress?.district || "請選擇鄉鎮區"} type="select" required />
                      <FormField label="街道" placeholder={rentalAddress?.street || "請輸入街道"} />
                      <FormField label="巷" placeholder={rentalAddress?.lane || "請輸入巷"} />
                      <FormField label="弄" placeholder={rentalAddress?.alley || "請輸入弄"} />
                      <FormField label="號" placeholder={rentalAddress?.number || "請輸入號"} />
                      <FormField label="之幾" placeholder={rentalAddress?.subNumber || "請輸入之幾"} />
                      <FormField label="隱藏門牌" placeholder={rentalAddress?.hideDoorplate ? "是" : "否"} type="select" />
                    </div>
                    <div className="mt-3">
                      <FormField label="完整地址" placeholder={property?.address || "請輸入完整地址"} />
                    </div>
                  </div>
                </div>
                <FormField label="社區名稱" placeholder={propertyInfo?.communityName || "請輸入社區名稱"} />
                <FormField label="朝向" placeholder={propertyInfo?.orientation || "請選擇"} type="select" />
                <FormField label="出租樓層類型" placeholder={propertyInfo?.rentalFloorType || "請選擇"} type="select" required />
                <FormField label="出租樓層" placeholder={propertyInfo?.rentalFloor || (property?.floor ? `${property.floor}樓` : "請輸入樓層")} required />
                <FormField label="樓層之幾" placeholder={propertyInfo?.rentalSubFloor || "請輸入（選填）"} />
                <FormField label="出租總樓層" placeholder={propertyInfo?.totalFloors ? `共 ${propertyInfo.totalFloors} 層` : "請輸入總樓層"} required />
                <div className="col-span-2 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                  <p className="text-xs text-gray-500 mb-3">
                    格局（現況）
                    <span className="text-red-400 ml-0.5">*</span>
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    <FormField label="房" placeholder={layout?.rooms?.toString() || "0"} required />
                    <FormField label="廳" placeholder={layout?.livingRooms?.toString() || "0"} />
                    <FormField label="衛" placeholder={layout?.bathrooms?.toString() || "0"} />
                    <FormField label="陽台" placeholder={layout?.balconies?.toString() || "0"} />
                    <div className="flex items-end pb-2">
                      <label className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                        <input type="checkbox" className="w-3 h-3" defaultChecked={!!layout?.isStudio} readOnly />
                        開放式格局
                      </label>
                    </div>
                  </div>
                </div>
                <FormField label="坪數（建坪）" placeholder={property?.size ? `${property.size}` : ""} />
                <FormField label="可使用坪數（坪）" placeholder={propertyInfo?.usableArea ? `${propertyInfo.usableArea}` : "請輸入可使用坪數"} required />
                <FormField label="建築完工日期" placeholder={propertyInfo?.completionDate || "YYYY-MM-DD"} type="text" />
                <FormField label="月租金（元/月）" placeholder={property?.rent ? `${property.rent.toLocaleString()}` : ""} required />
                <FormField label="押金" placeholder={propertyInfo?.deposit || "請選擇"} type="select" required />
                <FormField label="管理費（元/月）" placeholder={propertyInfo?.managementFee ? `${propertyInfo.managementFee}` : "無"} />
                <FormField label="最短租期" placeholder={propertyInfo?.minLeaseTerm || "請選擇"} type="select" required />
                <FormField label="可遷入日" placeholder={propertyInfo?.availableMoveInDate || "請選擇日期"} type="text" />
                <FormField label="裝潢時間" placeholder={propertyInfo?.decorationTime || "請選擇"} type="select" />
                <FormField label="裝潢程度" placeholder={propertyInfo?.decorationLevel || "請選擇"} type="select" />
                <FormField label="產權登記" placeholder={propertyInfo?.ownershipRegistration || "請選擇"} type="select" />
                <FormField label="開伙" placeholder={propertyInfo?.cookingAllowed || "請選擇"} type="select" />
                <FormField label="養寵物" placeholder={propertyInfo?.petAllowed || "請選擇"} type="select" />
                <MultiSelectPreview
                  label="租金包含"
                  options={RENT_INCLUDE_OPTIONS}
                  selected={propertyInfo?.rentIncludes}
                />
                <MultiSelectPreview
                  label="生活機能"
                  options={LIVING_FEATURE_OPTIONS}
                  selected={propertyInfo?.livingFeatures}
                />
                <MultiSelectPreview
                  label="附近交通"
                  options={TRANSPORT_OPTIONS}
                  selected={propertyInfo?.nearbyTransport}
                />
                <MultiSelectPreview
                  label="身分要求"
                  options={TENANT_REQUIREMENT_OPTIONS}
                  selected={propertyInfo?.tenantRequirements}
                />
              </div>
            </div>

            {/* 歷史租賃紀錄（待出租且有歷史租案時顯示） */}
            {historyRentals.length > 0 && (
              <HistoryRentalSection historyRentals={historyRentals} onNavigate={navigate} />
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">狀態設定</h2>
              <div className="space-y-3">
                {isUpgrade && (
                  <FormField label="社宅申請狀態" placeholder={property?.applied ? "通過" : "未通過"} type="select" />
                )}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">備註</h2>
              <FormField label="" placeholder="請輸入備註說明..." type="textarea" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">負責營業員</h2>
              <FormField label="營業員" placeholder={property?.agentName || "請選擇負責營業員"} type="select" />
            </div>
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
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">現勘基本資料</h2>
            <div className="grid grid-cols-4 gap-4">
              <FormField label="現勘日期" placeholder={conditionForm?.surveyDate || "民國___年___月___日"} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">一、租賃標的基本需求（請勾選）〔請檢附附件照片〕</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">（一）出入口、走廊、通路或樓梯間無堆放雜物，妨礙逃生避難。</p>
                <CheckOption label="符合" checked={conditionForm?.basicRequirements?.escapeRouteClear} />
              </div>

              <div className="p-4 border border-gray-100 rounded-lg space-y-3">
                <p className="text-sm text-gray-700">（二）海砂屋檢測</p>
                <div className="flex flex-wrap gap-6">
                  <CheckOption label="是，為海砂屋" checked={conditionForm?.basicRequirements?.seaSand?.isSeaSand} />
                  <CheckOption label="有做過混凝土中水溶性氯離子含量檢測" checked={conditionForm?.basicRequirements?.seaSand?.tested} />
                  <CheckOption label="合格" checked={conditionForm?.basicRequirements?.seaSand?.qualified} />
                  <CheckOption label="不合格" checked={conditionForm?.basicRequirements?.seaSand && !conditionForm.basicRequirements.seaSand.qualified} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="檢測結果" placeholder={conditionForm?.basicRequirements?.seaSand?.testResult || "請輸入"} />
                  <FormField label="不合格處理方式" placeholder={conditionForm?.basicRequirements?.seaSand?.handling || "由出租人/包租業修繕後交屋、以現況交屋或其他"} />
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg space-y-3">
                <p className="text-sm text-gray-700">（三）輻射屋檢測</p>
                <div className="flex flex-wrap gap-6">
                  <CheckOption label="是，為輻射屋" checked={conditionForm?.basicRequirements?.radiation?.isRadiation} />
                  <CheckOption label="有經過輻射屋檢測" checked={conditionForm?.basicRequirements?.radiation?.tested} />
                  <CheckOption label="合格" checked={conditionForm?.basicRequirements?.radiation?.qualified} />
                  <CheckOption label="不合格" checked={conditionForm?.basicRequirements?.radiation && !conditionForm.basicRequirements.radiation.qualified} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="檢測結果" placeholder={conditionForm?.basicRequirements?.radiation?.testResult || "請輸入"} />
                  <FormField label="不合格處理方式" placeholder={conditionForm?.basicRequirements?.radiation?.handling || "由出租人/包租業修繕後交屋、以現況交屋或其他"} />
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg space-y-3">
                <p className="text-sm text-gray-700">（四）消防設備（可複選，任一即可）</p>
                <div className="flex flex-wrap gap-6">
                  <CheckOption label="滅火器（必要，且在有效期限內）" checked={conditionForm?.basicRequirements?.fireDevices?.extinguisher} />
                  <CheckOption label="火警警報器" checked={conditionForm?.basicRequirements?.fireDevices?.fireAlarm} />
                  <CheckOption label="獨立型偵煙器" checked={conditionForm?.basicRequirements?.fireDevices?.smokeDetector} />
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg space-y-3">
                <p className="text-sm text-gray-700">（五）具備馬桶、洗臉盆及浴缸（或淋浴）等 3 項衛浴設備</p>
                <CheckOption label="具備" checked={conditionForm?.basicRequirements?.hasBathroomFacilities} />
              </div>

              <div className="p-4 border border-gray-100 rounded-lg space-y-3">
                <p className="text-sm text-gray-700">（六）熱水器</p>
                <div className="flex flex-wrap gap-6">
                  <CheckOption label="有熱水器" checked={conditionForm?.basicRequirements?.waterHeater?.hasWaterHeater} />
                  <CheckOption label="電熱水器" checked={conditionForm?.basicRequirements?.waterHeater?.type === "電熱水器"} />
                  <CheckOption label="瓦斯熱水器" checked={conditionForm?.basicRequirements?.waterHeater?.type === "瓦斯熱水器"} />
                  <CheckOption label="置於室外" checked={conditionForm?.basicRequirements?.waterHeater?.location === "室外"} />
                  <CheckOption label="置於室內" checked={conditionForm?.basicRequirements?.waterHeater?.location === "室內"} />
                  <CheckOption label="室內已加裝排氣管" checked={conditionForm?.basicRequirements?.waterHeater?.hasExhaustPipe} />
                  <CheckOption label="符合燃氣熱水器及其配管安裝標準" checked={conditionForm?.basicRequirements?.waterHeater?.compliant} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">二、租賃管理相關事務</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">（一）管理委員會統一管理</p>
                <div className="flex flex-wrap gap-6 mb-3">
                  <CheckOption label="有管理委員會" checked={conditionForm?.management?.hasCommittee} />
                  <CheckOption label="有管理費" checked={conditionForm?.management?.hasManagementFee} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="管理費（元/坪）" placeholder={conditionForm?.management?.managementFeePerPing ? `${conditionForm.management.managementFeePerPing}` : "無"} />
                  <FormField label="管理費（元/月）" placeholder={conditionForm?.management?.managementFeeMonthly ? `${conditionForm.management.managementFeeMonthly}` : "無"} />
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg flex flex-wrap gap-6">
                <CheckOption label="（二）有公寓大廈規約及其他住戶應遵循事項" checked={conditionForm?.management?.hasCommunityRules} />
                <CheckOption label="（三）有定期辦理消防安全檢查" checked={conditionForm?.management?.hasRegularFireInspection} />
              </div>

              <div className="p-4 border border-gray-100 rounded-lg space-y-4">
                <p className="text-sm text-gray-700">（四）停車管理</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-100 rounded-lg p-3 space-y-3">
                    <p className="text-sm text-gray-700">1. 汽車停車位</p>
                    <div className="flex flex-wrap gap-4">
                      <CheckOption label="有汽車停車位" checked={conditionForm?.management?.parking?.car?.hasParking} />
                      <CheckOption label="有獨立權狀" checked={conditionForm?.management?.parking?.car?.hasIndependentTitle} />
                      <CheckOption label="有檢附分管協議及圖說" checked={conditionForm?.management?.parking?.car?.hasAgreementDoc} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="車位樣式" placeholder={conditionForm?.management?.parking?.car?.style || "坡道平面、升降平面、坡道機械、升降機械、塔式車位等"} />
                      <FormField label="地上/地下" placeholder={conditionForm?.management?.parking?.car?.levelType || "請輸入"} />
                      <FormField label="車位樓層" placeholder={conditionForm?.management?.parking?.car?.level ? `${conditionForm.management.parking.car.level}` : "請輸入"} />
                      <FormField label="單位編號" placeholder={conditionForm?.management?.parking?.car?.unitNo || "請輸入"} />
                      <FormField label="停車管理費（元/月）" placeholder={conditionForm?.management?.parking?.car?.monthlyFee ? `${conditionForm.management.parking.car.monthlyFee}` : "請輸入"} />
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-lg p-3 space-y-3">
                    <p className="text-sm text-gray-700">2. 機車停車位</p>
                    <div className="flex flex-wrap gap-4">
                      <CheckOption label="有機車停車位" checked={conditionForm?.management?.parking?.scooter?.hasParking} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="地上/地下" placeholder={conditionForm?.management?.parking?.scooter?.levelType || "請輸入"} />
                      <FormField label="車位樓層" placeholder={conditionForm?.management?.parking?.scooter?.level ? `${conditionForm.management.parking.scooter.level}` : "請輸入"} />
                      <FormField label="車位編號" placeholder={conditionForm?.management?.parking?.scooter?.unitNo || "請輸入"} />
                      <FormField label="停車管理費（元/月）" placeholder={conditionForm?.management?.parking?.scooter?.monthlyFee ? `${conditionForm.management.parking.scooter.monthlyFee}` : "請輸入"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">三、租賃標的屋況</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-lg space-y-3">
                <div className="flex flex-wrap gap-6">
                  <CheckOption label="（一）無漏水" checked={conditionForm?.conditionStatus?.noWaterLeak} />
                  <CheckOption label="（二）有漏水情形" checked={conditionForm?.conditionStatus?.hasWaterLeak} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="滲漏水處" placeholder={conditionForm?.conditionStatus?.leakLocation || "請輸入滲漏水處"} />
                  <FormField label="漏水處理方式" placeholder={conditionForm?.conditionStatus?.leakHandling || "由出租人/包租業修繕後交屋、以現況交屋或其他"} />
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">（三）建物型態</p>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="一般建物" placeholder={conditionForm?.conditionStatus?.buildingType?.generalBuilding || "透天厝或其他"} />
                  <FormField label="區分所有建物" placeholder={conditionForm?.conditionStatus?.buildingType?.dividedOwnership || "公寓、華廈、住宅大樓或其他"} />
                  <FormField label="其他特殊建物" placeholder={conditionForm?.conditionStatus?.buildingType?.specialBuilding || "農舍或其他"} />
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">（四）建物出租型態及現況居格數</p>
                <div className="grid grid-cols-4 gap-4">
                  <FormField label="出租型態" placeholder={conditionForm?.conditionStatus?.rentalPattern?.mode || "獨立套房 / 整棟（戶）出租"} />
                  <FormField label="房" placeholder={conditionForm?.conditionStatus?.rentalPattern?.rooms?.toString() || "0"} />
                  <FormField label="廳" placeholder={conditionForm?.conditionStatus?.rentalPattern?.livingRooms?.toString() || "0"} />
                  <FormField label="衛" placeholder={conditionForm?.conditionStatus?.rentalPattern?.bathrooms?.toString() || "0"} />
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">（五）供水及排水</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="供水排水狀況" placeholder={conditionForm?.conditionStatus?.waterDrainage?.status || "正常 / 不正常"} />
                  <FormField label="若不正常負責修繕" placeholder={conditionForm?.conditionStatus?.waterDrainage?.repairBy || "出租人 / 承租人"} />
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">（六）是否曾發生非自然死亡情事</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="產權持有期間" placeholder={conditionForm?.conditionStatus?.nonNaturalDeath?.duringOwnership || "有 / 無"} />
                  <FormField label="產權持有前" placeholder={conditionForm?.conditionStatus?.nonNaturalDeath?.beforeOwnership || "確認無上述情事 / 知道曾發生 / 不知"} />
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg space-y-4">
                <p className="text-sm text-gray-700">（七）附屬設備項目（無則免填）</p>
                <div className="flex flex-wrap gap-6">
                  <CheckOption label="天然瓦斯" checked={conditionForm?.conditionStatus?.accessoryItems?.facility?.naturalGas} />
                  <CheckOption label="第四台" checked={conditionForm?.conditionStatus?.accessoryItems?.facility?.cableTV} />
                  <CheckOption label="無線網路" checked={conditionForm?.conditionStatus?.accessoryItems?.facility?.internet} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-100 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">家電（數量、廠牌/型號）</p>
                    <div className="space-y-2">
                      {conditionAppliances.map((item: { name: string; quantity: number; model?: string }) => (
                        <div key={item.name} className="grid grid-cols-2 gap-2">
                          <FormField label={item.name} placeholder={item.quantity ? `${item.quantity} 臺` : "0"} />
                          <FormField label="廠牌/型號" placeholder={item.model || "請輸入"} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">家具（數量）</p>
                    <div className="grid grid-cols-2 gap-2">
                      {conditionFurniture.map((item: { name: string; quantity: number }) => (
                        <FormField key={item.name} label={item.name} placeholder={item.quantity ? `${item.quantity} 件` : "0"} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">四、附件</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-sm text-gray-700 mb-3">（一）必要項目</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {requiredPhotoItems.map((item: { label: string; count: number }) => (
                    <PhotoUploadCard key={item.label} title={item.label} count={item.count} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-700 mb-3">（二）非必要項目：檢附其他可能影響出租之現況照片</h3>
                <div className="grid grid-cols-2 gap-3">
                  {optionalPhotoItems.map((item: { label: string; count: number }) => (
                    <PhotoUploadCard key={item.label} title={item.label} count={item.count} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">備註</h2>
            <FormField label="" placeholder={conditionForm?.note || "請輸入屋況備註..."} type="textarea" />
          </div>
        </div>
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
                <FormField label="申請狀態" placeholder={property?.applied ? "已申請" : "未申請"} type="select" />
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
