import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MISSION_MAP, MissionArtifact, TerrainProfile } from '../data/missions';
import { useAppStore } from '../store/useAppStore';
import { AudioEngine } from '../audio/AudioEngine';
import { applyStudioEnvironment, isSoftwareGl } from './glConfig';
import { ArtifactAnimationRefs, ProceduralArtifactModel } from './proceduralModels';
import { getPlanetTexture, getRadialGlowTexture } from './textures';

const _approachCamPos = new THREE.Vector3();
const _approachTarget = new THREE.Vector3();

function StudioEnvSetup() {
  const { gl, scene } = useThree();
  useEffect(() => {
    return applyStudioEnvironment(gl, scene, 0.75);
  }, [gl, scene]);
  return null;
}

function createSiteTerrainGeometry(
  radius: number,
  profile: TerrainProfile
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(radius * 2, radius * 2, 88, 88);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const dist = Math.hypot(x, z);
    const centerPad = THREE.MathUtils.smoothstep(dist, 2.4, 7.5);

    let y = 0;
    const micro =
      Math.sin(x * 0.45 + 0.5) * Math.cos(z * 0.42) * 0.16 +
      Math.sin(x * 0.9 - z * 0.7) * 0.06;

    if (profile === 'crater-plain') {
      // Mare Tranquillitatis / Oceanus Procellarum basalt plain with rimmed craters
      const crater1 = Math.exp(-Math.pow((Math.hypot(x - 11, z + 9) - 4.5) / 1.4, 2)) * 0.55;
      const bowl1 = Math.exp(-Math.pow(Math.hypot(x - 11, z + 9) / 3.8, 2)) * -0.85;
      const crater2 = Math.exp(-Math.pow((Math.hypot(x + 14, z - 8) - 3.2) / 1.1, 2)) * 0.35;
      y = (micro + crater1 + bowl1 + crater2) * centerPad;
    } else if (profile === 'rille-ridge') {
      // Hadley-Apennine: towering distant Apennine ridge + meandering Hadley Rille trough
      const apennines = Math.max(0, -z - 12) * 0.28 * Math.abs(Math.sin(x * 0.14) + 0.65);
      const rille = Math.exp(-Math.pow((x - Math.sin(z * 0.12) * 4 - 9.5) / 2.2, 2)) * -1.1;
      y = (micro + apennines + rille) * centerPad;
    } else if (profile === 'crater-rim') {
      // Surveyor / Gusev / Jezero / Eros crater bowl & sloped rim
      const rim = Math.exp(-Math.pow((dist - 15) / 3.8, 2)) * 1.45;
      const interiorSlope = Math.sin(x * 0.18) * 0.32;
      y = (micro + rim + interiorSlope) * centerPad;
    } else if (profile === 'flood-plain') {
      // Ares Vallis / Chryse Planitia ancient flood channels & ridges
      const channel = Math.sin(x * 0.24 + Math.cos(z * 0.15) * 1.4) * 0.48;
      y = (micro + channel) * centerPad;
    } else {
      // Elysium Planitia flat dust plain
      y = micro * 0.5 * centerPad;
    }

    pos.setY(i, y);
  }
  geo.computeVertexNormals();
  return geo;
}

const SCENE_CAMERAS: [number, number, number][] = [
  [4.8, 2.3, 4.9],   // Scene 1: Design / Blueprint
  [5.8, 1.8, 5.4],   // Scene 2: Liftoff
  [-4.6, 2.6, 5.6],  // Scene 3: Transit / Cruise
  [5.2, 3.2, 5.2],   // Scene 4: Landing / Orbital Insertion
  [-3.8, 1.9, 4.6],  // Scene 5: Key Milestone I
  [3.9, 2.1, -4.4],  // Scene 6: Key Milestone II
  [5.0, 2.6, 5.4],   // Scene 7: Legacy / Resting State
];

function ArtifactSceneContent({ mission }: { mission: MissionArtifact }) {
  const journeyActive = useAppStore((s) => s.journeyActive);
  const journeyPlaying = useAppStore((s) => s.journeyPlaying);
  const journeyProgress = useAppStore((s) => s.journeyProgress);
  const setJourneyProgress = useAppStore((s) => s.setJourneyProgress);
  const setJourneyPlaying = useAppStore((s) => s.setJourneyPlaying);
  const customAudioUrls = useAppStore((s) => s.customAudioUrls);

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const animRefs = useRef<ArtifactAnimationRefs>({ root: null, wheels: [], solarWings: [] });
  const stageGroupRef = useRef<THREE.Group>(null);
  const ascentPlumeRef = useRef<THREE.Mesh>(null);
  const rocksRef = useRef<THREE.InstancedMesh>(null);

  const [customGlbScene, setCustomGlbScene] = useState<THREE.Group | null>(null);

  // Check optional custom .glb slot in /models/artifacts/manifest.json (zero 404s)
  useEffect(() => {
    let cancelled = false;
    setCustomGlbScene(null);

    fetch('/models/artifacts/manifest.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { models?: Record<string, string> } | null) => {
        const glbUrl = data?.models?.[mission.id];
        if (!glbUrl || cancelled) return;
        const loader = new GLTFLoader();
        loader.load(
          glbUrl,
          (gltf) => {
            if (!cancelled) setCustomGlbScene(gltf.scene);
          },
          undefined,
          () => {}
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [mission.id]);

  // Orbital approach camera animation when artifact loads
  const approachActive = useRef(true);
  const { camera } = useThree();
  useEffect(() => {
    approachActive.current = true;
    camera.position.set(11.5, 6.2, 13.5);
    if (controlsRef.current) {
      controlsRef.current.target.set(-0.6, 0.9, 0);
      controlsRef.current.update();
    }
  }, [mission.id, camera]);

  // Compute 7-scene cumulative timeline offsets
  const stageTimings = useMemo(() => {
    let acc = 0;
    const total = mission.stages.reduce((s, st) => s + st.durationSec, 0);
    const items = mission.stages.map((st, idx) => {
      const start = acc / total;
      acc += st.durationSec;
      const end = acc / total;
      return { index: idx, start, end, stage: st };
    });
    return { total, items };
  }, [mission]);

  const getStageAtProgress = (p: number) => {
    const clamped = THREE.MathUtils.clamp(p, 0, 0.9999);
    for (const item of stageTimings.items) {
      if (clamped >= item.start && clamped < item.end) {
        const localT = (clamped - item.start) / Math.max(0.0001, item.end - item.start);
        return { index: item.index, localT, stage: item.stage };
      }
    }
    const last = stageTimings.items[stageTimings.items.length - 1];
    return { index: last.index, localT: 1, stage: last.stage };
  };

  // Trigger Echo Narration whenever active scene changes or playback starts/resumes
  const lastTriggeredStageRef = useRef<number>(-1);
  useEffect(() => {
    if (!journeyActive || !journeyPlaying) {
      AudioEngine.pauseEchoNarration();
      lastTriggeredStageRef.current = -1;
      return;
    }

    const { index, stage } = getStageAtProgress(journeyProgress);
    if (lastTriggeredStageRef.current !== index) {
      lastTriggeredStageRef.current = index;
      const seekSec = journeyProgress * stageTimings.total;
      AudioEngine.startEchoNarration(
        mission.id,
        `${mission.id}-${stage.id}-${index}`,
        stage.narration,
        customAudioUrls[mission.id],
        seekSec
      );
    }
  });

  useEffect(() => {
    return () => {
      AudioEngine.stopEchoNarration();
    };
  }, [mission.id]);

  // Site-specific terrain geometry & textures
  const terrainGeo = useMemo(() => {
    if (mission.terrainProfile === 'none') return null;
    return createSiteTerrainGeometry(48, mission.terrainProfile);
  }, [mission.terrainProfile]);

  const terrainTex = useMemo(() => {
    if (mission.environmentType === 'moon') return getPlanetTexture('moon');
    if (mission.environmentType === 'mars') return getPlanetTexture('mars');
    if (mission.environmentType === 'asteroid-eros') return getPlanetTexture('eros');
    return null;
  }, [mission.environmentType]);

  const earthTex = useMemo(() => getPlanetTexture('earth'), []);
  const ceresTex = useMemo(() => getPlanetTexture('ceres'), []);
  const jupiterTex = useMemo(() => getPlanetTexture('jupiter'), []);
  const sunGlowTex = useMemo(() => getRadialGlowTexture('#fde68a'), []);

  const starGeo = useMemo(() => {
    const count = 1400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 90 + Math.random() * 140;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useEffect(() => {
    if (!rocksRef.current) return;
    const dummy = new THREE.Object3D();
    const rockCount = mission.terrainProfile === 'flood-plain' ? 85 : 65;
    for (let i = 0; i < rockCount; i++) {
      const ang = (i / rockCount) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 3.2 + Math.random() * 19;
      dummy.position.set(Math.cos(ang) * dist, 0.06, Math.sin(ang) * dist);
      dummy.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      const s = 0.08 + Math.random() * 0.3;
      dummy.scale.set(s * 1.3, s * 0.72, s);
      dummy.updateMatrix();
      rocksRef.current.setMatrixAt(i, dummy.matrix);
    }
    rocksRef.current.instanceMatrix.needsUpdate = true;
    rocksRef.current.computeBoundingSphere();
  }, [mission.id, mission.terrainProfile]);

  // Animation loop: orbital approach + 7-scene timeline keyframes
  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;

    let activeProgress = journeyProgress;
    if (journeyActive && journeyPlaying) {
      activeProgress = Math.min(1, journeyProgress + dt / stageTimings.total);
      setJourneyProgress(activeProgress);
      if (activeProgress >= 1) {
        setJourneyPlaying(false);
        AudioEngine.stopEchoNarration();
      }
    }

    if (controlsRef.current) {
      if (journeyActive) {
        const { index } = getStageAtProgress(activeProgress);
        const camCoords = SCENE_CAMERAS[index % SCENE_CAMERAS.length];
        _approachCamPos.set(camCoords[0], camCoords[1], camCoords[2]);
        _approachTarget.set(-0.2, 0.85, 0);
        state.camera.position.lerp(_approachCamPos, 1 - Math.exp(-2.1 * dt));
        controlsRef.current.target.lerp(_approachTarget, 1 - Math.exp(-2.6 * dt));
        controlsRef.current.update();
      } else if (approachActive.current) {
        _approachCamPos.set(4.6, 2.35, 5.1);
        _approachTarget.set(-0.45, 0.85, 0);
        state.camera.position.lerp(_approachCamPos, 1 - Math.exp(-3.4 * dt));
        controlsRef.current.target.lerp(_approachTarget, 1 - Math.exp(-3.8 * dt));
        controlsRef.current.update();
        if (state.camera.position.distanceTo(_approachCamPos) < 0.05) {
          approachActive.current = false;
        }
      }
    }

    const root = animRefs.current.root;
    const stageGrp = stageGroupRef.current;

    if (!journeyActive) {
      if (stageGrp) {
        stageGrp.position.y = THREE.MathUtils.damp(stageGrp.position.y, 0, 5, dt);
        stageGrp.position.z = THREE.MathUtils.damp(stageGrp.position.z, 0, 5, dt);
        stageGrp.rotation.set(0, 0, 0);
      }
      if (animRefs.current.ascentStage) {
        animRefs.current.ascentStage.position.y = THREE.MathUtils.damp(
          animRefs.current.ascentStage.position.y,
          1.98,
          5,
          dt
        );
      }
      if (ascentPlumeRef.current) ascentPlumeRef.current.visible = false;
      if (mission.id === 'dawn-spacecraft' && animRefs.current.ionPlume) {
        animRefs.current.ionPlume.visible = true;
      }
      return;
    }

    // Active 7-Scene Lifecycle Choreography
    const { stage, localT } = getStageAtProgress(activeProgress);
    const cue = stage.visualCue;

    if (stageGrp) {
      if (cue === 'blueprint') {
        stageGrp.position.y = THREE.MathUtils.damp(stageGrp.position.y, 0, 5, dt);
        stageGrp.position.z = THREE.MathUtils.damp(stageGrp.position.z, 0, 5, dt);
        stageGrp.rotation.y = Math.sin(localT * Math.PI * 2) * 0.35;
      } else if (cue === 'liftoff') {
        stageGrp.position.y = localT * 0.65;
        stageGrp.rotation.y = THREE.MathUtils.damp(stageGrp.rotation.y, 0, 4, dt);
      } else if (cue === 'landing') {
        const descend = Math.max(0, 1 - localT * 1.25);
        const bounce =
          (mission.id === 'surveyor-landers' || mission.id === 'sojourner-rover') &&
          localT > 0.72 &&
          localT < 0.94
            ? Math.abs(Math.sin((localT - 0.72) * 28)) * 0.45
            : 0;
        stageGrp.position.y = descend * 3.1 + bounce;
      } else if (cue === 'flight' && mission.id === 'ingenuity-helicopter') {
        const flightArc = Math.sin(localT * Math.PI);
        stageGrp.position.y = flightArc * 1.95;
        stageGrp.position.z = Math.sin(localT * Math.PI * 2) * 0.9;
        stageGrp.rotation.x = Math.cos(localT * Math.PI * 2) * 0.08;
      } else if (cue === 'roving') {
        stageGrp.position.y = 0;
        stageGrp.position.z = Math.sin(localT * Math.PI) * 1.15;
      } else if (cue === 'orbit' || cue === 'cruise') {
        stageGrp.position.y = Math.sin(t * 0.9) * 0.16;
        stageGrp.rotation.y = localT * 0.65;
      } else {
        stageGrp.position.y = THREE.MathUtils.damp(stageGrp.position.y, 0, 5, dt);
        stageGrp.position.z = THREE.MathUtils.damp(stageGrp.position.z, 0, 5, dt);
        stageGrp.rotation.x = THREE.MathUtils.damp(stageGrp.rotation.x, 0, 5, dt);
      }
    }

    if (mission.id === 'apollo-lunar-modules' && animRefs.current.ascentStage) {
      if (cue === 'ascent') {
        const lift = Math.pow(localT, 1.8) * 5.2;
        animRefs.current.ascentStage.position.y = 1.98 + lift;
        if (ascentPlumeRef.current) {
          ascentPlumeRef.current.visible = localT > 0.05;
          ascentPlumeRef.current.position.y = 1.32 + lift;
        }
      } else {
        animRefs.current.ascentStage.position.y = 1.98;
        if (ascentPlumeRef.current) ascentPlumeRef.current.visible = false;
      }
    }

    if (animRefs.current.wheels && animRefs.current.wheels.length > 0 && cue === 'roving') {
      for (const w of animRefs.current.wheels) {
        w.rotation.x += dt * 2.8;
      }
    }

    if (mission.id === 'ingenuity-helicopter') {
      const spinSpeed = cue === 'flight' ? 28 : cue === 'landing' ? 5 : 0;
      if (animRefs.current.rotorTop) animRefs.current.rotorTop.rotation.y += dt * spinSpeed;
      if (animRefs.current.rotorBottom) animRefs.current.rotorBottom.rotation.y -= dt * spinSpeed;
    }

    if (animRefs.current.arm) {
      const targetRotX = cue === 'deployment' ? 0.38 : cue === 'dormant' ? 0.18 : 0;
      animRefs.current.arm.rotation.x = THREE.MathUtils.damp(
        animRefs.current.arm.rotation.x,
        targetRotX,
        3.5,
        dt
      );
    }

    if (mission.id === 'dawn-spacecraft' && animRefs.current.ionPlume) {
      animRefs.current.ionPlume.visible = cue !== 'dormant' && cue !== 'blueprint';
      const flicker = 0.85 + Math.sin(t * 14) * 0.15;
      animRefs.current.ionPlume.scale.set(flicker, flicker, flicker);
    }

    if (root && mission.environmentType === 'deep-space' && cue === 'dormant') {
      root.rotation.y += dt * 0.06;
    }
  });

  const env = mission.environmentType;
  const isMars = env === 'mars';
  const isMoon = env === 'moon';
  const isCeres = env === 'asteroid-ceres';
  const isEros = env === 'asteroid-eros';

  return (
    <>
      <color attach="background" args={[isMars ? '#190d08' : '#030508']} />
      {isMars && <fogExp2 attach="fog" args={['#26130b', 0.02]} />}

      <directionalLight
        position={[14, 16, 10]}
        intensity={isMoon ? 2.6 : isMars ? 2.25 : 2.35}
        color={isMars ? '#ffdfc4' : '#fffaf0'}
        castShadow={!isSoftwareGl}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <hemisphereLight
        args={[isMars ? '#7c3f26' : '#334155', isMars ? '#2c140c' : '#090d16', 0.48]}
      />
      <directionalLight position={[-10, 6, -12]} intensity={0.68} color="#93c5fd" />

      <OrbitControls
        ref={controlsRef}
        enableDamping={!isSoftwareGl}
        dampingFactor={0.06}
        minDistance={2.2}
        maxDistance={22}
        maxPolarAngle={env === 'deep-space' || isCeres ? Math.PI : Math.PI * 0.485}
        onStart={() => {
          approachActive.current = false;
        }}
      />

      <points geometry={starGeo}>
        <pointsMaterial
          color="#e2e8f0"
          size={0.35}
          transparent
          opacity={isMars ? 0.25 : 0.85}
          sizeAttenuation
        />
      </points>

      {terrainGeo && terrainTex && (
        <>
          <mesh geometry={terrainGeo} receiveShadow>
            <meshStandardMaterial
              map={terrainTex}
              color={isMars ? '#b4532a' : isEros ? '#8c8376' : '#949aa3'}
              roughness={0.94}
              metalness={0.02}
            />
          </mesh>
          <instancedMesh
            ref={rocksRef}
            args={[undefined, undefined, mission.terrainProfile === 'flood-plain' ? 85 : 65]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={isMars ? '#7c3519' : '#646a73'}
              roughness={0.95}
              metalness={0.02}
            />
          </instancedMesh>
        </>
      )}

      {isMoon && (
        <mesh position={[-22, 16, -34]}>
          <sphereGeometry args={[2.4, 28, 20]} />
          <meshStandardMaterial map={earthTex} roughness={0.6} />
        </mesh>
      )}

      {isCeres && (
        <mesh position={[0, -14.5, -4]} rotation={[0.4, 0, 0]}>
          <sphereGeometry args={[12.5, 48, 36]} />
          <meshStandardMaterial map={ceresTex} roughness={0.92} />
        </mesh>
      )}

      {mission.id === 'pioneer-10-11' && (
        <group>
          <mesh position={[-18, 4, -28]}>
            <sphereGeometry args={[4.2, 32, 24]} />
            <meshStandardMaterial map={jupiterTex} roughness={0.75} />
          </mesh>
          <sprite position={[24, 12, -45]} scale={[6, 6, 1]}>
            <spriteMaterial map={sunGlowTex} color="#fde68a" transparent opacity={0.85} />
          </sprite>
        </group>
      )}

      {mission.id === 'kepler-telescope' && (
        <sprite position={[22, 9, -38]} scale={[7, 7, 1]}>
          <spriteMaterial map={sunGlowTex} color="#fb923c" transparent opacity={0.8} />
        </sprite>
      )}

      <group ref={stageGroupRef}>
        {customGlbScene ? (
          <primitive object={customGlbScene} />
        ) : (
          <ProceduralArtifactModel missionId={mission.id} refsOut={animRefs} />
        )}

        {mission.id === 'apollo-lunar-modules' && (
          <mesh ref={ascentPlumeRef} position={[0, 1.32, 0]} visible={false}>
            <coneGeometry args={[0.25, 0.9, 16]} />
            <meshBasicMaterial color="#fed7aa" transparent opacity={0.82} />
          </mesh>
        )}
      </group>
    </>
  );
}

export const ArtifactDetailScene: React.FC = () => {
  const selectedMissionId = useAppStore((s) => s.selectedMissionId);
  const mission = selectedMissionId ? MISSION_MAP.get(selectedMissionId) : null;

  if (!mission) return null;

  return (
    <Canvas
      shadows={!isSoftwareGl}
      dpr={isSoftwareGl ? 1 : [1, 2]}
      camera={{ position: [10, 5, 11], fov: 42, near: 0.1, far: 400 }}
      gl={{
        antialias: !isSoftwareGl,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
        powerPreference: 'high-performance',
      }}
    >
      <StudioEnvSetup />
      <ArtifactSceneContent mission={mission} />
    </Canvas>
  );
};
