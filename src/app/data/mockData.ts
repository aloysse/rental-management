export const tenants = [
  { id: "住通台北B2T00001", name: "王小明", phone: "0912-345-678", email: "wang@example.com", idNo: "A123456789", category: "一般", applied: true, address: "台北市中正區中山路1號" },
  { id: "住通台北B2T00002", name: "李美玲", phone: "0923-456-789", email: "li@example.com", idNo: "B234567890", category: "弱勢", applied: true, address: "新北市板橋區文化路2號" },
  { id: "住通台北B2T00003", name: "張大華", phone: "0934-567-890", email: "zhang@example.com", idNo: "C345678901", category: "一般", applied: false, address: "台中市西屯區台灣大道3號" },
  { id: "住通台北B2T00004", name: "陳淑芬", phone: "0945-678-901", email: "chen@example.com", idNo: "D456789012", category: "弱勢", applied: true, address: "高雄市苓雅區四維路4號" },
  { id: "住通台北B2T00005", name: "林志豪", phone: "0956-789-012", email: "lin@example.com", idNo: "E567890123", category: "一般", applied: false, address: "台南市東區長榮路5號" },
  { id: "住通台北B2T00006", name: "黃雅惠", phone: "0967-890-123", email: "huang@example.com", idNo: "F678901234", category: "弱勢", applied: true, address: "桃園市中壢區中央路6號" },
];

export const coResidents = [
  { name: "王小花", relation: "配偶", idNo: "A223456789" },
  { name: "王大寶", relation: "子女", idNo: "A323456789" },
];

export const landlords = [
  { id: "L001", name: "台灣房產有限公司", type: "法人", phone: "02-1234-5678", email: "corp@example.com", bank: "台灣銀行", account: "123-456789-01", properties: ["P001", "P002"] },
  { id: "L002", name: "周建國", type: "自然人", phone: "0912-111-222", email: "chou@example.com", bank: "合作金庫", account: "321-654321-09", properties: ["P003"] },
  { id: "L003", name: "大安建設股份有限公司", type: "法人", phone: "02-8765-4321", email: "daan@example.com", bank: "第一銀行", account: "456-789012-34", properties: ["P004", "P005"] },
  { id: "L004", name: "吳麗華", type: "自然人", phone: "0923-222-333", email: "wu@example.com", bank: "國泰世華", account: "654-321098-76", properties: ["P006"] },
];

export const properties = [
  { id: "P001", caseNo: "住通台北B2T00001", name: "中正一號", address: "台北市中正區忠孝東路1段1號3樓", size: 25.5, rent: 18000, status: "出租中", landlordId: "L001", landlordName: "台灣房產有限公司", applied: true, floor: 3, type: "套房" },
  { id: "P002", caseNo: "住通台北B2T00002", name: "中正二號", address: "台北市中正區忠孝東路1段3號5樓", size: 32.0, rent: 22000, status: "待出租", landlordId: "L001", landlordName: "台灣房產有限公司", applied: false, floor: 5, type: "一房一廳" },
  { id: "P003", caseNo: "住通台北B2T00003", name: "板橋好宅", address: "新北市板橋區文化路二段15號2樓", size: 45.8, rent: 28000, status: "出租中", landlordId: "L002", landlordName: "周建國", applied: true, floor: 2, type: "兩房一廳" },
  { id: "P004", caseNo: "住通台北B2T00004", name: "大安精品", address: "台北市大安區信義路四段88號10樓", size: 58.3, rent: 45000, status: "出租中", landlordId: "L003", landlordName: "大安建設股份有限公司", applied: true, floor: 10, type: "三房兩廳" },
  { id: "P005", caseNo: "住通台北B2T00005", name: "大安雅居", address: "台北市大安區敦化南路二段20號8樓", size: 38.6, rent: 35000, status: "待出租", landlordId: "L003", landlordName: "大安建設股份有限公司", applied: false, floor: 8, type: "兩房一廳" },
  { id: "P006", caseNo: "住通台北B2T00006", name: "內湖小築", address: "台北市內湖區民權東路六段108號4樓", size: 28.2, rent: 20000, status: "出租中", landlordId: "L004", landlordName: "吳麗華", applied: true, floor: 4, type: "套房" },
];

export const contracts = [
  { id: "C001", caseNo: "住通台北B2M00001", name: "中正一號租賃契約", landlordId: "L001", landlordName: "台灣房產有限公司", tenantName: "王小明", propertyId: "P001", propertyName: "中正一號", type: "住宅租賃", startDate: "2024-01-01", endDate: "2025-12-31", rent: 18000, applied: true, status: "生效中" },
  { id: "C002", caseNo: "住通台北B2M00002", name: "板橋好宅租賃契約", landlordId: "L002", landlordName: "周建國", tenantName: "李美玲", propertyId: "P003", propertyName: "板橋好宅", type: "住宅租賃", startDate: "2024-03-01", endDate: "2025-02-28", rent: 28000, applied: true, status: "生效中" },
  { id: "C003", caseNo: "住通台北B2M00003", name: "大安精品租賃契約", landlordId: "L003", landlordName: "大安建設股份有限公司", tenantName: "張大華", propertyId: "P004", propertyName: "大安精品", type: "商業租賃", startDate: "2024-06-01", endDate: "2026-05-31", rent: 45000, applied: false, status: "生效中" },
  { id: "C004", caseNo: "住通台北B2M00004", name: "內湖小築租賃契約", landlordId: "L004", landlordName: "吳麗華", tenantName: "陳淑芬", propertyId: "P006", propertyName: "內湖小築", type: "住宅租賃", startDate: "2024-09-01", endDate: "2025-08-31", rent: 20000, applied: true, status: "生效中" },
  { id: "C005", caseNo: "住通台北B2M00005", name: "中正二號待簽契約", landlordId: "L001", landlordName: "台灣房產有限公司", tenantName: "林志豪", propertyId: "P002", propertyName: "中正二號", type: "住宅租賃", startDate: "2025-01-01", endDate: "2025-12-31", rent: 22000, applied: false, status: "草稿" },
];
