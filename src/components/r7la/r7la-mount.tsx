"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useAppStore } from "@/r7la/store/useAppStore";

const R7LA = dynamic(() => import("@/r7la/App"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-[#030508]">
      <div className="text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-[#F8FAFC]">
          R7LA Observatory
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#10B981]">
          Calibrating orbital viewport…
        </p>
      </div>
    </div>
  ),
});

export function R7LAMount() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const artifact = params.get("artifact");
    if (artifact) {
      useAppStore.getState().selectMission(artifact);
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return <R7LA />;
}
