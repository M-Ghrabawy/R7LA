import { create } from 'zustand';
import { MissionCategory } from '../data/missions';

export type ActPhase = 'launchpad' | 'observatory' | 'artifact';
export type LaunchPhase = 'idle' | 'igniting' | 'ascending' | 'meco' | 'pullback';
export type ObservatoryFilter = 'all' | MissionCategory;
export type OrbitSpeed = 1 | 5 | 20;

interface AppState {
  act: ActPhase;
  launchPhase: LaunchPhase;
  audioEnabled: boolean;
  audioUnlocked: boolean;
  selectedMissionId: string | null;
  hoveredMissionId: string | null;
  approachingMissionId: string | null;
  observatoryFilter: ObservatoryFilter;
  missionDrawerOpen: boolean;

  // Dynamic Solar System Time Controls
  orbitPlaying: boolean;
  orbitSpeed: OrbitSpeed;

  // Act III Journey / Echo Story Mode
  journeyActive: boolean;
  journeyPlaying: boolean;
  journeyProgress: number; // 0..1 across all 7 scenes
  subtitlesEnabled: boolean;
  echoMinimized: boolean;
  cameraResetNonce: number;

  // Custom local asset overrides (allows team to test .mp3 / .glb drops immediately)
  customAudioUrls: Record<string, string>;

  setAct: (act: ActPhase) => void;
  setLaunchPhase: (phase: LaunchPhase) => void;
  toggleAudio: () => void;
  setAudioUnlocked: (unlocked: boolean) => void;
  selectMission: (id: string | null) => void;
  setHoveredMission: (id: string | null) => void;
  setApproachingMission: (id: string | null) => void;
  setObservatoryFilter: (filter: ObservatoryFilter) => void;
  setMissionDrawerOpen: (open: boolean) => void;
  triggerCameraReset: () => void;

  toggleOrbitPlaying: () => void;
  cycleOrbitSpeed: () => void;

  startJourney: () => void;
  exitJourney: () => void;
  setJourneyPlaying: (playing: boolean) => void;
  setJourneyProgress: (progress: number) => void;
  toggleSubtitles: () => void;
  toggleEchoMinimized: () => void;
  setCustomAudioUrl: (missionId: string, url: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  act: 'launchpad',
  launchPhase: 'idle',
  audioEnabled: true,
  audioUnlocked: false,
  selectedMissionId: null,
  hoveredMissionId: null,
  approachingMissionId: null,
  observatoryFilter: 'all',
  missionDrawerOpen: false,

  orbitPlaying: true,
  orbitSpeed: 1,

  journeyActive: false,
  journeyPlaying: false,
  journeyProgress: 0,
  subtitlesEnabled: true,
  echoMinimized: false,
  cameraResetNonce: 0,

  customAudioUrls: {},

  setAct: (act) => set({ act }),
  setLaunchPhase: (launchPhase) => set({ launchPhase }),
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  setAudioUnlocked: (audioUnlocked) => set({ audioUnlocked }),
  selectMission: (id) =>
    set({
      selectedMissionId: id,
      approachingMissionId: null,
      act: id ? 'artifact' : 'observatory',
      journeyActive: false,
      journeyPlaying: false,
      journeyProgress: 0,
    }),
  setHoveredMission: (hoveredMissionId) => set({ hoveredMissionId }),
  setApproachingMission: (approachingMissionId) => set({ approachingMissionId }),
  setObservatoryFilter: (observatoryFilter) => set({ observatoryFilter }),
  setMissionDrawerOpen: (missionDrawerOpen) => set({ missionDrawerOpen }),
  triggerCameraReset: () => set((s) => ({ cameraResetNonce: s.cameraResetNonce + 1 })),

  toggleOrbitPlaying: () => set((s) => ({ orbitPlaying: !s.orbitPlaying })),
  cycleOrbitSpeed: () =>
    set((s) => ({
      orbitSpeed: s.orbitSpeed === 1 ? 5 : s.orbitSpeed === 5 ? 20 : 1,
    })),

  startJourney: () =>
    set({
      journeyActive: true,
      journeyPlaying: true,
      journeyProgress: 0,
      echoMinimized: false,
    }),
  exitJourney: () =>
    set({
      journeyActive: false,
      journeyPlaying: false,
      journeyProgress: 0,
    }),
  setJourneyPlaying: (journeyPlaying) => set({ journeyPlaying }),
  setJourneyProgress: (journeyProgress) => set({ journeyProgress }),
  toggleSubtitles: () => set((s) => ({ subtitlesEnabled: !s.subtitlesEnabled })),
  toggleEchoMinimized: () => set((s) => ({ echoMinimized: !s.echoMinimized })),
  setCustomAudioUrl: (missionId, url) =>
    set((s) => ({
      customAudioUrls: { ...s.customAudioUrls, [missionId]: url },
    })),
}));
