import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronRight, Filter, Plus } from "lucide-react";
import { activeRentals, properties, landlords, tenants } from "../../data/mockData";
import { StatusBadge, UpgradeTag, BrandButton, FilterButton, BrandCard } from "../../components/WireframeTag";
import { getLeaseStatus, getDaysUntilExpiry } from "./leaseUtils";

export function ActiveRentalList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("全部");
  const [leaseFilter, setLeaseFilter] = useState("全部");
  const [showFilter, setShowFilter] = useState(false);

  // Join data from related tables
  const rentalRows = activeRentals.map((ar) => {
    const property = properties.find((p) => p.id === ar.propertyId);
    const landlord = landlords.find((l) => l.id === ar.landlordId);
    const tenant = tenants.find((t) => t.id === ar.tenantId);
    const leaseStatus = getLeaseStatus(ar);
    const daysLeft = getDaysUntilExpiry(ar.endDate);
    return { ...ar, property, landlord, tenant, leaseStatus, daysLeft };
  });

  const filtered = rentalRows.filter((row) => {
    const matchSearch =
      row.property?.name?.includes(search) ||
      row.property?.address?.includes(search) ||
      row.landlord?.name?.includes(search) ||
      row.tenant?.name?.includes(search);
    const matchType = typeFilter === "全部" || row.rentalType === typeFilter;
    const matchLease = leaseFilter === "全部" || row.leaseStatus === leaseFilter;
    return matchSearch && matchType && matchLease;
  });

  function ExpiryBadge({ row }: { row: typeof rentalRows[0] }) {
    if (row.leaseStatus === "已結束") {
      return <StatusBadge status="已結束" />;
    }
    if (row.leaseStatus === "已到期") {
      return <StatusBadge status="已到期" />;
    }
    if (row.leaseStatus === "即將到期") {
      return (
        <span className="inline-flex px-2 py-0.5 text-xs rounded border bg-yellow-100 text-yellow-700 border-yellow-300">
          剩 {row.daysLeft} 天
        </span>
      );
    }
    return <span className="text-xs text-gray-500">{row.daysLeft} 天</span>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-800 text-lg">出租中物件</h1>
          <p className="text-xs text-gray-400 mt-0.5">共 {filtered.length} 筆資料</p>
        </div>
        <BrandButton onClick={() => navigate("/active-rentals/new")} icon={<Plus size={15} />}>
          新增出租中物件
        </BrandButton>
      </div>

      {/* Search & Filter */}
      <BrandCard className="p-4 mb-4">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-brand-border"
              placeholder="搜尋物件名稱、地址、出租人、承租人..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FilterButton active={showFilter} onClick={() => setShowFilter(!showFilter)}>
            <Filter size={14} />篩選
          </FilterButton>
          <BrandButton size="sm">搜尋</BrandButton>
          <button className="px-3 py-2 text-xs text-gray-400 hover:text-gray-600" onClick={() => { setSearch(""); setTypeFilter("全部"); setLeaseFilter("全部"); }}>清除</button>
        </div>

        {showFilter && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex gap-8">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">租案類型</label>
              <div className="flex gap-1.5">
                {["全部", "一般租案", "社宅包租案", "社宅代租案"].map((t) => (
                  <FilterButton key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
                    {t}
                  </FilterButton>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">租約狀態</label>
              <div className="flex gap-1.5">
                {["全部", "進行中", "即將到期", "已到期", "已結束"].map((t) => (
                  <FilterButton key={t} active={leaseFilter === t} onClick={() => setLeaseFilter(t)}>
                    {t}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        )}
      </BrandCard>

      {/* Table */}
      <BrandCard className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium whitespace-nowrap">
                  <span className="flex items-center gap-1">案號 <UpgradeTag /></span>
                </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">物件名稱</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">地址</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">出租人</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">承租人</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">租賃期間</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">剩餘天數</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">租案類型</th>
              <th className="px-4 py-3 text-right text-xs text-gray-500 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/active-rentals/${row.id}`)}
              >
                <td className="px-4 py-3 text-gray-500 text-xs font-mono">{row.id}</td>
                <td className="px-4 py-3">
                  <span className="text-gray-800">{row.property?.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{row.property?.address}</td>
                <td className="px-4 py-3 text-gray-500">{row.landlord?.name}</td>
                <td className="px-4 py-3 text-gray-500">{row.tenant?.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {row.startDate} ~ {row.endDate}
                </td>
                <td className="px-4 py-3">
                  <ExpiryBadge row={row} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.rentalType} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ChevronRight size={14} className="text-gray-400 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-sm">查無符合條件的出租中物件</div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400">顯示 1–{filtered.length} 筆，共 {filtered.length} 筆</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-500 bg-white">上一頁</button>
            <button className="px-3 py-1 text-xs border border-brand rounded bg-brand text-white">1</button>
            <button className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-500 bg-white">下一頁</button>
          </div>
        </div>
      </BrandCard>
    </div>
  );
}
