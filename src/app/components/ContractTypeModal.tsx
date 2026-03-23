import { useState } from "react";
import { X, FileText, Zap } from "lucide-react";
import { useVersion } from "../context/VersionContext";
import {
  BASE_CONTRACT_TYPES,
  UPGRADE_CONTRACT_TYPES,
  DELEGATION_TYPES,
  UPGRADE_DELEGATION_TYPES,
} from "../data/contractTypes";

interface ContractTypeModalProps {
  mode: "delegation" | "rental";
  onClose: () => void;
  existingTypeIds: string[];
  onSelect: (typeId: string, label: string) => void;
}

function TypeButton({
  type,
  selected,
  isUsed,
  variant,
  onSelect,
  badge,
}: {
  type: { id: string; label: string; desc: string };
  selected: string | null;
  isUsed: boolean;
  variant: "default" | "upgrade";
  onSelect: (id: string) => void;
  badge?: React.ReactNode;
}) {
  const isSelected = selected === type.id;
  const isUpgradeVariant = variant === "upgrade";

  return (
    <button
      key={type.id}
      disabled={isUsed}
      onClick={() => onSelect(type.id)}
      className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
        isUsed
          ? isUpgradeVariant
            ? "opacity-50 cursor-not-allowed border-amber-200 bg-amber-50/40"
            : "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
          : isSelected
          ? isUpgradeVariant
            ? "border-amber-500 bg-amber-50 ring-1 ring-amber-400"
            : "border-gray-800 bg-gray-50 ring-1 ring-gray-800"
          : isUpgradeVariant
          ? "border-amber-200 bg-amber-50/40 hover:border-amber-300 hover:bg-amber-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div
        className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
          isSelected && !isUsed
            ? isUpgradeVariant
              ? "bg-amber-500"
              : "bg-gray-800"
            : isUpgradeVariant
            ? "bg-amber-100"
            : "bg-gray-100"
        }`}
      >
        <FileText
          size={15}
          className={
            isSelected && !isUsed
              ? "text-white"
              : isUpgradeVariant
              ? "text-amber-600"
              : "text-gray-500"
          }
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm text-gray-700">{type.label}</p>
          {badge}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
      </div>
      {isUsed ? (
        <span
          className={`text-xs rounded px-1.5 py-0.5 ${
            isUpgradeVariant
              ? "text-amber-600 bg-amber-100"
              : "text-gray-400 bg-gray-100"
          }`}
        >
          已使用
        </span>
      ) : (
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
            isSelected
              ? isUpgradeVariant
                ? "border-amber-500 bg-amber-500"
                : "border-gray-800 bg-gray-800"
              : isUpgradeVariant
              ? "border-amber-300"
              : "border-gray-300"
          }`}
        >
          {isSelected && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          )}
        </div>
      )}
    </button>
  );
}

export function ContractTypeModal({
  mode,
  onClose,
  existingTypeIds,
  onSelect,
}: ContractTypeModalProps) {
  const { isUpgrade } = useVersion();
  const [selected, setSelected] = useState<string | null>(null);

  const allTypes = [
    ...(mode === "rental" ? BASE_CONTRACT_TYPES : []),
    ...(mode === "rental" && isUpgrade ? UPGRADE_CONTRACT_TYPES : []),
    ...DELEGATION_TYPES,
    ...(isUpgrade ? UPGRADE_DELEGATION_TYPES : []),
  ];
  const selectedLabel = allTypes.find((t) => t.id === selected)?.label ?? "";

  const delegationBadge = (
    <span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">
      委託用
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[520px] max-h-[70vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-gray-800">
              {mode === "delegation" ? "選擇委託契約類型" : "選擇合約類型"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">已使用的類別將標記說明</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {/* 一般版區塊 */}
          {mode === "rental" &&
            BASE_CONTRACT_TYPES.map((type) => (
              <TypeButton
                key={type.id}
                type={type}
                selected={selected}
                isUsed={existingTypeIds.includes(type.id)}
                variant="default"
                onSelect={setSelected}
              />
            ))}

          {DELEGATION_TYPES.map((type) => (
            <TypeButton
              key={type.id}
              type={type}
              selected={selected}
              isUsed={existingTypeIds.includes(type.id)}
              variant="default"
              onSelect={setSelected}
              badge={mode === "rental" ? delegationBadge : undefined}
            />
          ))}

          {/* 升級版區塊 */}
          {isUpgrade && (
            <>
              <div className="flex items-center gap-2 pt-2 pb-1">
                <div className="flex-1 h-px bg-amber-200" />
                <span className="flex items-center gap-1 text-xs text-amber-600 px-1">
                  <Zap size={11} />升級版專屬
                </span>
                <div className="flex-1 h-px bg-amber-200" />
              </div>
              {mode === "rental" &&
                UPGRADE_CONTRACT_TYPES.map((type) => (
                  <TypeButton
                    key={type.id}
                    type={type}
                    selected={selected}
                    isUsed={existingTypeIds.includes(type.id)}
                    variant="upgrade"
                    onSelect={setSelected}
                  />
                ))}
              {UPGRADE_DELEGATION_TYPES.map((type) => (
                <TypeButton
                  key={type.id}
                  type={type}
                  selected={selected}
                  isUsed={existingTypeIds.includes(type.id)}
                  variant="upgrade"
                  onSelect={setSelected}
                  badge={mode === "rental" ? delegationBadge : undefined}
                />
              ))}
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
          >
            取消
          </button>
          <button
            disabled={!selected}
            onClick={() => selected && onSelect(selected, selectedLabel)}
            className="px-5 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {mode === "delegation" ? "建立契約" : "下一步"}
          </button>
        </div>
      </div>
    </div>
  );
}
