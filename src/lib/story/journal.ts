const STORAGE_KEY = "space-relics-rex-journal";
const EVENT = "rex-journal-updated";

export type JournalKind = "chapter" | "study" | "discovery";

export type JournalEntry = {
  id: string;
  kind: JournalKind;
  title: string;
  body: string;
  relicId?: string;
  sourceIds: string[];
  createdAt: string;
};

export const emptyJournal: JournalEntry[] = [];
let snapshot: JournalEntry[] = emptyJournal;
let hasSnapshot = false;

export function readJournal(): JournalEntry[] {
  if (typeof window === "undefined") return emptyJournal;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyJournal;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JournalEntry[]) : emptyJournal;
  } catch {
    return emptyJournal;
  }
}

export function getJournalSnapshot() {
  if (typeof window === "undefined") return emptyJournal;
  if (!hasSnapshot) {
    snapshot = readJournal();
    hasSnapshot = true;
  }
  return snapshot;
}

export function subscribeJournal(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    snapshot = readJournal();
    hasSnapshot = true;
    callback();
  };
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT, handler);
  };
}

export function addJournalEntry(entry: JournalEntry) {
  if (typeof window === "undefined") return;
  const current = getJournalSnapshot();
  const existing = current.find((item) => item.id === entry.id);
  const next = [
    ...current.filter((item) => item.id !== entry.id),
    existing ? { ...entry, createdAt: existing.createdAt } : entry,
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  snapshot = next;
  hasSnapshot = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Journal persistence is optional.
  }
}

export function clearJournal() {
  snapshot = emptyJournal;
  hasSnapshot = true;
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Journal persistence is optional.
  }
}
