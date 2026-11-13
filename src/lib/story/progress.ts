const STORAGE_KEY = "space-relics-rex-progress";
const EVENT = "rex-progress-updated";

export type RexProgress = {
  chapters: string[];
  studies: string[];
};

export const emptyProgress: RexProgress = { chapters: [], studies: [] };
const empty = emptyProgress;
let snapshot: RexProgress = empty;
let hasSnapshot = false;

export function readProgress(): RexProgress {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<RexProgress>;
    return {
      chapters: Array.isArray(parsed.chapters) ? parsed.chapters : [],
      studies: Array.isArray(parsed.studies) ? parsed.studies : [],
    };
  } catch {
    return empty;
  }
}

export function saveProgress(progress: RexProgress) {
  snapshot = progress;
  hasSnapshot = true;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Progress is optional.
  }
}

export function getProgressSnapshot() {
  if (typeof window === "undefined") return empty;
  if (!hasSnapshot) {
    snapshot = readProgress();
    hasSnapshot = true;
  }
  return snapshot;
}

export function subscribeProgress(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    snapshot = readProgress();
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

export function markComplete(
  kind: "chapter" | "study",
  id: string,
): RexProgress {
  const current = readProgress();
  const key = kind === "chapter" ? "chapters" : "studies";
  const next = {
    ...current,
    [key]: [...new Set([...current[key], id])],
  };
  saveProgress(next);
  return next;
}
