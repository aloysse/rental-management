# Rental Management System Wireframe

## 專案概述

這是一個租屋管理系統的 **Wireframe Prototype**，目的是快速完成 UI 框架與流程驗證。

## 設計原則

- **灰階為主**：所有基礎 UI 元素使用灰階配色
- **顏色使用時機**：僅在特殊狀態（如錯誤、警告、成功）或重要區塊使用顏色強調
- **快速原型**：優先完成功能框架，不追求視覺精緻度

## Mock Data 規則

- 所有資料皆為 mock data，存放於 `src/app/data/mockData.ts`
- **重要**：當修改設計導致欄位增減時，必須同步更新 mock data
- Mock data 應保持合理的範例資料，便於展示各種狀態

## 技術棧

- **框架**: React 18 + TypeScript
- **建置工具**: Vite
- **樣式**: Tailwind CSS 4
- **UI 元件**: shadcn/ui (Radix UI)
- **路由**: React Router 7
- **圖標**: Lucide React

## 專案結構

```
src/
├── app/
│   ├── components/     # 共用元件
│   │   ├── ui/         # shadcn/ui 基礎元件
│   │   └── Layout.tsx  # 版面配置
│   ├── context/        # React Context
│   ├── data/           # Mock 資料
│   │   └── mockData.ts
│   ├── pages/          # 頁面元件
│   │   ├── contracts/  # 合約管理
│   │   ├── landlords/  # 房東管理
│   │   ├── properties/ # 物件管理
│   │   └── tenants/    # 租客管理
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
3. 使用 shadcn/ui 元件保持一致性
4. 避免過度設計，保持 wireframe 簡潔風格
