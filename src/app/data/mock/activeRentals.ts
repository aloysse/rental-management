export const activeRentals = [
  {
    id: "AR001",
    propertyId: "P001",
    landlordId: "L001",
    tenantId: "TT001",
    rentalType: "一般租案",
    startDate: "2024-01-01",
    endDate: "2026-05-03",  // 即將到期（距今 44 天）
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
      { id: "PR004", month: "2026-03", amount: 18000, paidAt: null, status: "未繳" },
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
    tenantId: "TT002",
    rentalType: "一般租案",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    terminatedAt: "2025-02-28",  // 不續約已結束
    terminationReason: "承租人不續約",
    depositMonths: 1,
    agentName: "張業務",
    socialHousingMatch: { applicationType: "包租", landlordCode: "LL002", tenantCode: "TT002" },
    contracts: [
      { id: "AC002", type: "住宅租賃契約書", typeId: "residential", version: "", status: "已終止", createdAt: "2024-03-02" },
    ],
    paymentRecords: [
      { id: "PR005", month: "2024-03", amount: 28000, paidAt: "2024-03-01", status: "已繳" },
      { id: "PR006", month: "2024-04", amount: 28000, paidAt: "2024-04-02", status: "已繳" },
    ],
    otherAttachments: [],
    realPriceRegistration: { declarantName: "周建國", declarantId: "L123456789", agentName: "張業務", agentId: "A987654321" },
  },
  {
    id: "AR003",
    propertyId: "P004",
    landlordId: "L003",
    tenantId: "TT003",
    rentalType: "社宅包租案",
    startDate: "2024-06-01",
    endDate: "2026-05-31",  // 進行中（距今 72 天）
    depositMonths: 2,
    agentName: "王業務",
    socialHousingMatch: { applicationType: "包租", landlordCode: "LL003", tenantCode: "TT003" },
    contracts: [
      { id: "AC003", type: "住宅租賃契約書", typeId: "residential", status: "生效中", createdAt: "2024-06-05" },
    ],
    paymentRecords: [
      { id: "PR007", month: "2024-06", amount: 45000, paidAt: "2024-06-03", status: "已繳" },
      { id: "PR008", month: "2024-07", amount: 45000, paidAt: "2024-07-02", status: "已繳" },
      { id: "PR009", month: "2024-08", amount: 45000, paidAt: "2024-08-01", status: "已繳" },
    ],
    otherAttachments: [{ id: "OA002", name: "交屋確認書.pdf", fileType: "PDF" }],
    realPriceRegistration: { declarantName: "大安建設股份有限公司", declarantId: "87654321", agentName: "王業務", agentId: "A111111111" },
  },
  {
    id: "AR004",
    propertyId: "P006",
    landlordId: "L004",
    tenantId: "TT004",
    rentalType: "一般租案",
    startDate: "2024-09-01",
    endDate: "2026-08-31",  // 進行中
    depositMonths: 2,
    agentName: "李業務",
    socialHousingMatch: { applicationType: "代租", landlordCode: "LL004", tenantCode: "TT004" },
    contracts: [
      { id: "AC004", type: "住宅租賃契約書", typeId: "residential", status: "生效中", createdAt: "2024-09-03" },
    ],
    paymentRecords: [
      { id: "PR010", month: "2024-09", amount: 20000, paidAt: "2024-09-02", status: "已繳" },
      { id: "PR011", month: "2024-10", amount: 20000, paidAt: "2024-10-03", status: "已繳" },
      { id: "PR012", month: "2024-11", amount: 20000, paidAt: "2024-11-01", status: "已繳" },
    ],
    otherAttachments: [],
    realPriceRegistration: { declarantName: "吳麗華", declarantId: "L987654321", agentName: "李業務", agentId: "A222222222" },
  },
  {
    id: "AR005",
    propertyId: "P005",
    landlordId: "L003",
    tenantId: "TT005",
    rentalType: "一般租案",
    startDate: "2025-02-01",
    endDate: "2026-01-31",  // 已到期（距今 -49 天），尚未處理
    depositMonths: 2,
    agentName: "王業務",
    socialHousingMatch: { applicationType: "代租", landlordCode: "LL003", tenantCode: "TT005" },
    contracts: [
      { id: "AC005", type: "住宅租賃契約書", typeId: "residential", status: "生效中", createdAt: "2025-02-03" },
    ],
    paymentRecords: [
      { id: "PR013", month: "2025-02", amount: 35000, paidAt: "2025-02-03", status: "已繳" },
      { id: "PR014", month: "2025-03", amount: 35000, paidAt: "2025-03-02", status: "已繳" },
      { id: "PR015", month: "2025-12", amount: 35000, paidAt: "2025-12-01", status: "已繳" },
    ],
    otherAttachments: [],
    realPriceRegistration: { declarantName: "大安建設股份有限公司", declarantId: "87654321", agentName: "王業務", agentId: "A111111111" },
  },
];
