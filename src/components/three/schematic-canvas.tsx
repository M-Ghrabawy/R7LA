"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

export type SchematicKind =
  | "lunar-module"
  | "rover"
  | "lander"
  | "retroreflector"
  | "instrument";

function Panel({
  position,
  size,
  color = "#203744",
  edge = "#3e6877",
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  edge?: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={0.45}
        roughness={0.58}
        transparent
        opacity={0.92}
      />
      <Edges color={edge} threshold={15} />
    </mesh>
  );
}

function Leg({
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  length = 1.3,
}: {
  rotation?: [number, number, number];
  position?: [number, number, number];
  length?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, -length / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.045, length, 8]} />
        <meshStandardMaterial color="#7c8b8f" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, -length, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.05, 16]} />
        <meshStandardMaterial color="#b0a37f" metalness={0.55} roughness={0.5} />
      </mesh>
    </group>
  );
}

function LunarModule() {
  return (
    <group position={[0, 0.6, 0]}>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[1.05, 1.15, 0.62, 8]} />
        <meshStandardMaterial color="#233943" metalness={0.62} roughness={0.46} />
        <Edges color="#55808c" threshold={15} />
      </mesh>
      <Panel position={[0, 0.24, 0]} size={[1.05, 0.58, 1.05]} />
      <Panel
        position={[0.62, 0.28, 0]}
        size={[0.34, 0.42, 0.86]}
        color="#3b3528"
        edge="#e4b44c"
      />
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.58, 12]} />
        <meshStandardMaterial color="#51636a" metalness={0.6} roughness={0.4} />
        <Edges color="#7a949c" />
      </mesh>
      <mesh position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.02, 6, 32]} />
        <meshBasicMaterial color="#e4b44c" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -0.73, 0]}>
        <cylinderGeometry args={[0.18, 0.38, 0.48, 16]} />
        <meshStandardMaterial color="#4d5b5e" metalness={0.8} roughness={0.3} />
        <Edges color="#8ca1a8" />
      </mesh>
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, index) => (
        <group key={index} rotation={[0, angle, 0]}>
          <Leg position={[0.92, -0.4, 0]} rotation={[0, 0, -0.4]} length={1.05} />
        </group>
      ))}
      <mesh position={[-0.65, 0.72, 0.2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.85, 6]} />
        <meshBasicMaterial color="#c9d3dd" />
      </mesh>
      <mesh position={[-0.65, 1.15, 0.2]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#e4b44c" />
      </mesh>
    </group>
  );
}

function Rover() {
  const wheelPositions: Array<[number, number, number]> = [
    [-0.55, -0.34, -0.6],
    [0, -0.34, -0.6],
    [0.55, -0.34, -0.6],
    [-0.55, -0.34, 0.6],
    [0, -0.34, 0.6],
    [0.55, -0.34, 0.6],
  ];
  return (
    <group position={[0, 0.55, 0]}>
      <Panel position={[0, 0.1, 0]} size={[1.7, 0.32, 0.95]} />
      <Panel
        position={[-0.1, 0.3, 0]}
        size={[1.05, 0.05, 0.75]}
        color="#3b3528"
        edge="#e4b44c"
      />
      {wheelPositions.map((position, index) => (
        <mesh key={index} position={position} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.14, 18]} />
          <meshStandardMaterial color="#6e7d82" metalness={0.75} roughness={0.34} />
          <Edges color="#a9bbc0" threshold={20} />
        </mesh>
      ))}
      <mesh position={[0.45, 0.55, 0.24]}>
        <cylinderGeometry args={[0.035, 0.045, 0.8, 8]} />
        <meshStandardMaterial color="#8a9a9e" metalness={0.8} roughness={0.3} />
      </mesh>
      <Panel position={[0.45, 0.98, 0.24]} size={[0.28, 0.18, 0.16]} />
      <mesh position={[0.45, 0.99, 0.33]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.07, 14]} />
        <meshStandardMaterial color="#e4b44c" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.76, 0.25, 0]}>
        <boxGeometry args={[0.04, 0.18, 0.48]} />
        <meshBasicMaterial color="#0b7a8f" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

function Lander() {
  return (
    <group position={[0, 0.5, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.88, 0.98, 0.58, 8]} />
        <meshStandardMaterial color="#263b45" metalness={0.56} roughness={0.5} />
        <Edges color="#5d8794" threshold={15} />
      </mesh>
      <Panel position={[0, 0.58, 0]} size={[0.88, 0.36, 0.88]} />
      <mesh position={[0.25, 0.9, 0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9, 6]} />
        <meshBasicMaterial color="#aebbc1" />
      </mesh>
      <mesh position={[0.25, 1.37, 0.05]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 18]} />
        <meshStandardMaterial color="#bdb29a" metalness={0.55} roughness={0.45} />
        <Edges color="#e4b44c" />
      </mesh>
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, index) => (
        <group key={index} rotation={[0, angle, 0]}>
          <Leg position={[0.72, -0.1, 0]} rotation={[0, 0, -0.52]} length={1.1} />
        </group>
      ))}
      <mesh position={[-0.35, 0.45, 0.42]}>
        <boxGeometry args={[0.32, 0.18, 0.08]} />
        <meshBasicMaterial color="#e4b44c" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

function Retroreflector() {
  return (
    <group position={[0, 0.35, 0]} rotation={[0, 0.35, 0]}>
      <Panel position={[0, 0, 0]} size={[1.5, 1.05, 0.14]} color="#1a2e39" />
      {Array.from({ length: 9 }).map((_, index) => {
        const x = (index % 3) * 0.4 - 0.4;
        const y = Math.floor(index / 3) * 0.33 - 0.33;
        return (
          <mesh key={index} position={[x, y, 0.13]}>
            <boxGeometry args={[0.27, 0.27, 0.12]} />
            <meshStandardMaterial
              color="#d7c28a"
              metalness={0.8}
              roughness={0.25}
            />
            <Edges color="#e4b44c" />
          </mesh>
        );
      })}
      <Leg position={[-0.55, -0.55, 0]} rotation={[0, 0, -0.2]} length={0.9} />
      <Leg position={[0.55, -0.55, 0]} rotation={[0, 0, 0.2]} length={0.9} />
    </group>
  );
}

function Instrument() {
  return (
    <group position={[0, 0.6, 0]}>
      <Panel position={[0, 0, 0]} size={[1.1, 0.8, 0.7]} />
      <mesh position={[0.3, 0.56, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 8]} />
        <meshStandardMaterial color="#87979b" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0.3, 0.94, 0]}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial color="#e4b44c" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.1, 0.42]}>
        <cylinderGeometry args={[0.19, 0.19, 0.12, 16]} />
        <meshBasicMaterial color="#0b7a8f" transparent opacity={0.7} />
      </mesh>
      {[-0.3, 0.3].map((x) => (
        <Leg
          key={x}
          position={[x, -0.4, 0]}
          rotation={[0, 0, x > 0 ? 0.25 : -0.25]}
          length={0.8}
        />
      ))}
    </group>
  );
}

function Model({ kind }: { kind: SchematicKind }) {
  const group = useRef<THREE.Group>(null);
  const reduceMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (group.current && !reduceMotion) {
      group.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={group} rotation={[0, -0.3, 0]}>
      {kind === "lunar-module" && <LunarModule />}
      {kind === "rover" && <Rover />}
      {kind === "lander" && <Lander />}
      {kind === "retroreflector" && <Retroreflector />}
      {kind === "instrument" && <Instrument />}
    </group>
  );
}

export default function SchematicCanvas({ kind }: { kind: SchematicKind }) {
  const reduceMotion = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 1.4, 5.2], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduceMotion ? "demand" : "always"}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 5]} intensity={3} color="#fff2d8" />
      <pointLight position={[-4, 1, 2]} intensity={9} color="#0b7a8f" />
      <Model kind={kind} />
      <gridHelper
        args={[12, 24, "#2b5262", "#122835"]}
        position={[0, -1.55, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.54, 0]}>
        <ringGeometry args={[1.8, 1.84, 64]} />
        <meshBasicMaterial color="#e4b44c" transparent opacity={0.45} />
      </mesh>
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={3.2}
        maxDistance={8}
        target={[0, 0.2, 0]}
      />
    </Canvas>
  );
}
