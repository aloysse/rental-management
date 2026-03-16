import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, ChevronRight, Filter } from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { properties } from "../../data/mockData";
import { StatusBadge, UpgradeTag } from "../../components/WireframeTag";

export function PropertyList() {
  const { isUpgrade } = useVersion();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = properties.filter((p) => {
    const matchSearch = p.name.includes(search) || p.address.includes(search) || p.landlordName.includes(search);
    const matchStatus = statusFilter === "全部" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-800 text-lg">物件管理</h1>
          <p className="text-xs text-gray-400 mt-0.5">共 {filtered.length} 筆資料</p>
        </div>
        <button
          onClick={() => navigate("/properties/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} />
          新增物件
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              placeholder="搜尋案名、地址、出租人..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className={`flex items-center gap-2 px-3 py-2 border text-sm rounded transition-colors ${showFilter ? "border-gray-800 bg-gray-800 text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={14} />
            篩選條件
          </button>
          <button className="px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50">搜尋</button>
          <button className="px-3 py-2 text-xs text-gray-400 hover:text-gray-600" onClick={() => { setSearch(""); setStatusFilter("全部"); }}>清除</button>
        </div>

        {showFilter && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">狀態</label>
              <div className="flex gap-1.5 flex-wrap">
                {["全部", "出租中", "待出租"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 text-xs rounded border transition-colors ${statusFilter === s ? "border-gray-800 bg-gray-800 text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">房型</label>
              <select className="border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-600 focus:outline-none">
                <option>全部房型</option>
                <option>套房</option>
                <option>一房一廳</option>
                <option>兩房一廳</option>
                <option>三房兩廳</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">租金範圍</label>
              <div className="flex items-center gap-2">
                <input className="border border-gray-300 rounded px-2 py-1.5 text-xs w-full focus:outline-none" placeholder="最低" readOnly />
                <span className="text-xs text-gray-400">–</span>
                <input className="border border-gray-300 rounded px-2 py-1.5 text-xs w-full focus:outline-none" placeholder="最高" readOnly />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">出租人</label>
              <select className="border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-600 focus:outline-none">
                <option>全部出租人</option>
                <option>台灣房產有限公司</option>
                <option>周建國</option>
                <option>大安建設股份有限公司</option>
                <option>吳麗華</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {isUpgrade && (
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium whitespace-nowrap">
                  <span className="flex items-center gap-1">物件編號 <UpgradeTag /></span>
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">案名</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">地址</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">坪數</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">租金</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">出租人</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">狀態</th>
              {isUpgrade && (
                <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium whitespace-nowrap">
                  <span className="flex items-center gap-1">申請狀態 <UpgradeTag /></span>
                </th>
              )}
              <th className="px-4 py-3 text-right text-xs text-gray-500 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((property) => (
              <tr
                key={property.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/properties/${property.id}`)}
              >
                {isUpgrade && (
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{property.caseNo}</td>
                )}
                <td className="px-4 py-3">
                  <span className="text-gray-800">{property.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{property.address}</td>
                <td className="px-4 py-3 text-gray-600">{property.size} 坪</td>
                <td className="px-4 py-3 text-gray-600">NT$ {property.rent.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{property.landlordName}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={property.status} />
                </td>
                {isUpgrade && (
                  <td className="px-4 py-3">
                    <StatusBadge status={property.applied ? "通過" : "未通過"} />
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
          <div className="py-16 text-center text-gray-400 text-sm">查無符合條件的物件</div>
        )}

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
