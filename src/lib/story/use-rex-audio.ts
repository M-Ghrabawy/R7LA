"use client";

import { useCallback, useEffect, useState } from "react";
import { getRexAudio } from "./audio";
import type { AudioTheme } from "./schema";

const STORAGE_KEY = "space-relics-rex-audio";

export function useRexAudio(theme: AudioTheme) {
  const [enabled, setEnabled] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    const audio = getRexAudio();
    audio.setEnabled(true);
    audio.setTheme(theme);
    const handleVisibility = () => {
      audio.setEnabled(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled, theme]);

  const enable = useCallback(async () => {
    const audio = getRexAudio();
    const started = await audio.unlock();
    setAvailable(started);
    if (started) {
      audio.setEnabled(true);
      audio.setTheme(theme);
      setEnabled(true);
      try {
        localStorage.setItem(STORAGE_KEY, "on");
      } catch {
        // Storage is optional.
      }
    }
    return started;
  }, [theme]);

  const disable = useCallback(() => {
    const audio = getRexAudio();
    audio.setEnabled(false);
    setEnabled(false);
    try {
      localStorage.setItem(STORAGE_KEY, "off");
    } catch {
      // Storage is optional.
    }
  }, []);

  const toggle = useCallback(async () => {
    if (enabled) {
      disable();
      return false;
    }
    return enable();
  }, [disable, enable, enabled]);

  const play = useCallback(
    (
      sound:
        | "click"
        | "advance"
        | "success"
        | "error"
        | "reveal"
        | "boot"
        | "transmit"
        | "complete"
        | "brush",
    ) => {
      if (!enabled) return;
      getRexAudio().sfx(sound);
    },
    [enabled],
  );

  return { enabled, available, enable, disable, toggle, play };
}
