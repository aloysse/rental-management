import { useState } from "react";
import { Save } from "lucide-react";

const applicationPeriods = [
  "第五期 1141010",
  "第四期 1141001",
  "第四期 1140201",
  "第三期 1131210",
];

type ReadonlyFieldProps = {
  label: string;
  value: string;
  className?: string;
};

function ReadonlyField({ label, value, className }: ReadonlyFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none"
      />
    </div>
  );
}

export function OperatorProfile() {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([
    "第四期 1141001",
  ]);

  const togglePeriod = (period: string) => {
    setSelectedPeriods((prev) =>
      prev.includes(period)
        ? prev.filter((item) => item !== period)
        : [...prev, period]
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-800 text-lg">業者資料</h1>
          <p className="text-xs text-gray-400 mt-0.5">業者基本資料與社宅申請設定</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">
          <Save size={14} />
          儲存
        </button>
      </div>

      <div className="max-w-4xl space-y-5">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">公司基本資料</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-gray-700 mb-3">租屋服務事業</h3>
              <div className="grid grid-cols-2 gap-4">
                <ReadonlyField label="公司名稱" value="都營不動產開發股份有限公司" />
                <ReadonlyField label="統一編號" value="80617344" />
                <ReadonlyField label="負責人姓名" value="陳興義" />
                <ReadonlyField label="許可字號" value="(111)新北租登字第0236號(換發)" />
                <ReadonlyField label="營業地址" value="新北市永和區中和路453號1樓" className="col-span-2" />
                <ReadonlyField label="聯絡電話" value="02-2929-0112" />
                <ReadonlyField label="電子郵件信箱" value="downrentalservice@hotmail.com" />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm text-gray-700 mb-3">不動產經紀人</h3>
              <div className="grid grid-cols-2 gap-4">
                <ReadonlyField label="姓名" value="邵育緒" />
                <ReadonlyField label="證書字號" value="(91)北縣字第000354號(換發)" />
                <ReadonlyField label="通訊住址" value="新北市中和區中和路358號9樓" className="col-span-2" />
                <ReadonlyField label="聯絡電話" value="02-2929-0112" />
                <ReadonlyField label="電子郵件信箱" value="downrentalservice@hotmail.com" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm text-gray-700 mb-3 pb-2 border-b border-gray-100">社會住宅申請期數</h2>
          <p className="text-xs text-gray-500 mb-4">可複選多個期數</p>
          <div className="grid grid-cols-2 gap-3">
            {applicationPeriods.map((period) => {
              const checked = selectedPeriods.includes(period);
              return (
                <label
                  key={period}
                  className={`flex items-center gap-2 px-3 py-2 border rounded text-sm cursor-pointer transition-colors ${
                    checked
                      ? "border-gray-800 bg-gray-50 text-gray-800"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={checked}
                    onChange={() => togglePeriod(period)}
                  />
                  <span>{period}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
