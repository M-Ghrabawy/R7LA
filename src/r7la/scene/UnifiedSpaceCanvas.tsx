import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { MISSIONS, MissionArtifact } from '../data/missions';
import { ObservatoryFilter, useAppStore } from '../store/useAppStore';
import { applyStudioEnvironment, isSoftwareGl } from './glConfig';
import {
  getPadGroundTexture,
  getPlanetTexture,
  getRadialGlowTexture,
  getRocketHullTexture,
  getSaturnRingTexture,
} from './textures';
import { createPlanetTexture } from '@/lib/planet-texture';
import { getVectorPlanetTexture } from './vectorPlanets';

const PARTICLE_COUNT = 220;
const _dummy = new THREE.Object3D();
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vC = new THREE.Vector3();

interface PlanetDef {
  id: string;
  name: string;
  radius: number;
  semiMajor: number;
  eccentricity: number;
  initialAngle: number;
  orbitSpeed: number;
  spinSpeed: number;
  orbitColor: string;
  texKey:
    | 'mercury'
    | 'venus'
    | 'earth'
    | 'mars'
    | 'jupiter'
    | 'saturn'
    | 'uranus'
    | 'neptune';
  hasRing?: boolean;
}

const PLANETS: PlanetDef[] = [
  { id: 'mercury', name: 'MERCURY', radius: 0.34, semiMajor: 5.5, eccentricity: 0.16, initialAngle: 0.7, orbitSpeed: 0.16, spinSpeed: 0.08, orbitColor: '#64748b', texKey: 'mercury' },
  { id: 'venus', name: 'VENUS', radius: 0.56, semiMajor: 8.2, eccentricity: 0.015, initialAngle: 2.3, orbitSpeed: 0.11, spinSpeed: -0.04, orbitColor: '#d97706', texKey: 'venus' },
  { id: 'earth', name: 'EARTH', radius: 0.64, semiMajor: 11.8, eccentricity: 0.025, initialAngle: 0.35, orbitSpeed: 0.075, spinSpeed: 0.35, orbitColor: '#38bdf8', texKey: 'earth' },
  { id: 'mars', name: 'MARS', radius: 0.52, semiMajor: 16.4, eccentricity: 0.09, initialAngle: 1.45, orbitSpeed: 0.048, spinSpeed: 0.32, orbitColor: '#ea580c', texKey: 'mars' },
  { id: 'jupiter', name: 'JUPITER', radius: 1.72, semiMajor: 27.5, eccentricity: 0.048, initialAngle: 2.85, orbitSpeed: 0.022, spinSpeed: 0.55, orbitColor: '#d97706', texKey: 'jupiter' },
  { id: 'saturn', name: 'SATURN', radius: 1.42, semiMajor: 34.5, eccentricity: 0.055, initialAngle: 4.45, orbitSpeed: 0.014, spinSpeed: 0.48, orbitColor: '#eab308', texKey: 'saturn', hasRing: true },
  { id: 'uranus', name: 'URANUS', radius: 0.92, semiMajor: 40.5, eccentricity: 0.046, initialAngle: 0.95, orbitSpeed: 0.009, spinSpeed: -0.35, orbitColor: '#22d3ee', texKey: 'uranus' },
  { id: 'neptune', name: 'NEPTUNE', radius: 0.88, semiMajor: 45.5, eccentricity: 0.012, initialAngle: 3.7, orbitSpeed: 0.006, spinSpeed: 0.38, orbitColor: '#3b82f6', texKey: 'neptune' },
];

const ATMOSPHERE: Record<string, { color: string; opacity: number }> = {
  venus: { color: '#e8c07a', opacity: 0.07 },
  earth: { color: '#4f9fd8', opacity: 0.11 },
  mars: { color: '#b65c3e', opacity: 0.06 },
  jupiter: { color: '#d8b48a', opacity: 0.045 },
  saturn: { color: '#d8c08a', opacity: 0.045 },
  uranus: { color: '#7fd8e8', opacity: 0.075 },
  neptune: { color: '#4f7fd8', opacity: 0.075 },
};

function getEllipticalPosition(
  semiMajor: number,
  eccentricity: number,
  angle: number,
  inclination = 0,
  out: THREE.Vector3
): THREE.Vector3 {
  const r = (semiMajor * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(angle));
  out.set(Math.cos(angle) * r, Math.sin(angle) * r * Math.sin(inclination), Math.sin(angle) * r);
  return out;
}

function buildEllipticalOrbitPoints(
  semiMajor: number,
  eccentricity: number,
  inclination = 0,
  segments = 140
): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const tmp = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    getEllipticalPosition(semiMajor, eccentricity, a, inclination, tmp);
    pts.push([tmp.x, tmp.y, tmp.z]);
  }
  return pts;
}

/** Converts geographic lat/lon degrees onto exact local sphere coordinates */
function latLonToLocalVec3(latDeg: number, lonDeg: number, radius: number): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - latDeg);
  const theta = THREE.MathUtils.degToRad(lonDeg + 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createNozzleBellGeometry(throatR: number, exitR: number, height: number): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const r = THREE.MathUtils.lerp(throatR, exitR, Math.pow(t, 0.7));
    const y = -t * height;
    pts.push(new THREE.Vector2(r, y));
  }
  return new THREE.LatheGeometry(pts, 20);
}

function StudioEnvSetup() {
  const { gl, scene } = useThree();
  useEffect(() => {
    return applyStudioEnvironment(gl, scene, 0.45);
  }, [gl, scene]);
  return null;
}

function GreenStarBeacon({
  mission,
  localPos,
  visible,
  onSelectTarget,
}: {
  mission: MissionArtifact;
  localPos: THREE.Vector3;
  visible: boolean;
  onSelectTarget: (missionId: string, worldPos: THREE.Vector3) => void;
}) {
  const hoveredMissionId = useAppStore((s) => s.hoveredMissionId);
  const setHoveredMission = useAppStore((s) => s.setHoveredMission);

  const starRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Sprite>(null);
  const glowTex = useMemo(() => getRadialGlowTexture('#10b981'), []);
  const isHovered = hoveredMissionId === mission.id;

  useFrame((state) => {
    if (!visible) return;
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 3.1 + localPos.x * 4) * 0.22;
    if (starRef.current) {
      const s = isHovered ? 1.5 : pulse;
      starRef.current.scale.setScalar(s);
      starRef.current.rotation.y = t * 0.9;
    }
    if (haloRef.current) {
      haloRef.current.material.opacity = isHovered ? 0.95 : 0.68 + Math.sin(t * 3.1) * 0.2;
    }
  });

  if (!visible) return null;

  const triggerClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (starRef.current) {
      starRef.current.getWorldPosition(_vC);
      onSelectTarget(mission.id, _vC.clone());
    }
  };

  return (
    <group ref={starRef} position={localPos}>
      {/* Emerald-green glowing star halo */}
      <sprite ref={haloRef} scale={[0.24, 0.24, 1]}>
        <spriteMaterial
          map={glowTex}
          color="#10b981"
          transparent
          opacity={0.82}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* Crisp Star Core */}
      <mesh
        onClick={triggerClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredMission(mission.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (hoveredMissionId === mission.id) setHoveredMission(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <octahedronGeometry args={[0.042, 0]} />
        <meshBasicMaterial color={isHovered ? '#6ee7b7' : '#10b981'} />
      </mesh>
      {/* Generous invisible pointer target */}
      <mesh
        onClick={triggerClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredMission(mission.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (hoveredMissionId === mission.id) setHoveredMission(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {isHovered && (
        <Html position={[0, 0.16, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="px-2.5 py-1 bg-[#05080F]/95 border border-[#10B981]/60 text-[#F8FAFC] text-[11px] font-medium tracking-wide whitespace-nowrap">
            <span className="text-[#10B981] mr-1.5">★</span>
            <span>{mission.name}</span>
            {mission.placement.surfaceCoords && (
              <span className="ml-2 text-[10px] font-mono text-[#94A3B8]">
                {mission.placement.surfaceCoords.siteName}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

function UnifiedSpaceWorld() {
  const act = useAppStore((s) => s.act);
  const launchPhase = useAppStore((s) => s.launchPhase);
  const setLaunchPhase = useAppStore((s) => s.setLaunchPhase);
  const setAct = useAppStore((s) => s.setAct);
  const observatoryFilter = useAppStore((s) => s.observatoryFilter);
  const cameraResetNonce = useAppStore((s) => s.cameraResetNonce);
  const orbitPlaying = useAppStore((s) => s.orbitPlaying);
  const orbitSpeed = useAppStore((s) => s.orbitSpeed);
  const approachingMissionId = useAppStore((s) => s.approachingMissionId);
  const setApproachingMission = useAppStore((s) => s.setApproachingMission);
  const selectMission = useAppStore((s) => s.selectMission);

  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Act I Launchpad Refs
  const launchpadGroupRef = useRef<THREE.Group>(null);
  const coreStageRef = useRef<THREE.Group>(null);
  const upperStageRef = useRef<THREE.Group>(null);
  const nozzleClusterRef = useRef<THREE.Group>(null);
  const arm1Ref = useRef<THREE.Group>(null);
  const arm2Ref = useRef<THREE.Group>(null);
  const crewArmRef = useRef<THREE.Group>(null);
  const exhaustLightRef = useRef<THREE.PointLight>(null);
  const plumeCoreRef = useRef<THREE.Mesh>(null);
  const upperPlumeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const earthLimbRef = useRef<THREE.Group>(null);

  // Act II Solar System Refs
  const solarGroupRef = useRef<THREE.Group>(null);
  const planetContainerRefs = useRef<Record<string, THREE.Group | null>>({});
  const planetSpinRefs = useRef<Record<string, THREE.Group | null>>({});
  const moonContainerRef = useRef<THREE.Group>(null);
  const moonSpinRef = useRef<THREE.Group>(null);
  const ceresContainerRef = useRef<THREE.Group>(null);
  const erosContainerRef = useRef<THREE.Group>(null);
  const keplerBeaconRef = useRef<THREE.Group>(null);
  const pioneerBeaconRef = useRef<THREE.Group>(null);
  const beltRef = useRef<THREE.InstancedMesh>(null);
  const starsRef = useRef<THREE.Points>(null);

  // Dynamic orbital angles (persisted across frames for live Keplerian motion)
  const simTimeRef = useRef(0);
  const planetAngles = useRef<Record<string, number>>(
    Object.fromEntries(PLANETS.map((p) => [p.id, p.initialAngle]))
  );
  const moonAngleRef = useRef(0.6);
  const ceresAngleRef = useRef(0.9);
  const erosAngleRef = useRef(4.1);

  // Launch timeline state
  const launchTimer = useRef(0);
  const altitude = useRef(0);
  const velocity = useRef(0);
  const pitchAngle = useRef(0);
  const downrangeX = useRef(0);
  const separationOffset = useRef(0);
  const currentLookAt = useRef(new THREE.Vector3(0, 6.8, 0));

  // Observatory camera focus / dive transition state
  const camTransitionActive = useRef(false);
  const desiredCamPos = useRef(new THREE.Vector3(22, 24, 34));
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0));
  const approachTimer = useRef(0);
  const approachWorldTarget = useRef(new THREE.Vector3());

  // Textures & Shaders
  const hullTex = useMemo(() => getRocketHullTexture(), []);
  const glowTex = useMemo(() => getRadialGlowTexture('#ffaa44'), []);
  const sunTex = useMemo(() => getPlanetTexture('sun'), []);
  const sunGlowTex = useMemo(() => getRadialGlowTexture('#fb923c'), []);
  const earthTex = useMemo(() => getPlanetTexture('earth'), []);
  const moonTex = useMemo(() => {
    const map = new THREE.CanvasTexture(createPlanetTexture('Moon'));
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.anisotropy = 8;
    return map;
  }, []);
  const marsTex = useMemo(() => {
    const map = new THREE.CanvasTexture(createPlanetTexture('Mars'));
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.anisotropy = 8;
    return map;
  }, []);
  const ceresTex = useMemo(() => getVectorPlanetTexture('ceres'), []);
  const erosTex = useMemo(() => getVectorPlanetTexture('eros'), []);
  const saturnRingTex = useMemo(() => getSaturnRingTexture(), []);
  const padGroundTex = useMemo(() => getPadGroundTexture(), []);
  const lampGlowTex = useMemo(() => getRadialGlowTexture('#e8f4ff'), []);
  const steamTex = useMemo(() => getRadialGlowTexture('#cbd5e1'), []);
  const lightPoolTex = useMemo(() => getRadialGlowTexture('#9fd8e8'), []);

  const coreBellGeo = useMemo(() => createNozzleBellGeometry(0.18, 0.36, 0.72), []);
  const boosterBellGeo = useMemo(() => createNozzleBellGeometry(0.15, 0.3, 0.56), []);

  // Layered Atmospheric Sky Dome Shader (Blue -> Stratosphere Violet -> Space Blackness)
  const skyUniforms = useMemo(
    () => ({
      uSpaceFactor: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  );

  const skyShaderMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      transparent: true,
      uniforms: skyUniforms,
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform float uSpaceFactor;
        uniform float uTime;
        varying vec3 vWorldPos;

        void main() {
          vec3 dir = normalize(vWorldPos);
          float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

          // Stage 0: Pre-dawn night sky over the launch complex
          vec3 lowBlue = vec3(0.035, 0.095, 0.135);
          vec3 midBlue = vec3(0.008, 0.026, 0.048);
          vec3 skyBlue = mix(lowBlue, midBlue, smoothstep(0.40, 0.9, h));

          // Stage 1: Upper atmosphere
          vec3 horizonViolet = vec3(0.045, 0.085, 0.145);
          vec3 zenithViolet = vec3(0.006, 0.014, 0.03);
          vec3 stratosphere = mix(horizonViolet, zenithViolet, smoothstep(0.35, 0.85, h));

          // Stage 2: Star-Filled Orbital Blackness
          vec3 spaceBlack = vec3(0.008, 0.012, 0.02);

          vec3 col = mix(skyBlue, stratosphere, smoothstep(0.15, 0.58, uSpaceFactor));
          col = mix(col, spaceBlack, smoothstep(0.55, 0.92, uSpaceFactor));

          // Faint teal horizon scattering, then fade out with altitude
          float sunAlign = max(0.0, dot(dir, normalize(vec3(0.75, 0.18, 0.55))));
          col += vec3(0.10, 0.30, 0.34) * pow(sunAlign, 8.0) * (1.0 - smoothstep(0.2, 0.75, uSpaceFactor));

          float alpha = 0.9 - smoothstep(0.82, 1.0, uSpaceFactor) * 0.9;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
  }, [skyUniforms]);

  // Cryogenic Frost Shader on Rocket Core Tank
  const frostUniforms = useMemo(
    () => ({
      uFrostAmount: { value: 1.0 },
      uTime: { value: 0 },
    }),
    []
  );

  const frostMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: frostUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uFrostAmount;
        uniform float uTime;
        varying vec2 vUv;
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        void main() {
          float n = hash(floor(vUv * 42.0));
          float band = smoothstep(0.18, 0.35, vUv.y) * (1.0 - smoothstep(0.68, 0.88, vUv.y));
          float ice = (0.55 + 0.45 * n) * band * uFrostAmount;
          float shimmer = 0.85 + 0.15 * sin(uTime * 3.0 + vUv.y * 24.0);
          gl_FragColor = vec4(vec3(0.84, 0.93, 1.0) * shimmer, ice * 0.42);
        }
      `,
    });
  }, [frostUniforms]);

  // Starfield Background
  const starfieldGeo = useMemo(() => {
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 135 + Math.random() * 210;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const tint = Math.random();
      if (tint > 0.82) c.set('#bfdbfe');
      else if (tint < 0.15) c.set('#fde68a');
      else c.set('#f8fafc');
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Exhaust / Deluge Steam Particles
  const particleState = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      age: (i / PARTICLE_COUNT) * 1.4,
      life: 0.9 + Math.random() * 0.65,
      vx: (Math.random() - 0.5) * 4,
      vy: -5 - Math.random() * 6,
      vz: (Math.random() - 0.5) * 4,
      px: 0,
      py: 0,
      pz: 0,
    }));
  }, []);

  // Asteroid Belt InstancedMesh
  useEffect(() => {
    if (!beltRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < 460; i++) {
      const ang = (i / 460) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
      const r = 19.4 + Math.random() * 4.5;
      const y = (Math.random() - 0.5) * 0.95;
      dummy.position.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
      dummy.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      const s = 0.045 + Math.random() * 0.095;
      dummy.scale.set(s, s * 0.78, s * 1.15);
      dummy.updateMatrix();
      beltRef.current.setMatrixAt(i, dummy.matrix);
      const shade = 0.45 + Math.random() * 0.35;
      color.setRGB(shade, shade * 0.95, shade * 0.88);
      beltRef.current.setColorAt(i, color);
    }
    beltRef.current.instanceMatrix.needsUpdate = true;
    if (beltRef.current.instanceColor) beltRef.current.instanceColor.needsUpdate = true;
    beltRef.current.computeBoundingSphere();
  }, []);

  // Precomputed elliptical orbit lines
  const orbitLines = useMemo(() => {
    return PLANETS.map((p) => ({
      id: p.id,
      color: p.orbitColor,
      points: buildEllipticalOrbitPoints(p.semiMajor, p.eccentricity),
    }));
  }, []);

  const ceresOrbitPts = useMemo(() => buildEllipticalOrbitPoints(21.5, 0.076, 0.04), []);
  const erosOrbitPts = useMemo(() => buildEllipticalOrbitPoints(15.8, 0.22, -0.06), []);

  // Background Voyager-like interstellar arc (not a green-star target)
  const backgroundVoyagerArc = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const r = 12 + t * 44;
      const ang = 2.0 + t * 1.4;
      pts.push([Math.cos(ang) * r, t * 4.5, Math.sin(ang) * r]);
    }
    return pts;
  }, []);

  // Handle Skip Intro or direct Observatory entry
  useEffect(() => {
    if (act === 'observatory' && launchPhase === 'idle') {
      skyUniforms.uSpaceFactor.value = 1.0;
      if (launchpadGroupRef.current) launchpadGroupRef.current.visible = false;
      if (solarGroupRef.current) {
        solarGroupRef.current.visible = true;
        solarGroupRef.current.scale.setScalar(1);
      }
      if (starsRef.current) {
        (starsRef.current.material as THREE.PointsMaterial).opacity = 0.88;
      }
      camTransitionActive.current = true;
    } else if (act === 'launchpad' && launchPhase === 'idle') {
      launchTimer.current = 0;
      altitude.current = 0;
      velocity.current = 0;
      pitchAngle.current = 0;
      downrangeX.current = 0;
      separationOffset.current = 0;
      skyUniforms.uSpaceFactor.value = 0;
      frostUniforms.uFrostAmount.value = 1.0;
      if (launchpadGroupRef.current) launchpadGroupRef.current.visible = true;
      if (solarGroupRef.current) solarGroupRef.current.visible = false;
      camera.position.set(14.5, 5.2, 16.5);
      currentLookAt.current.set(0, 6.8, 0);
      camera.lookAt(currentLookAt.current);
    }
  }, [act, launchPhase, camera, skyUniforms, frostUniforms]);

  // Update Observatory camera target on filter / reset
  useEffect(() => {
    if (act !== 'observatory') return;
    camTransitionActive.current = true;
    if (observatoryFilter === 'moon') {
      const earth = planetContainerRefs.current['earth'];
      const moon = moonContainerRef.current;
      if (earth && moon) {
        earth.getWorldPosition(_vA);
        moon.getWorldPosition(_vB);
        desiredTarget.current.copy(_vB);
        desiredCamPos.current.set(_vB.x + 1.05, _vB.y + 0.65, _vB.z + 1.15);
        return;
      }
    } else if (observatoryFilter === 'mars') {
      const mars = planetContainerRefs.current['mars'];
      if (mars) {
        mars.getWorldPosition(_vA);
        desiredTarget.current.copy(_vA);
        desiredCamPos.current.set(_vA.x + 1.45, _vA.y + 0.85, _vA.z + 1.65);
        return;
      }
    } else if (observatoryFilter === 'deep-space') {
      desiredTarget.current.set(0, 0, 0);
      desiredCamPos.current.set(34, 30, 44);
      return;
    }
    desiredTarget.current.set(0, 0, 0);
    desiredCamPos.current.set(22, 24, 34);
  }, [act, observatoryFilter, cameraResetNonce]);

  const handleSelectBeacon = (missionId: string, worldPos: THREE.Vector3) => {
    approachWorldTarget.current.copy(worldPos);
    approachTimer.current = 0;
    setApproachingMission(missionId);
  };

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    skyUniforms.uTime.value = t;
    frostUniforms.uTime.value = t;

    // 1. LIVE KEPLERIAN ORBITAL DYNAMICS (active during Observatory)
    const timeStep = act === 'observatory' && orbitPlaying && !approachingMissionId ? dt * orbitSpeed : 0;
    simTimeRef.current += timeStep;

    for (const p of PLANETS) {
      planetAngles.current[p.id] += p.orbitSpeed * timeStep * 0.35;
      const container = planetContainerRefs.current[p.id];
      if (container) {
        getEllipticalPosition(p.semiMajor, p.eccentricity, planetAngles.current[p.id], 0, _vA);
        container.position.copy(_vA);
      }
      const spinner = planetSpinRefs.current[p.id];
      if (spinner) {
        spinner.rotation.y += p.spinSpeed * (timeStep > 0 ? timeStep * 0.6 : dt * 0.05);
      }
    }

    // Orbiting Moon around Earth
    moonAngleRef.current += 0.38 * timeStep;
    if (moonContainerRef.current) {
      moonContainerRef.current.position.set(
        Math.cos(moonAngleRef.current) * 1.85,
        Math.sin(moonAngleRef.current) * 0.14,
        Math.sin(moonAngleRef.current) * 1.85
      );
    }
    if (moonSpinRef.current) {
      moonSpinRef.current.rotation.y += (timeStep > 0 ? timeStep * 0.35 : dt * 0.06);
    }

    // Orbiting Ceres & 433 Eros
    ceresAngleRef.current += 0.032 * timeStep;
    if (ceresContainerRef.current) {
      getEllipticalPosition(21.5, 0.076, ceresAngleRef.current, 0.04, _vA);
      ceresContainerRef.current.position.copy(_vA);
      ceresContainerRef.current.rotation.y += dt * 0.15;
    }

    erosAngleRef.current += 0.055 * timeStep;
    if (erosContainerRef.current) {
      getEllipticalPosition(15.8, 0.22, erosAngleRef.current, -0.06, _vA);
      erosContainerRef.current.position.copy(_vA);
      erosContainerRef.current.rotation.y += dt * 0.2;
    }

    // Kepler Earth-Trailing Position
    if (keplerBeaconRef.current) {
      const earthAngle = planetAngles.current['earth'] - 0.22;
      getEllipticalPosition(11.8, 0.025, earthAngle, 0.01, _vA);
      keplerBeaconRef.current.position.set(_vA.x, _vA.y + 0.22, _vA.z);
    }

    // Pioneer 10 & 11 Deep-Space Outer Position
    if (pioneerBeaconRef.current) {
      pioneerBeaconRef.current.position.set(
        Math.cos(5.2) * 43,
        2.2,
        Math.sin(5.2) * 43
      );
    }

    // 2. ACT I: SEAMLESS 9.5-SECOND LAUNCH & ATMOSPHERIC TRANSITION (ZERO BLACK CUTS)
    if (act === 'launchpad') {
      if (launchPhase === 'idle') {
        const orbitIdle = t * 0.12;
        _vA.set(Math.sin(orbitIdle) * 13.5 + 5, 4.8, Math.cos(orbitIdle) * 13.5 + 9);
        _vB.set(0, 6.8, 0);
        camera.position.lerp(_vA, 1 - Math.exp(-3 * dt));
        currentLookAt.current.lerp(_vB, 1 - Math.exp(-4 * dt));
        camera.lookAt(currentLookAt.current);

        if (plumeCoreRef.current) plumeCoreRef.current.visible = false;
        if (upperPlumeRef.current) upperPlumeRef.current.visible = false;
        if (particlesRef.current) particlesRef.current.visible = false;
        if (exhaustLightRef.current) exhaustLightRef.current.intensity = 0;
        if (earthLimbRef.current) earthLimbRef.current.visible = false;
        if (starsRef.current) {
          (starsRef.current.material as THREE.PointsMaterial).opacity = 0.42;
        }
        return;
      }

      launchTimer.current += dt;

      // Retract umbilical & crew access arms smoothly
      if (arm1Ref.current) arm1Ref.current.rotation.y = THREE.MathUtils.damp(arm1Ref.current.rotation.y, 1.25, 3.6, dt);
      if (arm2Ref.current) arm2Ref.current.rotation.y = THREE.MathUtils.damp(arm2Ref.current.rotation.y, 1.25, 3.6, dt);
      if (crewArmRef.current) crewArmRef.current.rotation.y = THREE.MathUtils.damp(crewArmRef.current.rotation.y, -1.35, 3.2, dt);

      if (launchPhase === 'igniting') {
        frostUniforms.uFrostAmount.value = Math.max(0.5, frostUniforms.uFrostAmount.value - dt * 0.22);
        if (launchTimer.current > 1.7) {
          setLaunchPhase('ascending');
        }
      } else if (launchPhase === 'ascending') {
        velocity.current = Math.min(36, velocity.current + dt * 7.8);
        altitude.current += velocity.current * dt;
        // Gravity turn pitch-over above pad tower
        const targetPitch = THREE.MathUtils.clamp((altitude.current - 14) / 70, 0, 0.52);
        pitchAngle.current = THREE.MathUtils.damp(pitchAngle.current, targetPitch, 2.2, dt);
        downrangeX.current += Math.sin(pitchAngle.current) * velocity.current * dt * 0.55;
        frostUniforms.uFrostAmount.value = Math.max(0, frostUniforms.uFrostAmount.value - dt * 0.35);

        if (altitude.current > 96) {
          launchTimer.current = 0;
          setLaunchPhase('meco');
        }
      } else if (launchPhase === 'meco') {
        // Main Engine Cutoff & Stage Separation in Low Orbit
        velocity.current = THREE.MathUtils.damp(velocity.current, 14, 1.8, dt);
        altitude.current += velocity.current * dt * 0.45;
        downrangeX.current += Math.sin(pitchAngle.current) * velocity.current * dt * 0.35;
        separationOffset.current += dt * 4.8;

        if (launchTimer.current > 1.9) {
          launchTimer.current = 0;
          if (solarGroupRef.current) {
            solarGroupRef.current.visible = true;
            solarGroupRef.current.scale.setScalar(0.06);
          }
          setLaunchPhase('pullback');
        }
      } else if (launchPhase === 'pullback') {
        // Continuous pullback from Low Earth Orbit straight into Panoramic Solar System Observatory
        const pullT = THREE.MathUtils.clamp(launchTimer.current / 2.1, 0, 1);
        const smoothPull = pullT * pullT * (3 - 2 * pullT);

        if (solarGroupRef.current) {
          solarGroupRef.current.visible = true;
          solarGroupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.08, 1.0, smoothPull));
        }
        if (launchpadGroupRef.current) {
          launchpadGroupRef.current.visible = pullT < 0.72;
        }

        // Blend camera seamlessly from upper stage orbital view -> Observatory overview [22, 24, 34]
        const startX = downrangeX.current + 12;
        const startY = altitude.current + 4;
        _vA.set(
          THREE.MathUtils.lerp(startX, 22, smoothPull),
          THREE.MathUtils.lerp(startY, 24, smoothPull),
          THREE.MathUtils.lerp(18, 34, smoothPull)
        );
        _vB.set(
          THREE.MathUtils.lerp(downrangeX.current, 0, smoothPull),
          THREE.MathUtils.lerp(altitude.current + 8, 0, smoothPull),
          0
        );
        camera.position.lerp(_vA, 1 - Math.exp(-5.5 * dt));
        currentLookAt.current.lerp(_vB, 1 - Math.exp(-6 * dt));
        camera.lookAt(currentLookAt.current);

        if (pullT >= 1.0) {
          if (launchpadGroupRef.current) launchpadGroupRef.current.visible = false;
          setLaunchPhase('idle');
          setAct('observatory');
        }
        return;
      }

      // Position Core Stage & Upper Stage
      const alt = altitude.current;
      const dx = downrangeX.current;
      const shake =
        launchPhase === 'igniting'
          ? 0.055
          : launchPhase === 'ascending'
            ? Math.max(0.008, 0.035 - alt * 0.0003)
            : 0;

      if (coreStageRef.current) {
        const sep = separationOffset.current;
        coreStageRef.current.position.set(
          dx - Math.sin(pitchAngle.current) * sep + (Math.random() - 0.5) * shake,
          alt - Math.cos(pitchAngle.current) * sep,
          (Math.random() - 0.5) * shake
        );
        coreStageRef.current.rotation.set(0, 0, -pitchAngle.current - sep * 0.035);
      }

      if (upperStageRef.current) {
        const lead = launchPhase === 'meco' ? separationOffset.current * 0.35 : 0;
        upperStageRef.current.position.set(
          dx + Math.sin(pitchAngle.current) * lead + (Math.random() - 0.5) * shake * 0.6,
          alt + Math.cos(pitchAngle.current) * lead,
          (Math.random() - 0.5) * shake * 0.6
        );
        upperStageRef.current.rotation.set(0, 0, -pitchAngle.current);
      }

      // Gimbaled engine bells subtle vectoring during gravity turn
      if (nozzleClusterRef.current) {
        nozzleClusterRef.current.rotation.z =
          launchPhase === 'ascending' ? Math.sin(t * 7) * 0.04 + pitchAngle.current * 0.14 : 0;
      }

      const enginesFiring = launchPhase === 'igniting' || launchPhase === 'ascending';
      if (plumeCoreRef.current) {
        plumeCoreRef.current.visible = enginesFiring;
        const flicker = 0.9 + Math.sin(t * 54) * 0.1;
        plumeCoreRef.current.scale.set(flicker, 1.15 + Math.min(2.4, alt * 0.04), flicker);
      }
      if (upperPlumeRef.current) {
        upperPlumeRef.current.visible = launchPhase === 'meco' && launchTimer.current > 0.6;
      }
      if (exhaustLightRef.current) {
        exhaustLightRef.current.position.set(dx, alt + 0.5, 0);
        exhaustLightRef.current.intensity = enginesFiring ? 52 + Math.sin(t * 40) * 9 : 0;
      }

      // Exhaust & Deluge Steam Particles
      if (particlesRef.current) {
        particlesRef.current.visible = enginesFiring || alt < 40;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particleState[i];
          p.age += dt;
          if (p.age >= p.life && enginesFiring) {
            p.age = 0;
            p.px = dx + (Math.random() - 0.5) * 0.9;
            p.py = alt + 0.5;
            p.pz = (Math.random() - 0.5) * 0.9;
            const spread = alt < 4 ? 5.6 : 1.9;
            p.vx = (Math.random() - 0.5) * spread - Math.sin(pitchAngle.current) * 4;
            p.vy = -6.5 - Math.random() * 5.5;
            p.vz = (Math.random() - 0.5) * spread;
          }
          p.px += p.vx * dt;
          p.py += p.vy * dt;
          p.pz += p.vz * dt;
          if (p.py < 0.45) {
            p.py = 0.45;
            p.vx *= 1.05;
            p.vz *= 1.05;
          }
          const progress = Math.min(1, p.age / p.life);
          const scale = (0.5 + progress * 2.3) * (enginesFiring ? 1 : 0.7);
          _dummy.position.set(p.px, p.py, p.pz);
          _dummy.scale.setScalar(Math.max(0.01, scale * (1 - progress * 0.4)));
          _dummy.updateMatrix();
          particlesRef.current.setMatrixAt(i, _dummy.matrix);
        }
        particlesRef.current.instanceMatrix.needsUpdate = true;
      }

      // Continuous Atmospheric Shader & Curved Earth Limb Reveal
      const spaceFactor = THREE.MathUtils.clamp(alt / 78, 0, 1);
      skyUniforms.uSpaceFactor.value = spaceFactor;
      if (starsRef.current) {
        (starsRef.current.material as THREE.PointsMaterial).opacity = THREE.MathUtils.lerp(
          0.08,
          0.92,
          spaceFactor
        );
      }
      if (earthLimbRef.current) {
        earthLimbRef.current.visible = spaceFactor > 0.35;
        earthLimbRef.current.position.set(dx - 18, alt - 56, -24);
      }

      // Camera Follow
      const shakeCam = launchPhase === 'igniting' ? 0.09 : launchPhase === 'ascending' ? 0.045 : 0;
      _vA.set(
        dx + 11.5 + (Math.random() - 0.5) * shakeCam,
        Math.max(3.8, alt + 3.6),
        16.5 + alt * 0.1 + (Math.random() - 0.5) * shakeCam
      );
      _vB.set(dx, alt + 7.2, 0);
      camera.position.lerp(_vA, 1 - Math.exp(-5.2 * dt));
      currentLookAt.current.lerp(_vB, 1 - Math.exp(-6.2 * dt));
      camera.lookAt(currentLookAt.current);
      return;
    }

    // 3. ACT II: BEACON DIVE-IN APPROACH OR FILTER FOCUS TRANSITION
    if (act === 'observatory' && controlsRef.current) {
      if (approachingMissionId) {
        approachTimer.current += dt;
        const diveT = THREE.MathUtils.clamp(approachTimer.current / 0.72, 0, 1);
        _vA.copy(approachWorldTarget.current).add(new THREE.Vector3(0.45, 0.3, 0.55));
        camera.position.lerp(_vA, 1 - Math.exp(-6.5 * dt));
        controlsRef.current.target.lerp(approachWorldTarget.current, 1 - Math.exp(-8 * dt));
        controlsRef.current.update();
        if (diveT >= 1.0) {
          selectMission(approachingMissionId);
        }
        return;
      }

      if (camTransitionActive.current) {
        camera.position.lerp(desiredCamPos.current, 1 - Math.exp(-3.8 * dt));
        controlsRef.current.target.lerp(desiredTarget.current, 1 - Math.exp(-4.2 * dt));
        controlsRef.current.update();
        if (
          camera.position.distanceTo(desiredCamPos.current) < 0.08 &&
          controlsRef.current.target.distanceTo(desiredTarget.current) < 0.05
        ) {
          camTransitionActive.current = false;
        }
      }
    }
  });

  // Group Moon and Mars surface missions onto their rotating globe meshes
  const moonMissions = useMemo(
    () => MISSIONS.filter((m) => m.placement.parentBody === 'moon'),
    []
  );
  const marsMissions = useMemo(
    () => MISSIONS.filter((m) => m.placement.parentBody === 'mars'),
    []
  );
  const ceresMission = useMemo(
    () => MISSIONS.find((m) => m.id === 'dawn-spacecraft')!,
    []
  );
  const erosMission = useMemo(
    () => MISSIONS.find((m) => m.id === 'near-shoemaker')!,
    []
  );
  const pioneerMission = useMemo(
    () => MISSIONS.find((m) => m.id === 'pioneer-10-11')!,
    []
  );
  const keplerMission = useMemo(
    () => MISSIONS.find((m) => m.id === 'kepler-telescope')!,
    []
  );

  const isVisible = (m: MissionArtifact) =>
    observatoryFilter === 'all' || observatoryFilter === m.category;

  return (
    <>
      <color attach="background" args={['#030508']} />

      {/* Deep Cosmic Starfield (Shared continuously across Launch -> Space -> Solar System) */}
      <points ref={starsRef} geometry={starfieldGeo}>
        <pointsMaterial size={0.38} vertexColors transparent opacity={0.85} sizeAttenuation />
      </points>

      {/* Atmospheric Sky Dome Shader (visible during Launchpad & Atmospheric Ascent) */}
      {act === 'launchpad' && (
        <mesh material={skyShaderMat}>
          <sphereGeometry args={[420, 32, 24]} />
        </mesh>
      )}

      {/* ==================== ACT I: LAUNCHPAD & MULTI-STAGE VEHICLE ==================== */}
      <group ref={launchpadGroupRef} visible={act === 'launchpad'}>
        <directionalLight position={[28, 22, 18]} intensity={0.32} color="#a8c8e8" castShadow={!isSoftwareGl} />
        <hemisphereLight args={['#1b3448', '#04070b', 0.4]} />
        <pointLight position={[-9, 6, 9]} intensity={55} distance={34} decay={1.8} color="#39b9c9" />
        <pointLight position={[9, 6, -9]} intensity={40} distance={34} decay={1.8} color="#e4b44c" />
        <pointLight position={[0, 13, 9]} intensity={95} distance={34} decay={1.7} color="#dbeafe" />
        <pointLight ref={exhaustLightRef} color="#ff9d3b" intensity={0} distance={48} decay={1.6} />

        {/* Launch Complex: night apron, octagonal deck, hazard ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
          <circleGeometry args={[120, 96]} />
          <meshStandardMaterial
            map={padGroundTex}
            transparent
            roughness={1}
            metalness={0}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[15.4, 16.1, 96]} />
          <meshBasicMaterial color="#39b9c9" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.24, 0]} receiveShadow>
          <cylinderGeometry args={[8.6, 9.6, 0.48, 8]} />
          <meshStandardMaterial color="#141c26" roughness={0.88} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.49, 0]} receiveShadow>
          <cylinderGeometry args={[6.7, 6.9, 0.06, 64]} />
          <meshStandardMaterial color="#0b1118" roughness={0.82} metalness={0.28} />
        </mesh>
        {/* Flame trench & blast deflector */}
        <mesh position={[0, 0.5, 0]} receiveShadow>
          <boxGeometry args={[3.4, 0.08, 12.4]} />
          <meshStandardMaterial color="#05080c" roughness={0.96} />
        </mesh>
        <mesh position={[0, 0.82, 0]} rotation={[0, Math.PI / 4, 0]} receiveShadow>
          <cylinderGeometry args={[2.2, 2.7, 0.46, 4]} />
          <meshStandardMaterial color="#1b2530" roughness={0.85} metalness={0.25} />
        </mesh>
        {/* Floodlit pool on the apron */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.53, 0]}>
          <circleGeometry args={[10.5, 64]} />
          <meshBasicMaterial
            map={lightPoolTex}
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Gold hazard ring */}
        {Array.from({ length: 32 }).map((_, i) => {
          const a = (i / 32) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 7.55, 0.52, Math.sin(a) * 7.55]}
              rotation={[0, -a, 0]}
            >
              <boxGeometry args={[0.62, 0.02, 0.3]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#e4b44c' : '#131b24'}
                emissive={i % 2 === 0 ? '#e4b44c' : '#000000'}
                emissiveIntensity={i % 2 === 0 ? 0.28 : 0}
                roughness={0.7}
              />
            </mesh>
          );
        })}
        {/* Hold-down clamps */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => (
          <mesh
            key={i}
            position={[Math.cos(a) * 1.5, 1.02, Math.sin(a) * 1.5]}
            rotation={[0, -a, 0]}
            castShadow
          >
            <boxGeometry args={[0.34, 0.86, 0.5]} />
            <meshStandardMaterial color="#2b3947" metalness={0.8} roughness={0.35} />
          </mesh>
        ))}

        {/* Four perimeter floodlight towers */}
        {[
          [-22, 0, 22],
          [22, 0, 22],
          [-22, 0, -22],
          [22, 0, -22],
        ].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            <mesh position={[0, 3.6, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.16, 7.2, 8]} />
              <meshStandardMaterial color="#2f3d4c" metalness={0.82} roughness={0.36} />
            </mesh>
            {[1.8, 3.6, 5.4].map((y) => (
              <mesh key={y} position={[0, y, 0]}>
                <boxGeometry args={[0.92, 0.05, 0.05]} />
                <meshStandardMaterial color="#43566a" metalness={0.7} roughness={0.4} />
              </mesh>
            ))}
            <group position={[0, 7.35, 0]}>
              <mesh>
                <boxGeometry args={[1.25, 0.42, 0.34]} />
                <meshStandardMaterial color="#0d151d" metalness={0.6} roughness={0.45} />
              </mesh>
              {[-0.4, 0, 0.4].map((x) => (
                <mesh key={x} position={[x, 0, 0.19]}>
                  <boxGeometry args={[0.24, 0.28, 0.04]} />
                  <meshBasicMaterial color="#eaf6ff" />
                </mesh>
              ))}
              <sprite scale={[4.2, 4.2, 1]} position={[0, 0, 0.4]}>
                <spriteMaterial
                  map={lampGlowTex}
                  color="#dbeafe"
                  transparent
                  opacity={0.5}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </sprite>
            </group>
            <spotLight
              position={[0, 7.1, 0]}
              angle={0.62}
              penumbra={0.9}
              intensity={55}
              distance={55}
              decay={1.7}
              color="#dbeafe"
            />
          </group>
        ))}

        {/* Low cryogenic vapour around the mount */}
        {[
          [-4.6, 3.2, 7],
          [4.2, 3.8, 6],
          [3.4, -4.4, 8],
          [-3.8, -3.6, 6.5],
        ].map(([x, z, s], i) => (
          <sprite key={i} position={[x, 1.15, z]} scale={[s, s * 0.55, 1]}>
            <spriteMaterial
              map={steamTex}
              color="#aebfcd"
              transparent
              opacity={0.09}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        ))}

        {/* High-Detail Umbilical Lattice Launch Tower */}
        <group position={[-4.5, 0.72, -1.2]}>
          {/* 4 Corner Main Steel Columns */}
          {[
            [-0.65, -0.65],
            [0.65, -0.65],
            [-0.65, 0.65],
            [0.65, 0.65],
          ].map(([cx, cz], ci) => (
            <mesh key={ci} position={[cx, 7.2, cz]} castShadow>
              <cylinderGeometry args={[0.09, 0.11, 14.4, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.78} roughness={0.42} />
            </mesh>
          ))}
          {/* Horizontal Structural Catwalks & Diagonal Cross Bracing */}
          {[2.2, 4.6, 7.0, 9.4, 11.8, 14.2].map((y, bi) => (
            <group key={bi} position={[0, y, 0]}>
              <mesh castShadow>
                <boxGeometry args={[1.65, 0.16, 1.65]} />
                <meshStandardMaterial color="#334155" metalness={0.75} roughness={0.45} />
              </mesh>
              <mesh position={[0, -1.1, 0.65]} rotation={[0, 0, 0.72]}>
                <boxGeometry args={[0.08, 2.2, 0.08]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} />
              </mesh>
              <mesh position={[0, -1.1, -0.65]} rotation={[0, 0, -0.72]}>
                <boxGeometry args={[0.08, 2.2, 0.08]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} />
              </mesh>
            </group>
          ))}
          {/* Lightning Arrestor Mast */}
          <mesh position={[0, 15.8, 0]}>
            <cylinderGeometry args={[0.03, 0.08, 2.8, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* Retracting Cryogenic Umbilical Swing Arms */}
          <group ref={arm1Ref} position={[0.65, 7.6, 0.2]}>
            <mesh position={[1.7, 0, 0]} castShadow>
              <boxGeometry args={[3.4, 0.22, 0.26]} />
              <meshStandardMaterial color="#64748b" metalness={0.72} roughness={0.38} />
            </mesh>
          </group>
          <group ref={arm2Ref} position={[0.65, 10.6, 0.2]}>
            <mesh position={[1.7, 0, 0]} castShadow>
              <boxGeometry args={[3.4, 0.22, 0.26]} />
              <meshStandardMaterial color="#64748b" metalness={0.72} roughness={0.38} />
            </mesh>
          </group>
          <group ref={crewArmRef} position={[0.65, 12.6, 0.4]}>
            <mesh position={[1.65, 0, 0]}>
              <boxGeometry args={[3.3, 0.38, 0.42]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.45} metalness={0.25} />
            </mesh>
          </group>
        </group>

        {/* CORE STAGE + TWIN BOOSTERS (separates cleanly at MECO) */}
        <group ref={coreStageRef} position={[0, 0, 0]}>
          {/* Main Metallic Panelled Fuselage */}
          <mesh position={[0, 5.4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.9, 0.94, 8.8, 32]} />
            <meshStandardMaterial map={hullTex} roughness={0.38} metalness={0.28} />
          </mesh>
          {/* Cryogenic Frost Shader Overlay */}
          <mesh position={[0, 5.4, 0]} material={frostMat}>
            <cylinderGeometry args={[0.915, 0.955, 8.4, 28]} />
          </mesh>
          {/* Structural External Stringer Ribs */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
            <mesh key={i} position={[Math.sin(ang) * 0.92, 5.4, Math.cos(ang) * 0.92]} rotation={[0, ang, 0]}>
              <boxGeometry args={[0.08, 8.2, 0.08]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
            </mesh>
          ))}
          {/* Corrugated Dark Carbon Interstage Ring & Separation Flange */}
          <mesh position={[0, 9.85, 0]} castShadow>
            <cylinderGeometry args={[0.91, 0.91, 0.85, 28]} />
            <meshStandardMaterial color="#181e29" roughness={0.5} metalness={0.45} />
          </mesh>
          {/* R7LA livery bands */}
          <mesh position={[0, 9.36, 0]}>
            <cylinderGeometry args={[0.925, 0.925, 0.07, 32]} />
            <meshStandardMaterial
              color="#39b9c9"
              emissive="#39b9c9"
              emissiveIntensity={0.35}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 10.32, 0]}>
            <cylinderGeometry args={[0.912, 0.912, 0.05, 32]} />
            <meshStandardMaterial
              color="#e4b44c"
              emissive="#e4b44c"
              emissiveIntensity={0.25}
              metalness={0.7}
              roughness={0.28}
            />
          </mesh>

          {/* Twin Side Strap-On Boosters */}
          {[-1.36, 1.36].map((x, idx) => (
            <group key={idx} position={[x, 3.9, 0]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.42, 0.44, 5.9, 24]} />
                <meshStandardMaterial map={hullTex} roughness={0.4} metalness={0.25} />
              </mesh>
              <mesh position={[0, 3.35, 0]} castShadow>
                <coneGeometry args={[0.42, 0.9, 24]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.42} metalness={0.2} />
              </mesh>
              {/* Booster Cross-Struts */}
              <mesh position={[x > 0 ? -0.45 : 0.45, 2.2, 0]}>
                <boxGeometry args={[0.5, 0.14, 0.22]} />
                <meshStandardMaterial color="#475569" metalness={0.75} />
              </mesh>
              <mesh position={[0, -3.05, 0]} geometry={boosterBellGeo}>
                <meshStandardMaterial color="#1e242e" metalness={0.88} roughness={0.26} side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}

          {/* 3 Gimbaled Main Engine Bells */}
          <group ref={nozzleClusterRef} position={[0, 0.95, 0]}>
            {[
              [0, 0, 0.34],
              [-0.3, 0, -0.22],
              [0.3, 0, -0.22],
            ].map((pos, ni) => (
              <mesh key={ni} position={pos as [number, number, number]} geometry={coreBellGeo}>
                <meshStandardMaterial color="#1c222c" metalness={0.9} roughness={0.24} side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>

          {/* Volumetric Ignition Plume Core */}
          <mesh ref={plumeCoreRef} position={[0, -2.5, 0]} visible={false}>
            <coneGeometry args={[1.28, 5.8, 22]} />
            <meshBasicMaterial color="#ffb347" transparent opacity={0.88} />
          </mesh>
        </group>

        {/* SEPARABLE UPPER STAGE & PAYLOAD FAIRING */}
        <group ref={upperStageRef} position={[0, 0, 0]}>
          <mesh position={[0, 11.4, 0]} castShadow>
            <cylinderGeometry args={[0.89, 0.91, 2.25, 28]} />
            <meshStandardMaterial map={hullTex} roughness={0.38} metalness={0.22} />
          </mesh>
          <mesh position={[0, 13.8, 0]} castShadow>
            <coneGeometry args={[0.9, 2.65, 28]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.34} metalness={0.12} />
          </mesh>
          {/* Upper Stage Vacuum Bell & Ignition Plume after Separation */}
          <mesh position={[0, 10.22, 0]} geometry={boosterBellGeo}>
            <meshStandardMaterial color="#1e242e" metalness={0.88} roughness={0.28} side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={upperPlumeRef} position={[0, 9.2, 0]} visible={false}>
            <coneGeometry args={[0.42, 1.5, 16]} />
            <meshBasicMaterial color="#93c5fd" transparent opacity={0.8} />
          </mesh>
        </group>

        {/* Curved Orbital Earth Limb (reveals cleanly above stratosphere) */}
        <group ref={earthLimbRef} visible={false}>
          <mesh>
            <sphereGeometry args={[48, 48, 36]} />
            <meshStandardMaterial map={earthTex} roughness={0.75} />
          </mesh>
        </group>

        {/* Instanced Billowing Steam & Exhaust Plume */}
        <instancedMesh
          ref={particlesRef}
          args={[undefined, undefined, PARTICLE_COUNT]}
          frustumCulled={false}
          visible={false}
        >
          <dodecahedronGeometry args={[0.78, 1]} />
          <meshStandardMaterial
            color="#e2e8f0"
            emissive="#fb923c"
            emissiveIntensity={0.45}
            roughness={0.95}
            transparent
            opacity={0.75}
            map={glowTex}
          />
        </instancedMesh>
      </group>

      {/* ==================== ACT II: DYNAMIC SOLAR SYSTEM OBSERVATORY ==================== */}
      <group ref={solarGroupRef} visible={act === 'observatory'}>
        <pointLight position={[0, 0, 0]} intensity={1500} distance={280} decay={1.6} color="#fff7ed" />
        <ambientLight intensity={0.42} color="#a8b4c4" />

        {act === 'observatory' && (
          <OrbitControls
            ref={controlsRef}
            enableDamping={!isSoftwareGl}
            dampingFactor={0.055}
            minDistance={0.85}
            maxDistance={115}
            onStart={() => {
              camTransitionActive.current = false;
            }}
          />
        )}

        {/* The Sun */}
        <group position={[0, 0, 0]}>
          <mesh>
            <sphereGeometry args={[2.2, 36, 28]} />
            <meshBasicMaterial map={sunTex} />
          </mesh>
          <sprite scale={[9.5, 9.5, 1]}>
            <spriteMaterial
              map={sunGlowTex}
              color="#fb923c"
              transparent
              opacity={0.72}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
          <sprite scale={[17, 17, 1]}>
            <spriteMaterial
              map={sunGlowTex}
              color="#f59e0b"
              transparent
              opacity={0.2}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        </group>

        {/* Major Planets on Elliptical Orbits */}
        {orbitLines.map((ol) => (
          <Line key={ol.id} points={ol.points} color={ol.color} lineWidth={1} transparent opacity={0.22} />
        ))}

        {PLANETS.map((planet) => {
          const tex = getVectorPlanetTexture(planet.texKey);
          const isEarth = planet.id === 'earth';
          const isMars = planet.id === 'mars';
          const surfaceMap = isMars ? marsTex : tex;

          return (
            <group
              key={planet.id}
              ref={(el) => {
                planetContainerRefs.current[planet.id] = el;
              }}
            >
              <group
                ref={(el) => {
                  planetSpinRefs.current[planet.id] = el;
                }}
              >
                <mesh castShadow receiveShadow>
                  <sphereGeometry args={[planet.radius, 64, 48]} />
                  <meshBasicMaterial map={surfaceMap} />
                </mesh>
                <mesh scale={1.012}>
                  <sphereGeometry args={[planet.radius, 48, 36]} />
                  <meshBasicMaterial
                    color="#eef4f8"
                    transparent
                    opacity={0.16}
                    side={THREE.BackSide}
                    depthWrite={false}
                  />
                </mesh>

                {ATMOSPHERE[planet.id] && (
                  <mesh scale={1.018}>
                    <sphereGeometry args={[planet.radius, 48, 36]} />
                    <meshBasicMaterial
                      color={ATMOSPHERE[planet.id].color}
                      transparent
                      opacity={ATMOSPHERE[planet.id].opacity}
                      side={THREE.BackSide}
                      depthWrite={false}
                      blending={THREE.AdditiveBlending}
                    />
                  </mesh>
                )}

                {planet.hasRing && (
                  <mesh rotation={[Math.PI / 2.4, 0.15, 0]}>
                    <ringGeometry args={[planet.radius * 1.35, planet.radius * 2.35, 64]} />
                    <meshBasicMaterial
                      map={saturnRingTex}
                      transparent
                      opacity={0.78}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                )}

                {/* EXACT TOPOGRAPHICAL SURFACE PINPOINTING ON MARS GLOBE */}
                {isMars &&
                  marsMissions.map((m) => {
                    const coords = m.placement.surfaceCoords!;
                    const localPos = latLonToLocalVec3(coords.latDeg, coords.lonDeg, planet.radius + 0.015);
                    return (
                      <GreenStarBeacon
                        key={m.id}
                        mission={m}
                        localPos={localPos}
                        visible={isVisible(m)}
                        onSelectTarget={handleSelectBeacon}
                      />
                    );
                  })}
              </group>

              {/* Earth's Orbiting Moon + Surface-Pinned Lunar Artifacts */}
              {isEarth && (
                <>
                  <Line
                    points={buildEllipticalOrbitPoints(1.85, 0.05, 0.075, 64)}
                    color="#94a3b8"
                    lineWidth={1}
                    transparent
                    opacity={0.2}
                  />
                  <group ref={moonContainerRef}>
                    <group ref={moonSpinRef}>
                      <mesh castShadow receiveShadow>
                        <sphereGeometry args={[0.26, 48, 36]} />
                        <meshBasicMaterial map={moonTex} />
                      </mesh>
                      <mesh scale={1.012}>
                        <sphereGeometry args={[0.26, 32, 24]} />
                        <meshBasicMaterial
                          color="#eef4f8"
                          transparent
                          opacity={0.16}
                          side={THREE.BackSide}
                          depthWrite={false}
                        />
                      </mesh>
                      {/* EXACT TOPOGRAPHICAL SURFACE PINPOINTING ON MOON GLOBE */}
                      {moonMissions.map((m) => {
                        const coords = m.placement.surfaceCoords!;
                        const localPos = latLonToLocalVec3(coords.latDeg, coords.lonDeg, 0.272);
                        return (
                          <GreenStarBeacon
                            key={m.id}
                            mission={m}
                            localPos={localPos}
                            visible={isVisible(m)}
                            onSelectTarget={handleSelectBeacon}
                          />
                        );
                      })}
                    </group>
          {/* Moon label removed to avoid crowding the Earth label */}
                  </group>
                </>
              )}

              {act === 'observatory' && (
                <Html
                  position={[0, planet.radius + (planet.hasRing ? 1.15 : 0.55), 0]}
                  center
                  style={{ pointerEvents: 'none' }}
                >
                  <span className="text-[10px] font-mono tracking-[0.22em] text-[#94A3B8] select-none">
                    {planet.name}
                  </span>
                </Html>
              )}
            </group>
          );
        })}

        {/* Main Asteroid Belt */}
        <instancedMesh ref={beltRef} args={[undefined, undefined, 460]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial roughness={0.92} metalness={0.05} />
        </instancedMesh>

        {/* Dwarf Planet Ceres + Dawn Spacecraft Beacon */}
        <Line points={ceresOrbitPts} color="#94a3b8" lineWidth={1} transparent opacity={0.14} />
        <group ref={ceresContainerRef}>
          <mesh>
            <sphereGeometry args={[0.23, 22, 18]} />
            <meshBasicMaterial map={ceresTex} />
          </mesh>
          <GreenStarBeacon
            mission={ceresMission}
            localPos={new THREE.Vector3(0.32, 0.16, 0.18)}
            visible={isVisible(ceresMission)}
            onSelectTarget={handleSelectBeacon}
          />
          {act === 'observatory' && (
            <Html position={[0, 0.42, 0]} center style={{ pointerEvents: 'none' }}>
              <span className="text-[9px] font-mono tracking-[0.18em] text-[#94A3B8]/80 select-none">
                CERES
              </span>
            </Html>
          )}
        </group>

        {/* Asteroid 433 Eros + NEAR Shoemaker Surface-Pinned Beacon */}
        <Line points={erosOrbitPts} color="#94a3b8" lineWidth={1} transparent opacity={0.14} />
        <group ref={erosContainerRef}>
          <mesh scale={[1.65, 0.65, 0.72]}>
            <dodecahedronGeometry args={[0.14, 1]} />
            <meshBasicMaterial map={erosTex} />
          </mesh>
          <GreenStarBeacon
            mission={erosMission}
            localPos={new THREE.Vector3(0.18, 0.08, 0.06)}
            visible={isVisible(erosMission)}
            onSelectTarget={handleSelectBeacon}
          />
          {act === 'observatory' && (
            <Html position={[0, 0.34, 0]} center style={{ pointerEvents: 'none' }}>
              <span className="text-[9px] font-mono tracking-[0.18em] text-[#94A3B8]/80 select-none">
                433 EROS
              </span>
            </Html>
          )}
        </group>

        {/* Kepler Space Telescope (Earth-Trailing Orbit) */}
        <group ref={keplerBeaconRef}>
          <GreenStarBeacon
            mission={keplerMission}
            localPos={new THREE.Vector3(0, 0, 0)}
            visible={isVisible(keplerMission)}
            onSelectTarget={handleSelectBeacon}
          />
        </group>

        {/* Pioneer 10 & 11 Escaping Trajectory + Beacon */}
        <Line
          points={[
            [Math.cos(5.2) * 11.8, 0, Math.sin(5.2) * 11.8],
            [Math.cos(5.2) * 27.5, 0.9, Math.sin(5.2) * 27.5],
            [Math.cos(5.2) * 43, 2.2, Math.sin(5.2) * 43],
          ]}
          color="#10b981"
          lineWidth={1}
          transparent
          opacity={0.28}
        />
        <group ref={pioneerBeaconRef}>
          <GreenStarBeacon
            mission={pioneerMission}
            localPos={new THREE.Vector3(0, 0, 0)}
            visible={isVisible(pioneerMission)}
            onSelectTarget={handleSelectBeacon}
          />
        </group>

        {/* Background realistic spacecraft trajectory (no green star beacon) */}
        <Line points={backgroundVoyagerArc} color="#64748b" lineWidth={1} transparent opacity={0.18} />
        <mesh position={backgroundVoyagerArc[backgroundVoyagerArc.length - 1]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
      </group>
    </>
  );
}

export const UnifiedSpaceCanvas: React.FC = () => {
  return (
    <Canvas
      shadows={!isSoftwareGl}
      dpr={isSoftwareGl ? 1 : [1, 2]}
      camera={{ position: [16, 6.4, 19], fov: 45, near: 0.1, far: 950 }}
      gl={{
        antialias: !isSoftwareGl,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
        powerPreference: 'high-performance',
      }}
    >
      <StudioEnvSetup />
      <UnifiedSpaceWorld />
    </Canvas>
  );
};
