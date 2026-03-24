import { Plus } from "lucide-react";
import { FormField } from "./WireframeTag";

type SharedProperty = {
  name?: string;
  address?: string;
  floor?: number | string;
  size?: number;
  rent?: number;
  rentalType?: string;
  agentName?: string;
  propertyInfo?: {
    rentalAddress?: {
      city?: string;
      district?: string;
      street?: string;
      lane?: string;
      alley?: string;
      number?: string;
      subNumber?: string;
      hideDoorplate?: boolean;
    };
    communityName?: string;
    orientation?: string;
    rentalFloorType?: string;
    rentalFloor?: string;
    rentalSubFloor?: string;
    totalFloors?: number;
    layout?: {
      rooms?: number;
      livingRooms?: number;
      bathrooms?: number;
      balconies?: number;
      isStudio?: boolean;
    };
    usableArea?: number;
    completionDate?: string;
    deposit?: string;
    managementFee?: number;
    minLeaseTerm?: string;
    availableMoveInDate?: string;
    decorationTime?: string;
    decorationLevel?: string;
    ownershipRegistration?: string;
    cookingAllowed?: string;
    petAllowed?: string;
    rentIncludes?: string[];
    livingFeatures?: string[];
    nearbyTransport?: string[];
    tenantRequirements?: string[];
  };
  conditionForm?: any;
};

type SharedLandlord = {
  name?: string;
  type?: string;
  phone?: string;
  email?: string;
  bank?: string;
  account?: string;
};

const RENT_INCLUDE_OPTIONS = ["管理費", "清潔費", "第四台", "網路", "水費", "電費", "瓦斯費"];
const LIVING_FEATURE_OPTIONS = ["近便利商店", "近傳統市場", "近百貨公司", "近公園綠地", "近學校", "近醫療機構", "近夜市"];
const TRANSPORT_OPTIONS = ["公車站", "捷運站", "火車站"];
const TENANT_REQUIREMENT_OPTIONS = ["學生", "上班族", "家庭"];

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

export function PropertyRentalTypeCard({ rentalType, defaultGeneralChecked = false }: {
  rentalType?: string;
  defaultGeneralChecked?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租案類型</h2>
      <div className="flex gap-6">
        <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
          <input
            type="radio"
            name="rentalType"
            className="w-4 h-4"
            defaultChecked={rentalType === "一般租案" || (!rentalType && defaultGeneralChecked)}
            readOnly
          />
          一般租案
        </label>
        <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
          <input type="radio" name="rentalType" className="w-4 h-4" defaultChecked={rentalType === "社宅包租案"} readOnly />
          社宅包租案
        </label>
        <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
          <input type="radio" name="rentalType" className="w-4 h-4" defaultChecked={rentalType === "社宅代租案"} readOnly />
          社宅代租案
        </label>
      </div>
    </div>
  );
}

export function PropertyBasicInfoCard({ property }: { property: SharedProperty | null }) {
  const propertyInfo = property?.propertyInfo;
  const rentalAddress = propertyInfo?.rentalAddress;
  const layout = propertyInfo?.layout;

  return (
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
        <FormField
          label="出租樓層"
          placeholder={propertyInfo?.rentalFloor || (property?.floor ? `${property.floor}樓` : "請輸入樓層")}
          required
        />
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
        <MultiSelectPreview label="租金包含" options={RENT_INCLUDE_OPTIONS} selected={propertyInfo?.rentIncludes} />
        <MultiSelectPreview label="生活機能" options={LIVING_FEATURE_OPTIONS} selected={propertyInfo?.livingFeatures} />
        <MultiSelectPreview label="附近交通" options={TRANSPORT_OPTIONS} selected={propertyInfo?.nearbyTransport} />
        <MultiSelectPreview label="身分要求" options={TENANT_REQUIREMENT_OPTIONS} selected={propertyInfo?.tenantRequirements} />
      </div>
    </div>
  );
}

export function PropertyAgentCard({ agentName, fallback = "請選擇負責營業員" }: {
  agentName?: string;
  fallback?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">負責營業員</h2>
      <FormField label="營業員" placeholder={agentName || fallback} type="select" />
    </div>
  );
}

export function LandlordInfoCard({ landlord, title = "出租人資料" }: {
  landlord: SharedLandlord | null;
  title?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FormField label="姓名／名稱" placeholder={landlord?.name || "請輸入姓名／名稱"} />
        </div>
        <FormField label="身份類型" placeholder={landlord?.type || "請選擇"} type="select" />
        <FormField label="聯絡電話" placeholder={landlord?.phone || "請輸入聯絡電話"} />
        <div className="col-span-2">
          <FormField label="Email" placeholder={landlord?.email || "請輸入 Email"} />
        </div>
        <FormField label="銀行" placeholder={landlord?.bank || "請輸入銀行"} />
        <FormField label="帳號" placeholder={landlord?.account || "請輸入帳號"} />
      </div>
    </div>
  );
}

export function PropertyConditionSection({ property }: { property: SharedProperty | null }) {
  const conditionForm = property?.conditionForm;
  const conditionAppliances = conditionForm?.conditionStatus?.accessoryItems?.appliances ?? [];
  const conditionFurniture = conditionForm?.conditionStatus?.accessoryItems?.furniture ?? [];
  const requiredPhotoItems = conditionForm?.photoAttachments?.required ?? [];
  const optionalPhotoItems = conditionForm?.photoAttachments?.optional ?? [];

  return (
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
  );
}
