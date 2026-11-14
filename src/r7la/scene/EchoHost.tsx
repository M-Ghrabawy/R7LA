import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AudioEngine } from '../audio/AudioEngine';
import { useAppStore } from '../store/useAppStore';
import { applyStudioEnvironment, isSoftwareGl } from './glConfig';
import { getEchoBadgeTexture } from './textures';

function EchoStudioEnv() {
  const { gl, scene } = useThree();
  useEffect(() => {
    return applyStudioEnvironment(gl, scene, 0.9);
  }, [gl, scene]);
  return null;
}

function EchoCharacter() {
  const journeyPlaying = useAppStore((s) => s.journeyPlaying);

  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const antennaOrbRef = useRef<THREE.Mesh>(null);
  const barsRef = useRef<(THREE.Mesh | null)[]>([]);

  const badgeTex = useMemo(() => getEchoBadgeTexture(), []);

  const mats = useMemo(() => {
    return {
      whiteShell: new THREE.MeshPhysicalMaterial({
        color: '#f8fafc',
        metalness: 0.08,
        roughness: 0.18,
        clearcoat: 0.92,
        clearcoatRoughness: 0.1,
      }),
      darkJoint: new THREE.MeshStandardMaterial({
        color: '#111827',
        metalness: 0.45,
        roughness: 0.42,
      }),
      visor: new THREE.MeshPhysicalMaterial({
        color: '#040812',
        metalness: 0.12,
        roughness: 0.06,
        clearcoat: 1.0,
      }),
      cyanGlow: new THREE.MeshBasicMaterial({
        color: '#38bdf8',
      }),
      cyanBright: new THREE.MeshBasicMaterial({
        color: '#bae6fd',
      }),
      badge: new THREE.MeshBasicMaterial({
        map: badgeTex,
      }),
    };
  }, [badgeTex]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    const metrics = journeyPlaying
      ? AudioEngine.getEchoAudioMetrics(t)
      : { amplitude: 0, bass: 0, mid: 0, high: 0, bands: new Array(16).fill(0), isMp3Active: false };

    const amp = metrics.amplitude;

    // Gentle hover float matching the Top/Front reference stance
    if (rootRef.current) {
      rootRef.current.position.y = -0.34 + Math.sin(t * 1.8) * 0.025;
      rootRef.current.rotation.y = THREE.MathUtils.damp(
        rootRef.current.rotation.y,
        Math.sin(t * 0.7) * (0.06 + amp * 0.12),
        4,
        dt
      );
    }

    // Expressive head tilts & nods synced to mid/bass cadence
    if (headRef.current) {
      const targetTiltZ = journeyPlaying
        ? Math.sin(t * 2.0) * 0.05 + (metrics.mid - metrics.bass) * 0.16
        : Math.sin(t * 0.8) * 0.02;
      const targetNodX = journeyPlaying
        ? Math.sin(t * 3.0) * (0.03 + amp * 0.1)
        : 0.02;
      const targetYawY = journeyPlaying
        ? Math.cos(t * 1.2) * (0.05 + metrics.high * 0.14)
        : 0;

      headRef.current.rotation.z = THREE.MathUtils.damp(headRef.current.rotation.z, targetTiltZ, 6, dt);
      headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, targetNodX, 7, dt);
      headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, targetYawY, 5, dt);
    }

    // Expressive eyes (periodic blink + slight happy squint on voice emphasis)
    const blinkCycle = t % 4.2;
    const isBlinking = blinkCycle > 4.05;
    const eyeScaleY = isBlinking ? 0.15 : 1.0 + amp * 0.15;
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.damp(leftEyeRef.current.scale.y, eyeScaleY, 18, dt);
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = THREE.MathUtils.damp(rightEyeRef.current.scale.y, eyeScaleY, 18, dt);
    }

    // Cyan smiling mouth reacts dynamically to voice amplitude
    if (mouthRef.current) {
      const mouthOpen = journeyPlaying ? 0.85 + amp * 1.55 : 0.9;
      mouthRef.current.scale.y = THREE.MathUtils.damp(mouthRef.current.scale.y, mouthOpen, 16, dt);
    }

    // Top antenna orb pulse
    if (antennaOrbRef.current) {
      const orbScale = 1 + (journeyPlaying ? amp * 0.25 : Math.sin(t * 2.5) * 0.06);
      antennaOrbRef.current.scale.setScalar(orbScale);
    }

    // Subtle broadcast companion gestures on plump rounded arms
    if (leftArmRef.current) {
      const targetX = journeyPlaying ? -0.22 - metrics.mid * 0.4 - Math.sin(t * 2.3) * 0.1 : -0.06;
      const targetZ = journeyPlaying ? 0.22 + Math.cos(t * 1.6) * 0.08 : 0.14;
      leftArmRef.current.rotation.x = THREE.MathUtils.damp(leftArmRef.current.rotation.x, targetX, 6, dt);
      leftArmRef.current.rotation.z = THREE.MathUtils.damp(leftArmRef.current.rotation.z, targetZ, 5, dt);
    }
    if (rightArmRef.current) {
      const targetX = journeyPlaying ? -0.28 - metrics.bass * 0.42 - Math.cos(t * 2.4) * 0.12 : -0.06;
      const targetZ = journeyPlaying ? -0.22 - Math.sin(t * 1.7) * 0.08 : -0.14;
      rightArmRef.current.rotation.x = THREE.MathUtils.damp(rightArmRef.current.rotation.x, targetX, 6, dt);
      rightArmRef.current.rotation.z = THREE.MathUtils.damp(rightArmRef.current.rotation.z, targetZ, 5, dt);
    }

    // Subtle audio waveform equalizer bars along lower visor edge
    for (let i = 0; i < 8; i++) {
      const bar = barsRef.current[i];
      if (!bar) continue;
      const bandVal = journeyPlaying ? metrics.bands[i * 2] ?? 0 : 0.05;
      const targetScaleY = Math.max(0.18, 0.22 + bandVal * 1.35);
      bar.scale.y = THREE.MathUtils.damp(bar.scale.y, targetScaleY, 16, dt);
    }
  });

  return (
    <>
      <color attach="background" args={['#040813']} />
      <directionalLight position={[2.5, 3.8, 4.2]} intensity={2.1} color="#ffffff" />
      <directionalLight position={[-3, 1.8, -2]} intensity={1.3} color="#38bdf8" />
      <hemisphereLight args={['#e2e8f0', '#0f172a', 0.6]} />

      <group ref={rootRef} position={[0, -0.34, 0]}>
        {/* Subtle Cyan Hover Base Ring (matching Front & Side reference floor projection) */}
        <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.cyanGlow}>
          <ringGeometry args={[0.38, 0.41, 36]} />
        </mesh>

        {/* CHIBI TORSO & R7LA CHEST EMBLEM */}
        <group position={[0, 0.02, 0]}>
          {/* Main White Rounded Barrel Torso */}
          <mesh scale={[1.05, 1.0, 0.88]} material={mats.whiteShell}>
            <sphereGeometry args={[0.25, 24, 20]} />
          </mesh>
          {/* Lower Dark-Slate Pelvis Joint + Cyan Hip Trim Lights */}
          <mesh position={[0, -0.16, 0]} material={mats.darkJoint}>
            <cylinderGeometry args={[0.17, 0.13, 0.16, 18]} />
          </mesh>
          {[-0.14, 0.14].map((x, i) => (
            <mesh key={i} position={[x, -0.12, 0.12]} rotation={[0, i === 0 ? -0.4 : 0.4, 0]} material={mats.cyanGlow}>
              <boxGeometry args={[0.055, 0.022, 0.02]} />
            </mesh>
          ))}
          {/* Front Circular R7LA Emblem Badge */}
          <mesh position={[0, 0.02, 0.218]} material={mats.badge}>
            <circleGeometry args={[0.115, 24]} />
          </mesh>
          {/* Rear Sleek Jetpack Pod + Cyan Vertical Core */}
          <group position={[0, 0.02, -0.22]}>
            <mesh scale={[0.9, 1.15, 0.55]} material={mats.whiteShell}>
              <sphereGeometry args={[0.14, 18, 16]} />
            </mesh>
            <mesh position={[0, 0, -0.06]} material={mats.cyanGlow}>
              <boxGeometry args={[0.03, 0.14, 0.03]} />
            </mesh>
          </group>

          {/* Neck Joint */}
          <mesh position={[0, 0.25, 0]} material={mats.darkJoint}>
            <cylinderGeometry args={[0.08, 0.095, 0.1, 16]} />
          </mesh>
        </group>

        {/* LARGE ROUNDED-PILL HELMET HEAD (Strict match to Multi-Angle Blueprint) */}
        <group ref={headRef} position={[0, 0.58, 0]}>
          {/* Wide Rounded White Helmet Shell */}
          <mesh scale={[1.28, 0.98, 0.96]} material={mats.whiteShell}>
            <sphereGeometry args={[0.32, 32, 24]} />
          </mesh>
          {/* Top Crown Dark Mount + R7LA Top Badge */}
          <mesh position={[0, 0.295, -0.02]} rotation={[-Math.PI / 2, 0, 0]} material={mats.darkJoint}>
            <circleGeometry args={[0.16, 20]} />
          </mesh>
          <mesh position={[0, 0.302, 0.03]} rotation={[-Math.PI / 2, 0, 0]} material={mats.badge}>
            <circleGeometry args={[0.11, 20]} />
          </mesh>

          {/* Slightly Backward-Tilted Top Antenna + Glowing Cyan Orb */}
          <group position={[0, 0.31, -0.02]} rotation={[-0.14, 0, 0]}>
            <mesh position={[0, 0.09, 0]} material={mats.whiteShell}>
              <cylinderGeometry args={[0.012, 0.024, 0.18, 12]} />
            </mesh>
            <mesh ref={antennaOrbRef} position={[0, 0.2, 0]} material={mats.cyanBright}>
              <sphereGeometry args={[0.052, 16, 16]} />
            </mesh>
          </group>

          {/* Twin Side Circular Headphones with Glowing Cyan Halo Rings */}
          {[-0.41, 0.41].map((x, i) => (
            <group key={i} position={[x, 0, 0]} rotation={[0, i === 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
              <mesh material={mats.whiteShell}>
                <cylinderGeometry args={[0.135, 0.145, 0.06, 22]} />
              </mesh>
              <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.cyanGlow}>
                <ringGeometry args={[0.088, 0.115, 24]} />
              </mesh>
              <mesh position={[0, 0.034, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.darkJoint}>
                <circleGeometry args={[0.085, 22]} />
              </mesh>
            </group>
          ))}

          {/* Curved Dark Glossy Front Visor */}
          <mesh position={[0, -0.01, 0.09]} scale={[1.16, 0.84, 0.86]} material={mats.visor}>
            <sphereGeometry args={[0.275, 28, 22]} />
          </mesh>

          {/* Expressive Glowing Cyan Happy Curved Eyes (^ ^) */}
          <mesh
            ref={leftEyeRef}
            position={[-0.11, 0.02, 0.328]}
            rotation={[0, -0.18, 0.05]}
            material={mats.cyanBright}
          >
            <torusGeometry args={[0.048, 0.014, 10, 18, Math.PI]} />
          </mesh>
          <mesh
            ref={rightEyeRef}
            position={[0.11, 0.02, 0.328]}
            rotation={[0, 0.18, -0.05]}
            material={mats.cyanBright}
          >
            <torusGeometry args={[0.048, 0.014, 10, 18, Math.PI]} />
          </mesh>

          {/* Expressive Glowing Cyan Smile / Voice-Synced Mouth */}
          <mesh
            ref={mouthRef}
            position={[0, -0.065, 0.332]}
            rotation={[0, 0, Math.PI]}
            material={mats.cyanBright}
          >
            <torusGeometry args={[0.042, 0.014, 10, 18, Math.PI]} />
          </mesh>

          {/* Subtle Lower-Visor Real-Time AnalyserNode Audio Bars */}
          <group position={[0, -0.145, 0.312]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh
                key={i}
                ref={(el) => {
                  barsRef.current[i] = el;
                }}
                position={[(i - 3.5) * 0.024, 0, 0]}
                material={mats.cyanGlow}
              >
                <boxGeometry args={[0.012, 0.022, 0.008]} />
              </mesh>
            ))}
          </group>
        </group>

        {/* PLUMP ARTICULATED ARMS & DARK MITTEN HANDS */}
        <group ref={leftArmRef} position={[-0.27, 0.12, 0.02]}>
          <mesh material={mats.whiteShell}>
            <sphereGeometry args={[0.072, 14, 14]} />
          </mesh>
          <mesh position={[-0.04, -0.12, 0.02]} rotation={[0.15, 0, 0.18]} material={mats.whiteShell}>
            <cylinderGeometry args={[0.052, 0.062, 0.18, 14]} />
          </mesh>
          <mesh position={[-0.06, -0.23, 0.05]} material={mats.darkJoint}>
            <sphereGeometry args={[0.056, 12, 12]} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.27, 0.12, 0.02]}>
          <mesh material={mats.whiteShell}>
            <sphereGeometry args={[0.072, 14, 14]} />
          </mesh>
          <mesh position={[0.04, -0.12, 0.02]} rotation={[0.15, 0, -0.18]} material={mats.whiteShell}>
            <cylinderGeometry args={[0.052, 0.062, 0.18, 14]} />
          </mesh>
          <mesh position={[0.06, -0.23, 0.05]} material={mats.darkJoint}>
            <sphereGeometry args={[0.056, 12, 12]} />
          </mesh>
        </group>

        {/* CHUNKY FLARED WHITE AEROSPACE BOOTS WITH CYAN TRIM */}
        {[-0.12, 0.12].map((x, i) => (
          <group key={i} position={[x, -0.26, 0]}>
            {/* Dark Thigh Joint */}
            <mesh position={[0, 0.04, 0]} material={mats.darkJoint}>
              <cylinderGeometry args={[0.055, 0.055, 0.12, 12]} />
            </mesh>
            {/* Flared Boot Upper */}
            <mesh position={[0, -0.1, 0.02]} material={mats.whiteShell}>
              <cylinderGeometry args={[0.072, 0.115, 0.18, 16]} />
            </mesh>
            {/* Rounded Toe Box */}
            <mesh position={[0, -0.16, 0.06]} scale={[0.95, 0.65, 1.35]} material={mats.whiteShell}>
              <sphereGeometry args={[0.095, 14, 12]} />
            </mesh>
            {/* Dark Sole + Cyan Hover Trim */}
            <mesh position={[0, -0.22, 0.04]} scale={[1.0, 0.35, 1.35]} material={mats.darkJoint}>
              <cylinderGeometry args={[0.11, 0.115, 0.07, 16]} />
            </mesh>
            <mesh position={[0, -0.23, 0.04]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.32, 1]} material={mats.cyanGlow}>
              <ringGeometry args={[0.095, 0.112, 20]} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

export const EchoHost: React.FC = () => {
  return (
    <Canvas
      dpr={isSoftwareGl ? 1 : [1, 2]}
      camera={{ position: [0, 0.25, 1.85], fov: 35, near: 0.1, far: 20 }}
      gl={{
        antialias: !isSoftwareGl,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
    >
      <EchoStudioEnv />
      <EchoCharacter />
    </Canvas>
  );
};
