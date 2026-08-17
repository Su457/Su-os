const pad = (value: number) => String(value).padStart(2, "0");

export function toDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function addDays(dateKey: string, amount: number): string {
  const date = fromDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

export function getLastDateKeys(count: number, endDate = toDateKey()): string[] {
  return Array.from({ length: count }, (_, index) => addDays(endDate, index - count + 1));
}

export function startOfWeek(date = new Date()): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  return result;
}

export function isDateThisWeek(dateKey: string, now = new Date()): boolean {
  const start = startOfWeek(now);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const date = fromDateKey(dateKey);
  return date >= start && date < end;
}

export function isDateThisMonth(dateKey: string, now = new Date()): boolean {
  const date = fromDateKey(dateKey);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function formatDate(dateKey: string | null, options?: Intl.DateTimeFormatOptions): string {
  if (!dateKey) return "未设置日期";
  return new Intl.DateTimeFormat("zh-CN", options ?? { month: "short", day: "numeric" }).format(fromDateKey(dateKey));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`;
}

export function minutesBetween(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  return Math.max(0, endHour * 60 + endMinute - (startHour * 60 + startMinute));
}

export function getLearningStreak(dateKeys: string[], today = toDateKey()): number {
  const unique = new Set(dateKeys);
  let cursor = unique.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (unique.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
