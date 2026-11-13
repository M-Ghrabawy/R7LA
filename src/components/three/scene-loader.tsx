"use client";

import dynamic from "next/dynamic";
import { Component, useSyncExternalStore, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ObservatoryCanvas = dynamic(
  () => import("@/components/three/observatory-canvas"),
  {
    ssr: false,
    loading: () => <SceneLoading />,
  },
);

export function SceneLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center bg-void",
        className,
      )}
      aria-label="Loading interactive planetary scene"
    >
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle className="size-5 animate-spin text-teal" />
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
          Calibrating orbital view
        </p>
      </div>
    </div>
  );
}

class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

let webglSupport: boolean | null = null;

function getWebGLSupport() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

function subscribeToNothing() {
  return () => {};
}

export function SceneBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const supported = useSyncExternalStore<boolean | null>(
    subscribeToNothing,
    getWebGLSupport,
    () => null,
  );

  if (supported === null) return <SceneLoading />;
  if (!supported) return fallback;

  return (
    <SceneErrorBoundary fallback={fallback}>{children}</SceneErrorBoundary>
  );
}

export { ObservatoryCanvas };
