import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { AudioEngine } from './audio/AudioEngine';
import { HUD } from './components/HUD';
import { ArtifactDetailScene } from './scene/ArtifactDetailScene';
import { UnifiedSpaceCanvas } from './scene/UnifiedSpaceCanvas';
import { useAppStore } from './store/useAppStore';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Graceful WebGL fallback handled by state
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#030508] flex flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-base tracking-[0.22em] uppercase text-[#F8FAFC]">
            R7LA Observatory
          </p>
          <p className="mt-2 text-xs text-[#94A3B8] max-w-md">
            3D WebGL viewport could not initialize in this environment. Reload or enable hardware acceleration to view the Solar System scenes.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-5 px-4 py-2 border border-white/20 text-xs uppercase tracking-wider text-[#F8FAFC] hover:border-[#10B981] cursor-pointer"
          >
            Retry Viewport
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const act = useAppStore((s) => s.act);
  const launchPhase = useAppStore((s) => s.launchPhase);
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const setAudioUnlocked = useAppStore((s) => s.setAudioUnlocked);

  // Unlock Web Audio on the user's very first interaction (audio defaults to ON)
  useEffect(() => {
    const handleFirstInteraction = async () => {
      if (!useAppStore.getState().audioEnabled) return;
      const ok = await AudioEngine.unlock();
      if (ok) {
        setAudioUnlocked(true);
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, {
      once: true,
      capture: true,
    });
    window.addEventListener('keydown', handleFirstInteraction, {
      once: true,
      capture: true,
    });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction, {
        capture: true,
      });
      window.removeEventListener('keydown', handleFirstInteraction, {
        capture: true,
      });
    };
  }, [setAudioUnlocked]);

  // Keep AudioEngine synchronized with active act, launch stage, and mute toggle
  useEffect(() => {
    AudioEngine.setState(act, launchPhase);
  }, [act, launchPhase]);

  useEffect(() => {
    AudioEngine.setEnabled(audioEnabled);
  }, [audioEnabled]);

  return (
    <main className="r7la-root relative w-screen h-screen overflow-hidden bg-[#030508] text-[#F8FAFC]">
      <SceneErrorBoundary>
        <div className="fixed inset-0 z-0">
          {act !== 'artifact' ? <UnifiedSpaceCanvas /> : <ArtifactDetailScene />}
        </div>
      </SceneErrorBoundary>

      <HUD />
    </main>
  );
}
