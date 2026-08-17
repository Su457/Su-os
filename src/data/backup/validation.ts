import type { SuOsData } from "@/domain/snapshot";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isTask(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isString(value.id) && isString(value.title) && isString(value.description) && isBoolean(value.completed)
    && isNullableString(value.dueDate) && isNullableString(value.time) && ["high", "medium", "low"].includes(String(value.priority))
    && isNullableString(value.projectId) && isStringArray(value.tags) && isBoolean(value.isMIT) && isNumber(value.order)
    && isString(value.createdAt) && isString(value.updatedAt) && isNullableString(value.completedAt);
}

function isNote(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isString(value.id) && isString(value.title) && isString(value.content) && isStringArray(value.tags)
    && isBoolean(value.favorite) && isBoolean(value.archived) && isNullableString(value.projectId)
    && isString(value.createdAt) && isString(value.updatedAt);
}

function isProject(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isString(value.id) && isString(value.name) && isString(value.description) && isString(value.goal)
    && ["active", "paused", "completed", "archived"].includes(String(value.status))
    && isNullableString(value.startDate) && isNullableString(value.dueDate) && isString(value.createdAt) && isString(value.updatedAt);
}

function isMilestone(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isString(value.id) && isString(value.projectId) && isString(value.title) && isBoolean(value.completed)
    && isNullableString(value.dueDate) && isNumber(value.order);
}

function isLearningSession(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isString(value.id) && isString(value.subject) && isString(value.content) && isNumber(value.durationMinutes)
    && isString(value.date) && isNullableString(value.startTime) && isNullableString(value.endTime) && isString(value.note)
    && isString(value.createdAt) && isString(value.updatedAt);
}

function isFocusSession(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isString(value.id) && isNullableString(value.taskId) && isNullableString(value.projectId)
    && isNumber(value.durationMinutes) && isString(value.startedAt) && isString(value.completedAt);
}

function isFocusDraft(value: unknown): boolean {
  return value === null || (isRecord(value) && isNullableString(value.taskId) && isNullableString(value.projectId));
}

export function isSuOsData(value: unknown): value is SuOsData {
  if (!isRecord(value)) return false;
  return value.schemaVersion === 2
    && Array.isArray(value.tasks) && value.tasks.every(isTask)
    && Array.isArray(value.notes) && value.notes.every(isNote)
    && Array.isArray(value.projects) && value.projects.every(isProject)
    && Array.isArray(value.milestones) && value.milestones.every(isMilestone)
    && Array.isArray(value.learningSessions) && value.learningSessions.every(isLearningSession)
    && Array.isArray(value.focusSessions) && value.focusSessions.every(isFocusSession)
    && isFocusDraft(value.focusDraft);
}

export function parseImportedData(text: string): SuOsData {
  const parsed: unknown = JSON.parse(text);
  if (!isSuOsData(parsed)) throw new Error("文件不是有效的 Su OS v0.2 数据。 ");
  return parsed;
}
