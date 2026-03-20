/* ── 租賃契約類型 ── */
export const BASE_CONTRACT_TYPES = [
  { id: "residential", label: "住宅租賃契約書", desc: "一般住宅出租使用" },
  { id: "parking", label: "車位租約", desc: "停車位、車庫租賃" },
];

export const UPGRADE_CONTRACT_TYPES = [
  { id: "social-residential", label: "社會住宅租賃契約書", desc: "社會住宅標準租賃契約", upgrade: true },
  { id: "social-delegate-rent", label: "社宅代租代管－委託租賃契約書", desc: "委託機構代為出租", upgrade: true },
  { id: "social-lease", label: "社會住宅－包租契約書", desc: "社會住宅包租模式", upgrade: true },
];

/* ── 委託契約類型 ── */
export const DELEGATION_TYPES = [
  { id: "general-delegation", label: "一般租案委託約", desc: "一般住宅出租委託" },
];

export const UPGRADE_DELEGATION_TYPES = [
  { id: "social-rent-delegation", label: "社宅委託租賃", desc: "社宅委託租賃約", upgrade: true },
  { id: "social-lease-delegation", label: "社宅包租", desc: "社宅包租委託約", upgrade: true },
  { id: "social-management-delegation", label: "社宅委託管理", desc: "社宅委託管理約", upgrade: true },
];
