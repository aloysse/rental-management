import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Trash2, Download, Plus } from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { properties, landlords } from "../../data/mockData";
import { FormField, UpgradeSection, ImageUploadBox, StatusBadge } from "../../components/WireframeTag";

type TabId = "basic" | "landlord" | "inspection";

function FileUploadButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
      <Plus size={14} />
      上傳照片
    </button>
  );
}

function SectionDivider() {
  return <div className="border-t border-dashed border-gray-200 my-5" />;
}

function RadioGroup({ name, options, defaultValue }: { name: string; options: string[]; defaultValue?: string }) {
  return (
    <div className="flex gap-6 mt-1.5">
      {options.map((opt) => (
        <label key={opt} className="inline-flex items-center gap-1.5 text-sm text-gray-700">
          <input type="radio" name={name} className="w-4 h-4" defaultChecked={opt === defaultValue} readOnly />
          {opt}
        </label>
      ))}
    </div>
  );
}

function CheckItem({ label, note, color }: { label: string; note?: string; color?: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
      <input type="checkbox" className="w-4 h-4" readOnly />
      <span>{label}</span>
      {note && <span className={`text-xs ${color === "red" ? "text-red-500" : "text-gray-400"}`}>{note}</span>}
    </label>
  );
}

export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUpgrade } = useVersion();
  const isNew = id === "new";
  const property = isNew ? null : properties.find((p) => p.id === id) ?? properties[0];
  const landlord = property ? landlords.find((l) => l.id === property.landlordId) ?? null : null;

  const [activeTab, setActiveTab] = useState<TabId>("basic");

  const legalBuildingUsageOptions = [
    "主要用途登記含有「住」、「住宅」、「農舍」、「套房」、「公寓」或「宿舍」字樣。",
    "主要用途均為空白，依房屋稅繳款書或稅捐單位相關證明文件等得認定該建物全部為住宅使用。",
    "非位於工業區或丁種建築用地之建物，其主要用途登記為「商業用」、「辦公室」、「一般事務所」、「工商服務業」、「店舖」、「零售業」，且提出主管建築機關核可作第一項用途使用且得免辦理變更使用執照之相關證明文件者，得依房屋稅單繳款書或稅捐單位相關證明文件，認定該建築物全部為住宅使用。",
    "不符合前三項規定，提出合法房屋證明或經直轄市、縣（市）主管機關認定實施建築管理前已建造完成之建築物文件。",
  ];

  const tabs = [
    { id: "basic" as TabId, label: "基本資料" },
    { id: "landlord" as TabId, label: "出租人資料" },
    ...(isUpgrade ? [{ id: "inspection" as TabId, label: "屋況及租屋安全檢核表" }] : []),
  ];

  return (
    <div className="p-6">
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
            <h1 className="text-gray-800 text-lg">{isNew ? "新增物件" : property?.name}</h1>
            {!isNew && property && (
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status={property.status} />
                {isUpgrade && <StatusBadge status={property.applied ? "通過" : "未通過"} />}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {isUpgrade && !isNew && (
            <button className="flex items-center gap-2 px-4 py-2 border border-amber-400 bg-amber-50 text-amber-700 text-sm rounded hover:bg-amber-100 transition-colors">
              <Download size={14} />
              社宅物件申請書
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

      {/* Tab 1: 基本資料 */}
      {activeTab === "basic" && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            {/* 物件資訊 */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">物件資訊</h2>
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
                <FormField label="樓層" placeholder={`${property?.floor || ""}樓`} />
                <FormField label="坪數（建坪）" placeholder={`${property?.size || ""}`} />
                <FormField label="坪數（實坪）" placeholder="請輸入實際坪數" />
                <FormField label="租金（月）" placeholder={`${property?.rent?.toLocaleString() || ""}`} required />
                <FormField label="押金（月）" placeholder="請輸入押金月數" type="select" />
                <FormField label="出租人" placeholder={property?.landlordName || "請選擇出租人"} type="select" />
                <FormField label="現況" placeholder="請選擇物件狀態" type="select" />
              </div>
            </div>

            {/* 謄本資訊（升級版） */}
            {isUpgrade && (
              <UpgradeSection label="謄本資訊">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">建物座落地號</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-400"
                        placeholder="請輸入建物座落地號"
                        readOnly
                      />
                      <button className="px-3 py-2 text-xs border border-amber-300 bg-white text-amber-700 rounded hover:bg-amber-100 whitespace-nowrap">
                        調閱比對
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <FormField label="建物標示部" placeholder="請輸入建物標示部資訊" type="textarea" />
                  </div>
                </div>
              </UpgradeSection>
            )}

            {/* 社宅申請 */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">社宅申請</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="地址座標" placeholder="請輸入經緯度（例：25.0330, 121.5654）" />
                  <FormField label="屋齡" placeholder="請輸入屋齡" />
                  <FormField label="建築完成日期" placeholder="請輸入建築完成日期" />
                  <FormField label="層次" placeholder="請輸入層次（例：四層）" />
                  <FormField label="建物樓層" placeholder="請輸入建物樓層（例：7/12）" />
                  <FormField label="建築使用別" placeholder="請選擇建築使用別" type="select" />
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">屋件區位</label>
                    <div className="mt-1 flex flex-wrap gap-5">
                      {["中下區位", "中上區位", "優質區位"].map((zone, index) => (
                        <label key={zone} className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <input type="radio" name="locationZone" className="w-4 h-4 accent-teal-500" defaultChecked={index === 0} />
                          {zone}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-100">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-4 flex flex-col gap-1">
                      <label className="text-xs text-gray-500">
                        出租人建物持分比例
                        <span className="text-red-400 ml-0.5">*</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <input type="text" className="w-24 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-400" placeholder="1" readOnly />
                        <span className="text-sm text-gray-500">/</span>
                        <input type="text" className="w-24 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-400" placeholder="1" readOnly />
                        <label className="inline-flex items-center gap-1.5 text-sm text-gray-700 ml-2">
                          <input type="radio" name="ownershipType" className="w-4 h-4 accent-teal-500" defaultChecked readOnly />
                          持分共有
                        </label>
                        <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <input type="radio" name="ownershipType" className="w-4 h-4 accent-teal-500" readOnly />
                          公同共有
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-100 space-y-4">
                  <h3 className="text-sm text-gray-700 font-medium">出租物有無共同持有人</h3>
                  <div className="max-w-xs">
                    <FormField label="人數" placeholder="請輸入人數" />
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-100 space-y-4">
                  <h3 className="text-sm text-gray-700 font-medium">合法建築條件</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 font-medium">
                        1. 出租人為出租住宅之所有權人
                        <span className="text-red-400 ml-1">*</span>
                      </label>
                      <div className="flex gap-6">
                        <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <input type="radio" name="conditionOwner" className="w-4 h-4 accent-teal-500" defaultChecked readOnly />
                          符合
                        </label>
                        <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <input type="radio" name="conditionOwner" className="w-4 h-4 accent-teal-500" readOnly />
                          不符合
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 font-medium">
                        2. 租賃標的需坐落於當地直轄市
                        <span className="text-red-400 ml-1">*</span>
                      </label>
                      <div className="flex gap-6">
                        <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <input type="radio" name="conditionCity" className="w-4 h-4 accent-teal-500" defaultChecked readOnly />
                          符合
                        </label>
                        <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <input type="radio" name="conditionCity" className="w-4 h-4 accent-teal-500" readOnly />
                          不符合
                        </label>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm text-gray-700 font-medium">
                        3. 認定該建築物為住宅使用
                        <span className="text-red-400 ml-1">*</span>
                      </label>
                      <p className="text-xs text-gray-400">註：四擇一</p>
                      <div className="grid grid-cols-2 gap-3">
                        {legalBuildingUsageOptions.map((option, index) => (
                          <label key={option} className="inline-flex items-start gap-2 text-sm text-gray-700 leading-6">
                            <input type="radio" name="conditionBuildingUsage" className="w-4 h-4 mt-1 accent-teal-500" defaultChecked={index === 0} readOnly />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 格局與設備 */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">格局與設備</h2>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="房間數" placeholder="0" />
                <FormField label="廳數" placeholder="0" />
                <FormField label="衛浴數" placeholder="0" />
                <div className="col-span-3">
                  <label className="text-xs text-gray-500">設備勾選</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["冷氣", "熱水器", "冰箱", "洗衣機", "瓦斯爐", "電磁爐", "網路", "第四台", "車位"].map((item) => (
                      <label key={item} className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" className="w-3 h-3" readOnly />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-span-3">
                  <FormField label="物件描述" placeholder="請輸入物件說明、特色..." type="textarea" />
                </div>
              </div>
            </div>

            {/* 物況照片（升級版） */}
            {isUpgrade && (
              <UpgradeSection label="物況照片">
                <div className="grid grid-cols-3 gap-3">
                  <ImageUploadBox label="室內照片" />
                  <ImageUploadBox label="衛浴照片" />
                  <ImageUploadBox label="廚房照片" />
                  <ImageUploadBox label="外觀照片" />
                  <ImageUploadBox label="陽台照片" />
                  <div className="border-2 border-dashed border-amber-300 rounded-lg flex items-center justify-center text-xs text-amber-400 cursor-pointer hover:bg-amber-50">
                    + 新增照片
                  </div>
                </div>
              </UpgradeSection>
            )}
          </div>

          {/* Right Column */}
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

            {!isNew && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">相關契約</h2>
                <div className="space-y-2">
                  <div className="p-2 border border-gray-200 rounded text-xs text-gray-600 flex items-center justify-between">
                    <span>{property?.name} 租賃契約</span>
                    <span className="text-gray-400">2024–2025</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: 出租人資料 */}
      {activeTab === "landlord" && (
        <div className="max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">出租人資料</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField label="出租人" placeholder={landlord?.name || property?.landlordName || "請選擇出租人"} type="select" required />
              </div>
              <FormField label="類型" placeholder={landlord?.type || "請選擇"} type="select" />
              <FormField label="聯絡電話" placeholder={landlord?.phone || "請輸入聯絡電話"} />
              <div className="col-span-2">
                <FormField label="電子信箱" placeholder={landlord?.email || "請輸入電子信箱"} />
              </div>
              <FormField label="銀行" placeholder={landlord?.bank || "請輸入銀行名稱"} />
              <FormField label="帳號" placeholder={landlord?.account || "請輸入帳號"} />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 屋況及租屋安全檢核表（升級版） */}
      {activeTab === "inspection" && isUpgrade && (
        <div className="max-w-3xl space-y-0">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* 現勘日期 */}
            <div className="flex items-center justify-end gap-2 mb-6">
              <span className="text-sm text-gray-700">現勘日期：民國</span>
              <span className="text-red-400 text-sm">*</span>
              <input type="text" className="w-16 border border-gray-300 rounded px-2 py-1.5 text-sm text-center text-gray-600 focus:outline-none" placeholder="115" readOnly />
              <span className="text-sm text-gray-500">年</span>
              <input type="text" className="w-12 border border-gray-300 rounded px-2 py-1.5 text-sm text-center text-gray-600 focus:outline-none" placeholder="3" readOnly />
              <span className="text-sm text-gray-500">月</span>
              <input type="text" className="w-12 border border-gray-300 rounded px-2 py-1.5 text-sm text-center text-gray-600 focus:outline-none" placeholder="9" readOnly />
              <span className="text-sm text-gray-500">日</span>
            </div>

            {/* 一、租賃標的基本需求 */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-teal-400 rounded" />
              <h2 className="text-lg text-gray-800 font-medium">一、租賃標的基本需求</h2>
            </div>

            <div className="space-y-0">
              {/* 1 */}
              <div className="py-4">
                <p className="text-sm text-gray-800 mb-3">
                  1. 建物門牌以及大門圖片 <span className="text-red-400">*</span>
                </p>
                <FileUploadButton />
              </div>
              <SectionDivider />

              {/* 2 */}
              <div className="py-4">
                <p className="text-sm text-gray-800 mb-3">
                  2. 出入口、走廊、通路或樓梯間無堆放雜物，妨礙逃生避難 <span className="text-red-400">*</span>
                </p>
                <FileUploadButton />
              </div>
              <SectionDivider />

              {/* 3 */}
              <div className="py-4 space-y-3">
                <p className="text-sm text-gray-800">
                  3. 是否為海砂屋 <span className="text-red-400">*</span>
                </p>
                <RadioGroup name="seaSand" options={["否", "是"]} defaultValue="否" />
                <p className="text-sm text-gray-700 mt-3">有無做過混凝土中水溶性氯離子含量檢測
                  <span className="text-xs text-gray-400 ml-2">（例如海砂屋檢測事項）</span>
                </p>
                <div className="space-y-1.5">
                  <RadioGroup name="seaSandTest" options={["無"]} defaultValue="無" />
                  <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                    <input type="radio" name="seaSandTest" className="w-4 h-4" readOnly />
                    有
                    <span className="text-xs text-gray-400 ml-1">（若做過海砂屋檢測，請檢附檢測證明文件）</span>
                  </label>
                </div>
              </div>
              <SectionDivider />

              {/* 4 */}
              <div className="py-4 space-y-3">
                <p className="text-sm text-gray-800">
                  4. 是否為輻射屋 <span className="text-red-400">*</span>
                </p>
                <RadioGroup name="radiation" options={["否", "是"]} defaultValue="否" />
                <p className="text-sm text-gray-700 mt-3">有無做過輻射屋檢測</p>
                <div className="space-y-1.5">
                  <RadioGroup name="radiationTest" options={["無"]} defaultValue="無" />
                  <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                    <input type="radio" name="radiationTest" className="w-4 h-4" readOnly />
                    是
                    <span className="text-xs text-gray-400 ml-1">（若做過輻射屋檢測，請檢附檢測證明文件）</span>
                  </label>
                </div>
              </div>
              <SectionDivider />

              {/* 5 */}
              <div className="py-4 space-y-4">
                <p className="text-sm text-gray-800">
                  5. 室內具備功能正常且貼有內政部消防署個別認可合格標示之 <span className="text-red-400">*</span>
                </p>
                <div className="space-y-2">
                  <CheckItem label="滅火器" note="（必要，且在有效期限內）" color="red" />
                  <div className="ml-6">
                    <FileUploadButton />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CheckItem label="火警警報器" />
                    <span className="text-sm text-gray-500">/</span>
                    <CheckItem label="獨立型偵煙器" note="（可複選，任一即可）" />
                  </div>
                  <p className="text-xs text-red-500">（非屬應設置火警自動警報設備之住宅所有權人應依消防法第六條第五項規定設置及維護住宅用火災警報器）</p>
                  <div className="ml-0">
                    <FileUploadButton />
                  </div>
                </div>
              </div>
              <SectionDivider />

              {/* 6 */}
              <div className="py-4">
                <p className="text-sm text-gray-800 mb-3">
                  6. 具備馬桶、洗臉盆及浴缸(或淋浴)等 3 項衛浴設備 <span className="text-red-400">*</span>
                </p>
                <FileUploadButton />
              </div>
            </div>

            {/* 二、租賃管理相關事務 */}
            <div className="flex items-center gap-3 mt-8 mb-6">
              <div className="w-1 h-8 bg-teal-400 rounded" />
              <h2 className="text-lg text-gray-800 font-medium">二、租賃管理相關事務</h2>
            </div>

            <div className="space-y-0">
              {/* 1 */}
              <div className="py-4 space-y-2">
                <p className="text-sm text-gray-800">
                  1. 有無管理委員會統一管理 <span className="text-red-400">*</span>
                </p>
                <div className="space-y-1.5">
                  {["無", "有，但無管理費"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 text-sm text-gray-700">
                      <input type="radio" name="mgmtCommittee" className="w-4 h-4" readOnly />
                      {opt}
                    </label>
                  ))}
                  <label className="flex items-center gap-1.5 text-sm text-gray-700">
                    <input type="radio" name="mgmtCommittee" className="w-4 h-4" defaultChecked readOnly />
                    有，且有管理費
                  </label>
                  <div className="ml-6 flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-sm text-gray-700">管理費為 新臺幣</span>
                    <span className="text-red-400 text-sm">*</span>
                    <input type="text" className="w-24 border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-600 focus:outline-none" placeholder="76.13" readOnly />
                    <span className="text-sm text-gray-500">元/坪 、 每月</span>
                    <span className="text-red-400 text-sm">*</span>
                    <input type="text" className="w-20 border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-600 focus:outline-none" placeholder="1142" readOnly />
                    <span className="text-sm text-gray-500">元。</span>
                  </div>
                </div>
              </div>
              <SectionDivider />

              {/* 2 */}
              <div className="py-4 space-y-2">
                <p className="text-sm text-gray-800">
                  2. 有無公寓大廈規約或其他住戶應遵循事項 <span className="text-red-400">*</span>
                </p>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                    <input type="radio" name="buildingRules" className="w-4 h-4" readOnly />
                    無
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                    <input type="radio" name="buildingRules" className="w-4 h-4" defaultChecked readOnly />
                    有
                  </label>
                </div>
              </div>
              <SectionDivider />

              {/* 3 */}
              <div className="py-4 space-y-2">
                <p className="text-sm text-gray-800">
                  3. 有無定期辦理消防安全檢查 <span className="text-red-400">*</span>
                </p>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                    <input type="radio" name="fireInspection" className="w-4 h-4" readOnly />
                    無
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                    <input type="radio" name="fireInspection" className="w-4 h-4" defaultChecked readOnly />
                    有
                  </label>
                </div>
              </div>
              <SectionDivider />

              {/* 4 */}
              <div className="py-4 space-y-3">
                <p className="text-sm text-gray-800">
                  4. 停車管理 <span className="text-red-400">*</span>
                </p>
                <p className="text-xs text-teal-600">註：停車位管理費以清潔費名義收取者亦同。</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-700">有無汽車停車位？<span className="text-red-400">*</span></p>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                        <input type="radio" name="carParking" className="w-4 h-4" defaultChecked readOnly />
                        無
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                        <input type="radio" name="carParking" className="w-4 h-4" readOnly />
                        有
                      </label>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-700">有無機車停車位？<span className="text-red-400">*</span></p>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                        <input type="radio" name="motoParking" className="w-4 h-4" defaultChecked readOnly />
                        無
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                        <input type="radio" name="motoParking" className="w-4 h-4" readOnly />
                        有
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
