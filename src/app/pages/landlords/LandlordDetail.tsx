import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Trash2, ExternalLink } from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { landlords, properties } from "../../data/mockData";
import { FormField, UpgradeSection, ImageUploadBox, StatusBadge } from "../../components/WireframeTag";

export function LandlordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUpgrade } = useVersion();
  const isNew = id === "new";
  const landlord = isNew ? null : landlords.find((l) => l.id === id) ?? landlords[0];
  const ownedProperties = landlord
    ? properties.filter((p) => landlord.properties.includes(p.id))
    : [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/landlords")}
            className="p-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-gray-800 text-lg">{isNew ? "新增出租人" : landlord?.name}</h1>
            {!isNew && landlord && (
              <p className="text-xs text-gray-400 mt-0.5">
                <StatusBadge status={landlord.type} />
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
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
        {/* Left */}
        <div className="col-span-2 space-y-5">
          {/* Basic */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">基本資料</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="姓名／名稱" placeholder={landlord?.name || "請輸入姓名"} required />
              <FormField label="身份類型" placeholder={landlord?.type || "請選擇"} type="select" required />
              <FormField label="性別" placeholder={landlord?.gender || "請選擇"} type="select" required />
              <FormField label="出生年月日" placeholder={landlord?.birthday || "請輸入出生年月日"} type="date" required />
              <FormField label="統一編號／身分證" placeholder="請輸入統編或身分證字號" required />
              <FormField label="手機" placeholder={landlord?.phone || "請輸入手機"} />
              <FormField label="電話 (日)" placeholder={landlord?.phone || "請輸入電話"} />
              <FormField label="電話 (夜)" placeholder={landlord?.phone || "請輸入電話"} />
              <div className="col-span-2">
                <FormField label="Email" placeholder={landlord?.email || "請輸入 Email"} type="email" />
              </div>
              <div className="col-span-2">
                <FormField label="戶籍地址" placeholder="請輸入戶籍地址" />
              </div>
              <div className="col-span-2">
                <FormField label="聯絡地址" placeholder="請輸入聯絡地址" />
              </div>
            </div>
          </div>

          {/* Bank Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">銀行帳戶資料</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="銀行名稱" placeholder={landlord?.bank || "請選擇銀行"} type="select" />
              <FormField label="分行" placeholder="請輸入分行名稱" />
              <div className="col-span-2">
                <FormField label="帳號" placeholder={landlord?.account || "請輸入帳號"} />
              </div>
              <FormField label="戶名" placeholder="請輸入戶名" />
            </div>
          </div>

          {/* Properties */}
          {!isNew && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h2 className="text-sm text-gray-700">名下物件</h2>
                <span className="text-xs text-gray-400">{ownedProperties.length} 件</span>
              </div>
              <div className="space-y-2">
                {ownedProperties.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/properties/${p.id}`)}
                  >
                    <div>
                      <p className="text-sm text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.status} />
                      <ExternalLink size={12} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">備註</h2>
            <FormField label="" placeholder="請輸入備註說明..." type="textarea" />
          </div>

          {isUpgrade && (
            <UpgradeSection label="證件上傳">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-2">身分證 / 公司登記證明正面</p>
                  <ImageUploadBox label="上傳身分證正面" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">身分證 / 公司登記證明反面</p>
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
