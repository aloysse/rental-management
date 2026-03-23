import { useMemo, useState } from "react";
import { X, Download, FileText, Zap, CheckCircle, ChevronRight } from "lucide-react";
import { useVersion } from "../context/VersionContext";
import { FormField, UpgradeSection } from "./WireframeTag";
import {
  buildContractFormInitialValues,
  getDelegationContractFormSchema,
  type ContractFormFieldSchema,
  type ContractFormSectionSchema,
  type DelegationContractFormSchema,
} from "../data/contractFormSchemas";

interface DelegationContractEditDialogProps {
  contractType: string;
  contractTypeId?: string;
  property?: any;
  landlord?: any;
  onClose: () => void;
}

function ChoiceField({
  field,
  value,
}: {
  field: ContractFormFieldSchema;
  value: string;
}) {
  const options = field.options ?? [];
  const selectedValues = value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
  const selectedSet = new Set(selectedValues);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">
        {field.label}
        {field.required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="border border-gray-300 rounded px-3 py-2 bg-white">
        <div className="flex flex-wrap gap-4">
          {options.map((option) => {
            const isChecked =
              field.type === "radio" ? value === option : selectedSet.has(option);
            return (
              <label key={option} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                <input
                  type={field.type === "radio" ? "radio" : "checkbox"}
                  checked={isChecked}
                  readOnly
                  className="w-3.5 h-3.5"
                />
                {option}
              </label>
            );
          })}
        </div>
        {field.hint && <p className="text-xs text-gray-400 mt-2">{field.hint}</p>}
      </div>
    </div>
  );
}

function SchemaField({
  field,
  value,
}: {
  field: ContractFormFieldSchema;
  value: string;
}) {
  if (field.type === "radio" || field.type === "checkbox-group") {
    return <ChoiceField field={field} value={value} />;
  }

  const fieldType = field.type === "textarea" ? "textarea" : field.type === "select" ? "select" : "text";
  const label = field.label;
  const placeholder = value || field.placeholder;

  return (
    <div className="space-y-1">
      <FormField
        label={label}
        type={fieldType}
        placeholder={placeholder}
        required={field.required}
      />
      {field.hint && <p className="text-xs text-gray-400">{field.hint}</p>}
    </div>
  );
}

const ATTACHMENT4_TABLE_SECTION_IDS = new Set([
  "a4_outdoor_items",
  "a4_living_room_items",
  "a4_kitchen_bath_items",
]);

const HANDOVER_OPTIONS = ["現狀", "修繕後點交"];
const OWNER_OPTIONS = ["包租業", "出租人", "其他"];

function Attachment4TableSection({
  section,
  values,
}: {
  section: ContractFormSectionSchema;
  values: Record<string, string>;
}) {
  const rows: ContractFormFieldSchema[][] = [];
  for (let i = 0; i < section.fields.length; i += 5) {
    rows.push(section.fields.slice(i, i + 5));
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="text-sm text-gray-700 mb-3 pb-2 border-b border-gray-100">{section.title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-2 text-left text-gray-600 font-medium whitespace-nowrap">設備/設施及數量</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-gray-600 font-medium whitespace-nowrap">點交狀態</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-gray-600 font-medium whitespace-nowrap">租賃期間損壞責任歸屬</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-gray-600 font-medium whitespace-nowrap">修繕費用之負擔</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-gray-600 font-medium whitespace-nowrap w-28">備註</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((rowFields, idx) => {
              const [nameField, handoverField, damageField, repairField, remarkField] = rowFields;
              const itemName = values[nameField.id] || nameField.label.replace("（設備/設施）", "");
              const handoverVal = values[handoverField.id] ?? "";
              const damageVal = values[damageField.id] ?? "";
              const repairVal = values[repairField.id] ?? "";
              const remarkVal = values[remarkField.id] ?? "";

              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-2 py-2 text-gray-700 whitespace-nowrap">{itemName}</td>
                  <td className="border border-gray-200 px-2 py-2">
                    <div className="flex flex-col gap-1">
                      {HANDOVER_OPTIONS.map((opt) => (
                        <label key={opt} className="flex items-center gap-1 text-gray-600 cursor-default">
                          <input type="checkbox" readOnly checked={handoverVal === opt} className="w-3 h-3" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="border border-gray-200 px-2 py-2">
                    <div className="flex flex-col gap-1">
                      {OWNER_OPTIONS.map((opt) => (
                        <label key={opt} className="flex items-center gap-1 text-gray-600 cursor-default">
                          <input type="checkbox" readOnly checked={damageVal === opt} className="w-3 h-3" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="border border-gray-200 px-2 py-2">
                    <div className="flex flex-col gap-1">
                      {OWNER_OPTIONS.map((opt) => (
                        <label key={opt} className="flex items-center gap-1 text-gray-600 cursor-default">
                          <input type="checkbox" readOnly checked={repairVal === opt} className="w-3 h-3" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="border border-gray-200 px-2 py-2">
                    <input
                      type="text"
                      defaultValue={remarkVal}
                      placeholder="請輸入"
                      className="w-full border border-gray-200 rounded px-1.5 py-1 text-xs text-gray-600"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SchemaDelegationContractEditDialog({
  schema,
  contractType,
  property,
  landlord,
  onClose,
}: {
  schema: DelegationContractFormSchema;
  contractType: string;
  property?: any;
  landlord?: any;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const steps = schema.steps;
  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const values = useMemo(
    () =>
      buildContractFormInitialValues(schema, {
        contractTypeLabel: contractType,
        property,
        landlord,
      }),
    [schema, contractType, property, landlord]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[760px] max-h-[88vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-gray-800">{contractType}</h2>
            <div className="flex items-center gap-2 mt-1.5 overflow-x-auto pb-1">
              {steps.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setStep(i)}
                  className={`flex items-center ${i < steps.length - 1 ? "gap-2" : ""}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step >= i ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <div className={`w-6 h-px ${step > i ? "bg-gray-800" : "bg-gray-200"}`} />
                  )}
                </button>
              ))}
              <span className="text-xs text-gray-400 ml-1 whitespace-nowrap">{currentStep.title}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            {currentStep.sections.map((section) => {
              if (ATTACHMENT4_TABLE_SECTION_IDS.has(section.id)) {
                return (
                  <Attachment4TableSection
                    key={section.id}
                    section={section}
                    values={values}
                  />
                );
              }
              return (
                <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-sm text-gray-700 mb-3 pb-2 border-b border-gray-100">{section.title}</h3>
                  {section.description && (
                    <p className="text-xs text-gray-500 mb-4">{section.description}</p>
                  )}
                  <div
                    className={`grid ${
                      section.columns === 1 ? "grid-cols-1" : "grid-cols-2"
                    } gap-4`}
                  >
                    {section.fields.map((field) => (
                      <SchemaField
                        key={field.id}
                        field={field}
                        value={values[field.id] ?? ""}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {isLastStep && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 leading-7">
                <p className="font-medium text-gray-800 mb-3">契約草稿預覽</p>
                <p>
                  立契約書人出租人與租屋服務事業（包租業），就本社會住宅包租契約書之租賃標的、
                  費用分擔、稅費負擔與相關條款完成欄位設定。
                </p>
                <p className="mt-3 text-gray-400 text-xs">（契約內容依實際填寫資料生成）</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div>
            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                上一步
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {isLastStep ? (
              <>
                <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                  <Download size={14} />下載 PDF
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                  儲存並關閉
                </button>
              </>
            ) : (
              <button
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                下一步
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LegacyDelegationContractEditDialog({
  contractType,
  onClose,
}: {
  contractType: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const steps = ["基本資訊", "租賃條款", "特約事項", "確認完成"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[680px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-gray-800">{contractType}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              {steps.map((s, i) => (
                <div key={i} className={`flex items-center ${i < steps.length - 1 ? "gap-2" : ""}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step >= i ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-6 h-px ${step > i ? "bg-gray-800" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
              <span className="text-xs text-gray-400 ml-1">{steps[step]}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><FormField label="案件名稱" required /></div>
              <FormField label="起始日期" type="text" placeholder="YYYY-MM-DD" />
              <FormField label="終止日期" type="text" placeholder="YYYY-MM-DD" />
              <FormField label="月租金" />
              <FormField label="押金月數" type="select" placeholder="請選擇" />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <FormField label="付款方式" type="select" placeholder="請選擇" />
              <FormField label="水費分擔" type="select" placeholder="請選擇" />
              <FormField label="電費分擔" type="select" placeholder="請選擇" />
              <FormField label="瓦斯費分擔" type="select" placeholder="請選擇" />
              <FormField label="管理費分擔" type="select" placeholder="請選擇" />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              {["飼養寵物", "轉租", "裝修"].map((item) => (
                <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">{item}</span>
                  <div className="flex gap-3">
                    {["允許", "不允許", "協議"].map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <input type="radio" name={item} className="w-3 h-3" defaultChecked={opt === "不允許"} readOnly />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <FormField label="其他特約事項" type="textarea" />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 leading-7">
                <p className="font-medium text-gray-800 mb-3">委託契約書預覽</p>
                <p>委託人（甲方）與受託人（乙方），就下列不動產之租賃委託，訂立本契約，雙方同意遵守下列條款...</p>
                <p className="mt-3 text-gray-400 text-xs">（契約內容依實際填寫資料生成）</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="w-4 h-4" readOnly />
                我已閱讀並同意上述委託契約書條款
              </label>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div>
            {step > 0 && (
              <button
                onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2 | 3)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                上一步
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {step === 3 ? (
              <>
                <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                  <Download size={14} />下載 PDF
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                  儲存並關閉
                </button>
              </>
            ) : (
              <button
                onClick={() => setStep((s) => (s + 1) as 0 | 1 | 2 | 3)}
                className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                下一步
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 委託契約編輯 Dialog（PropertyDetail 用）── */
export function DelegationContractEditDialog({
  contractType,
  contractTypeId,
  property,
  landlord,
  onClose,
}: DelegationContractEditDialogProps) {
  const schema = getDelegationContractFormSchema(contractTypeId);

  if (schema) {
    return (
      <SchemaDelegationContractEditDialog
        schema={schema}
        contractType={contractType}
        property={property}
        landlord={landlord}
        onClose={onClose}
      />
    );
  }

  return <LegacyDelegationContractEditDialog contractType={contractType} onClose={onClose} />;
}

/* ── 租賃契約編輯 Dialog（ActiveRentalDetail 用）── */
export function RentalContractEditDialog({
  contractType,
  onClose,
}: {
  contractType: string;
  onClose: () => void;
}) {
  const { isUpgrade } = useVersion();
  const [step, setStep] = useState(0);
  const STEPS = ["基本資訊", "租賃條款", "特約事項", "確認簽署"];
  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[720px] max-h-[88vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-gray-800">{contractType}</h2>
            <div className="flex items-center mt-1.5">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <button onClick={() => setStep(i)} className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${
                        i < step
                          ? "bg-gray-800 border-gray-800 text-white"
                          : i === step
                          ? "border-gray-800 bg-white text-gray-800"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {i < step ? <CheckCircle size={12} /> : i + 1}
                    </div>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        i === step ? "text-gray-800" : i < step ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {s}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-2 ${i < step ? "bg-gray-800" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-0">
            <div className="col-span-2 p-6 border-r border-gray-100">
              {step === 0 && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">基本資訊</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2"><FormField label="案件名稱" required /></div>
                      <FormField label="合約類型" placeholder={contractType} type="select" />
                      <FormField label="物件" type="select" />
                      <FormField label="出租人" type="select" />
                      <FormField label="承租人" type="select" />
                      <FormField label="簽署日期" placeholder="YYYY-MM-DD" />
                      {isUpgrade && <FormField label="申請狀態" type="select" placeholder="未申請" />}
                    </div>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">租賃期間與租金</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="租賃起始日" placeholder="YYYY-MM-DD" required />
                      <FormField label="租賃終止日" placeholder="YYYY-MM-DD" required />
                      <FormField label="月租金（元）" required />
                      <FormField label="押金（月）" type="select" placeholder="請選擇" />
                      <FormField label="付款方式" type="select" />
                      <FormField label="付款帳戶" type="select" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">費用分攤</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="水費" type="select" placeholder="請選擇" />
                      <FormField label="電費" type="select" placeholder="請選擇" />
                      <FormField label="瓦斯費" type="select" placeholder="請選擇" />
                      <FormField label="管理費" type="select" placeholder="請選擇" />
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">特約條款</h3>
                  <div className="space-y-2">
                    {["飼養寵物", "轉租", "裝修", "設置廣告", "營業登記"].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-sm text-gray-700">{item}</span>
                        <div className="flex gap-3">
                          {["允許", "不允許", "協議"].map((opt) => (
                            <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-600">
                              <input
                                type="radio"
                                name={item}
                                className="w-3 h-3"
                                defaultChecked={opt === "不允許"}
                                readOnly
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <FormField label="其他特約事項" type="textarea" />
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                      <FileText size={14} />契約確認與簽署
                    </h3>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 leading-6 mb-4">
                      <p>立契約書人出租人（甲方）與承租人（乙方），雙方同意就下列租賃標的物訂立本契約...</p>
                      <p className="mt-2 text-gray-400">（契約內容依實際填寫資料生成）</p>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="w-4 h-4" readOnly />
                      本人已詳閱並同意契約書所有條款
                    </label>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">簽署資訊</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-gray-200 rounded p-4 text-center">
                        <p className="text-xs text-gray-400 mb-2">出租人簽名</p>
                        <div className="h-14 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-300">
                          簽名區域
                        </div>
                      </div>
                      <div className="border-2 border-dashed border-gray-200 rounded p-4 text-center">
                        <p className="text-xs text-gray-400 mb-2">承租人簽名</p>
                        <div className="h-14 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-300">
                          簽名區域
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between gap-2">
                  <button
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="flex-1 px-3 py-2 border border-gray-300 text-xs text-gray-600 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← 上一步
                  </button>
                  {!isLastStep ? (
                    <button
                      onClick={() => setStep((s) => Math.min(3, s + 1))}
                      className="flex-1 px-3 py-2 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 flex items-center justify-center gap-1"
                    >
                      下一步 <ChevronRight size={12} />
                    </button>
                  ) : (
                    <button className="flex-1 px-3 py-2 bg-green-700 text-white text-xs rounded hover:bg-green-800 flex items-center justify-center gap-1">
                      <CheckCircle size={12} />完成
                    </button>
                  )}
                </div>
              </div>

              {isLastStep && (
                <>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50">
                    <Download size={14} />下載 PDF
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
                  >
                    儲存並關閉
                  </button>
                  {isUpgrade && (
                    <UpgradeSection label="升級版功能">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm rounded hover:bg-amber-600">
                        <Zap size={14} />一鍵填表申請
                      </button>
                    </UpgradeSection>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
