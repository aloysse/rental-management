import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Save, Download, Plus, X, Zap, ChevronRight,
  AlertTriangle, AlertCircle, ClipboardList,
} from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { activeRentals, properties, landlords, tenants } from "../../data/mockData";
import {
  FormField, StatusBadge,
  RadioGroup, FileAttachmentList, FileUploadButton,
} from "../../components/WireframeTag";
import { StepNavBar } from "../../components/StepNavBar";
import { StepTabBar } from "../../components/StepTabBar";
import { ContractTypeModal } from "../../components/ContractTypeModal";
import { RentalContractEditDialog } from "../../components/ContractEditDialog";
import {
  PropertyRentalTypeCard,
  PropertyBasicInfoCard,
  PropertyAgentCard,
  LandlordInfoCard,
  PropertyConditionSection,
} from "../../components/PropertySharedSections";
import { getLeaseStatus, getDaysUntilExpiry } from "./leaseUtils";
import { StopRentalModal } from "./StopRentalModal";
import { LeaseTerminationModal } from "./LeaseTerminationModal";
import { LeaseRenewalModal } from "./LeaseRenewalModal";

type TabId =
  | "propertyInfo" | "landlordInfo" | "condition" | "tenantInfo"
  | "socialMatch" | "contracts" | "payments" | "leaseManagement" | "attachments" | "realPrice";

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

  // 只排除「生效中」的契約類型，已終止/已續約的同類型可重選（支援續約歷史）
  const existingContractTypeIds = (rental?.contracts ?? [])
    .filter((c) => c.status === "生效中")
    .map((c) => c.typeId);

  const leaseStatus = rental ? getLeaseStatus(rental) : "進行中";
  const daysLeft = rental ? getDaysUntilExpiry(rental.endDate) : 0;
  const [showStopModal, setShowStopModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  const tabs = [
    { id: "propertyInfo" as TabId, label: "物件資訊" },
    { id: "landlordInfo" as TabId, label: "出租人資訊" },
    { id: "condition" as TabId, label: "屋況" },
    { id: "tenantInfo" as TabId, label: "承租人資訊" },
    ...(isUpgrade ? [{ id: "socialMatch" as TabId, label: "社宅媒合申請" }] : []),
    { id: "contracts" as TabId, label: "契約文件" },
    { id: "payments" as TabId, label: "繳費紀錄" },
    { id: "leaseManagement" as TabId, label: "租約管理" },
    { id: "attachments" as TabId, label: "附加檔案" },
    { id: "realPrice" as TabId, label: "實價登錄登記" },
  ];

  return (
    <div className="p-6">
      {showContractModal && (
        <ContractTypeModal
          mode="rental"
          onClose={() => setShowContractModal(false)}
          existingTypeIds={existingContractTypeIds}
          onSelect={(typeId, label) => {
            setShowContractModal(false);
            setEditingContract({ typeId, label });
          }}
        />
      )}
      {editingContract && (
        <RentalContractEditDialog
          contractType={editingContract.label}
          onClose={() => setEditingContract(null)}
        />
      )}
      {showStopModal && rental && (
        <StopRentalModal
          propertyName={property?.name ?? ""}
          tenantName={tenant?.name ?? ""}
          landlordName={landlord?.name ?? ""}
          startDate={rental.startDate}
          endDate={rental.endDate}
          onClose={() => setShowStopModal(false)}
          onConfirm={(_date, _reason) => setShowStopModal(false)}
        />
      )}
      {showTerminateModal && rental && (
        <LeaseTerminationModal
          propertyName={property?.name ?? ""}
          tenantName={tenant?.name ?? ""}
          landlordName={landlord?.name ?? ""}
          endDate={rental.endDate}
          onClose={() => setShowTerminateModal(false)}
          onConfirm={(_reason) => setShowTerminateModal(false)}
        />
      )}
      {showRenewalModal && rental && (
        <LeaseRenewalModal
          propertyName={property?.name ?? ""}
          tenantName={tenant?.name ?? ""}
          landlordName={landlord?.name ?? ""}
          currentStartDate={rental.startDate}
          currentEndDate={rental.endDate}
          currentRent={property?.rent ?? 0}
          currentDepositMonths={rental.depositMonths}
          onClose={() => setShowRenewalModal(false)}
          onConfirm={(_newEndDate, _newRent) => setShowRenewalModal(false)}
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
                <StatusBadge status={leaseStatus === "已結束" ? "已結束" : leaseStatus === "已到期" ? "租約到期" : "出租中"} />
                <StatusBadge status={rental?.rentalType ?? "一般租案"} />
                {(leaseStatus === "即將到期" || leaseStatus === "已到期") && (
                  <StatusBadge status={leaseStatus} />
                )}
              </div>
            )}
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">
          <Save size={14} />儲存
        </button>
      </div>

      {/* Tab Bar */}
      <StepTabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
      />

      {/* ── Alert Banner ── */}
      {!isNew && leaseStatus === "即將到期" && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-5">
          <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0" />
          <p className="text-sm text-yellow-700 flex-1">
            租約將於 {rental?.endDate} 到期，距今剩 <strong>{daysLeft}</strong> 天
          </p>
          <button
            onClick={() => setActiveTab("leaseManagement")}
            className="flex items-center gap-1 text-xs text-yellow-700 border border-yellow-400 rounded px-2.5 py-1 hover:bg-yellow-100"
          >
            立即處理 <ChevronRight size={11} />
          </button>
        </div>
      )}
      {!isNew && leaseStatus === "已到期" && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-5">
          <AlertCircle size={16} className="text-orange-500 flex-shrink-0" />
          <p className="text-sm text-orange-700 flex-1">
            租約已於 {rental?.endDate} 到期，尚未處理
          </p>
          <button
            onClick={() => setActiveTab("leaseManagement")}
            className="flex items-center gap-1 text-xs text-orange-700 border border-orange-400 rounded px-2.5 py-1 hover:bg-orange-100"
          >
            立即處理 <ChevronRight size={11} />
          </button>
        </div>
      )}

      {/* ── Tab: 物件資訊 ── */}
      {activeTab === "propertyInfo" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            <PropertyRentalTypeCard
              rentalType={rental?.rentalType}
              isUpgrade={isUpgrade}
              defaultGeneralChecked={!rental}
            />
            <PropertyBasicInfoCard property={property} />
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租賃內容</h2>
              <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-5">
                <p className="text-sm text-yellow-700">
                  此處資訊在新增契約時會自動帶入，請確認內容正確無誤。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="租賃起始日" placeholder={rental?.startDate} />
                <FormField label="租賃終止日" placeholder={rental?.endDate} />
                <FormField label="月租金（元）" placeholder={property?.rent ? `${property.rent.toLocaleString()}` : ""} />
                <FormField label="押金（月）" placeholder={rental?.depositMonths ? `${rental.depositMonths}` : ""} />
              </div>
            </div>
            <PropertyAgentCard agentName={rental?.agentName} />
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
          <div className="flex items-center gap-2 mb-3">
            <StatusBadge status={landlord?.type ?? "自然人"} />
            <span className="text-sm text-gray-700">{landlord?.name ?? "未指定出租人"}</span>
          </div>
          <LandlordInfoCard landlord={landlord} />
        </div>
      )}

      {/* ── Tab: 屋況 ── */}
      {activeTab === "condition" && (
        <PropertyConditionSection property={property} />
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

      {/* ── Tab: 租約管理 ── */}
      {activeTab === "leaseManagement" && (
        <div className="max-w-3xl space-y-5">
          {/* 租賃狀態總覽 */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租賃狀態</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">租賃起始</p>
                <p className="text-gray-700 mt-0.5">{rental?.startDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">租賃終止</p>
                <p className="text-gray-700 mt-0.5">{rental?.terminatedAt ?? rental?.endDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">狀態</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <StatusBadge status={leaseStatus} />
                  {leaseStatus === "即將到期" && (
                    <span className="text-xs text-yellow-600">（剩 {daysLeft} 天）</span>
                  )}
                  {leaseStatus === "已到期" && (
                    <span className="text-xs text-orange-600">（已過 {Math.abs(daysLeft)} 天）</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 操作區 */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">操作</h2>
            {leaseStatus === "進行中" && (
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 border border-red-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">停止租賃</p>
                    <p className="text-xs text-gray-400 mt-0.5">適用於租約期間中提前終止，需填寫終止日期與原因</p>
                  </div>
                  <button
                    onClick={() => setShowStopModal(true)}
                    className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 whitespace-nowrap"
                  >
                    停止租賃
                  </button>
                </div>
              </div>
            )}
            {(leaseStatus === "即將到期" || leaseStatus === "已到期") && (
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">續約</p>
                    <p className="text-xs text-gray-400 mt-0.5">重新簽訂租約，更新租賃期間與租金條件</p>
                  </div>
                  <button
                    onClick={() => setShowRenewalModal(true)}
                    className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 whitespace-nowrap"
                  >
                    續約
                  </button>
                </div>
                <div className="flex items-start gap-4 p-4 border border-red-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">不續約</p>
                    <p className="text-xs text-gray-400 mt-0.5">確認終止租約，物件將重新開放承租人配對</p>
                  </div>
                  <button
                    onClick={() => setShowTerminateModal(true)}
                    className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 whitespace-nowrap"
                  >
                    不續約
                  </button>
                </div>
              </div>
            )}
            {leaseStatus === "已結束" && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400">
                <ClipboardList size={16} />
                此案件已結束 — 唯讀模式
              </div>
            )}
          </div>

          {/* 租約歷史紀錄 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm text-gray-700">租約歷史紀錄</h2>
            </div>
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
                      <button className="flex items-center gap-1 text-xs text-gray-500 px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 ml-auto">
                        <Download size={11} />查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(rental?.contracts ?? []).length === 0 && (
              <div className="py-10 text-center text-gray-400 text-sm">尚無契約記錄</div>
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

      {!isNew && (
        <StepNavBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as TabId)}
        />
      )}
    </div>
  );
}
