import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Subtitles,
  Upload,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { AudioEngine } from '../audio/AudioEngine';
import { MISSION_MAP, MISSIONS, MissionCategory } from '../data/missions';
import { R7LARex } from './r7la-rex';
import { ObservatoryFilter, useAppStore } from '../store/useAppStore';
import { archiveHrefForMission } from '../bridge';

const CATEGORY_ORDER: { id: MissionCategory; label: string }[] = [
  { id: 'moon', label: 'The Moon' },
  { id: 'mars', label: 'Mars' },
  { id: 'deep-space', label: 'Deep Space' },
];

const FILTER_TABS: { id: ObservatoryFilter; label: string }[] = [
  { id: 'all', label: `All ${MISSIONS.length}` },
  { id: 'moon', label: 'The Moon' },
  { id: 'mars', label: 'Mars' },
  { id: 'deep-space', label: 'Deep Space' },
];

export const HUD: React.FC = () => {
  const act = useAppStore((s) => s.act);
  const launchPhase = useAppStore((s) => s.launchPhase);
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const selectedMissionId = useAppStore((s) => s.selectedMissionId);
  const observatoryFilter = useAppStore((s) => s.observatoryFilter);
  const missionDrawerOpen = useAppStore((s) => s.missionDrawerOpen);
  const orbitPlaying = useAppStore((s) => s.orbitPlaying);
  const orbitSpeed = useAppStore((s) => s.orbitSpeed);

  const journeyActive = useAppStore((s) => s.journeyActive);
  const journeyPlaying = useAppStore((s) => s.journeyPlaying);
  const journeyProgress = useAppStore((s) => s.journeyProgress);
  const subtitlesEnabled = useAppStore((s) => s.subtitlesEnabled);
  const echoMinimized = useAppStore((s) => s.echoMinimized);
  const customAudioUrls = useAppStore((s) => s.customAudioUrls);

  const setAct = useAppStore((s) => s.setAct);
  const setLaunchPhase = useAppStore((s) => s.setLaunchPhase);
  const toggleAudio = useAppStore((s) => s.toggleAudio);
  const setAudioUnlocked = useAppStore((s) => s.setAudioUnlocked);
  const selectMission = useAppStore((s) => s.selectMission);
  const setObservatoryFilter = useAppStore((s) => s.setObservatoryFilter);
  const setMissionDrawerOpen = useAppStore((s) => s.setMissionDrawerOpen);
  const triggerCameraReset = useAppStore((s) => s.triggerCameraReset);
  const toggleOrbitPlaying = useAppStore((s) => s.toggleOrbitPlaying);
  const cycleOrbitSpeed = useAppStore((s) => s.cycleOrbitSpeed);

  const startJourney = useAppStore((s) => s.startJourney);
  const exitJourney = useAppStore((s) => s.exitJourney);
  const setJourneyPlaying = useAppStore((s) => s.setJourneyPlaying);
  const setJourneyProgress = useAppStore((s) => s.setJourneyProgress);
  const toggleSubtitles = useAppStore((s) => s.toggleSubtitles);
  const toggleEchoMinimized = useAppStore((s) => s.toggleEchoMinimized);
  const setCustomAudioUrl = useAppStore((s) => s.setCustomAudioUrl);

  const [cardCollapsed, setCardCollapsed] = useState(false);
  const [draggingTrack, setDraggingTrack] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCardCollapsed(false);
  }, [selectedMissionId]);

  const mission = selectedMissionId ? MISSION_MAP.get(selectedMissionId) ?? null : null;

  // Compute cumulative timeline geometry across all 7+ scenes
  const stageInfo = useMemo(() => {
    if (!mission) return null;
    const total = mission.stages.reduce((acc, st) => acc + st.durationSec, 0);
    let acc = 0;
    const segments = mission.stages.map((st, idx) => {
      const start = acc / total;
      acc += st.durationSec;
      const end = acc / total;
      return {
        index: idx,
        stage: st,
        start,
        end,
        widthPct: ((end - start) * 100),
      };
    });

    const clamped = Math.min(0.9999, Math.max(0, journeyProgress));
    let activeIdx = segments.length - 1;
    for (const seg of segments) {
      if (clamped >= seg.start && clamped < seg.end) {
        activeIdx = seg.index;
        break;
      }
    }

    return {
      index: activeIdx,
      stage: segments[activeIdx].stage,
      totalDuration: total,
      segments,
    };
  }, [mission, journeyProgress]);

  // Keep active scene node scrolled cleanly into view on horizontal strip
  useEffect(() => {
    if (!journeyActive || !stageInfo || !nodeStripRef.current) return;
    const activeBtn = nodeStripRef.current.children[stageInfo.index] as HTMLElement | undefined;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [journeyActive, stageInfo?.index]);

  const handleToggleAudio = async () => {
    const ok = await AudioEngine.unlock();
    if (ok) setAudioUnlocked(true);
    const next = !audioEnabled;
    toggleAudio();
    AudioEngine.setEnabled(next);
  };

  const handleLaunchClick = async () => {
    const ok = await AudioEngine.unlock();
    if (ok) setAudioUnlocked(true);
    setLaunchPhase('igniting');
  };

  const handleSkipIntro = async () => {
    const ok = await AudioEngine.unlock();
    if (ok) setAudioUnlocked(true);
    setLaunchPhase('idle');
    setAct('observatory');
  };

  const handleStartJourney = async () => {
    const ok = await AudioEngine.unlock();
    if (ok) setAudioUnlocked(true);
    startJourney();
  };

  const handleTogglePlayPause = async () => {
    const ok = await AudioEngine.unlock();
    if (ok) setAudioUnlocked(true);
    if (journeyProgress >= 0.995 && !journeyPlaying) {
      setJourneyProgress(0);
    }
    setJourneyPlaying(!journeyPlaying);
  };

  const scrubFromClientX = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / Math.max(1, rect.width)));
    setJourneyProgress(ratio);
  };

  const handleTimelineWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 1) return;
    const next = Math.min(1, Math.max(0, journeyProgress + delta * 0.0008));
    setJourneyProgress(next);
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !mission) return;
    const objectUrl = URL.createObjectURL(file);
    setCustomAudioUrl(mission.id, objectUrl);
    if (journeyActive && journeyPlaying && stageInfo) {
      AudioEngine.startEchoNarration(
        mission.id,
        `${mission.id}-${stageInfo.stage.id}-custom`,
        stageInfo.stage.narration,
        objectUrl,
        journeyProgress * stageInfo.totalDuration
      );
    }
    e.target.value = '';
  };

  const hideTopBarForCinema = act === 'artifact' && journeyActive;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between select-none">
      {/* TOP NAVIGATION BAR (Hidden cleanly during Act III Story Playback) */}
      {!hideTopBarForCinema ? (
        <header className="flex items-center justify-between px-5 py-4 sm:px-7">
          {/* Top-Left: Wordmark + Breadcrumb / Index Toggle */}
          <div className="pointer-events-auto flex items-center gap-3 min-w-0">
            <a
              href="/"
              className="group flex flex-col leading-none whitespace-nowrap shrink-0"
              title="Back to the R7LA archive"
            >
              <span className="font-display text-sm sm:text-base font-semibold tracking-[0.28em] text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">
                R7LA
              </span>
              <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.24em] text-[#10B981]/90">
                Observatory / Archive 01
              </span>
            </a>

            {act === 'observatory' && (
              <>
                <span className="h-3.5 w-px bg-white/15 shrink-0" />
                <button
                  type="button"
                  onClick={() => setMissionDrawerOpen(!missionDrawerOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-[#05080F]/88 border border-white/12 hover:border-white/30 text-[11px] font-medium tracking-wider uppercase text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {missionDrawerOpen ? (
                    <ChevronLeft className="w-3.5 h-3.5 text-[#10B981]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#10B981]" />
                  )}
                  <span>{MISSIONS.length} Artifacts</span>
                </button>
              </>
            )}

            {act === 'artifact' && mission && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#94A3B8] truncate">
                <span className="text-white/20">/</span>
                <span className="whitespace-nowrap">{mission.categoryLabel}</span>
                <span className="text-white/20">/</span>
                <span className="text-[#F8FAFC] font-medium truncate">{mission.name}</span>
              </div>
            )}
          </div>

          {/* Top-Right: Orbit Time Controls (Act II) + Audio Toggle + Skip/Back */}
          <div className="pointer-events-auto flex items-center gap-2 shrink-0">
            {act === 'observatory' && (
              <div className="flex items-center bg-[#05080F]/88 border border-white/15">
                <button
                  type="button"
                  onClick={toggleOrbitPlaying}
                  aria-label={orbitPlaying ? 'Pause Orbits' : 'Play Orbits'}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium tracking-wider uppercase text-[#E2E8F0] hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {orbitPlaying ? (
                    <Pause className="w-3 h-3 text-[#10B981]" />
                  ) : (
                    <Play className="w-3 h-3 fill-current text-[#10B981]" />
                  )}
                  <span>{orbitPlaying ? 'Orbiting' : 'Paused'}</span>
                </button>
                <span className="h-3.5 w-px bg-white/15" />
                <button
                  type="button"
                  onClick={cycleOrbitSpeed}
                  title="Cycle orbital speed"
                  className="px-2.5 py-1.5 text-[11px] font-mono text-[#94A3B8] hover:text-[#F8FAFC] tabular-nums transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {orbitSpeed}x
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleToggleAudio}
              aria-label={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#05080F]/88 border border-white/15 hover:border-white/35 text-[11px] font-medium tracking-wider uppercase text-[#E2E8F0] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {audioEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#10B981]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-[#94A3B8]" />
              )}
              <span>Audio: {audioEnabled ? 'On' : 'Off'}</span>
            </button>

            {act === 'launchpad' && (
              <button
                type="button"
                onClick={handleSkipIntro}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#05080F]/88 border border-white/15 hover:border-white/35 text-[11px] font-medium tracking-wider uppercase text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Skip Intro</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}

            {act === 'artifact' && (
              <button
                type="button"
                onClick={() => selectMission(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#05080F]/88 border border-white/15 hover:border-[#10B981]/60 text-[11px] font-medium tracking-wider uppercase text-[#E2E8F0] hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Solar System</span>
              </button>
            )}
          </div>
        </header>
      ) : (
        <div />
      )}

      {/* ACT I: LAUNCHPAD TRIGGER */}
      {act === 'launchpad' && launchPhase === 'idle' && (
        <div className="pointer-events-auto mb-12 flex flex-col items-center justify-center gap-3 px-4">
          <button
            type="button"
            onClick={handleLaunchClick}
            className="px-9 py-3.5 bg-[#05080F]/88 border border-white/30 hover:border-[#10B981] text-[#F8FAFC] text-xs font-display font-semibold tracking-[0.3em] uppercase transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            LAUNCH R7LA
          </button>
          <p className="text-[11px] tracking-[0.16em] uppercase text-[#94A3B8]/85">
            Interactive Solar System Artifact Documentary
          </p>
        </div>
      )}

      {/* ACT II: SOLAR SYSTEM OBSERVATORY */}
      {act === 'observatory' && (
        <>
          {missionDrawerOpen && (
            <aside className="pointer-events-auto fixed left-5 top-16 bottom-20 w-72 bg-[#05080F]/92 border border-white/12 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#94A3B8]">
                  Target Artifacts ({MISSIONS.length})
                </span>
                <button
                  type="button"
                  onClick={() => setMissionDrawerOpen(false)}
                  aria-label="Close Artifact Index"
                  className="text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="r7la-scroll flex-1 overflow-y-auto px-3 py-3 space-y-5">
                {CATEGORY_ORDER.map((cat) => {
                  const items = MISSIONS.filter((m) => m.category === cat.id);
                  return (
                    <div key={cat.id}>
                      <div className="px-2 pb-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-[#94A3B8]/80 border-b border-white/8">
                        {cat.label}
                      </div>
                      <div className="mt-1.5 space-y-0.5">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setMissionDrawerOpen(false);
                              selectMission(item.id);
                            }}
                            className="w-full text-left px-2 py-2 hover:bg-white/6 transition-colors flex items-start gap-2.5 group cursor-pointer"
                          >
                            <span className="text-[#10B981] text-xs mt-0.5 shrink-0">★</span>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-[#E2E8F0] group-hover:text-[#F8FAFC] truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-[#94A3B8] truncate tabular-nums">
                                {item.placement.surfaceCoords?.siteName ?? item.destination}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          <footer className="relative flex items-end justify-center px-5 pb-5 sm:px-7">
            <span className="hidden lg:block absolute left-7 bottom-6 text-[11px] text-[#94A3B8]/75 tracking-wide">
              Drag to orbit · Scroll to zoom · Select a green star beacon
            </span>

            <div className="pointer-events-auto flex items-center gap-1 bg-[#05080F]/90 border border-white/14 px-2 py-1.5">
              {FILTER_TABS.map((tab) => {
                const active = observatoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setObservatoryFilter(tab.id)}
                    className={`px-3 py-1 text-[11px] font-medium tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b ${
                      active
                        ? 'text-[#F8FAFC] border-[#10B981]'
                        : 'text-[#94A3B8] border-transparent hover:text-[#E2E8F0]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}

              <span className="mx-1 h-4 w-px bg-white/15 shrink-0" />

              <button
                type="button"
                onClick={triggerCameraReset}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium tracking-wider uppercase text-[#94A3B8] hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset View</span>
              </button>
            </div>
          </footer>
        </>
      )}

      {/* ACT III: ARTIFACT INSPECTION & 7-SCENE STORY MODE */}
      {act === 'artifact' && mission && (
        <>
          {/* INSPECTION MODE: Minimalist Artifact Card */}
          {!journeyActive && (
            <div className="pointer-events-auto px-5 pb-6 sm:px-7 sm:pb-8 flex items-end justify-between">
              {cardCollapsed ? (
                <button
                  type="button"
                  onClick={() => setCardCollapsed(false)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-[#05080F]/90 border border-white/15 hover:border-[#10B981]/60 text-xs font-medium text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{mission.name}</span>
                </button>
              ) : (
                <section className="w-full max-w-[368px] bg-[#05080F]/90 border border-white/12 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-[11px] font-mono tracking-wider uppercase text-[#94A3B8] tabular-nums">
                      {mission.categoryLabel} · {mission.missionType}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCardCollapsed(true)}
                      aria-label="Hide Artifact Info"
                      className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer shrink-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#F8FAFC] mt-1.5">
                    {mission.name}
                  </h1>
                  <div className="text-[11px] font-mono text-[#10B981]/90 mt-1 tabular-nums">
                    {mission.destination}
                  </div>

                  <p className="text-[13px] leading-relaxed text-[#CBD5E1] mt-3">
                    {mission.summary}
                  </p>

                  <dl className="mt-4 border-t border-white/10 divide-y divide-white/8">
                    {mission.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="py-2 flex items-baseline justify-between gap-4 text-[11px]"
                      >
                        <dt className="text-[#94A3B8] shrink-0">{spec.label}</dt>
                        <dd className="text-[#E2E8F0] text-right font-mono tabular-nums">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <button
                    type="button"
                    onClick={handleStartJourney}
                    className="mt-5 w-full py-2.5 px-4 bg-[#10B981]/16 hover:bg-[#10B981]/28 border border-[#10B981]/70 text-[#F8FAFC] text-xs font-display font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-[#10B981]" />
                    <span>PLAY JOURNEY ({mission.stages.length} SCENES)</span>
                  </button>

                  <a
                    href={archiveHrefForMission(mission.id)}
                    className="mt-2 w-full py-2.5 px-4 border border-white/20 hover:border-[#10B981]/70 hover:text-[#10B981] text-[#E2E8F0] text-xs font-display font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>OPEN ARCHIVE RECORD</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </section>
              )}
            </div>
          )}

          {/* STORY PLAYBACK MODE: Compact 160x200 REX PiP + Cinema Subtitles + Interactive 7-Scene Horizontal Scrubber */}
          {journeyActive && stageInfo && (
            <div className="relative flex flex-col items-center px-4 pb-4 sm:px-6 mt-auto">
              {/* COMPACT REX PIP (160px x 200px, Bottom-Right, Hide/Minimize Toggle) */}
              <div className="pointer-events-auto fixed right-4 bottom-28 sm:right-6 sm:bottom-5 z-30">
                {echoMinimized ? (
                  <button
                    type="button"
                    onClick={toggleEchoMinimized}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#05080F]/90 border border-white/15 hover:border-[#38bdf8]/60 text-[11px] font-mono tracking-wider uppercase text-[#E2E8F0] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>REX</span>
                  </button>
                ) : (
                  <div className="w-[160px] h-[200px] bg-[#05080F]/92 border border-white/16 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-2.5 py-1 border-b border-white/10 bg-[#030508]/85">
                      <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#CBD5E1]">
                        REX
                      </span>
                      <div className="flex items-center gap-1.5">
                        {customAudioUrls[mission.id] && (
                          <span className="text-[9px] font-mono uppercase text-[#10B981]">
                            MP3
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          title="Load custom MP3 voiceover"
                          aria-label="Load custom MP3 voiceover"
                          className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={toggleEchoMinimized}
                          title="Hide REX"
                          aria-label="Hide REX"
                          className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                        >
                          <EyeOff className="w-3 h-3" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="audio/*"
                          onChange={handleCustomAudioUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <div className="flex-1 w-full h-full">
                      <R7LARex />
                    </div>
                  </div>
                )}
              </div>

              {/* Cinema Subtitles */}
              {subtitlesEnabled && (
                <div className="pointer-events-none mb-2.5 max-w-2xl bg-[#05080F]/90 border border-white/10 px-5 py-2 text-center">
                  <p className="text-xs sm:text-[13px] leading-relaxed text-[#F8FAFC]">
                    {stageInfo.stage.narration}
                  </p>
                </div>
              )}

              {/* SLEEK BOTTOM SCENE TIMELINE BAR (Drag, Wheel Scrub, Horizontal Scroll, Click-to-Jump Nodes 1..7) */}
              <div
                onWheel={handleTimelineWheel}
                className="pointer-events-auto w-full max-w-2xl bg-[#05080F]/92 border border-white/14 px-3.5 py-2.5 flex flex-col gap-2"
              >
                {/* Row 1: Current Scene Meta + Transport + Exit */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={handleTogglePlayPause}
                      aria-label={journeyPlaying ? 'Pause Journey' : 'Play Journey'}
                      className="p-1 text-[#F8FAFC] hover:text-[#10B981] transition-colors shrink-0 cursor-pointer"
                    >
                      {journeyPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                    </button>

                    <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#10B981] tabular-nums whitespace-nowrap shrink-0">
                      Scene {stageInfo.index + 1} / {mission.stages.length}
                    </span>

                    <span className="h-3 w-px bg-white/15 shrink-0" />

                    <span className="text-xs font-medium text-[#F8FAFC] truncate">
                      {stageInfo.stage.title}
                    </span>

                    <span className="hidden md:inline text-[11px] font-mono text-[#94A3B8] tabular-nums whitespace-nowrap shrink-0">
                      · {stageInfo.stage.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={toggleSubtitles}
                      aria-label="Toggle Subtitles"
                      title={subtitlesEnabled ? 'Hide Subtitles' : 'Show Subtitles'}
                      className={`p-1 transition-colors cursor-pointer ${
                        subtitlesEnabled
                          ? 'text-[#10B981]'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      <Subtitles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleAudio}
                      aria-label={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
                      className="p-1 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      {audioEnabled ? (
                        <Volume2 className="w-3.5 h-3.5 text-[#10B981]" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="h-3.5 w-px bg-white/15" />
                    <button
                      type="button"
                      onClick={() => {
                        AudioEngine.stopEchoNarration();
                        exitJourney();
                      }}
                      className="px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Exit
                    </button>
                  </div>
                </div>

                {/* Row 2: Interactive Horizontal Scene Nodes (1..7) */}
                <div
                  ref={nodeStripRef}
                  className="r7la-scroll flex items-center gap-1 overflow-x-auto pb-0.5"
                >
                  {stageInfo.segments.map((seg) => {
                    const isActive = stageInfo.index === seg.index;
                    const isPassed = journeyProgress >= seg.end;
                    return (
                      <button
                        key={seg.stage.id}
                        type="button"
                        onClick={() => {
                          setJourneyProgress(seg.start + 0.001);
                          setJourneyPlaying(true);
                        }}
                        className={`flex items-center gap-1.5 px-2 py-1 border text-[10px] font-mono tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-[#10B981]/18 border-[#10B981]/75 text-[#F8FAFC]'
                            : isPassed
                              ? 'bg-white/5 border-white/15 text-[#CBD5E1] hover:border-white/35'
                              : 'bg-transparent border-white/10 text-[#94A3B8] hover:text-[#E2E8F0] hover:border-white/25'
                        }`}
                      >
                        <span className={isActive ? 'text-[#10B981] font-semibold' : ''}>
                          {seg.stage.sceneNumber}
                        </span>
                        <span>{seg.stage.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Row 3: Continuous Drag-Scrubbable Segmented Progress Bar */}
                <div
                  ref={trackRef}
                  onPointerDown={(e) => {
                    setDraggingTrack(true);
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                    scrubFromClientX(e.clientX);
                  }}
                  onPointerMove={(e) => {
                    if (draggingTrack) scrubFromClientX(e.clientX);
                  }}
                  onPointerUp={() => setDraggingTrack(false)}
                  onPointerCancel={() => setDraggingTrack(false)}
                  className="relative h-2.5 bg-white/10 cursor-ew-resize touch-none"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-[#10B981] pointer-events-none"
                    style={{ width: `${Math.min(100, journeyProgress * 100)}%` }}
                  />
                  {stageInfo.segments.slice(1).map((seg) => (
                    <span
                      key={seg.stage.id}
                      className="absolute inset-y-0 w-px bg-[#030508] pointer-events-none"
                      style={{ left: `${seg.start * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
