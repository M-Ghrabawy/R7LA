"use client";

import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { createPlanetTexture } from "@/lib/planet-texture";
import type { SceneRelic } from "@/lib/scene-types";

const markerColors = {
  active: "#39b9c9",
  passive: "#e4b44c",
  inactive: "#8ea0ab",
  unknown: "#6f808a",
} as const;

function useMarkerColor(relic: SceneRelic) {
  if (
    relic.operationalStatus === "active" ||
    relic.operationalStatus === "passive-operational"
  ) {
    return relic.operationalStatus === "active"
      ? markerColors.active
      : markerColors.passive;
  }
  if (relic.operationalStatus === "unknown") return markerColors.unknown;
  return markerColors.inactive;
}

function latLonToVector3(
  latitude: number,
  longitude: number,
  radius: number,
): THREE.Vector3 {
  const phi = ((90 - latitude) * Math.PI) / 180;
  const theta = ((longitude + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function seededRandom(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Starfield() {
  const reduceMotion = useReducedMotion();
  const pointsRef = useRef<THREE.Points>(null);
  const count = useMemo(() => {
    if (typeof window === "undefined") return 3600;
    return window.innerWidth < 768 ? 1900 : 4600;
  }, []);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#d7e1e8"),
      new THREE.Color("#8fb4c4"),
      new THREE.Color("#e4b44c"),
      new THREE.Color("#f1efe6"),
    ];
    const random = seededRandom(0x5eed);
    for (let i = 0; i < count; i += 1) {
      const radius = 16 + random() * 38;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const color = palette[Math.floor(random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current || reduceMotion) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.004;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ArtifactMarker({
  relics,
  selectedId,
  onSelect,
}: {
  relics: SceneRelic[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const relic = relics[0];
  const selected = relics.some((item) => item.id === selectedId);
  const markerRelic =
    relics.find((item) => item.id === selectedId) ?? relic;
  const color = useMarkerColor(markerRelic);
  const position = useMemo(
    () => latLonToVector3(relic.latitude, relic.longitude, 2.08),
    [relic.latitude, relic.longitude],
  );
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const world = useMemo(() => new THREE.Vector3(), []);
  const cameraDirection = useMemo(() => new THREE.Vector3(), []);
  const reduceMotion = useReducedMotion();

  useFrame(({ clock, camera }) => {
    if (!groupRef.current) return;
    groupRef.current.getWorldPosition(world);
    cameraDirection.copy(world).normalize();
    const cameraNormal = camera.position.clone().normalize();
    const facing = cameraDirection.dot(cameraNormal);
    groupRef.current.visible = facing > -0.04 || selected;
    if (ringRef.current && !reduceMotion) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2 + relic.latitude) * 0.16;
      ringRef.current.scale.setScalar(pulse);
    }
  });

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        const currentIndex = relics.findIndex(
          (item) => item.id === selectedId,
        );
        const next =
          currentIndex >= 0
            ? relics[(currentIndex + 1) % relics.length]
            : relics[0];
        onSelect(next.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <mesh>
        <sphereGeometry args={[0.17, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Billboard>
        <mesh>
          <circleGeometry args={[selected ? 0.055 : 0.038, 24]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <mesh ref={ringRef}>
          <ringGeometry args={[0.065, 0.082, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={selected ? 0.95 : 0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {selected && (
          <mesh>
            <ringGeometry args={[0.11, 0.115, 40]} />
            <meshBasicMaterial
              color="#e4b44c"
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}
      </Billboard>
    </group>
  );
}

function clusterRelics(relics: SceneRelic[]): SceneRelic[][] {
  const clusters: SceneRelic[][] = [];
  for (const relic of relics) {
    const point = latLonToVector3(relic.latitude, relic.longitude, 1);
    const existing = clusters.find((cluster) => {
      const anchor = cluster[0];
      const anchorPoint = latLonToVector3(
        anchor.latitude,
        anchor.longitude,
        1,
      );
      return anchorPoint.distanceTo(point) < 0.02;
    });
    if (existing) {
      existing.push(relic);
    } else {
      clusters.push([relic]);
    }
  }
  return clusters;
}

function Planet({
  destination,
  relics,
  selectedId,
  onSelect,
}: {
  destination: "Moon" | "Mars";
  relics: SceneRelic[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const reduceMotion = useReducedMotion();
  const texture = useMemo(() => {
    const canvas = createPlanetTexture(destination);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.anisotropy = 4;
    return map;
  }, [destination]);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  const selected = relics.find((relic) => relic.id === selectedId);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    if (selected) {
      const point = latLonToVector3(
        selected.latitude,
        selected.longitude,
        1,
      );
      const target = -Math.atan2(point.x, point.z);
      group.rotation.y = THREE.MathUtils.damp(
        group.rotation.y,
        target,
        3,
        delta,
      );
    } else if (!reduceMotion) {
      group.rotation.y += delta * 0.025;
      group.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.025;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.08, 0, destination === "Mars" ? 0.21 : 0.15]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2, 96, 96]} />
        <meshStandardMaterial
          map={texture}
          roughness={destination === "Mars" ? 0.95 : 1}
          metalness={0}
        />
      </mesh>
      {destination === "Mars" && (
        <mesh scale={1.018}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial
            color="#b65c3e"
            transparent
            opacity={0.065}
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      {clusterRelics(relics).map((cluster) => (
        <ArtifactMarker
          key={cluster.map((item) => item.id).join("-")}
          relics={cluster}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function CameraRig({ destination }: { destination: "Moon" | "Mars" }) {
  const { camera } = useThree();
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const reduceMotion = useReducedMotion();
  const intro = useRef(true);

  useEffect(() => {
    if (!controls.current) return;
    const targetZ = destination === "Moon" ? 6.2 : 6.6;
    const targetY = destination === "Moon" ? 0.55 : 0.4;
    const duration = reduceMotion ? 0 : intro.current ? 1.9 : 0.8;
    intro.current = false;
    gsap.to(camera.position, {
      x: 0,
      y: targetY,
      z: targetZ,
      duration,
      ease: "power3.out",
      onUpdate: () => controls.current?.update(),
    });
  }, [camera, destination, reduceMotion]);

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableDamping
      dampingFactor={0.055}
      minDistance={4.2}
      maxDistance={9}
      rotateSpeed={0.55}
      zoomSpeed={0.55}
    />
  );
}

export default function ObservatoryCanvas({
  destination,
  relics,
  selectedId,
  onSelect,
}: {
  destination: "Moon" | "Mars";
  relics: SceneRelic[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const destinationRelics = useMemo(
    () => relics.filter((relic) => relic.destination === destination),
    [destination, relics],
  );

  return (
    <Canvas
      dpr={[1, 1.65]}
      camera={{ position: [0, 0.55, 6.2], fov: 38, near: 0.1, far: 120 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ touchAction: "pan-y" }}
      frameloop={reduceMotion ? "demand" : "always"}
    >
      <color attach="background" args={["#030a10"]} />
      <fog attach="fog" args={["#030a10", 14, 55]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={3.1}
        color="#fff3dd"
      />
      <pointLight position={[-6, -2, -5]} intensity={12} color="#0b7a8f" />
      <pointLight position={[4, -3, 2]} intensity={4} color="#e4b44c" />
      <Starfield />
      <Planet
        destination={destination}
        relics={destinationRelics}
        selectedId={selectedId}
        onSelect={onSelect}
      />
      <CameraRig destination={destination} />
    </Canvas>
  );
}
