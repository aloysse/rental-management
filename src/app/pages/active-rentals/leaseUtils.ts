export type LeaseStatus = "進行中" | "即將到期" | "已到期" | "已結束";

export interface ActiveRentalBase {
  endDate: string;
  terminatedAt?: string;
}

export function getLeaseStatus(rental: ActiveRentalBase): LeaseStatus {
  if (rental.terminatedAt) return "已結束";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(rental.endDate);
  end.setHours(0, 0, 0, 0);
  const daysUntilEnd = Math.ceil((end.getTime() - today.getTime()) / 86400000);

  if (daysUntilEnd < 0) return "已到期";
  if (daysUntilEnd <= 60) return "即將到期";
  return "進行中";
}

export function getDaysUntilExpiry(endDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / 86400000);
}
