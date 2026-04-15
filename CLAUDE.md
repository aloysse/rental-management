# Rental Management System Wireframe

## 專案概述

這是一個租屋管理系統的 **Wireframe Prototype**，目的是快速完成 UI 與流程驗證。

## 設計原則

- **使用 figma 設計稿**：按照 figma 設計稿來切版
- **設計為元件**：將所有元素設計為元件，直接引用
- **使用 react-icons 套件**：所有設計稿的 icon 使用 react-icons 套件

## Mock Data 規則

- 所有資料皆為 mock data，存放於 `src/app/data/mockData.ts`
- **重要**：當修改設計導致欄位增減時，必須同步更新 mock data
- Mock data 應保持合理的範例資料，便於展示各種狀態

## 技術棧

- **框架**: React 18 + TypeScript
- **建置工具**: Vite
- **樣式**: Tailwind CSS 4
- **UI 元件**: Material UI
- **路由**: React Router 7
- **圖標**: react-icons

## 專案結構

```
src/
├── app/
│   ├── components/     # 共用元件
│   │   ├── ui/         # Material UI 基礎元件
│   │   └── Layout.tsx  # 版面配置
│   ├── context/        # React Context
│   ├── data/           # Mock 資料
│   │   └── mockData.ts
│   ├── pages/          # 頁面元件
│   │   ├── host/  # 業者資料
│   │   ├── landlords/  # 出租人管理
│   │   ├── properties/ # 委託出租物件
│   │   ├── active-rentals/ # 出租中物件
│   │   └── tenants/    # 承租人管理
│   ├── App.tsx
│   └── routes.tsx      # 路由設定
├── styles/             # 全域樣式
└── main.tsx           # 進入點
```

## 開發指令

```bash
npm run dev    # 啟動開發伺服器
npm run build  # 建置專案
```

## 注意事項

1. 新增頁面時需同步更新 `routes.tsx`
2. 新增資料欄位時需同步更新 `mockData.ts`
3. 使用 Material UI 元件保持一致性
4. 依據指令完成區塊，不要一次完成所有 figma 設計稿的所有內容
