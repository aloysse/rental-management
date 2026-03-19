export const tenants = [
  {
    id: "住通台北B2T00001", name: "王小明", phone: "0912-345-678", email: "wang@example.com",
    idNo: "A123456789", category: "一般", applied: true, address: "台北市中正區中山路1號",
    preferredRent: { min: 15000, max: 20000 }, preferredDistrict: "台北市中正區",
    preferredRoomType: "套房", preferredOccupants: 1,
    socialHousingApp: { tenantCode: "TT001", virtualCode: "VC001", otherGovSubsidy: false, coResidentCount: 0 },
    attachments: [{ id: "TA001", name: "身分證正反面.pdf", fileType: "PDF" }],
  },
  {
    id: "住通台北B2T00002", name: "李美玲", phone: "0923-456-789", email: "li@example.com",
    idNo: "B234567890", category: "弱勢", applied: true, address: "新北市板橋區文化路2號",
    preferredRent: { min: 20000, max: 30000 }, preferredDistrict: "新北市板橋區",
    preferredRoomType: "兩房一廳", preferredOccupants: 2,
    socialHousingApp: { tenantCode: "TT002", virtualCode: "VC002", otherGovSubsidy: true, coResidentCount: 1 },
    attachments: [],
  },
  {
    id: "住通台北B2T00003", name: "張大華", phone: "0934-567-890", email: "zhang@example.com",
    idNo: "C345678901", category: "一般", applied: false, address: "台中市西屯區台灣大道3號",
    preferredRent: { min: 18000, max: 50000 }, preferredDistrict: "台北市中正區",
    preferredRoomType: "三房兩廳", preferredOccupants: 3,
    socialHousingApp: { tenantCode: "TT003", virtualCode: "VC003", otherGovSubsidy: false, coResidentCount: 2 },
    attachments: [],
  },
  {
    id: "住通台北B2T00004", name: "陳淑芬", phone: "0945-678-901", email: "chen@example.com",
    idNo: "D456789012", category: "弱勢", applied: true, address: "高雄市苓雅區四維路4號",
    preferredRent: { min: 15000, max: 22000 }, preferredDistrict: "台北市內湖區",
    preferredRoomType: "套房", preferredOccupants: 1,
    socialHousingApp: { tenantCode: "TT004", virtualCode: "VC004", otherGovSubsidy: false, coResidentCount: 0 },
    attachments: [{ id: "TA004", name: "租屋申請書.pdf", fileType: "PDF" }],
  },
  {
    id: "住通台北B2T00005", name: "林志豪", phone: "0956-789-012", email: "lin@example.com",
    idNo: "E567890123", category: "一般", applied: false, address: "台南市東區長榮路5號",
    preferredRent: { min: 20000, max: 35000 }, preferredDistrict: "台北市大安區",
    preferredRoomType: "兩房一廳", preferredOccupants: 2,
    socialHousingApp: { tenantCode: "TT005", virtualCode: "VC005", otherGovSubsidy: false, coResidentCount: 1 },
    attachments: [],
  },
  {
    id: "住通台北B2T00006", name: "黃雅惠", phone: "0967-890-123", email: "huang@example.com",
    idNo: "F678901234", category: "弱勢", applied: true, address: "桃園市中壢區中央路6號",
    preferredRent: { min: 15000, max: 22000 }, preferredDistrict: "桃園市中壢區",
    preferredRoomType: "套房", preferredOccupants: 1,
    socialHousingApp: { tenantCode: "TT006", virtualCode: "VC006", otherGovSubsidy: true, coResidentCount: 0 },
    attachments: [],
  },
];

export const coResidents = [
  { name: "王小花", relation: "配偶", idNo: "A223456789" },
  { name: "王大寶", relation: "子女", idNo: "A323456789" },
];

export const landlords = [
  {
    id: "L001", name: "台灣房產有限公司", type: "法人", landlordType: "法人",
    phone: "02-1234-5678", email: "corp@example.com", bank: "台灣銀行", account: "123-456789-01",
    properties: ["P001", "P002"],
    companyName: "台灣房產有限公司", taxId: "12345678", representativeName: "陳建國",
  },
  {
    id: "L002", name: "周建國", type: "自然人", landlordType: "出租人",
    phone: "0912-111-222", email: "chou@example.com", bank: "合作金庫", account: "321-654321-09",
    properties: ["P003"],
  },
  {
    id: "L003", name: "大安建設股份有限公司", type: "法人", landlordType: "法人",
    phone: "02-8765-4321", email: "daan@example.com", bank: "第一銀行", account: "456-789012-34",
    properties: ["P004", "P005"],
    companyName: "大安建設股份有限公司", taxId: "87654321", representativeName: "王大明",
  },
  {
    id: "L004", name: "吳麗華", type: "自然人", landlordType: "出租人",
    phone: "0923-222-333", email: "wu@example.com", bank: "國泰世華", account: "654-321098-76",
    properties: ["P006"],
  },
];

export const properties = [
  {
    id: "P001", caseNo: "住通台北B2T00001", name: "中正一號",
    address: "台北市中正區忠孝東路1段1號3樓", district: "台北市中正區",
    size: 25.5, rent: 18000, status: "出租中", landlordId: "L001", landlordName: "台灣房產有限公司",
    applied: true, floor: 3, type: "套房",
    rentalType: "一般租案", agentName: "張業務",
    houseCondition: {
      parking: false,
      appliances: { ac: true, waterHeater: true, fridge: true, washer: false, gasStove: false, inductionCooker: true, internet: true, cableTV: false },
      socialCheck: { seaSand: false, radiation: false, fireExtinguisher: true, fireInspection: true },
    },
    socialHousingApp: { landlordCode: "LL001", virtualCode: "VC-P001" },
    attachments: [
      { id: "PA001-1", name: "建物謄本.pdf", fileType: "PDF" },
      { id: "PA001-2", name: "物件照片.jpg", fileType: "JPG" },
    ],
    delegationContracts: [
      { id: "DC001", type: "一般租案委託約", typeId: "general-delegation", status: "生效中", createdAt: "2024-01-02" },
    ],
  },
  {
    id: "P002", caseNo: "住通台北B2T00002", name: "中正二號",
    address: "台北市中正區忠孝東路1段3號5樓", district: "台北市中正區",
    size: 32.0, rent: 22000, status: "待出租", landlordId: "L001", landlordName: "台灣房產有限公司",
    applied: false, floor: 5, type: "一房一廳",
    rentalType: "一般租案", agentName: "李業務",
    houseCondition: {
      parking: false,
      appliances: { ac: true, waterHeater: true, fridge: false, washer: false, gasStove: true, inductionCooker: false, internet: true, cableTV: true },
      socialCheck: { seaSand: false, radiation: false, fireExtinguisher: true, fireInspection: false },
    },
    socialHousingApp: { landlordCode: "", virtualCode: "" },
    attachments: [],
    delegationContracts: [],
  },
  {
    id: "P003", caseNo: "住通台北B2T00003", name: "板橋好宅",
    address: "新北市板橋區文化路二段15號2樓", district: "新北市板橋區",
    size: 45.8, rent: 28000, status: "出租中", landlordId: "L002", landlordName: "周建國",
    applied: true, floor: 2, type: "兩房一廳",
    rentalType: "一般租案", agentName: "張業務",
    houseCondition: {
      parking: true,
      appliances: { ac: true, waterHeater: true, fridge: true, washer: true, gasStove: true, inductionCooker: false, internet: true, cableTV: true },
      socialCheck: { seaSand: false, radiation: false, fireExtinguisher: true, fireInspection: true },
    },
    socialHousingApp: { landlordCode: "LL002", virtualCode: "VC-P003" },
    attachments: [
      { id: "PA003-1", name: "建物謄本.pdf", fileType: "PDF" },
    ],
    delegationContracts: [
      { id: "DC002", type: "一般租案委託約", typeId: "general-delegation", status: "生效中", createdAt: "2024-03-01" },
    ],
  },
  {
    id: "P004", caseNo: "住通台北B2T00004", name: "大安精品",
    address: "台北市大安區信義路四段88號10樓", district: "台北市大安區",
    size: 58.3, rent: 45000, status: "出租中", landlordId: "L003", landlordName: "大安建設股份有限公司",
    applied: true, floor: 10, type: "三房兩廳",
    rentalType: "社宅包租案", agentName: "王業務",
    houseCondition: {
      parking: true,
      appliances: { ac: true, waterHeater: true, fridge: true, washer: true, gasStove: true, inductionCooker: false, internet: true, cableTV: true },
      socialCheck: { seaSand: false, radiation: false, fireExtinguisher: true, fireInspection: true },
    },
    socialHousingApp: { landlordCode: "LL003", virtualCode: "VC-P004" },
    attachments: [
      { id: "PA004-1", name: "社宅申請書.pdf", fileType: "PDF" },
      { id: "PA004-2", name: "建物謄本.pdf", fileType: "PDF" },
    ],
    delegationContracts: [
      { id: "DC003", type: "社宅包租", typeId: "social-lease", status: "生效中", createdAt: "2024-06-01" },
    ],
  },
  {
    id: "P005", caseNo: "住通台北B2T00005", name: "大安雅居",
    address: "台北市大安區敦化南路二段20號8樓", district: "台北市大安區",
    size: 38.6, rent: 35000, status: "待出租", landlordId: "L003", landlordName: "大安建設股份有限公司",
    applied: false, floor: 8, type: "兩房一廳",
    rentalType: "一般租案", agentName: "王業務",
    houseCondition: {
      parking: false,
      appliances: { ac: true, waterHeater: true, fridge: false, washer: false, gasStove: false, inductionCooker: true, internet: true, cableTV: false },
      socialCheck: { seaSand: false, radiation: false, fireExtinguisher: false, fireInspection: false },
    },
    socialHousingApp: { landlordCode: "", virtualCode: "" },
    attachments: [],
    delegationContracts: [],
  },
  {
    id: "P006", caseNo: "住通台北B2T00006", name: "內湖小築",
    address: "台北市內湖區民權東路六段108號4樓", district: "台北市內湖區",
    size: 28.2, rent: 20000, status: "出租中", landlordId: "L004", landlordName: "吳麗華",
    applied: true, floor: 4, type: "套房",
    rentalType: "一般租案", agentName: "李業務",
    houseCondition: {
      parking: false,
      appliances: { ac: true, waterHeater: true, fridge: true, washer: false, gasStove: false, inductionCooker: false, internet: true, cableTV: false },
      socialCheck: { seaSand: false, radiation: false, fireExtinguisher: true, fireInspection: true },
    },
    socialHousingApp: { landlordCode: "LL004", virtualCode: "VC-P006" },
    attachments: [
      { id: "PA006-1", name: "身分證影本.pdf", fileType: "PDF" },
    ],
    delegationContracts: [
      { id: "DC004", type: "一般租案委託約", typeId: "general-delegation", status: "生效中", createdAt: "2024-09-01" },
    ],
  },
];

export const contracts = [
  { id: "C001", caseNo: "住通台北B2M00001", name: "中正一號租賃契約", landlordId: "L001", landlordName: "台灣房產有限公司", tenantName: "王小明", propertyId: "P001", propertyName: "中正一號", type: "住宅租賃", startDate: "2024-01-01", endDate: "2025-12-31", rent: 18000, applied: true, status: "生效中" },
  { id: "C002", caseNo: "住通台北B2M00002", name: "板橋好宅租賃契約", landlordId: "L002", landlordName: "周建國", tenantName: "李美玲", propertyId: "P003", propertyName: "板橋好宅", type: "住宅租賃", startDate: "2024-03-01", endDate: "2025-02-28", rent: 28000, applied: true, status: "生效中" },
  { id: "C003", caseNo: "住通台北B2M00003", name: "大安精品租賃契約", landlordId: "L003", landlordName: "大安建設股份有限公司", tenantName: "張大華", propertyId: "P004", propertyName: "大安精品", type: "商業租賃", startDate: "2024-06-01", endDate: "2026-05-31", rent: 45000, applied: false, status: "生效中" },
  { id: "C004", caseNo: "住通台北B2M00004", name: "內湖小築租賃契約", landlordId: "L004", landlordName: "吳麗華", tenantName: "陳淑芬", propertyId: "P006", propertyName: "內湖小築", type: "住宅租賃", startDate: "2024-09-01", endDate: "2025-08-31", rent: 20000, applied: true, status: "生效中" },
  { id: "C005", caseNo: "住通台北B2M00005", name: "中正二號待簽契約", landlordId: "L001", landlordName: "台灣房產有限公司", tenantName: "林志豪", propertyId: "P002", propertyName: "中正二號", type: "住宅租賃", startDate: "2025-01-01", endDate: "2025-12-31", rent: 22000, applied: false, status: "草稿" },
];

export const activeRentals = [
  {
    id: "AR001",
    propertyId: "P001",
    landlordId: "L001",
    tenantId: "住通台北B2T00001",
    rentalType: "一般租案",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    depositMonths: 2,
    agentName: "張業務",
    socialHousingMatch: { applicationType: "代租", landlordCode: "LL001", tenantCode: "TT001" },
    contracts: [
      { id: "AC001", type: "住宅租賃契約書", typeId: "residential", version: "", status: "生效中", createdAt: "2024-01-05" },
    ],
    paymentRecords: [
      { id: "PR001", month: "2024-01", amount: 18000, paidAt: "2024-01-03", status: "已繳" },
      { id: "PR002", month: "2024-02", amount: 18000, paidAt: "2024-02-02", status: "已繳" },
      { id: "PR003", month: "2024-03", amount: 18000, paidAt: "2024-03-04", status: "已繳" },
      { id: "PR004", month: "2024-04", amount: 18000, paidAt: null, status: "未繳" },
    ],
    otherAttachments: [
      { id: "OA001", name: "交屋確認書.pdf", fileType: "PDF" },
    ],
    realPriceRegistration: { declarantName: "台灣房產有限公司", declarantId: "12345678", agentName: "張業務", agentId: "A987654321" },
  },
  {
    id: "AR002",
    propertyId: "P003",
    landlordId: "L002",
    tenantId: "住通台北B2T00002",
    rentalType: "一般租案",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    depositMonths: 1,
    agentName: "張業務",
    socialHousingMatch: { applicationType: "包租", landlordCode: "LL002", tenantCode: "TT002" },
    contracts: [
      { id: "AC002", type: "住宅租賃契約書", typeId: "residential", version: "", status: "生效中", createdAt: "2024-03-02" },
    ],
    paymentRecords: [
      { id: "PR005", month: "2024-03", amount: 28000, paidAt: "2024-03-01", status: "已繳" },
      { id: "PR006", month: "2024-04", amount: 28000, paidAt: "2024-04-02", status: "已繳" },
    ],
    otherAttachments: [],
    realPriceRegistration: { declarantName: "周建國", declarantId: "L123456789", agentName: "張業務", agentId: "A987654321" },
  },
];
