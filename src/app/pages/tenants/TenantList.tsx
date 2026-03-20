import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, ChevronRight } from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { tenants } from "../../data/mockData";
import { StatusBadge, UpgradeTag } from "../../components/WireframeTag";

export function TenantList() {
  const { isUpgrade } = useVersion();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = tenants.filter((t) =>
    t.name.includes(search) || t.phone.includes(search) || t.email.includes(search)
  );

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-800 text-lg">承租人管理</h1>
          <p className="text-xs text-gray-400 mt-0.5">共 {filtered.length} 筆資料</p>
        </div>
        <button
          onClick={() => navigate("/tenants/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} />
          新增承租人
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              placeholder="搜尋姓名、電話、Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50">
            搜尋
          </button>
          <button
            className="px-3 py-2 text-xs text-gray-400 hover:text-gray-600"
            onClick={() => setSearch("")}
          >
            清除
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {isUpgrade && (
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium whitespace-nowrap">
                  <span className="flex items-center gap-1">編號 <UpgradeTag /></span>
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">姓名</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">電話</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">Email</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">承租狀態</th>
              {isUpgrade && (
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium whitespace-nowrap">
                  <span className="flex items-center gap-1">身份類別 <UpgradeTag /></span>
                </th>
              )}
              {isUpgrade && (
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium whitespace-nowrap">
                  <span className="flex items-center gap-1">社宅申請 <UpgradeTag /></span>
                </th>
              )}
              <th className="px-4 py-3 text-right text-xs text-gray-500 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((tenant) => (
              <tr
                key={tenant.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/tenants/${tenant.id}`)}
              >
                {isUpgrade && (
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{tenant.socialHousingApp.tenantCode}</td>
                )}
                <td className="px-4 py-3">
                  <span className="text-gray-800">{tenant.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{tenant.phone}</td>
                <td className="px-4 py-3 text-gray-500">{tenant.email}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={tenant.rentalStatus} />
                </td>
                {isUpgrade && (
                  <td className="px-4 py-3">
                    <StatusBadge status={tenant.category} />
                  </td>
                )}
                {isUpgrade && (
                  <td className="px-4 py-3">
                    <StatusBadge status={tenant.applied} />
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  <ChevronRight size={14} className="text-gray-400 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-sm">
            查無符合條件的承租人
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400">顯示 1–{filtered.length} 筆，共 {filtered.length} 筆</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-500 bg-white">上一頁</button>
            <button className="px-3 py-1 text-xs border border-gray-800 rounded bg-gray-800 text-white">1</button>
            <button className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-500 bg-white">下一頁</button>
          </div>
        </div>
      </div>
    </div>
  );
}
