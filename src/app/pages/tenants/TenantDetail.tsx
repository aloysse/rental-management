import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Download, Save, Trash2, Plus } from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { tenants, coResidents } from "../../data/mockData";
import { FormField, UpgradeSection, ImageUploadBox } from "../../components/WireframeTag";

export function TenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUpgrade } = useVersion();
  const isNew = id === "new";
  const tenant = isNew ? null : tenants.find((t) => t.id === id) ?? tenants[0];

  return (
    <div className="p-6">
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
            {!isNew && isUpgrade && (
              <p className="text-xs text-gray-400 mt-0.5">編號：{tenant?.id}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {isUpgrade && !isNew && (
            <button className="flex items-center gap-2 px-4 py-2 border border-amber-400 bg-amber-50 text-amber-700 text-sm rounded hover:bg-amber-100 transition-colors">
              <Download size={14} />
              社宅承租人申請書
            </button>
          )}
          {!isNew && (
            <button className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-500 text-sm rounded hover:bg-red-50">
              <Trash2 size={14} />
              刪除
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">
            <Save size={14} />
            {isNew ? "建立" : "儲存"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left column */}
        <div className="col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">基本資料</h2>
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

          {/* Upgrade: Co-residents */}
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
                  <Plus size={13} />
                  新增共住者
                </button>
              </div>
            </UpgradeSection>
          )}

          {/* Upgrade: Identity */}
          {isUpgrade && (
            <UpgradeSection label="身份資料">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="身份類別"
                  placeholder={tenant?.category || "請選擇"}
                  type="select"
                />
                <FormField
                  label="申請狀態"
                  placeholder={tenant?.applied ? "通過" : "未通過"}
                  type="select"
                />
              </div>
            </UpgradeSection>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">備註</h2>
            <FormField label="" placeholder="請輸入備註說明..." type="textarea" />
          </div>

          {/* Upgrade: Documents */}
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
                <div>
                  <p className="text-xs text-gray-500 mb-2">存摺封面</p>
                  <ImageUploadBox label="上傳存摺封面" />
                </div>
              </div>
            </UpgradeSection>
          )}
        </div>
      </div>
    </div>
  );
}
