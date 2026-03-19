# 租屋管理系統 Wireframe — 架構說明

## 技術棧

| 項目 | 版本 / 套件 |
|------|-------------|
| 框架 | React 18 + TypeScript |
| 建置工具 | Vite |
| 樣式 | Tailwind CSS 4 |
| UI 元件 | shadcn/ui (Radix UI) |
| 路由 | React Router 7 |
| 圖標 | Lucide React |

---

## 版本切換機制

`src/app/context/VersionContext.tsx` 提供 `useVersion()` hook，回傳 `{ isUpgrade: boolean }`。
Layout 右上角有版本切換按鈕（一般版 / 升級版），切換後 `isUpgrade` 全域變更，升級版專屬功能才會顯示。

**升級版才顯示的功能：**
- 委託出租物件：「社宅申請」頁籤、租案類型的社宅選項、委託契約的社宅類型
- 承租人：「社宅申請」頁籤
- 出租中物件：「社宅媒合申請」頁籤、租案類型的社宅選項、契約的社宅類型
- 列表頁的「物件編號」欄（UpgradeTag 標記）

---

## 路由架構

```
/                          → redirect to /properties
/properties                → 委託出租物件清單
/properties/:id            → 委託出租物件詳細
/landlords                 → 出租人清單
/landlords/:id             → 出租人詳細
/tenants                   → 承租人清單
/tenants/:id               → 承租人詳細
/active-rentals            → 出租中物件清單
/active-rentals/:id        → 出租中物件詳細
```

檔案：`src/app/routes.tsx`

---

## 模組架構

### 1. 委託出租物件 `/properties`

**清單頁** (`PropertyList.tsx`)：搜尋、篩選（狀態/房型/租金/出租人）、表格列表（案名、地址、坪數、租金、出租人、狀態）。

**詳細頁** (`PropertyDetail.tsx`)：7 個頁籤

| 頁籤 | 版本 | 說明 |
|------|------|------|
| 物件資訊 | 一般 | 租案類型（一般租案；**升級：社宅包租案、社宅代租案**）、建物基本資訊、租金、負責營業員、591 拋轉按鈕 |
| 出租人資訊 | 一般 | 空白狀態→新增/選擇已建立屋主資料；選擇後顯示出租人表單；右上「更改出租人」按鈕 |
| 屋況 | 一般 | 車位、家電勾選；**升級：社宅檢測（海砂屋/輻射屋/滅火器/消防安全檢查）** |
| 社宅申請 | **升級** | 出租人編號、虛擬碼、下載申請書按鈕 |
| 委託契約 | 一般 | 契約清單，新增→類別選取（`DelegationContractModal`）→步驟式編輯彈窗 |
| 附加檔案 | 一般 | 附件清單 + 上傳 |
| 承租人配對 | 一般 | 依租金/地區配對承租人清單；查看承租人（彈窗）；配對轉出租（Alert → 跳轉出租中物件） |

**委託契約類型清單（`DelegationContractModal`）：**
- 一般版：一般租案委託約
- 升級版額外：社宅委託租賃、社宅包租、社宅委託管理

---

### 2. 出租人 `/landlords`

**清單頁** (`LandlordList.tsx`)：搜尋、身份類型篩選、表格列表。

**詳細頁** (`LandlordDetail.tsx`)：現有頁籤 + 出租人/法人切換

| 頁籤 | 說明 |
|------|------|
| 基本資料 | 頂部 RadioGroup 切換「出租人 / 法人」，動態顯示對應欄位；固定顯示銀行帳戶資料 |
| 名下物件 | 出租人名下的委託出租物件清單 |

**出租人欄位：** 姓名、身分證、性別、生日、手機、電話（日/夜）、Email、戶籍地址、聯絡地址

**法人欄位：** 公司名稱、統一編號、代表人姓名、代表人身分證字號、聯絡電話、Email、公司地址、聯絡地址

---

### 3. 承租人 `/tenants`

**清單頁** (`TenantList.tsx`)：搜尋、類別篩選（一般/弱勢）、表格列表。

**詳細頁** (`TenantDetail.tsx`)：4 個頁籤

| 頁籤 | 版本 | 說明 |
|------|------|------|
| 承租人資訊 | 一般 | 基本資訊（姓名/身分證/電話/Email/地址）、承租期望條件（租金範圍/地區/房型/人數）、承租中案件（連結至對應出租中物件） |
| 社宅申請 | **升級** | 承租人編號、虛擬碼、是否為其他政府補助戶、同住人數、下載申請書按鈕 |
| 附加檔案 | 一般 | 附件清單 + 上傳 |
| 配對案件 | 一般 | 依期望租金/地區配對委託出租物件清單；查看物件（彈窗）；配對轉出租（Alert → 跳轉出租中物件） |

---

### 4. 出租中物件 `/active-rentals`

**清單頁** (`ActiveRentalList.tsx`)：JOIN properties/landlords/tenants 顯示案件列表（物件名稱、地址、出租人、承租人、租期、狀態）。

**詳細頁** (`ActiveRentalDetail.tsx`)：9 個頁籤

| 頁籤 | 版本 | 說明 |
|------|------|------|
| 物件資訊 | 一般 | 租案類型（一般租案；**升級：社宅包租案、社宅代租案**）、建物基本資訊、租賃期間、押金、負責營業員 |
| 出租人資訊 | 一般 | 來源：activeRental.landlordId → landlords（唯讀展示） |
| 屋況 | 一般 | 來源：property.houseCondition（唯讀展示） |
| 承租人資訊 | 一般 | 來源：activeRental.tenantId → tenants，可編輯表單 |
| 社宅媒合申請 | **升級** | 申請類型（包租/代租）、出租人編號、承租人編號、同步申請欄位按鈕 |
| 契約文件 | 一般 | 契約清單，新增→`ContractTypeModal`→步驟式編輯彈窗（下載 PDF / 儲存並關閉） |
| 繳費紀錄 | 一般 | 表格：期別、月份、金額、繳費日期、狀態（已繳/未繳） |
| 附加檔案 | 一般 | 三子區塊：承租人附加（來源 tenants，唯讀）、委託物件附加（來源 properties，唯讀）、其他附加（可新增） |
| 實價登錄登記 | 一般 | 申報人基本資料、申報代理人基本資料、下載 JSON 按鈕 |

**契約類型清單（`ContractTypeModal`）：**

一般租賃類型（灰色）：
- 住宅租賃契約書
- 車位租約

升級版租賃類型（amber，升級才顯示）：
- 社會住宅租賃契約書
- 社宅代租代管－委託租賃契約書
- 社會住宅－包租契約書

委託用類型（灰色 + 藍色「委託用」badge）：
- 一般租案委託約

升級版委託用類型（amber + 藍色「委託用」badge，升級才顯示）：
- 社宅委託租賃
- 社宅包租
- 社宅委託管理

---

## 資料架構 (`src/app/data/mockData.ts`)

四個主要資料表，以 ID 欄位模擬資料庫主從關係。

### tenants（承租人）

```ts
{
  id: string               // 住通台北B2T00001
  name: string
  phone: string
  email: string
  idNo: string
  category: "一般" | "弱勢"
  applied: boolean
  address: string
  preferredRent: { min: number; max: number }
  preferredDistrict: string
  preferredRoomType: string
  preferredOccupants: number
  socialHousingApp: {
    tenantCode: string; virtualCode: string
    otherGovSubsidy: boolean; coResidentCount: number
  }
  attachments: Array<{ id: string; name: string; fileType: string }>
}
```

### landlords（出租人）

```ts
{
  id: string               // L001
  name: string
  type: "法人" | "自然人"
  landlordType: "出租人" | "法人"
  phone: string
  email: string
  bank: string
  account: string
  properties: string[]     // FK → properties.id[]
  // 法人專用
  companyName?: string
  taxId?: string
  representativeName?: string
}
```

### properties（委託出租物件）

```ts
{
  id: string               // P001
  caseNo: string
  name: string
  address: string
  district: string
  size: number
  rent: number
  status: "出租中" | "待出租"
  landlordId: string       // FK → landlords.id
  landlordName: string
  applied: boolean
  floor: number
  type: string             // 套房 / 一房一廳 / ...
  rentalType: "一般租案" | "社宅包租案" | "社宅代租案"
  agentName: string
  houseCondition: {
    parking: boolean
    appliances: { ac; waterHeater; fridge; washer; gasStove; inductionCooker; internet; cableTV: boolean }
    socialCheck: { seaSand; radiation; fireExtinguisher; fireInspection: boolean }
  }
  socialHousingApp: { landlordCode: string; virtualCode: string }
  attachments: Array<{ id: string; name: string; fileType: string }>
  delegationContracts: Array<{
    id: string; type: string; typeId: string; status: string; createdAt: string
  }>
}
```

### activeRentals（出租中物件）

```ts
{
  id: string               // AR001
  propertyId: string       // FK → properties.id
  landlordId: string       // FK → landlords.id
  tenantId: string         // FK → tenants.id
  rentalType: "一般租案" | "社宅包租案" | "社宅代租案"
  startDate: string
  endDate: string
  depositMonths: number
  agentName: string
  socialHousingMatch: {
    applicationType: "包租" | "代租"
    landlordCode: string
    tenantCode: string
  }
  contracts: Array<{
    id: string; type: string; typeId: string; version: string; status: string; createdAt: string
  }>
  paymentRecords: Array<{
    id: string; month: string; amount: number; paidAt: string | null; status: "已繳" | "未繳"
  }>
  otherAttachments: Array<{ id: string; name: string; fileType: string }>
  realPriceRegistration: {
    declarantName: string; declarantId: string; agentName: string; agentId: string
  }
}
```

**資料關係：**
- `properties.landlordId` → `landlords.id`
- `activeRentals.propertyId` → `properties.id`
- `activeRentals.landlordId` → `landlords.id`
- `activeRentals.tenantId` → `tenants.id`

---

## 共用元件 (`src/app/components/WireframeTag.tsx`)

| 元件 | 說明 |
|------|------|
| `UpgradeTag` | 升級版 icon badge（amber） |
| `UpgradeSection` | 升級版功能區塊（amber 框線） |
| `StatusBadge` | 狀態標籤，支援：出租中/待出租/生效中/草稿/通過/未通過/申請中/弱勢/一般/自然人/法人/住宅租賃/商業租賃/一般租案/社宅包租案/社宅代租案/已繳/未繳/未申請 |
| `RadioGroup` | 單選按鈕群組 |
| `SectionDivider` | 虛線分隔線 |
| `FileUploadButton` | 上傳檔案按鈕 |
| `CheckItem` | 勾選項目（含可選說明文字） |
| `FileAttachmentList` | 附件清單（含下載/刪除按鈕） |
| `FormField` | 表單欄位（支援 text/textarea/select type） |
| `ImageUploadBox` | 圖片上傳佔位框 |

---

## 設計原則

- **灰階為主**：所有基礎 UI 元素使用灰階配色
- **顏色使用時機**：升級版 amber、錯誤 red、成功 green、委託用 blue
- **頁籤制**：所有詳細頁一律使用頁籤架構，不使用流程式
- **Mock Data**：欄位增減時同步更新 `mockData.ts`
