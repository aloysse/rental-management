import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, ChevronRight, Filter, X, FileText, Zap } from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { contracts } from "../../data/mockData";
import { StatusBadge, UpgradeTag } from "../../components/WireframeTag";

const BASE_CONTRACT_TYPES = [
  { id: "residential", label: "一般住宅租賃契約書", desc: "一般住宅出租使用" },
  { id: "office", label: "辦公室租約", desc: "辦公室、工作室等商業用途" },
  { id: "parking", label: "車位租約", desc: "停車位、車庫租賃" },
  { id: "sublease", label: "包租約", desc: "整棟或整層包租" },
];

const UPGRADE_CONTRACT_TYPES = [
  { id: "social-residential", label: "社會住宅租賃契約書", desc: "社會住宅標準租賃契約", upgrade: true },
  { id: "social-delegate-rent", label: "社會住宅代租代管－委託租賃契約書", desc: "委託機構代為出租", upgrade: true },
  { id: "social-delegate-manage", label: "社會住宅代租代管－委託管理契約書", desc: "委託機構代為管理", upgrade: true },
  { id: "social-lease", label: "社會住宅－包租契約書", desc: "社會住宅包租模式", upgrade: true },
  { id: "social-sublease", label: "社會住宅－轉租契約書", desc: "社會住宅轉租模式", upgrade: true },
];

const CONTRACT_VERSIONS = [
  { id: "4th-1131001", label: "第4期 1131001版" },
  { id: "4th-1150203", label: "第4期 1150203版" },
  { id: "5th-1150206", label: "第5期 1150206版" },
];

function ContractTypeModal({ onClose, onSelect }: { onClose: () => void; onSelect: (type: string, version?: string) => void }) {
  const { isUpgrade } = useVersion();
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const isUpgradeType = selected ? UPGRADE_CONTRACT_TYPES.some((t) => t.id === selected) : false;

  function handleNext() {
    if (step === 1) {
      if (isUpgradeType) {
        setStep(2);
      } else {
        selected && onSelect(selected);
      }
    } else {
      selected && selectedVersion && onSelect(selected, selectedVersion);
    }
  }

  function handleBack() {
    setStep(1);
    setSelectedVersion(null);
  }

  const selectedTypeLabel = UPGRADE_CONTRACT_TYPES.find((t) => t.id === selected)?.label ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[560px] max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-gray-800">{step === 1 ? "選擇合約類型" : "選擇契約版本"}</h2>
              <span className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">{step} / 2</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {step === 1 ? "請選擇要建立的契約書類型" : selectedTypeLabel}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {step === 1 ? (
            <>
              {/* Base types */}
              {BASE_CONTRACT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelected(type.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
                    selected === type.id
                      ? "border-gray-800 bg-gray-50 ring-1 ring-gray-800"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${selected === type.id ? "bg-gray-800" : "bg-gray-100"}`}>
                    <FileText size={15} className={selected === type.id ? "text-white" : "text-gray-500"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${selected === type.id ? "text-gray-900" : "text-gray-700"}`}>{type.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${selected === type.id ? "border-gray-800 bg-gray-800" : "border-gray-300"}`}>
                    {selected === type.id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}

              {/* Upgrade types */}
              {isUpgrade && (
                <>
                  <div className="flex items-center gap-2 pt-2 pb-1">
                    <div className="flex-1 h-px bg-amber-200" />
                    <span className="flex items-center gap-1 text-xs text-amber-600 px-1">
                      <Zap size={11} />
                      升級版專屬
                    </span>
                    <div className="flex-1 h-px bg-amber-200" />
                  </div>
                  {UPGRADE_CONTRACT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelected(type.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
                        selected === type.id
                          ? "border-amber-500 bg-amber-50 ring-1 ring-amber-400"
                          : "border-amber-200 bg-amber-50/40 hover:border-amber-300 hover:bg-amber-50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${selected === type.id ? "bg-amber-500" : "bg-amber-100"}`}>
                        <FileText size={15} className={selected === type.id ? "text-white" : "text-amber-600"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${selected === type.id ? "text-gray-900" : "text-gray-700"}`}>{type.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-amber-600 bg-amber-100 rounded px-1.5 py-0.5">需選版本</span>
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${selected === type.id ? "border-amber-500 bg-amber-500" : "border-amber-300"}`}>
                          {selected === type.id && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </>
          ) : (
            /* Step 2: version selection */
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-3">請選擇契約書的版本</p>
              {CONTRACT_VERSIONS.map((ver) => (
                <button
                  key={ver.id}
                  onClick={() => setSelectedVersion(ver.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
                    selectedVersion === ver.id
                      ? "border-amber-500 bg-amber-50 ring-1 ring-amber-400"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${selectedVersion === ver.id ? "bg-amber-500" : "bg-gray-100"}`}>
                    <FileText size={15} className={selectedVersion === ver.id ? "text-white" : "text-gray-500"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${selectedVersion === ver.id ? "text-gray-900 font-medium" : "text-gray-700"}`}>{ver.label}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${selectedVersion === ver.id ? "border-amber-500 bg-amber-500" : "border-gray-300"}`}>
                    {selectedVersion === ver.id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div>
            {step === 2 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                上一步
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <button
              disabled={step === 1 ? !selected : !selectedVersion}
              onClick={handleNext}
              className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContractList() {
  const { isUpgrade } = useVersion();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("全部");
  const [showFilter, setShowFilter] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);

  const filtered = contracts.filter((c) => {
    const matchSearch =
      c.name.includes(search) ||
      c.landlordName.includes(search) ||
      c.tenantName.includes(search) ||
      c.propertyName.includes(search);
    const matchType = typeFilter === "全部" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6">
      {showTypeModal && (
        <ContractTypeModal
          onClose={() => setShowTypeModal(false)}
          onSelect={(type, version) => {
            setShowTypeModal(false);
            navigate(`/contracts/new?type=${type}${version ? `&version=${version}` : ""}`);
          }}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-800 text-lg">契約管理</h1>
          <p className="text-xs text-gray-400 mt-0.5">共 {filtered.length} 筆資料</p>
        </div>
        <button
          onClick={() => setShowTypeModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} />
          新增契約
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              placeholder="搜尋案件名稱、出租人、承租人..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className={`flex items-center gap-2 px-3 py-2 border text-sm rounded transition-colors ${showFilter ? "border-gray-800 bg-gray-800 text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={14} />
            篩選
          </button>
          <button className="px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50">搜尋</button>
          <button className="px-3 py-2 text-xs text-gray-400 hover:text-gray-600" onClick={() => { setSearch(""); setTypeFilter("全部"); }}>清除</button>
        </div>

        {showFilter && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">合約類型</label>
              <div className="flex gap-1.5 flex-wrap">
                {["全部", "住宅租賃", "商業租賃"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1 text-xs rounded border transition-colors ${typeFilter === t ? "border-gray-800 bg-gray-800 text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">狀態</label>
              <select className="border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-600 focus:outline-none">
                <option>全部狀態</option>
                <option>生效中</option>
                <option>草稿</option>
                <option>已到期</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">起始日期</label>
              <input type="text" className="border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none" placeholder="YYYY-MM-DD" readOnly />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">到期日期</label>
              <input type="text" className="border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none" placeholder="YYYY-MM-DD" readOnly />
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
                  <span className="flex items-center gap-1">合約編號 <UpgradeTag /></span>
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">案件名稱</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">出租人</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">承租人</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">合約類型</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 font-medium">起迄日期</th>
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
            {filtered.map((contract) => (
              <tr
                key={contract.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/contracts/${contract.id}`)}
              >
                {isUpgrade && (
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{contract.caseNo}</td>
                )}
                <td className="px-4 py-3">
                  <span className="text-gray-800">{contract.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{contract.landlordName}</td>
                <td className="px-4 py-3 text-gray-500">{contract.tenantName}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={contract.type} />
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {contract.startDate} ~ {contract.endDate}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={contract.status} />
                </td>
                {isUpgrade && (
                  <td className="px-4 py-3">
                    <StatusBadge status={contract.applied ? "申請中" : "未申請"} />
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
          <div className="py-16 text-center text-gray-400 text-sm">查無符合條件的契約</div>
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