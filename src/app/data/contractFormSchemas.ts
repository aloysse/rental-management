export type ContractFieldType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox-group";

export interface ContractFormContext {
  contractTypeLabel?: string;
  property?: any;
  landlord?: any;
}

export interface ContractFormFieldSchema {
  id: string;
  label: string;
  type: ContractFieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  autoFill?: boolean;
  hint?: string;
  defaultValue?: (context: ContractFormContext) => string;
}

export interface ContractFormSectionSchema {
  id: string;
  title: string;
  description?: string;
  columns?: 1 | 2;
  fields: ContractFormFieldSchema[];
}

export interface ContractFormStepSchema {
  id: string;
  title: string;
  sections: ContractFormSectionSchema[];
}

export interface DelegationContractFormSchema {
  id: string;
  title: string;
  contractTypeIds: string[];
  steps: ContractFormStepSchema[];
}

const FEE_BEARER_OPTIONS = ["出租人負擔", "包租業負擔", "其他"];
const TAX_BEARER_OPTIONS = ["出租人負擔", "包租業負擔", "平均分擔"];

const DEPOSIT_TEXT_TO_MONTHS: Record<string, number> = {
  一個月: 1,
  兩個月: 2,
  三個月: 3,
};

const toText = (value: unknown) => {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
};

const getPeriodFromContractTypeLabel = (label?: string) => {
  if (!label) {
    return "";
  }
  const matched = label.match(/（([^）]+)）/);
  return matched?.[1] ?? "";
};

const getDepositMonths = (property: any) => {
  const depositText = property?.propertyInfo?.deposit;
  if (!depositText) {
    return "";
  }
  const months = DEPOSIT_TEXT_TO_MONTHS[depositText];
  return months ? String(months) : "";
};

const getDepositAmount = (property: any) => {
  const rent = Number(property?.rent ?? 0);
  const months = Number(getDepositMonths(property) || 0);
  if (!rent || !months) {
    return "";
  }
  return String(rent * months);
};

const hasAccessoryEquipment = (property: any) => {
  const appliances = property?.houseCondition?.appliances;
  if (!appliances) {
    return false;
  }
  return Object.values(appliances).some(Boolean);
};

const MAINTENANCE_HANDOVER_OPTIONS = ["現狀", "修繕後點交"];
const MAINTENANCE_OWNER_OPTIONS = ["包租業", "出租人", "其他"];

const ATTACHMENT4_OUTDOOR_ITEMS = [
  ["main_door", "大門"],
  ["door_lock", "門鎖"],
  ["door_bell", "門鈴"],
  ["intercom", "對講機"],
  ["room_door", "房門"],
  ["entrance_light", "門口燈"],
  ["other", "其他"],
] as const;

const ATTACHMENT4_LIVING_ITEMS = [
  ["french_window", "落地門窗"],
  ["screen_door", "紗門"],
  ["glass_window", "玻璃窗"],
  ["ceiling", "天花板"],
  ["inner_wall", "內牆壁"],
  ["indoor_floor", "室內地板"],
  ["other", "其他"],
] as const;

const ATTACHMENT4_KITCHEN_BATH_ITEMS = [
  ["sink_basin", "洗臉台"],
  ["kitchen_counter", "流理台"],
  ["drain", "排水孔"],
  ["faucet", "水龍頭"],
  ["toilet", "馬桶"],
  ["bathtub", "浴缸"],
  ["door_window", "門窗"],
  ["ceiling", "天花板"],
  ["floor", "地板"],
  ["wall", "牆壁"],
  ["other", "其他"],
] as const;

function createAttachment4MaintenanceFields(
  groupId: string,
  itemId: string,
  itemLabel: string
): ContractFormFieldSchema[] {
  return [
    {
      id: `a4_${groupId}_${itemId}_item_name`,
      label: `${itemLabel}（設備/設施）`,
      type: "text",
      defaultValue: () => itemLabel,
    },
    {
      id: `a4_${groupId}_${itemId}_handover_state`,
      label: `${itemLabel} 點交狀態`,
      type: "radio",
      options: MAINTENANCE_HANDOVER_OPTIONS,
      defaultValue: () => "現狀",
    },
    {
      id: `a4_${groupId}_${itemId}_damage_owner`,
      label: `${itemLabel} 損壞責任歸屬`,
      type: "select",
      options: MAINTENANCE_OWNER_OPTIONS,
      defaultValue: () => "包租業",
    },
    {
      id: `a4_${groupId}_${itemId}_repair_fee_owner`,
      label: `${itemLabel} 修繕費用負擔`,
      type: "select",
      options: MAINTENANCE_OWNER_OPTIONS,
      defaultValue: () => "包租業",
    },
    {
      id: `a4_${groupId}_${itemId}_remark`,
      label: `${itemLabel} 備註`,
      type: "text",
      placeholder: "請輸入",
    },
  ];
}

function createAttachment5RowFields(index: 1 | 2): ContractFormFieldSchema[] {
  return [
    {
      id: `a5_row${index}_address`,
      label: `第 ${index} 筆 門牌地址`,
      type: "text",
      placeholder: "縣/市、鄉/鎮/市/區、街/路、段、巷、弄、號、樓之",
      autoFill: index === 1,
      defaultValue:
        index === 1 ? ({ property }) => toText(property?.address) : undefined,
    },
    {
      id: `a5_row${index}_sublease_scope`,
      label: `第 ${index} 筆 轉租範圍`,
      type: "radio",
      options: ["全部", "一部"],
      defaultValue: () => "全部",
    },
    {
      id: `a5_row${index}_lease_start`,
      label: `第 ${index} 筆 租賃起始期間`,
      type: "text",
      placeholder: "YYYY-MM-DD",
    },
    {
      id: `a5_row${index}_lease_end`,
      label: `第 ${index} 筆 租賃終止期間`,
      type: "text",
      placeholder: "YYYY-MM-DD",
    },
    {
      id: `a5_row${index}_early_termination`,
      label: `第 ${index} 筆 提前終止租約之約定`,
      type: "radio",
      options: ["有", "無"],
      defaultValue: () => "無",
    },
    {
      id: `a5_row${index}_early_termination_note`,
      label: `第 ${index} 筆 提前終止說明`,
      type: "text",
      placeholder: "若選有，請填寫說明",
    },
    {
      id: `a5_row${index}_remark`,
      label: `第 ${index} 筆 備註`,
      type: "text",
      placeholder: "請輸入",
    },
  ];
}

const socialLeaseDelegationSchema: DelegationContractFormSchema = {
  id: "social-lease-delegation",
  title: "社宅-包租契約書",
  contractTypeIds: ["social-lease-delegation", "social-lease"],
  steps: [
    {
      id: "parties-and-target",
      title: "當事人與租賃標的",
      sections: [
        {
          id: "parties",
          title: "立契約書人",
          description: "依契約首頁設定雙方資料，與案件重複資料自動帶入。",
          columns: 2,
          fields: [
            {
              id: "contract_period",
              label: "計畫期數",
              type: "text",
              placeholder: "例如：第五期 1141010",
              autoFill: true,
              defaultValue: ({ contractTypeLabel }) =>
                getPeriodFromContractTypeLabel(contractTypeLabel),
            },
            {
              id: "signing_date",
              label: "立約日期",
              type: "text",
              placeholder: "YYYY-MM-DD",
              required: true,
            },
            {
              id: "lessor_name",
              label: "出租人",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord, property }) =>
                toText(landlord?.name ?? property?.landlordName),
            },
            {
              id: "lease_business_name",
              label: "租屋服務事業（包租業）",
              type: "text",
              placeholder: "請輸入包租業公司名稱",
            },
            {
              id: "case_no",
              label: "案件編號",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) => toText(property?.caseNo),
            },
            {
              id: "rental_type",
              label: "案件租案類型",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) => toText(property?.rentalType),
            },
          ],
        },
        {
          id: "doorplate",
          title: "第一條 一、租賃住宅標示（建物門牌）",
          columns: 2,
          fields: [
            {
              id: "doorplate_city",
              label: "縣/市",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) =>
                toText(property?.propertyInfo?.rentalAddress?.city),
            },
            {
              id: "doorplate_district",
              label: "鄉/鎮/市/區",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) =>
                toText(property?.propertyInfo?.rentalAddress?.district),
            },
            {
              id: "doorplate_street",
              label: "街/路",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) =>
                toText(property?.propertyInfo?.rentalAddress?.street),
            },
            {
              id: "doorplate_section",
              label: "段",
              type: "text",
              placeholder: "請輸入",
            },
            {
              id: "doorplate_lane",
              label: "巷",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) =>
                toText(property?.propertyInfo?.rentalAddress?.lane),
            },
            {
              id: "doorplate_alley",
              label: "弄",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) =>
                toText(property?.propertyInfo?.rentalAddress?.alley),
            },
            {
              id: "doorplate_number",
              label: "號",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) =>
                toText(property?.propertyInfo?.rentalAddress?.number),
            },
            {
              id: "doorplate_floor",
              label: "樓之",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) =>
                toText(property?.propertyInfo?.rentalFloor ?? property?.floor),
            },
          ],
        },
        {
          id: "land-building-number",
          title: "第一條 一、建物坐落與建號",
          columns: 2,
          fields: [
            {
              id: "land_section",
              label: "地段（坐落地號）",
              type: "text",
              placeholder: "請輸入地段",
            },
            {
              id: "land_sub_section",
              label: "小段（坐落地號）",
              type: "text",
              placeholder: "請輸入小段",
            },
            {
              id: "land_number",
              label: "地號",
              type: "text",
              placeholder: "請輸入地號",
            },
            {
              id: "building_section",
              label: "地段（建號）",
              type: "text",
              placeholder: "請輸入地段",
            },
            {
              id: "building_sub_section",
              label: "小段（建號）",
              type: "text",
              placeholder: "請輸入小段",
            },
            {
              id: "building_number",
              label: "建號",
              type: "text",
              placeholder: "請輸入建號",
            },
          ],
        },
        {
          id: "rental-scope",
          title: "第一條 二、租賃範圍",
          columns: 2,
          fields: [
            {
              id: "house_area_sqm",
              label: "房屋面積（平方公尺）",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) => toText(property?.size),
            },
            {
              id: "parking_status",
              label: "車位",
              type: "radio",
              options: ["有車位", "無車位"],
              autoFill: true,
              defaultValue: ({ property }) =>
                property?.houseCondition?.parking ? "有車位" : "無車位",
            },
            {
              id: "accessory_status",
              label: "租賃附屬設備",
              type: "radio",
              options: ["有附屬設備", "無附屬設備"],
              autoFill: true,
              defaultValue: ({ property }) =>
                hasAccessoryEquipment(property) ? "有附屬設備" : "無附屬設備",
            },
            {
              id: "scope_other",
              label: "其他",
              type: "text",
              placeholder: "請輸入其他租賃範圍說明",
            },
          ],
        },
      ],
    },
    {
      id: "lease-and-money",
      title: "租期與金流",
      sections: [
        {
          id: "lease-term",
          title: "第二條 租賃期間",
          columns: 2,
          fields: [
            {
              id: "lease_start_date",
              label: "租賃起始日",
              type: "text",
              placeholder: "YYYY-MM-DD",
              required: true,
            },
            {
              id: "lease_end_date",
              label: "租賃終止日",
              type: "text",
              placeholder: "YYYY-MM-DD",
              required: true,
            },
            {
              id: "lease_years",
              label: "租賃期間年數",
              type: "text",
              placeholder: "例如：3",
            },
          ],
        },
        {
          id: "rent-payment",
          title: "第三條 租金約定及支付",
          columns: 2,
          fields: [
            {
              id: "monthly_rent",
              label: "每月房屋租金（元）",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) => toText(property?.rent),
            },
            {
              id: "payment_periods",
              label: "包租業應繳納期數",
              type: "text",
              placeholder: "請輸入期數",
            },
            {
              id: "monthly_payment_day",
              label: "每月付款日（日前）",
              type: "text",
              placeholder: "例如：5",
            },
            {
              id: "payment_methods",
              label: "租金支付方式",
              type: "checkbox-group",
              options: ["轉帳繳付", "票據繳付", "現金繳付"],
              defaultValue: () => "轉帳繳付",
            },
            {
              id: "payment_bank_name",
              label: "金融機構",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord }) => toText(landlord?.bank),
            },
            {
              id: "payment_account_name",
              label: "戶名",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord }) => toText(landlord?.name),
            },
            {
              id: "payment_account_number",
              label: "帳號",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord }) => toText(landlord?.account),
            },
            {
              id: "payment_other",
              label: "其他支付方式",
              type: "text",
              placeholder: "請輸入",
            },
          ],
        },
        {
          id: "deposit",
          title: "第四條 押金約定及返還",
          columns: 2,
          fields: [
            {
              id: "deposit_months",
              label: "押金月數",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) => getDepositMonths(property),
            },
            {
              id: "deposit_amount",
              label: "押金金額（元）",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) => getDepositAmount(property),
            },
          ],
        },
      ],
    },
    {
      id: "fees-and-tax",
      title: "費用與稅費負擔",
      sections: [
        {
          id: "fees",
          title: "第五條 租賃期間相關費用之支付",
          description: "每一費用項目需指定負擔方，選擇「其他」時可填寫金額與補充說明。",
          columns: 2,
          fields: [
            { id: "fee_management_bearer", label: "管理費負擔方", type: "select", options: FEE_BEARER_OPTIONS },
            { id: "fee_management_other_amount", label: "管理費其他金額", type: "text", placeholder: "每月___元整" },
            { id: "fee_parking_bearer", label: "停車位管理費負擔方", type: "select", options: FEE_BEARER_OPTIONS },
            { id: "fee_parking_other_amount", label: "停車位管理費其他金額", type: "text", placeholder: "每月___元整" },
            { id: "fee_water_bearer", label: "水費負擔方", type: "select", options: FEE_BEARER_OPTIONS },
            { id: "fee_water_other_amount", label: "水費其他金額", type: "text", placeholder: "每度___元整" },
            { id: "fee_electricity_bearer", label: "電費負擔方", type: "select", options: FEE_BEARER_OPTIONS },
            { id: "fee_electricity_other_amount", label: "電費其他金額", type: "text", placeholder: "每度___元整" },
            { id: "fee_gas_bearer", label: "瓦斯費負擔方", type: "select", options: FEE_BEARER_OPTIONS },
            { id: "fee_gas_other_amount", label: "瓦斯費其他金額", type: "text", placeholder: "請輸入" },
            { id: "fee_internet_bearer", label: "網路費負擔方", type: "select", options: FEE_BEARER_OPTIONS },
            { id: "fee_internet_other_amount", label: "網路費其他金額", type: "text", placeholder: "請輸入" },
            { id: "fee_other_bearer", label: "其他費用負擔方", type: "select", options: FEE_BEARER_OPTIONS },
            { id: "fee_other_note", label: "其他費用說明", type: "text", placeholder: "請輸入費用名稱與金額" },
          ],
        },
        {
          id: "taxes",
          title: "第六條 稅費負擔之約定",
          columns: 2,
          fields: [
            {
              id: "tax_house",
              label: "房屋稅",
              type: "select",
              options: TAX_BEARER_OPTIONS,
              defaultValue: () => "出租人負擔",
            },
            {
              id: "tax_land",
              label: "地價稅",
              type: "select",
              options: TAX_BEARER_OPTIONS,
              defaultValue: () => "出租人負擔",
            },
            {
              id: "tax_stamp",
              label: "印花稅",
              type: "select",
              options: TAX_BEARER_OPTIONS,
              defaultValue: () => "出租人負擔",
            },
            {
              id: "tax_notary",
              label: "公證費",
              type: "select",
              options: TAX_BEARER_OPTIONS,
            },
            {
              id: "tax_other",
              label: "其他稅費",
              type: "text",
              placeholder: "請輸入稅費名稱與負擔方式",
            },
          ],
        },
      ],
    },
    {
      id: "clauses",
      title: "重要條款約定",
      sections: [
        {
          id: "renovation",
          title: "第九條 室內裝修",
          columns: 2,
          fields: [
            {
              id: "renovation_consent",
              label: "出租人是否同意裝修",
              type: "radio",
              options: ["同意", "不同意"],
            },
            {
              id: "renovation_cost_bearer",
              label: "裝修費用負擔方",
              type: "select",
              options: ["出租人", "包租業", "其他"],
            },
            {
              id: "renovation_cost_other",
              label: "裝修費用其他說明",
              type: "text",
              placeholder: "請輸入",
            },
            {
              id: "restore_state",
              label: "返還租賃住宅狀態",
              type: "select",
              options: ["回復原狀", "現況返還", "其他"],
            },
            {
              id: "restore_state_other",
              label: "返還狀態其他說明",
              type: "text",
              placeholder: "請輸入",
            },
          ],
        },
        {
          id: "early-termination",
          title: "第十三條 提前終止租約之約定",
          columns: 2,
          fields: [
            {
              id: "early_termination_allowed",
              label: "租賃雙方是否得提前終止",
              type: "radio",
              options: ["得", "不得"],
            },
            {
              id: "early_termination_scope",
              label: "終止範圍",
              type: "select",
              options: ["全部", "一部"],
            },
          ],
        },
        {
          id: "notary-and-dispute",
          title: "第二十一條與第二十三條 其他約定",
          columns: 2,
          fields: [
            {
              id: "notary_agreement",
              label: "本契約是否辦理公證",
              type: "radio",
              options: ["同意", "不同意"],
            },
            {
              id: "compulsory_execution_items",
              label: "公證強制執行事項",
              type: "checkbox-group",
              options: [
                "(一) 期滿返還租賃住宅",
                "(二) 給付租金、費用與管理費",
                "(三) 返還押金",
              ],
            },
            {
              id: "dispute_resolution",
              label: "第二十三條 爭議處理方式",
              type: "radio",
              options: ["法院訴訟", "仲裁"],
            },
          ],
        },
      ],
    },
    {
      id: "notice-and-attachments",
      title: "通知方式與附件",
      sections: [
        {
          id: "notice",
          title: "第二十條 履行本契約之通知",
          columns: 2,
          fields: [
            {
              id: "notice_postal_address",
              label: "郵寄通知地址",
              type: "text",
              placeholder: "請輸入通知地址",
            },
            {
              id: "notice_methods",
              label: "前項通知方式",
              type: "checkbox-group",
              options: ["電子郵件信箱", "手機簡訊", "即時通訊軟體"],
            },
            {
              id: "notice_email",
              label: "電子郵件信箱",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord }) => toText(landlord?.email),
            },
            {
              id: "notice_sms",
              label: "手機簡訊號碼",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord }) => toText(landlord?.phone),
            },
            {
              id: "notice_im",
              label: "即時通訊軟體帳號",
              type: "text",
              placeholder: "請輸入",
            },
          ],
        },
        {
          id: "attachments",
          title: "附屬文件與其他自行檢附文件",
          columns: 1,
          fields: [
            {
              id: "attachment_agent_consent",
              label: "授權代理人簽約同意書",
              type: "radio",
              options: ["檢附", "不檢附（本人簽約）"],
            },
            {
              id: "attachment_other",
              label: "其他自行檢附文件",
              type: "textarea",
              placeholder: "例如：測量成果圖、室內空間現況照片、稅籍證明等",
            },
          ],
        },
      ],
    },
    {
      id: "signature",
      title: "簽署資料確認",
      sections: [
        {
          id: "lessor-signature",
          title: "出租人簽署資訊",
          columns: 2,
          fields: [
            {
              id: "sign_lessor_name",
              label: "姓名/法人名稱",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord, property }) =>
                toText(landlord?.name ?? property?.landlordName),
            },
            {
              id: "sign_lessor_id",
              label: "身分證字號/統一編號",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord }) => toText(landlord?.taxId),
            },
            {
              id: "sign_lessor_principal",
              label: "負責人姓名",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord }) =>
                toText(landlord?.representativeName),
            },
            {
              id: "sign_lessor_household_address",
              label: "戶籍地址",
              type: "text",
              placeholder: "請輸入",
            },
            {
              id: "sign_lessor_contact_address",
              label: "通訊地址",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) => toText(property?.address),
            },
            {
              id: "sign_lessor_phone",
              label: "聯絡電話",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord }) => toText(landlord?.phone),
            },
          ],
        },
        {
          id: "business-signature",
          title: "租屋服務事業（包租業）簽署資訊",
          columns: 2,
          fields: [
            {
              id: "sign_company_name",
              label: "公司名稱",
              type: "text",
              placeholder: "請輸入包租業公司名稱",
            },
            {
              id: "sign_company_tax_id",
              label: "統一編號",
              type: "text",
              placeholder: "請輸入統一編號",
            },
            {
              id: "sign_company_principal",
              label: "負責人姓名",
              type: "text",
              placeholder: "請輸入",
            },
            {
              id: "sign_company_license",
              label: "許可字號/登記證字號",
              type: "text",
              placeholder: "請輸入",
            },
            {
              id: "sign_company_address",
              label: "營業地址",
              type: "text",
              placeholder: "請輸入",
            },
            {
              id: "sign_company_phone",
              label: "聯絡電話",
              type: "text",
              placeholder: "請輸入",
            },
          ],
        },
        {
          id: "manager-signature",
          title: "租賃住宅管理人員",
          columns: 2,
          fields: [
            {
              id: "sign_manager_name",
              label: "姓名",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) => toText(property?.agentName),
            },
            {
              id: "sign_manager_license",
              label: "證書字號",
              type: "text",
              placeholder: "請輸入",
            },
            {
              id: "sign_manager_address",
              label: "通訊地址",
              type: "text",
              placeholder: "請輸入",
            },
            {
              id: "sign_manager_phone",
              label: "聯絡電話",
              type: "text",
              placeholder: "請輸入",
            },
          ],
        },
      ],
    },
    {
      id: "attachment-four-maintenance",
      title: "附件四 修繕費用確認",
      sections: [
        {
          id: "a4_statement",
          title: "出租人負擔修繕費用之項目及範圍確認書",
          description:
            "依附件四內容確認點交狀態、租賃期間損壞責任與修繕費用負擔，雙方簽認後生效。",
          columns: 2,
          fields: [
            {
              id: "a4_lessor_name",
              label: "出租人",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord, property }) =>
                toText(landlord?.name ?? property?.landlordName),
            },
            {
              id: "a4_lease_business_name",
              label: "包租業公司名稱",
              type: "text",
              placeholder: "請輸入公司名稱",
            },
            {
              id: "a4_sign_date",
              label: "簽訂日期",
              type: "text",
              placeholder: "YYYY-MM-DD",
            },
            {
              id: "a4_statement_note",
              label: "補充說明",
              type: "textarea",
              placeholder: "請輸入雙方另行約定內容",
            },
          ],
        },
        {
          id: "a4_outdoor_items",
          title: "明細表：室外設備或設施",
          columns: 1,
          fields: ATTACHMENT4_OUTDOOR_ITEMS.flatMap(([itemId, itemLabel]) =>
            createAttachment4MaintenanceFields("outdoor", itemId, itemLabel)
          ),
        },
        {
          id: "a4_living_room_items",
          title: "明細表：客餐廳及臥室",
          columns: 1,
          fields: ATTACHMENT4_LIVING_ITEMS.flatMap(([itemId, itemLabel]) =>
            createAttachment4MaintenanceFields("living", itemId, itemLabel)
          ),
        },
        {
          id: "a4_kitchen_bath_items",
          title: "明細表：廚房及衛浴設備等",
          columns: 1,
          fields: ATTACHMENT4_KITCHEN_BATH_ITEMS.flatMap(([itemId, itemLabel]) =>
            createAttachment4MaintenanceFields("kitchen_bath", itemId, itemLabel)
          ),
        },
        {
          id: "a4_note_and_sign",
          title: "附註與簽認",
          columns: 2,
          fields: [
            {
              id: "a4_contact_method_same_as_basic",
              label: "修繕聯絡方式",
              type: "radio",
              options: ["同本契約基本資料", "另填聯絡方式"],
              defaultValue: () => "同本契約基本資料",
            },
            {
              id: "a4_contact_method_other",
              label: "其他聯絡方式",
              type: "text",
              placeholder: "若另填，請輸入",
            },
            {
              id: "a4_manager_name",
              label: "租賃住宅管理人員",
              type: "text",
              autoFill: true,
              defaultValue: ({ property }) => toText(property?.agentName),
            },
            {
              id: "a4_lessor_sign_date",
              label: "出租人簽章日期",
              type: "text",
              placeholder: "YYYY-MM-DD",
            },
          ],
        },
      ],
    },
    {
      id: "attachment-five-sublease-consent",
      title: "附件五 轉租範圍確認",
      sections: [
        {
          id: "a5_statement",
          title: "出租人同意轉租範圍、租賃期間及終止租約事由確認書",
          description:
            "依附件五填列轉租範圍與期間，若有提前終止租約約定，需於備註詳述事由。",
          columns: 2,
          fields: [
            {
              id: "a5_lessor_name",
              label: "出租人",
              type: "text",
              autoFill: true,
              defaultValue: ({ landlord, property }) =>
                toText(landlord?.name ?? property?.landlordName),
            },
            {
              id: "a5_lease_business_name",
              label: "包租業公司名稱",
              type: "text",
              placeholder: "請輸入公司名稱",
            },
            {
              id: "a5_sign_date",
              label: "簽訂日期",
              type: "text",
              placeholder: "YYYY-MM-DD",
            },
          ],
        },
        {
          id: "a5_scope_rows",
          title: "出租人同意轉租範圍、租賃期間及終止租約事由明細表",
          columns: 2,
          fields: [
            ...createAttachment5RowFields(1),
            ...createAttachment5RowFields(2),
          ],
        },
        {
          id: "a5_termination_reasons",
          title: "提前終止租約事由",
          columns: 1,
          fields: [
            {
              id: "a5_termination_reason_note",
              label: "提前終止租約事由補充說明",
              type: "textarea",
              placeholder: "請輸入提前終止事由",
            },
            {
              id: "a5_lessor_sign_date",
              label: "出租人簽章日期",
              type: "text",
              placeholder: "YYYY-MM-DD",
            },
          ],
        },
      ],
    },
  ],
};

const delegationContractSchemas = [socialLeaseDelegationSchema];

export function getDelegationContractFormSchema(contractTypeId?: string | null) {
  if (!contractTypeId) {
    return null;
  }
  const normalized = contractTypeId.trim().toLowerCase();
  return (
    delegationContractSchemas.find((schema) =>
      schema.contractTypeIds.some((id) => id.toLowerCase() === normalized)
    ) ?? null
  );
}

export function buildContractFormInitialValues(
  schema: DelegationContractFormSchema,
  context: ContractFormContext
) {
  const values: Record<string, string> = {};

  schema.steps.forEach((step) => {
    step.sections.forEach((section) => {
      section.fields.forEach((field) => {
        values[field.id] = field.defaultValue?.(context) ?? "";
      });
    });
  });

  return values;
}
