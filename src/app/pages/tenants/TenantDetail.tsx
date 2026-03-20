import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Download, Save, Trash2, Plus, X } from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { tenants, coResidents, properties, activeRentals } from "../../data/mockData";
import { getLeaseStatus } from "../active-rentals/leaseUtils";
import { FormField, UpgradeSection, ImageUploadBox, StatusBadge, FileAttachmentList, FileUploadButton } from "../../components/WireframeTag";

type TabId = "info" | "socialApp" | "attachments" | "matching";

/* ── 查看物件 Dialog ── */
function PropertyViewDialog({ property, onClose }: {
  property: typeof properties[0];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[480px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-gray-800">物件資料</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-400 text-xs">案名</span><p className="text-gray-800 mt-0.5">{property.name}</p></div>
            <div><span className="text-gray-400 text-xs">租案類型</span><p className="mt-0.5"><StatusBadge status={property.rentalType} /></p></div>
            <div className="col-span-2"><span className="text-gray-400 text-xs">地址</span><p className="text-gray-800 mt-0.5">{property.address}</p></div>
            <div><span className="text-gray-400 text-xs">月租金</span><p className="text-gray-800 mt-0.5">NT$ {property.rent.toLocaleString()}</p></div>
            <div><span className="text-gray-400 text-xs">房型</span><p className="text-gray-800 mt-0.5">{property.type}</p></div>
            <div><span className="text-gray-400 text-xs">出租人</span><p className="text-gray-800 mt-0.5">{property.landlordName}</p></div>
            <div><span className="text-gray-400 text-xs">狀態</span><p className="mt-0.5"><StatusBadge status={property.status} /></p></div>
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
function ConvertToRentalAlert({ property, onClose, onConfirm }: {
  property: typeof properties[0];
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] p-6">
        <h2 className="text-gray-800 mb-2">確認配對轉出租？</h2>
        <p className="text-sm text-gray-500 mb-5">
          將此承租人與物件「{property.name}」配對，並建立出租中物件紀錄。此操作將無法撤銷。
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-100">取消</button>
          <button onClick={onConfirm} className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700">確認轉出租</button>
        </div>
      </div>
    </div>
  );
}

/* ══ TenantDetail ══ */
export function TenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUpgrade } = useVersion();
  const isNew = id === "new";
  const tenant = isNew ? null : tenants.find((t) => t.id === id) ?? tenants[0];

  const [activeTab, setActiveTab] = useState<TabId>("info");
  const [viewingProperty, setViewingProperty] = useState<typeof properties[0] | null>(null);
  const [convertingProperty, setConvertingProperty] = useState<typeof properties[0] | null>(null);
  const [filters, setFilters] = useState({
    minRent: tenant?.preferredRent.min ?? 0,
    maxRent: tenant?.preferredRent.max ?? 50000,
    district: tenant?.preferredDistrict ?? "",
    roomType: tenant?.preferredRoomType ?? "",
  });

  // 承租中案件：此承租人的 activeRentals
  const myActiveRentals = activeRentals.filter((ar) => ar.tenantId === tenant?.id);

  // 配對案件：只排除在進行中（非已結束）租案中的物件
  const activeRentalPropertyIds = new Set(
    activeRentals.filter((ar) => !ar.terminatedAt).map((ar) => ar.propertyId)
  );
  const matchedProperties = properties.filter((p) =>
    p.rent >= filters.minRent &&
    p.rent <= filters.maxRent &&
    (filters.district === "" || p.district === filters.district) &&
    (filters.roomType === "" || p.type === filters.roomType) &&
    !activeRentalPropertyIds.has(p.id)
  );

  const tabs = [
    { id: "info" as TabId, label: "承租人資訊" },
    ...(isUpgrade ? [{ id: "socialApp" as TabId, label: "社宅申請" }] : []),
    { id: "attachments" as TabId, label: "附加檔案" },
    { id: "matching" as TabId, label: "配對案件" },
  ];

  return (
    <div className="p-6">
      {viewingProperty && (
        <PropertyViewDialog property={viewingProperty} onClose={() => setViewingProperty(null)} />
      )}
      {convertingProperty && (
        <ConvertToRentalAlert
          property={convertingProperty}
          onClose={() => setConvertingProperty(null)}
          onConfirm={() => {
            setConvertingProperty(null);
            navigate("/active-rentals/AR001");
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/tenants")}
            className="p-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-gray-800 text-lg">{isNew ? "新增承租人" : tenant?.name}</h1>
            {!isNew && (
              <div className="flex items-center gap-2 mt-0.5">
                {tenant?.rentalStatus && <StatusBadge status={tenant.rentalStatus} />}
                {isUpgrade && <p className="text-xs text-gray-400">編號：{tenant?.id}</p>}
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

      {/* ── Tab: 承租人資訊 ── */}
      {activeTab === "info" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            {/* 基本資訊 */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">基本資訊</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="姓名" placeholder={tenant?.name || "請輸入姓名"} required />
                <FormField label="身分證字號" placeholder={tenant?.idNo || "請輸入身分證字號"} required />
                <FormField label="電話" placeholder={tenant?.phone || "請輸入電話"} />
                <FormField label="Email" placeholder={tenant?.email || "請輸入 Email"} type="email" />
                <div className="col-span-2">
                  <FormField label="戶籍地址" placeholder={tenant?.address || "請輸入戶籍地址"} />
                </div>
                <div className="col-span-2">
                  <FormField label="通訊地址" placeholder="請輸入通訊地址" />
                </div>
                <FormField label="出生日期" type="text" placeholder="YYYY-MM-DD" />
                <FormField label="緊急聯絡人" placeholder="請輸入緊急聯絡人姓名" />
              </div>
            </div>

            {isUpgrade && (
              <UpgradeSection label="共住者資訊">
                <div className="space-y-3">
                  {coResidents.map((r, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3 p-3 bg-white border border-gray-200 rounded">
                      <FormField label="共住者姓名" placeholder={r.name} />
                      <FormField label="關係" placeholder={r.relation} type="select" />
                      <FormField label="身分證字號" placeholder={r.idNo} />
                    </div>
                  ))}
                  <button className="flex items-center gap-2 text-xs text-amber-600 border border-dashed border-amber-300 rounded px-3 py-2 w-full justify-center hover:bg-amber-50">
                    <Plus size={13} />新增共住者
                  </button>
                </div>
              </UpgradeSection>
            )}

            {/* 承租期望條件 */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">承租期望條件</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="期望租金下限" placeholder={tenant ? `${tenant.preferredRent.min.toLocaleString()}` : ""} />
                <FormField label="期望租金上限" placeholder={tenant ? `${tenant.preferredRent.max.toLocaleString()}` : ""} />
                <div className="col-span-2">
                  <FormField label="期望地區" placeholder={tenant?.preferredDistrict || "請輸入期望地區"} />
                </div>
                <FormField label="承租人數" placeholder={tenant ? `${tenant.preferredOccupants}` : "1"} />
                <FormField label="期望房型" placeholder={tenant?.preferredRoomType || "請選擇"} type="select" />
              </div>
            </div>

            {/* 租賃案件紀錄 */}
            {!isNew && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租賃案件紀錄</h2>
                {myActiveRentals.length === 0 ? (
                  <p className="text-sm text-gray-400 py-2 text-center">目前無租賃案件</p>
                ) : (
                  <div className="space-y-2">
                    {myActiveRentals.map((ar) => {
                      const p = properties.find((prop) => prop.id === ar.propertyId);
                      const ls = getLeaseStatus(ar);
                      const badgeStatus = ar.terminatedAt ? "已結束"
                        : ls === "已到期" ? "已到期"
                        : ls === "即將到期" ? "即將到期"
                        : "出租中";
                      return (
                        <div
                          key={ar.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate(`/active-rentals/${ar.id}`)}
                        >
                          <div>
                            <p className="text-sm text-gray-800">{p?.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{ar.startDate} ~ {ar.endDate}</p>
                          </div>
                          <StatusBadge status={badgeStatus} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">備註</h2>
              <FormField label="" placeholder="請輸入備註說明..." type="textarea" />
            </div>

            {isUpgrade && (
              <UpgradeSection label="身份資料">
                <div className="grid grid-cols-1 gap-4">
                  <FormField label="身份類別" placeholder={tenant?.category || "請選擇"} type="select" />
                  <FormField label="申請狀態" placeholder={tenant?.applied ? "通過" : "未通過"} type="select" />
                </div>
              </UpgradeSection>
            )}

            {isUpgrade && (
              <UpgradeSection label="證件上傳">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">身分證正面</p>
                    <ImageUploadBox label="上傳身分證正面" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">身分證反面</p>
                    <ImageUploadBox label="上傳身分證反面" />
                  </div>
                </div>
              </UpgradeSection>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: 社宅申請（升級版）── */}
      {activeTab === "socialApp" && isUpgrade && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">社宅申請資料</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="承租人編號" placeholder={tenant?.socialHousingApp?.tenantCode || "請輸入承租人編號"} />
              <FormField label="虛擬碼" placeholder={tenant?.socialHousingApp?.virtualCode || "請輸入虛擬碼"} />
              <div className="col-span-2">
                <label className="text-xs text-gray-500 block mb-1.5">是否為其他政府補助戶</label>
                <div className="flex gap-6 mt-1">
                  {["否", "是"].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="otherGovSubsidy"
                        className="w-4 h-4"
                        defaultChecked={opt === (tenant?.socialHousingApp?.otherGovSubsidy ? "是" : "否")}
                        readOnly
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <FormField label="同住人數" placeholder={tenant ? `${tenant.socialHousingApp.coResidentCount}` : "0"} />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-amber-400 bg-amber-50 text-amber-700 text-sm rounded hover:bg-amber-100">
            <Download size={14} />下載申請書
          </button>
        </div>
      )}

      {/* ── Tab: 附加檔案 ── */}
      {activeTab === "attachments" && (
        <div className="max-w-2xl space-y-4">
          <FileAttachmentList attachments={tenant?.attachments ?? []} />
          <FileUploadButton label="上傳附加檔案" />
        </div>
      )}

      {/* ── Tab: 配對案件 ── */}
      {activeTab === "matching" && (
        <div className="space-y-4">
          {tenant?.rentalStatus === "承租中" && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
              此承租人目前承租中，如需換租請先辦理停止租賃或不續約。
            </div>
          )}
          {tenant?.rentalStatus === "待租" && (
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600">
              此承租人租約已終止，可重新配對物件。
            </div>
          )}
          <div>
            <h2 className="text-sm text-gray-700">符合條件的委託出租物件</h2>
            <p className="text-xs text-gray-400 mt-0.5">依租金與地區自動配對</p>
          </div>
          {/* 過濾器 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">租金下限</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700"
                  value={filters.minRent}
                  onChange={(e) => setFilters((f) => ({ ...f, minRent: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">租金上限</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700"
                  value={filters.maxRent}
                  onChange={(e) => setFilters((f) => ({ ...f, maxRent: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">地區</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700"
                  value={filters.district}
                  placeholder="不限"
                  onChange={(e) => setFilters((f) => ({ ...f, district: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">房型</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700"
                  value={filters.roomType}
                  placeholder="不限"
                  onChange={(e) => setFilters((f) => ({ ...f, roomType: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">案名</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">地址</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">月租金</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">房型</th>
                  <th className="px-4 py-3 text-right text-xs text-gray-500 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {matchedProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{p.address}</td>
                    <td className="px-4 py-3 text-gray-700">NT$ {p.rent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{p.type}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewingProperty(p)}
                          className="text-xs text-gray-500 px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"
                        >
                          查看物件
                        </button>
                        <button
                          onClick={() => setConvertingProperty(p)}
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
            {matchedProperties.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">暫無符合條件的委託出租物件</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
