import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getGoldFoilTexture, getSolarPanelTexture } from './textures';

export interface ArtifactAnimationRefs {
  root: THREE.Group | null;
  ascentStage?: THREE.Group | null;
  wheels?: THREE.Object3D[];
  rotorTop?: THREE.Object3D | null;
  rotorBottom?: THREE.Object3D | null;
  arm?: THREE.Object3D | null;
  dish?: THREE.Object3D | null;
  ionPlume?: THREE.Mesh | null;
  seismometer?: THREE.Object3D | null;
  solarWings?: THREE.Object3D[];
}

function createParabolicDishGeometry(radius: number, depth: number, segments = 28): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = t * radius;
    const y = t * t * depth;
    pts.push(new THREE.Vector2(r, y));
  }
  return new THREE.LatheGeometry(pts, segments);
}

function createHelixGeometry(radius: number, height: number, turns = 5.5): THREE.TubeGeometry {
  const pts: THREE.Vector3[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = t * Math.PI * 2 * turns;
    pts.push(new THREE.Vector3(Math.cos(ang) * radius, (t - 0.5) * height, Math.sin(ang) * radius));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, 64, radius * 0.14, 6, false);
}

/** A cylinder connecting two points — used for clean structural legs and booms. */
function Strut({
  from,
  to,
  radius = 0.03,
  material,
  castShadow = true,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius?: number;
  material: THREE.Material;
  castShadow?: boolean;
}) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const delta = end.clone().sub(start);
  const length = delta.length();
  const rotation = new THREE.Euler().setFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      delta.clone().normalize(),
    ),
  );
  return (
    <mesh
      position={[mid.x, mid.y, mid.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      material={material}
      castShadow={castShadow}
    >
      <cylinderGeometry args={[radius, radius, length, 10]} />
    </mesh>
  );
}

function useSpacecraftMaterials() {
  return useMemo(() => {
    const { map: goldMap, bumpMap: goldBump } = getGoldFoilTexture();
    const solarMap = getSolarPanelTexture();

    const goldFoil = new THREE.MeshPhysicalMaterial({
      map: goldMap,
      bumpMap: goldBump,
      bumpScale: 0.045,
      metalness: 0.92,
      roughness: 0.28,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
    });

    const silverFoil = new THREE.MeshStandardMaterial({
      color: '#d4dce6',
      bumpMap: goldBump,
      bumpScale: 0.032,
      metalness: 0.88,
      roughness: 0.34,
    });

    const whiteThermal = new THREE.MeshStandardMaterial({
      color: '#f1f5f9',
      metalness: 0.08,
      roughness: 0.58,
    });

    const titanium = new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      metalness: 0.9,
      roughness: 0.24,
    });

    const darkCarbon = new THREE.MeshStandardMaterial({
      color: '#181e28',
      metalness: 0.28,
      roughness: 0.52,
    });

    const copper = new THREE.MeshStandardMaterial({
      color: '#c27a38',
      metalness: 0.9,
      roughness: 0.24,
    });

    const solar = new THREE.MeshPhysicalMaterial({
      map: solarMap,
      metalness: 0.22,
      roughness: 0.12,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
    });

    const opticGlass = new THREE.MeshPhysicalMaterial({
      color: '#112940',
      metalness: 0.15,
      roughness: 0.05,
      clearcoat: 1.0,
    });

    const meshAntenna = new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      metalness: 0.72,
      roughness: 0.38,
      wireframe: true,
    });

    return {
      goldFoil,
      silverFoil,
      whiteThermal,
      titanium,
      darkCarbon,
      copper,
      solar,
      opticGlass,
      meshAntenna,
    };
  }, []);
}

export interface ProceduralArtifactProps {
  missionId: string;
  refsOut: React.MutableRefObject<ArtifactAnimationRefs>;
}

export const ProceduralArtifactModel: React.FC<ProceduralArtifactProps> = ({
  missionId,
  refsOut,
}) => {
  const m = useSpacecraftMaterials();

  const geos = useMemo(() => {
    return {
      lmSBandDish: createParabolicDishGeometry(0.28, 0.1, 20),
      lmRadarDish: createParabolicDishGeometry(0.24, 0.09, 20),
      lrvUmbrellaDish: createParabolicDishGeometry(0.46, 0.16, 20),
      merDish: createParabolicDishGeometry(0.26, 0.09, 20),
      vikingDish: createParabolicDishGeometry(0.54, 0.18, 24),
      dawnDish: createParabolicDishGeometry(0.62, 0.2, 24),
      nearDish: createParabolicDishGeometry(0.74, 0.22, 26),
      pioneerDish: createParabolicDishGeometry(1.38, 0.36, 32),
      alsepHelix: createHelixGeometry(0.065, 0.42, 6),
      alsepDish: createParabolicDishGeometry(0.24, 0.09, 20),
    };
  }, []);

  // Reset refs cleanly on mission change
  refsOut.current = {
    root: null,
    wheels: [],
    solarWings: [],
  };

  const registerWheel = (el: THREE.Object3D | null) => {
    if (el && refsOut.current.wheels && !refsOut.current.wheels.includes(el)) {
      refsOut.current.wheels.push(el);
    }
  };

  switch (missionId) {
    /* 1. APOLLO LUNAR MODULES */
    case 'apollo-lunar-modules': {
      const legAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Descent Stage (Octagonal Kapton-Wrapped Launch Pad) */}
          <group position={[0, 0.88, 0]}>
            <mesh material={m.goldFoil} castShadow receiveShadow>
              <cylinderGeometry args={[1.24, 1.24, 0.82, 8]} />
            </mesh>
            {/* Dark Thermal Micrometeoroid Side Panels */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
              <mesh
                key={i}
                position={[Math.sin(ang) * 1.16, 0, Math.cos(ang) * 1.16]}
                rotation={[0, ang, 0]}
                material={m.darkCarbon}
                castShadow
              >
                <boxGeometry args={[0.78, 0.62, 0.05]} />
              </mesh>
            ))}
            {/* Top Deck Plate & Interstage Separation Ring */}
            <mesh position={[0, 0.43, 0]} material={m.titanium} castShadow>
              <cylinderGeometry args={[1.18, 1.24, 0.05, 8]} />
            </mesh>
            <mesh position={[0, 0.48, 0]} material={m.darkCarbon}>
              <cylinderGeometry args={[0.92, 0.98, 0.06, 16]} />
            </mesh>
            {/* Descent Engine Nozzle Bell */}
            <mesh position={[0, -0.56, 0]} material={m.darkCarbon} castShadow>
              <cylinderGeometry args={[0.16, 0.46, 0.56, 24, 1, true]} />
            </mesh>
            {/* Forward Porch Platform */}
            <mesh position={[0, 0.36, 1.38]} material={m.titanium} castShadow>
              <boxGeometry args={[0.68, 0.06, 0.44]} />
            </mesh>
            {/* 4 Articulated Outrigger Landing Legs + Secondary Struts + Dish Footpads */}
            {legAngles.map((ang, idx) => (
              <group key={idx} rotation={[0, ang, 0]}>
                {/* Primary Telescoping Strut */}
                <mesh position={[1.45, -0.34, 0]} rotation={[0, 0, -0.46]} material={m.goldFoil} castShadow>
                  <cylinderGeometry args={[0.048, 0.055, 1.28, 12]} />
                </mesh>
                {/* Upper A-Frame Braces */}
                <mesh position={[1.12, 0.08, 0.22]} rotation={[0.15, 0, 0.7]} material={m.titanium}>
                  <cylinderGeometry args={[0.025, 0.025, 0.88, 8]} />
                </mesh>
                <mesh position={[1.12, 0.08, -0.22]} rotation={[-0.15, 0, 0.7]} material={m.titanium}>
                  <cylinderGeometry args={[0.025, 0.025, 0.88, 8]} />
                </mesh>
                {/* Lower Diagonal Drag Strut */}
                <mesh position={[1.28, -0.58, 0]} rotation={[0, 0, 1.1]} material={m.titanium}>
                  <cylinderGeometry args={[0.026, 0.026, 0.82, 8]} />
                </mesh>
                {/* Crushable Circular Dish Footpad */}
                <mesh position={[1.74, -0.84, 0]} material={m.goldFoil} receiveShadow castShadow>
                  <cylinderGeometry args={[0.27, 0.31, 0.08, 20]} />
                </mesh>
                {idx === 0 && (
                  /* 9-Rung Egress Ladder */
                  <group position={[1.4, -0.28, 0]} rotation={[0, 0, -0.46]}>
                    <mesh position={[0, 0, 0.12]} material={m.whiteThermal}>
                      <cylinderGeometry args={[0.014, 0.014, 1.0, 8]} />
                    </mesh>
                    <mesh position={[0, 0, -0.12]} material={m.whiteThermal}>
                      <cylinderGeometry args={[0.014, 0.014, 1.0, 8]} />
                    </mesh>
                    {[-0.36, -0.18, 0, 0.18, 0.36].map((ry, rIdx) => (
                      <mesh key={rIdx} position={[0, ry, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.titanium}>
                        <cylinderGeometry args={[0.01, 0.01, 0.24, 6]} />
                      </mesh>
                    ))}
                  </group>
                )}
              </group>
            ))}
          </group>

          {/* Separable Ascent Stage */}
          <group
            ref={(el) => {
              refsOut.current.ascentStage = el;
            }}
            position={[0, 1.98, 0]}
          >
            {/* Asymmetric Pressurized Crew Cabin */}
            <mesh material={m.silverFoil} castShadow receiveShadow>
              <cylinderGeometry args={[0.88, 0.96, 1.04, 12]} />
            </mesh>
            {/* Aft Equipment Bay Bulge */}
            <mesh position={[0, 0.04, -0.68]} material={m.goldFoil} castShadow>
              <boxGeometry args={[1.1, 0.78, 0.65]} />
            </mesh>
            {/* Forward Crew Face & Ingress Hatch */}
            <mesh position={[0, 0.04, 0.78]} material={m.darkCarbon} castShadow>
              <boxGeometry args={[1.08, 0.82, 0.44]} />
            </mesh>
            <mesh position={[0, -0.16, 1.01]} material={m.titanium}>
              <boxGeometry args={[0.42, 0.42, 0.05]} />
            </mesh>
            {/* Canted Triangular Cabin Windows */}
            <mesh position={[-0.29, 0.2, 1.01]} rotation={[0, 0, 0.22]} material={m.opticGlass}>
              <boxGeometry args={[0.25, 0.19, 0.04]} />
            </mesh>
            <mesh position={[0.29, 0.2, 1.01]} rotation={[0, 0, -0.22]} material={m.opticGlass}>
              <boxGeometry args={[0.25, 0.19, 0.04]} />
            </mesh>
            {/* Overhead Docking Tunnel & Hatch */}
            <mesh position={[0, 0.62, 0.05]} material={m.titanium} castShadow>
              <cylinderGeometry args={[0.42, 0.46, 0.22, 18]} />
            </mesh>
            {/* Rendezvous Radar Parabolic Dish */}
            <mesh
              position={[0.42, 0.76, 0.42]}
              rotation={[0.95, 0.35, 0]}
              geometry={geos.lmRadarDish}
              material={m.whiteThermal}
              castShadow
            />
            {/* S-Band Steerable Parabolic Dish */}
            <mesh
              ref={(el) => { refsOut.current.dish = el; }}
              position={[-0.56, 0.72, 0.28]}
              rotation={[0.75, -0.55, 0]}
              geometry={geos.lmSBandDish}
              material={m.whiteThermal}
              castShadow
            />
            {/* 4 Orthogonal RCS Thruster Quads */}
            {[
              [0.98, 0.14, 0.44],
              [-0.98, 0.14, 0.44],
              [0.98, 0.14, -0.44],
              [-0.98, 0.14, -0.44],
            ].map((pos, i) => (
              <group key={i} position={pos as [number, number, number]}>
                <mesh material={m.titanium}>
                  <cylinderGeometry args={[0.075, 0.095, 0.22, 10]} />
                </mesh>
                <mesh position={[0, 0.14, 0]} material={m.darkCarbon}>
                  <cylinderGeometry args={[0.04, 0.06, 0.1, 10, 1, true]} />
                </mesh>
                <mesh position={[0, -0.14, 0]} material={m.darkCarbon}>
                  <cylinderGeometry args={[0.06, 0.04, 0.1, 10, 1, true]} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      );
    }

    /* 2. LUNAR ROVING VEHICLES (LRVs) */
    case 'lunar-roving-vehicles': {
      const wheelPositions: [number, number, number][] = [
        [-0.86, 0.36, 1.06],
        [0.86, 0.36, 1.06],
        [-0.86, 0.36, -1.06],
        [0.86, 0.36, -1.06],
      ];
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Open Tubular Aluminum Space-Frame Rails */}
          {[-0.58, 0.58].map((x, i) => (
            <mesh key={i} position={[x, 0.46, 0]} material={m.titanium} castShadow>
              <boxGeometry args={[0.08, 0.09, 2.55]} />
            </mesh>
          ))}
          <mesh position={[0, 0.45, 0]} material={m.titanium} castShadow receiveShadow>
            <boxGeometry args={[1.18, 0.07, 2.45]} />
          </mesh>
          {/* Forward Avionics & Battery Thermal Bay */}
          <mesh position={[0, 0.56, 0.88]} material={m.goldFoil} castShadow>
            <boxGeometry args={[1.08, 0.22, 0.62]} />
          </mesh>
          {/* Aft Sample Stowage Rack & Lunar Tool Pallet */}
          <mesh position={[0, 0.6, -0.96]} material={m.silverFoil} castShadow>
            <boxGeometry args={[1.16, 0.24, 0.54]} />
          </mesh>
          {/* Twin Astronaut Mesh Seats with Roll Bars */}
          {[-0.36, 0.36].map((xPos, i) => (
            <group key={i} position={[xPos, 0.66, -0.15]}>
              <mesh material={m.whiteThermal} castShadow>
                <boxGeometry args={[0.45, 0.07, 0.46]} />
              </mesh>
              <mesh position={[0, 0.32, -0.21]} rotation={[-0.18, 0, 0]} material={m.whiteThermal} castShadow>
                <boxGeometry args={[0.45, 0.6, 0.06]} />
              </mesh>
              <mesh position={[0.24, 0.14, 0]} material={m.titanium}>
                <boxGeometry args={[0.04, 0.04, 0.38]} />
              </mesh>
            </group>
          ))}
          {/* Center Console & T-Bar Hand Controller */}
          <mesh position={[0, 0.72, 0.34]} material={m.darkCarbon}>
            <boxGeometry args={[0.18, 0.24, 0.32]} />
          </mesh>
          <mesh position={[0, 0.94, 0.34]} rotation={[0.25, 0, 0]} material={m.titanium}>
            <cylinderGeometry args={[0.022, 0.025, 0.36, 8]} />
          </mesh>
          {/* Umbrella Parabolic High-Gain Mesh Dish */}
          <group
            ref={(el) => { refsOut.current.dish = el; }}
            position={[0.48, 1.24, 0.96]}
          >
            <mesh position={[0, -0.34, 0]} material={m.titanium}>
              <cylinderGeometry args={[0.022, 0.025, 0.68, 8]} />
            </mesh>
            <mesh rotation={[0.75, 0, 0]} geometry={geos.lrvUmbrellaDish} material={m.meshAntenna} />
            <mesh rotation={[0.75, 0, 0]} position={[0, 0.08, 0.14]} material={m.goldFoil}>
              <cylinderGeometry args={[0.04, 0.04, 0.18, 10]} />
            </mesh>
          </group>
          {/* Color TV Camera & Low-Gain Mast */}
          <mesh position={[-0.44, 0.98, 1.06]} material={m.whiteThermal} castShadow>
            <boxGeometry args={[0.16, 0.14, 0.25]} />
          </mesh>
          <mesh position={[-0.44, 0.98, 1.2]} rotation={[Math.PI / 2, 0, 0]} material={m.opticGlass}>
            <cylinderGeometry args={[0.04, 0.04, 0.04, 12]} />
          </mesh>
          <mesh position={[-0.44, 0.78, 1.06]} material={m.titanium}>
            <cylinderGeometry args={[0.022, 0.022, 0.44, 8]} />
          </mesh>
          {/* 4 Wire-Mesh Wheels + Copper Hub Motors + Curved Fenders */}
          {wheelPositions.map((pos, idx) => (
            <group key={idx} position={pos}>
              {/* Suspension Wishbone */}
              <mesh position={[pos[0] > 0 ? -0.18 : 0.18, 0.06, 0]} rotation={[0, 0, pos[0] > 0 ? -0.3 : 0.3]} material={m.titanium}>
                <cylinderGeometry args={[0.024, 0.024, 0.42, 8]} />
              </mesh>
              <group ref={registerWheel}>
                <mesh rotation={[0, 0, Math.PI / 2]} material={m.darkCarbon} castShadow receiveShadow>
                  <cylinderGeometry args={[0.36, 0.36, 0.22, 22]} />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]} material={m.meshAntenna}>
                  <cylinderGeometry args={[0.365, 0.365, 0.21, 18]} />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]} material={m.copper}>
                  <cylinderGeometry args={[0.14, 0.14, 0.24, 14]} />
                </mesh>
              </group>
              {/* Curved White Dust Fender */}
              <mesh position={[0, 0.26, 0]} rotation={[0, Math.PI / 2, 0]} material={m.whiteThermal}>
                <cylinderGeometry args={[0.42, 0.42, 0.25, 14, 1, true, -0.95, 1.9]} />
              </mesh>
            </group>
          ))}
        </group>
      );
    }

    /* 3. ALSEP SCIENTIFIC PACKAGES */
    case 'alsep-packages': {
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Central Station: tripod, insulated equipment box, dish mast */}
          <group position={[0, 0, 0]}>
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
              <mesh
                key={i}
                position={[Math.cos(ang) * 0.24, 0.17, Math.sin(ang) * 0.24]}
                rotation={[Math.sin(ang) * 0.22, 0, -Math.cos(ang) * 0.22]}
                material={m.titanium}
                castShadow
              >
                <cylinderGeometry args={[0.018, 0.024, 0.36, 8]} />
              </mesh>
            ))}
            <mesh position={[0, 0.42, 0]} material={m.whiteThermal} castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.3, 0.56]} />
            </mesh>
            <mesh position={[0, 0.585, 0]} material={m.silverFoil} castShadow>
              <boxGeometry args={[0.74, 0.03, 0.6]} />
            </mesh>
            <mesh position={[-0.18, 0.48, 0.29]} material={m.goldFoil}>
              <boxGeometry args={[0.26, 0.14, 0.02]} />
            </mesh>
            {/* Antenna mast and high-gain dish */}
            <mesh position={[0.18, 0.92, 0]} material={m.titanium} castShadow>
              <cylinderGeometry args={[0.018, 0.026, 0.72, 10]} />
            </mesh>
            <group position={[0.18, 1.28, 0]} rotation={[0.5, 0.4, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.3, 0.055, 0.15, 24, 1, true]} />
                <meshStandardMaterial
                  color="#e9eef4"
                  metalness={0.35}
                  roughness={0.45}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh position={[0, 0.17, 0]} material={m.titanium}>
                <cylinderGeometry args={[0.008, 0.008, 0.3, 6]} />
              </mesh>
              <mesh position={[0, 0.33, 0]} material={m.copper}>
                <sphereGeometry args={[0.032, 10, 8]} />
              </mesh>
            </group>
          </group>

          {/* SNAP-27 RTG: finned cylinder with fuel-cask handle */}
          <group position={[-0.98, 0, 0.36]}>
            <mesh position={[0, 0.2, 0]} material={m.darkCarbon} castShadow>
              <cylinderGeometry args={[0.1, 0.12, 0.4, 18]} />
            </mesh>
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh
                key={i}
                position={[0, 0.2, 0]}
                rotation={[0, (i * Math.PI) / 4, 0]}
                material={m.titanium}
                castShadow
              >
                <boxGeometry args={[0.4, 0.4, 0.018]} />
              </mesh>
            ))}
            <mesh position={[0, 0.42, 0]} material={m.silverFoil}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
            </mesh>
            <mesh position={[0, 0.02, 0]} material={m.goldFoil}>
              <cylinderGeometry args={[0.13, 0.13, 0.04, 16]} />
            </mesh>
            <mesh position={[0, 0.47, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.titanium}>
              <torusGeometry args={[0.07, 0.012, 8, 16]} />
            </mesh>
          </group>

          {/* Passive Seismometer: squat gold skirt and instrument can */}
          <group
            ref={(el) => { refsOut.current.seismometer = el; }}
            position={[1.02, 0, -0.32]}
          >
            <mesh position={[0, 0.045, 0]} material={m.goldFoil} receiveShadow castShadow>
              <cylinderGeometry args={[0.3, 0.4, 0.09, 24]} />
            </mesh>
            <mesh position={[0, 0.19, 0]} material={m.goldFoil} castShadow>
              <cylinderGeometry args={[0.23, 0.27, 0.22, 20]} />
            </mesh>
            <mesh position={[0, 0.33, 0]} material={m.whiteThermal} castShadow>
              <cylinderGeometry args={[0.1, 0.12, 0.12, 16]} />
            </mesh>
            <mesh position={[0, 0.39, 0]} material={m.silverFoil}>
              <sphereGeometry args={[0.06, 12, 10]} />
            </mesh>
          </group>

          {/* Lunar Surface Magnetometer: tripod with three orthogonal booms */}
          <group position={[0.66, 0, 0.9]}>
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
              <mesh
                key={i}
                position={[Math.cos(ang) * 0.14, 0.16, Math.sin(ang) * 0.14]}
                rotation={[Math.sin(ang) * 0.3, 0, -Math.cos(ang) * 0.3]}
                material={m.titanium}
              >
                <cylinderGeometry args={[0.012, 0.016, 0.32, 6]} />
              </mesh>
            ))}
            <mesh position={[0, 0.36, 0]} material={m.whiteThermal} castShadow>
              <boxGeometry args={[0.18, 0.14, 0.18]} />
            </mesh>
            {/* Three orthogonal sensor booms */}
            <mesh position={[0.23, 0.36, 0]} rotation={[0, 0, Math.PI / 2]} material={m.titanium}>
              <cylinderGeometry args={[0.01, 0.01, 0.36, 6]} />
            </mesh>
            <mesh position={[0.42, 0.36, 0]} material={m.goldFoil}>
              <sphereGeometry args={[0.045, 10, 8]} />
            </mesh>
            <mesh position={[0, 0.36, 0.23]} rotation={[Math.PI / 2, 0, 0]} material={m.titanium}>
              <cylinderGeometry args={[0.01, 0.01, 0.36, 6]} />
            </mesh>
            <mesh position={[0, 0.36, 0.42]} material={m.goldFoil}>
              <sphereGeometry args={[0.045, 10, 8]} />
            </mesh>
            <mesh position={[0, 0.59, 0]} material={m.titanium}>
              <cylinderGeometry args={[0.01, 0.01, 0.32, 6]} />
            </mesh>
            <mesh position={[0, 0.76, 0]} material={m.goldFoil}>
              <sphereGeometry args={[0.045, 10, 8]} />
            </mesh>
          </group>

          {/* Flat Kapton telemetry ribbons running across the regolith */}
          <mesh position={[-0.5, 0.022, 0.19]} rotation={[0, -0.35, 0]} material={m.copper}>
            <boxGeometry args={[0.95, 0.014, 0.075]} />
          </mesh>
          <mesh position={[0.52, 0.022, -0.16]} rotation={[0, 0.28, 0]} material={m.copper}>
            <boxGeometry args={[1.02, 0.014, 0.075]} />
          </mesh>
          <mesh position={[0.34, 0.022, 0.5]} rotation={[0, -0.75, 0]} material={m.copper}>
            <boxGeometry args={[0.88, 0.014, 0.075]} />
          </mesh>
        </group>
      );
    }

    /* 4. SURVEYOR LANDERS */
    case 'surveyor-landers': {
      const legAngles = [
        Math.PI / 2,
        Math.PI / 2 + (2 * Math.PI) / 3,
        Math.PI / 2 + (4 * Math.PI) / 3,
      ];
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Three main landing legs, shock struts and crushable footpads */}
          {legAngles.map((ang, i) => {
            const nextAng = legAngles[(i + 1) % legAngles.length];
            const attach: [number, number, number] = [
              Math.cos(ang) * 0.3,
              1.04,
              Math.sin(ang) * 0.3,
            ];
            const foot: [number, number, number] = [
              Math.cos(ang) * 1.48,
              0.12,
              Math.sin(ang) * 1.48,
            ];
            const braceTop: [number, number, number] = [
              Math.cos(ang) * 0.46,
              1.2,
              Math.sin(ang) * 0.46,
            ];
            const braceFoot: [number, number, number] = [
              Math.cos(ang) * 1.02,
              0.52,
              Math.sin(ang) * 1.02,
            ];
            const crossA: [number, number, number] = [
              Math.cos(ang) * 1.02,
              0.66,
              Math.sin(ang) * 1.02,
            ];
            const crossB: [number, number, number] = [
              Math.cos(nextAng) * 1.02,
              0.66,
              Math.sin(nextAng) * 1.02,
            ];
            return (
              <group key={i}>
                <Strut from={attach} to={foot} radius={0.045} material={m.titanium} />
                <Strut from={braceTop} to={braceFoot} radius={0.027} material={m.silverFoil} />
                <Strut from={crossA} to={crossB} radius={0.019} material={m.titanium} />
                <mesh position={attach} material={m.darkCarbon}>
                  <boxGeometry args={[0.17, 0.15, 0.17]} />
                </mesh>
                <mesh
                  position={[Math.cos(ang) * 1.48, 0.055, Math.sin(ang) * 1.48]}
                  material={m.whiteThermal}
                  castShadow
                  receiveShadow
                >
                  <cylinderGeometry args={[0.25, 0.28, 0.11, 18]} />
                </mesh>
              </group>
            );
          })}

          {/* Central hexagonal equipment bus and gold thermal skirt */}
          <mesh position={[0, 0.98, 0]} material={m.whiteThermal} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.52, 0.52, 6]} />
          </mesh>
          <mesh position={[0, 0.7, 0]} material={m.goldFoil} castShadow>
            <cylinderGeometry args={[0.54, 0.4, 0.26, 6]} />
          </mesh>
          <mesh position={[0, 1.26, 0]} material={m.silverFoil}>
            <cylinderGeometry args={[0.58, 0.58, 0.06, 6]} />
          </mesh>
          <mesh position={[0.28, 0.82, 0.3]} material={m.goldFoil} castShadow>
            <boxGeometry args={[0.24, 0.2, 0.16]} />
          </mesh>
          <mesh position={[-0.3, 0.86, -0.2]} material={m.silverFoil} castShadow>
            <boxGeometry args={[0.2, 0.18, 0.22]} />
          </mesh>

          {/* Solar panel deck */}
          <group position={[0, 1.37, 0]} rotation={[-0.1, 0, 0]}>
            <mesh material={m.solar} castShadow>
              <boxGeometry args={[1.24, 0.045, 0.94]} />
            </mesh>
            <mesh position={[0, -0.035, 0]} material={m.darkCarbon}>
              <boxGeometry args={[1.28, 0.02, 0.98]} />
            </mesh>
          </group>

          {/* Planar high-gain antenna on a short mast */}
          <mesh position={[-0.34, 1.58, 0]} material={m.titanium}>
            <cylinderGeometry args={[0.018, 0.022, 0.62, 8]} />
          </mesh>
          <group position={[-0.34, 1.98, 0]} rotation={[0.34, 0.18, 0]}>
            <mesh material={m.whiteThermal} castShadow>
              <boxGeometry args={[0.72, 0.72, 0.035]} />
            </mesh>
            {[
              [0, 0.36, 0.02, 0.74, 0.03, 0.045],
              [0, -0.36, 0.02, 0.74, 0.03, 0.045],
              [0.36, 0, 0.02, 0.03, 0.72, 0.045],
              [-0.36, 0, 0.02, 0.03, 0.72, 0.045],
            ].map(([x, y, z, w, h, d], i) => (
              <mesh key={i} position={[x, y, z]} material={m.titanium}>
                <boxGeometry args={[w, h, d]} />
              </mesh>
            ))}
          </group>

          {/* Omnidirectional antenna */}
          <mesh position={[0.32, 1.6, 0.18]} material={m.titanium}>
            <cylinderGeometry args={[0.01, 0.014, 0.72, 8]} />
          </mesh>
          <mesh position={[0.32, 1.98, 0.18]} material={m.goldFoil}>
            <coneGeometry args={[0.055, 0.12, 10]} />
          </mesh>

          {/* TV camera turret and sensor boom */}
          <mesh position={[0.12, 1.06, 0.42]} material={m.whiteThermal} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.22, 12]} />
          </mesh>
          <mesh position={[0.12, 1.19, 0.42]} rotation={[0.5, 0, 0]} material={m.opticGlass}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
          </mesh>
          <group ref={(el) => { refsOut.current.arm = el; }} position={[0.42, 0.8, 0.28]}>
            <mesh position={[0, 0, 0.36]} rotation={[Math.PI / 2, 0, 0]} material={m.titanium}>
              <cylinderGeometry args={[0.022, 0.022, 0.72, 8]} />
            </mesh>
            <mesh position={[0, -0.04, 0.72]} material={m.copper}>
              <boxGeometry args={[0.1, 0.07, 0.12]} />
            </mesh>
          </group>
        </group>
      );
    }

    /* 5. SOJOURNER ROVER */
    case 'sojourner-rover': {
      const wheels: [number, number, number][] = [
        [-0.46, 0.18, 0.48],
        [0.46, 0.18, 0.48],
        [-0.5, 0.18, 0],
        [0.5, 0.18, 0],
        [-0.46, 0.18, -0.48],
        [0.46, 0.18, -0.48],
      ];
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Gold Kapton Warm Electronics Box */}
          <mesh position={[0, 0.42, 0]} material={m.goldFoil} castShadow receiveShadow>
            <boxGeometry args={[0.68, 0.24, 0.92]} />
          </mesh>
          {/* Top Photovoltaic Solar Panel Deck */}
          <mesh position={[0, 0.56, 0]} material={m.solar} castShadow>
            <boxGeometry args={[0.8, 0.04, 1.06]} />
          </mesh>
          {/* Stereo Front Cameras & Laser Projectors */}
          <mesh position={[-0.14, 0.48, 0.49]} rotation={[Math.PI / 2, 0, 0]} material={m.opticGlass}>
            <cylinderGeometry args={[0.038, 0.038, 0.06, 12]} />
          </mesh>
          <mesh position={[0.14, 0.48, 0.49]} rotation={[Math.PI / 2, 0, 0]} material={m.opticGlass}>
            <cylinderGeometry args={[0.038, 0.038, 0.06, 12]} />
          </mesh>
          {/* Whip UHF Antenna */}
          <mesh position={[-0.28, 0.88, -0.36]} material={m.titanium}>
            <cylinderGeometry args={[0.01, 0.014, 0.62, 8]} />
          </mesh>
          {/* Rear Alpha Proton X-Ray Spectrometer (APXS) Head */}
          <group
            ref={(el) => { refsOut.current.arm = el; }}
            position={[0.18, 0.36, -0.48]}
          >
            <mesh position={[0, -0.04, -0.18]} rotation={[Math.PI / 2, 0, 0]} material={m.copper} castShadow>
              <cylinderGeometry args={[0.085, 0.095, 0.24, 14]} />
            </mesh>
          </group>
          {/* Rocker-Bogie Differential Links & 6 Cleated Metallic Wheels */}
          {[-0.38, 0.38].map((x, i) => (
            <group key={i} position={[x, 0.32, 0]}>
              <mesh material={m.titanium}>
                <boxGeometry args={[0.04, 0.04, 0.96]} />
              </mesh>
              <mesh position={[0, -0.07, 0.24]} rotation={[0.4, 0, 0]} material={m.titanium}>
                <cylinderGeometry args={[0.018, 0.018, 0.46, 8]} />
              </mesh>
              <mesh position={[0, -0.07, -0.24]} rotation={[-0.4, 0, 0]} material={m.titanium}>
                <cylinderGeometry args={[0.018, 0.018, 0.46, 8]} />
              </mesh>
            </group>
          ))}
          {wheels.map((pos, i) => (
            <group key={i} position={pos}>
              <mesh ref={registerWheel} rotation={[0, 0, Math.PI / 2]} material={m.darkCarbon} castShadow>
                <cylinderGeometry args={[0.18, 0.18, 0.13, 18]} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} material={m.titanium}>
                <cylinderGeometry args={[0.08, 0.08, 0.145, 10]} />
              </mesh>
            </group>
          ))}
        </group>
      );
    }

    /* 6. SPIRIT, OPPORTUNITY, CURIOSITY & PERSEVERANCE (MARS ROVERS) */
    case 'spirit-opportunity':
    case 'curiosity':
    case 'perseverance': {
      const wheels: [number, number, number][] = [
        [-0.8, 0.24, 0.74],
        [0.8, 0.24, 0.74],
        [-0.84, 0.24, 0],
        [0.84, 0.24, 0],
        [-0.8, 0.24, -0.74],
        [0.8, 0.24, -0.74],
      ];
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Gold Kapton Warm Electronics Box */}
          <mesh position={[0, 0.65, 0]} material={m.goldFoil} castShadow receiveShadow>
            <boxGeometry args={[0.88, 0.42, 1.05]} />
          </mesh>
          {/* Multi-Wing Butterfly Solar Array Deck */}
          <mesh position={[0, 0.89, 0]} material={m.solar} castShadow>
            <boxGeometry args={[1.98, 0.05, 1.38]} />
          </mesh>
          <mesh position={[0, 0.89, -0.78]} material={m.solar} castShadow>
            <boxGeometry args={[1.15, 0.05, 0.56]} />
          </mesh>
          {/* Pancam Mast Assembly (PMA) + Stereo Camera Bar */}
          <group position={[0.18, 1.26, 0.42]}>
            <mesh position={[0, -0.15, 0]} material={m.whiteThermal} castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.74, 12]} />
            </mesh>
            <mesh position={[0, 0.25, 0]} material={m.whiteThermal} castShadow>
              <boxGeometry args={[0.42, 0.16, 0.18]} />
            </mesh>
            <mesh position={[-0.12, 0.25, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={m.opticGlass}>
              <cylinderGeometry args={[0.042, 0.042, 0.04, 12]} />
            </mesh>
            <mesh position={[0.12, 0.25, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={m.opticGlass}>
              <cylinderGeometry args={[0.042, 0.042, 0.04, 12]} />
            </mesh>
          </group>
          {/* Steerable Parabolic High-Gain Dish */}
          <mesh
            ref={(el) => { refsOut.current.dish = el; }}
            position={[-0.36, 1.14, -0.32]}
            rotation={[0.75, 0.2, 0]}
            geometry={geos.merDish}
            material={m.whiteThermal}
            castShadow
          />
          {/* 5-DOF Instrument Deployment Device (IDD Arm + Turret) */}
          <group
            ref={(el) => { refsOut.current.arm = el; }}
            position={[-0.18, 0.64, 0.55]}
          >
            <mesh position={[0, 0, 0.36]} rotation={[Math.PI / 2, 0, 0]} material={m.titanium} castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.74, 10]} />
            </mesh>
            <mesh position={[0, -0.04, 0.74]} material={m.copper}>
              <cylinderGeometry args={[0.095, 0.095, 0.14, 14]} />
            </mesh>
          </group>
          {/* 6 Rocker-Bogie Suspension Arms & Spiral-Flexed Anodized Wheels */}
          {[-0.66, 0.66].map((x, i) => (
            <group key={i} position={[x, 0.44, 0]}>
              <mesh material={m.titanium}>
                <boxGeometry args={[0.048, 0.055, 1.44]} />
              </mesh>
              <mesh position={[0, -0.1, 0.36]} rotation={[0.45, 0, 0]} material={m.titanium}>
                <cylinderGeometry args={[0.024, 0.024, 0.55, 8]} />
              </mesh>
              <mesh position={[0, -0.1, -0.36]} rotation={[-0.45, 0, 0]} material={m.titanium}>
                <cylinderGeometry args={[0.024, 0.024, 0.55, 8]} />
              </mesh>
            </group>
          ))}
          {wheels.map((pos, i) => (
            <group key={i} position={pos}>
              <mesh ref={registerWheel} rotation={[0, 0, Math.PI / 2]} material={m.darkCarbon} castShadow>
                <cylinderGeometry args={[0.24, 0.24, 0.16, 20]} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} material={m.titanium}>
                <cylinderGeometry args={[0.11, 0.11, 0.17, 12]} />
              </mesh>
            </group>
          ))}
        </group>
      );
    }

    /* 7. VIKING 1 & 2 LANDERS */
    case 'viking-1-2': {
      const legAngles = [
        Math.PI / 2,
        Math.PI / 2 + (2 * Math.PI) / 3,
        Math.PI / 2 + (4 * Math.PI) / 3,
      ];
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Hexagonal thermal-blanketed lander body */}
          <mesh position={[0, 0.88, 0]} material={m.whiteThermal} castShadow receiveShadow>
            <cylinderGeometry args={[0.95, 1.0, 0.54, 6]} />
          </mesh>
          <mesh position={[0, 0.58, 0]} material={m.goldFoil} castShadow>
            <cylinderGeometry args={[1.0, 0.9, 0.16, 6]} />
          </mesh>
          <mesh position={[0, 1.16, 0]} material={m.silverFoil}>
            <cylinderGeometry args={[0.97, 0.97, 0.05, 6]} />
          </mesh>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
            <mesh
              key={i}
              position={[Math.cos(ang) * 0.92, 0.92, Math.sin(ang) * 0.92]}
              rotation={[0, -ang, 0]}
              material={m.goldFoil}
              castShadow
            >
              <boxGeometry args={[0.52, 0.28, 0.025]} />
            </mesh>
          ))}

          {/* Three landing legs: attached at body, knee joint, footpad */}
          {legAngles.map((ang, i) => {
            const attach: [number, number, number] = [
              Math.cos(ang) * 0.84,
              0.9,
              Math.sin(ang) * 0.84,
            ];
            const knee: [number, number, number] = [
              Math.cos(ang) * 1.2,
              0.58,
              Math.sin(ang) * 1.2,
            ];
            const foot: [number, number, number] = [
              Math.cos(ang) * 1.58,
              0.1,
              Math.sin(ang) * 1.58,
            ];
            const brace: [number, number, number] = [
              Math.cos(ang) * 1.02,
              1.02,
              Math.sin(ang) * 1.02,
            ];
            return (
              <group key={i}>
                <Strut from={attach} to={knee} radius={0.045} material={m.titanium} />
                <Strut from={knee} to={foot} radius={0.035} material={m.titanium} />
                <Strut from={brace} to={knee} radius={0.02} material={m.silverFoil} />
                <mesh position={foot} material={m.whiteThermal} castShadow receiveShadow>
                  <cylinderGeometry args={[0.23, 0.27, 0.1, 18]} />
                </mesh>
              </group>
            );
          })}

          {/* Twin SNAP-19 RTGs with radial fins */}
          {[-0.62, 0.62].map((x, i) => (
            <group key={i} position={[x, 1.4, -0.08]}>
              <Strut
                from={[x, 1.17, -0.08]}
                to={[x, 1.26, -0.08]}
                radius={0.05}
                material={m.titanium}
              />
              <mesh material={m.goldFoil} castShadow>
                <cylinderGeometry args={[0.13, 0.13, 0.42, 16]} />
              </mesh>
              {Array.from({ length: 6 }).map((_, fi) => (
                <mesh key={fi} rotation={[0, (fi * Math.PI) / 3, 0]} material={m.titanium}>
                  <boxGeometry args={[0.36, 0.38, 0.014]} />
                </mesh>
              ))}
              <mesh position={[0, 0.23, 0]} material={m.darkCarbon}>
                <cylinderGeometry args={[0.09, 0.09, 0.05, 12]} />
              </mesh>
            </group>
          ))}

          {/* High-gain parabolic dish on a mast */}
          <mesh position={[0.05, 1.38, -0.6]} material={m.titanium}>
            <cylinderGeometry args={[0.028, 0.034, 0.55, 8]} />
          </mesh>
          <group position={[0.05, 1.72, -0.6]} rotation={[0.6, 0.2, 0]}>
            <mesh geometry={geos.vikingDish} castShadow>
              <meshStandardMaterial
                color="#eef2f6"
                metalness={0.25}
                roughness={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 0.12, 0]} material={m.titanium}>
              <cylinderGeometry args={[0.008, 0.008, 0.24, 6]} />
            </mesh>
            <mesh position={[0, 0.25, 0]} material={m.copper}>
              <sphereGeometry args={[0.032, 8, 8]} />
            </mesh>
          </group>

          {/* Facsimile cameras */}
          {[-0.3, 0.3].map((x, i) => (
            <group key={i} position={[x, 1.24, 0.7]}>
              <mesh material={m.goldFoil} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
              </mesh>
              <mesh position={[0, 0.05, 0.1]} material={m.opticGlass}>
                <boxGeometry args={[0.06, 0.14, 0.03]} />
              </mesh>
            </group>
          ))}

          {/* Meteorology boom */}
          <Strut
            from={[-0.82, 1.12, 0.18]}
            to={[-1.26, 1.66, 0.34]}
            radius={0.015}
            material={m.titanium}
          />
          <mesh position={[-1.26, 1.66, 0.34]} material={m.silverFoil}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
          </mesh>

          {/* Remote sampler arm */}
          <group ref={(el) => { refsOut.current.arm = el; }} position={[0, 0.94, 0.86]}>
            <mesh position={[0, 0, 0.56]} rotation={[Math.PI / 2, 0, 0]} material={m.titanium} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 1.12, 10]} />
            </mesh>
            <mesh position={[0, -0.04, 1.14]} material={m.copper}>
              <boxGeometry args={[0.12, 0.08, 0.16]} />
            </mesh>
          </group>
        </group>
      );
    }

    /* 8. PHOENIX & INSIGHT LANDERS */
    case 'phoenix-insight': {
      const legAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Circular Avionics Science Deck */}
          <mesh position={[0, 0.78, 0]} material={m.goldFoil} castShadow receiveShadow>
            <cylinderGeometry args={[0.88, 0.82, 0.34, 24]} />
          </mesh>
          {/* Twin Decagonal UltraFlex Fan-Folded Solar Wings */}
          {[-1.82, 1.82].map((x, i) => (
            <group key={i} position={[x, 0.86, 0]}>
              <mesh
                ref={(el) => {
                  if (el && refsOut.current.solarWings && !refsOut.current.solarWings.includes(el)) {
                    refsOut.current.solarWings.push(el);
                  }
                }}
                material={m.solar}
                castShadow
                receiveShadow
              >
                <cylinderGeometry args={[1.0, 1.0, 0.04, 10]} />
              </mesh>
              <mesh position={[x > 0 ? -0.95 : 0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.titanium}>
                <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
              </mesh>
            </group>
          ))}
          {/* 3 Shock-Absorbing Landing Legs */}
          {legAngles.map((ang, i) => (
            <group key={i} rotation={[0, ang, 0]}>
              <mesh position={[0.92, 0.38, 0]} rotation={[0, 0, -0.58]} material={m.titanium} castShadow>
                <cylinderGeometry args={[0.04, 0.045, 0.92, 10]} />
              </mesh>
              <mesh position={[1.18, 0.05, 0]} material={m.darkCarbon} castShadow>
                <cylinderGeometry args={[0.18, 0.22, 0.09, 16]} />
              </mesh>
            </group>
          ))}
          {/* 1.8m 4-DOF Robotic Deployment Arm */}
          <group
            ref={(el) => { refsOut.current.arm = el; }}
            position={[0.28, 0.96, 0.45]}
          >
            <mesh position={[0, 0.16, 0.38]} rotation={[0.9, 0, 0]} material={m.titanium} castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.85, 10]} />
            </mesh>
            <mesh position={[0, 0.32, 0.72]} material={m.copper}>
              <boxGeometry args={[0.1, 0.08, 0.12]} />
            </mesh>
          </group>
          {/* SEIS Copper-Trimmed Wind & Thermal Dome Placed on Martian Soil */}
          <group
            ref={(el) => { refsOut.current.seismometer = el; }}
            position={[0.35, 0.16, 1.48]}
          >
            <mesh material={m.whiteThermal} castShadow receiveShadow>
              <sphereGeometry args={[0.28, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
            <mesh position={[0, 0.02, 0]} material={m.copper}>
              <cylinderGeometry args={[0.3, 0.32, 0.06, 20]} />
            </mesh>
          </group>
        </group>
      );
    }

    /* 9. DAWN SPACECRAFT */
    case 'dawn-spacecraft': {
      return (
        <group ref={(r) => { refsOut.current.root = r; }} position={[0, 0.95, 0]}>
          {/* Aluminum-Composite Silver/Gold Spacecraft Bus */}
          <mesh material={m.silverFoil} castShadow receiveShadow>
            <boxGeometry args={[0.96, 1.18, 0.96]} />
          </mesh>
          <mesh position={[0, 0.1, 0.49]} material={m.goldFoil}>
            <boxGeometry args={[0.72, 0.72, 0.04]} />
          </mesh>
          {/* 1.52-m Parabolic High-Gain Dish */}
          <mesh
            ref={(el) => { refsOut.current.dish = el; }}
            position={[0, 0.62, 0]}
            geometry={geos.dawnDish}
            material={m.whiteThermal}
            castShadow
          />
          {/* Massive Twin 3-Panel Solar Wings */}
          {[-2.45, 2.45].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh
                ref={(el) => {
                  if (el && refsOut.current.solarWings && !refsOut.current.solarWings.includes(el)) {
                    refsOut.current.solarWings.push(el);
                  }
                }}
                material={m.solar}
                castShadow
              >
                <boxGeometry args={[3.55, 0.045, 0.88]} />
              </mesh>
              <mesh position={[x > 0 ? -1.8 : 1.8, 0, 0]} material={m.titanium}>
                <boxGeometry args={[0.32, 0.08, 0.24]} />
              </mesh>
            </group>
          ))}
          {/* 3 Xenon Ion Thrusters + Luminous Blue Plasma Cone */}
          <mesh position={[0, -0.68, 0]} material={m.titanium}>
            <cylinderGeometry args={[0.24, 0.28, 0.24, 16]} />
          </mesh>
          <mesh
            ref={(el) => { refsOut.current.ionPlume = el; }}
            position={[0, -1.16, 0]}
          >
            <coneGeometry args={[0.22, 0.88, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.78} />
          </mesh>
        </group>
      );
    }

    /* 10. NEAR SHOEMAKER */
    case 'near-shoemaker': {
      const solarRotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      return (
        <group ref={(r) => { refsOut.current.root = r; }} position={[0, 0.76, 0]}>
          {/* Octagonal Gold-Kapton Bus */}
          <mesh material={m.goldFoil} castShadow receiveShadow>
            <cylinderGeometry args={[0.78, 0.78, 1.18, 8]} />
          </mesh>
          {/* Fixed 1.5-m Parabolic X-Band High-Gain Dish */}
          <mesh
            ref={(el) => { refsOut.current.dish = el; }}
            position={[0, 0.62, 0]}
            geometry={geos.nearDish}
            material={m.whiteThermal}
            castShadow
          />
          {/* Feed Horn Post */}
          <mesh position={[0, 0.92, 0]} material={m.titanium}>
            <cylinderGeometry args={[0.025, 0.035, 0.56, 10]} />
          </mesh>
          {/* 4 Fixed Windmill Solar Wings */}
          {solarRotations.map((ang, i) => (
            <group key={i} rotation={[0, ang, 0]}>
              <mesh position={[1.48, 0.16, 0]} rotation={[0.16, 0, 0]} material={m.solar} castShadow>
                <boxGeometry args={[1.58, 0.04, 0.86]} />
              </mesh>
              <mesh position={[0.72, 0.16, 0]} material={m.titanium}>
                <boxGeometry args={[0.22, 0.06, 0.2]} />
              </mesh>
            </group>
          ))}
          {/* MSI Imager & Spectrometer Hood */}
          <mesh position={[0, -0.25, 0.84]} rotation={[Math.PI / 2, 0, 0]} material={m.darkCarbon}>
            <cylinderGeometry args={[0.14, 0.16, 0.2, 14]} />
          </mesh>
        </group>
      );
    }

    /* 11. PIONEER 10 & 11 */
    case 'pioneer-10-11': {
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Iconic 2.74 m parabolic high-gain dish, facing the camera */}
          <mesh
            ref={(el) => { refsOut.current.dish = el; }}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            geometry={geos.pioneerDish}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color="#eef2f6"
              metalness={0.25}
              roughness={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Feed horn tripod */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
            <Strut
              key={i}
              from={[Math.cos(ang) * 1.3, Math.sin(ang) * 1.3, 0]}
              to={[0, 0, 0.95]}
              radius={0.02}
              material={m.titanium}
            />
          ))}
          <mesh position={[0, 0, 1.0]} rotation={[Math.PI / 2, 0, 0]} material={m.goldFoil}>
            <cylinderGeometry args={[0.09, 0.05, 0.18, 10]} />
          </mesh>
          <mesh position={[0, 0, 1.12]} material={m.copper}>
            <sphereGeometry args={[0.04, 10, 8]} />
          </mesh>

          {/* Hexagonal gold-foil equipment bus behind the dish */}
          <mesh position={[0, 0, -0.55]} rotation={[Math.PI / 2, 0, 0]} material={m.goldFoil} castShadow>
            <cylinderGeometry args={[0.46, 0.46, 0.42, 6]} />
          </mesh>
          <mesh position={[0, 0, -0.78]} rotation={[Math.PI / 2, 0, 0]} material={m.silverFoil}>
            <cylinderGeometry args={[0.3, 0.3, 0.06, 6]} />
          </mesh>

          {/* Three RTG booms with finned generators */}
          {[
            Math.PI / 2,
            Math.PI / 2 + (2 * Math.PI) / 3,
            Math.PI / 2 + (4 * Math.PI) / 3,
          ].map((ang, i) => {
            const dx = Math.cos(ang);
            const dy = Math.sin(ang);
            const from: [number, number, number] = [dx * 0.46, dy * 0.46, -0.55];
            const end: [number, number, number] = [dx * 2.35, dy * 2.35, -0.55];
            return (
              <group key={i}>
                <Strut from={from} to={end} radius={0.025} material={m.titanium} />
                <group position={end} rotation={[0, 0, ang - Math.PI / 2]}>
                  <mesh material={m.darkCarbon} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.46, 14]} />
                  </mesh>
                  {[0, Math.PI / 3, (2 * Math.PI) / 3].map((fa, fi) => (
                    <mesh key={fi} rotation={[0, fa, 0]} material={m.titanium}>
                      <boxGeometry args={[0.38, 0.44, 0.016]} />
                    </mesh>
                  ))}
                  <mesh position={[0, 0.26, 0]} material={m.goldFoil}>
                    <cylinderGeometry args={[0.1, 0.1, 0.06, 12]} />
                  </mesh>
                </group>
              </group>
            );
          })}

          {/* Magnetometer boom */}
          <Strut from={[0, -0.3, -0.6]} to={[0, -2.15, -0.6]} radius={0.02} material={m.titanium} />
          <mesh position={[0, -2.28, -0.6]} material={m.copper}>
            <cylinderGeometry args={[0.07, 0.07, 0.22, 10]} />
          </mesh>

          {/* Pioneer plaque */}
          <mesh position={[0.34, 0.18, -0.72]} rotation={[0, 0.35, 0]} material={m.goldFoil}>
            <boxGeometry args={[0.22, 0.15, 0.02]} />
          </mesh>
        </group>
      );
    }

    /* 12. INGENUITY HELICOPTER */
    case 'ingenuity-helicopter': {
      const legAngles = [
        Math.PI / 4,
        (3 * Math.PI) / 4,
        (5 * Math.PI) / 4,
        (7 * Math.PI) / 4,
      ];
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Gold-foil avionics body with solar deck */}
          <mesh position={[0, 0.62, 0]} material={m.goldFoil} castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.28, 0.42]} />
          </mesh>
          <mesh position={[0, 0.77, 0]} material={m.whiteThermal}>
            <boxGeometry args={[0.46, 0.03, 0.46]} />
          </mesh>
          <mesh position={[0, 0.79, 0]} material={m.solar} castShadow>
            <boxGeometry args={[0.56, 0.02, 0.5]} />
          </mesh>
          <mesh position={[0.1, 0.47, 0.1]} material={m.opticGlass}>
            <cylinderGeometry args={[0.035, 0.035, 0.03, 12]} />
          </mesh>

          {/* Four landing legs with skids, attached to the body */}
          {legAngles.map((ang, i) => {
            const top: [number, number, number] = [
              Math.cos(ang) * 0.17,
              0.55,
              Math.sin(ang) * 0.17,
            ];
            const foot: [number, number, number] = [
              Math.cos(ang) * 0.52,
              0.04,
              Math.sin(ang) * 0.52,
            ];
            return (
              <group key={i}>
                <Strut from={top} to={foot} radius={0.016} material={m.darkCarbon} />
                <mesh position={foot} rotation={[0, -ang, Math.PI / 2]} material={m.titanium}>
                  <cylinderGeometry args={[0.022, 0.022, 0.2, 8]} />
                </mesh>
              </group>
            );
          })}

          {/* Rotor mast and swashplate */}
          <mesh position={[0, 0.99, 0]} material={m.titanium} castShadow>
            <cylinderGeometry args={[0.03, 0.038, 0.4, 12]} />
          </mesh>
          <mesh position={[0, 0.87, 0]} material={m.silverFoil}>
            <cylinderGeometry args={[0.07, 0.07, 0.05, 14]} />
          </mesh>

          {/* Two counter-rotating rotors */}
          <group ref={(el) => { refsOut.current.rotorBottom = el; }} position={[0, 1.12, 0]}>
            <mesh material={m.darkCarbon} castShadow>
              <boxGeometry args={[1.2, 0.012, 0.065]} />
            </mesh>
            <mesh material={m.titanium}>
              <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
            </mesh>
          </group>
          <group
            ref={(el) => { refsOut.current.rotorTop = el; }}
            position={[0, 1.26, 0]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <mesh material={m.darkCarbon} castShadow>
              <boxGeometry args={[1.2, 0.012, 0.065]} />
            </mesh>
            <mesh material={m.titanium}>
              <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
            </mesh>
          </group>

          {/* Antenna */}
          <mesh position={[0.17, 0.94, -0.12]} material={m.titanium}>
            <cylinderGeometry args={[0.008, 0.008, 0.36, 6]} />
          </mesh>
        </group>
      );
    }

    /* 14. LUNOKHOD 1 (SOVIET LUNAR ROVER) */
    case 'lunokhod-1': {
      const wheelX = [-0.55, -0.18, 0.18, 0.55];
      const wheelZ = [-0.56, 0.56];
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Pressurised instrument tub */}
          <mesh position={[0, 0.55, 0]} material={m.titanium} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.5, 1.04]} />
          </mesh>
          <mesh position={[0, 0.81, 0]} material={m.silverFoil}>
            <boxGeometry args={[1.54, 0.05, 1.08]} />
          </mesh>
          <mesh position={[0, 0.32, 0]} material={m.goldFoil}>
            <boxGeometry args={[1.46, 0.07, 1.0]} />
          </mesh>
          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh position={[side * 0.76, 0.56, 0]} material={m.whiteThermal}>
                <boxGeometry args={[0.03, 0.36, 0.9]} />
              </mesh>
              <mesh position={[side * 0.76, 0.37, 0]} material={m.goldFoil}>
                <boxGeometry args={[0.035, 0.12, 0.94]} />
              </mesh>
            </group>
          ))}

          {/* Rear hinge and open solar lid */}
          <mesh position={[0, 0.83, -0.54]} rotation={[0, 0, Math.PI / 2]} material={m.darkCarbon}>
            <cylinderGeometry args={[0.035, 0.035, 1.48, 10]} />
          </mesh>
          <group position={[0, 0.83, -0.53]} rotation={[-0.52, 0, 0]}>
            <mesh position={[0, 0, 0.52]} material={m.darkCarbon} castShadow>
              <boxGeometry args={[1.5, 0.05, 1.04]} />
            </mesh>
            <mesh position={[0, 0.035, 0.52]} material={m.solar} castShadow>
              <boxGeometry args={[1.42, 0.02, 0.96]} />
            </mesh>
            <mesh position={[0, -0.035, 0.52]} material={m.whiteThermal}>
              <boxGeometry args={[1.44, 0.015, 0.98]} />
            </mesh>
            <mesh position={[0, 0.05, 0.52]} material={m.darkCarbon}>
              <boxGeometry args={[0.46, 0.015, 0.34]} />
            </mesh>
          </group>

          {/* Eight driven wheels on suspension arms */}
          {wheelX.map((x) =>
            wheelZ.map((z) => (
              <group key={`${x}-${z}`} position={[x, 0.22, z]}>
                <group
                  ref={registerWheel}
                  userData={{ spinAxis: 'y' }}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <mesh material={m.darkCarbon} castShadow>
                    <cylinderGeometry args={[0.2, 0.2, 0.13, 24]} />
                  </mesh>
                  <mesh material={m.titanium}>
                    <cylinderGeometry args={[0.08, 0.08, 0.14, 14]} />
                  </mesh>
                  <mesh position={[0, 0.072, 0]} material={m.silverFoil}>
                    <boxGeometry args={[0.34, 0.012, 0.035]} />
                  </mesh>
                  <mesh position={[0, -0.072, 0]} material={m.silverFoil}>
                    <boxGeometry args={[0.34, 0.012, 0.035]} />
                  </mesh>
                  <mesh position={[0, 0.072, 0]} rotation={[0, Math.PI / 2, 0]} material={m.silverFoil}>
                    <boxGeometry args={[0.34, 0.012, 0.035]} />
                  </mesh>
                </group>
                <Strut from={[0, 0.3, 0]} to={[0, 0.04, 0]} radius={0.022} material={m.titanium} />
              </group>
            )),
          )}

          {/* Front TV cameras and soil scoop */}
          {[-0.18, 0.18].map((z, i) => (
            <group key={i} position={[0.68, 0.86, z]}>
              <mesh material={m.whiteThermal} castShadow>
                <cylinderGeometry args={[0.07, 0.08, 0.18, 12]} />
              </mesh>
              <mesh position={[0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.opticGlass}>
                <cylinderGeometry args={[0.055, 0.055, 0.04, 12]} />
              </mesh>
            </group>
          ))}
          <mesh position={[0.77, 0.48, 0]} material={m.copper}>
            <boxGeometry args={[0.12, 0.1, 0.28]} />
          </mesh>

          {/* X-ray spectrometer on a short boom */}
          <Strut
            from={[0.5, 0.62, 0.4]}
            to={[0.94, 0.36, 0.62]}
            radius={0.018}
            material={m.titanium}
          />
          <mesh position={[0.96, 0.34, 0.64]} material={m.goldFoil}>
            <boxGeometry args={[0.11, 0.11, 0.11]} />
          </mesh>

          {/* Rear antenna mast and dish */}
          <mesh position={[-0.42, 1.04, -0.2]} material={m.titanium}>
            <cylinderGeometry args={[0.014, 0.02, 0.62, 8]} />
          </mesh>
          <group position={[-0.42, 1.4, -0.2]} rotation={[0.4, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.15, 0.03, 0.09, 14, 1, true]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.1, 0]} material={m.copper}>
              <sphereGeometry args={[0.022, 8, 8]} />
            </mesh>
          </group>

          {/* Laser reflector and top instrument box */}
          <mesh position={[-0.34, 0.86, 0.24]} material={m.whiteThermal}>
            <boxGeometry args={[0.26, 0.1, 0.22]} />
          </mesh>
          {[
            [-0.44, 0.92, 0.16],
            [-0.24, 0.92, 0.16],
            [-0.34, 0.92, 0.32],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]} material={m.goldFoil}>
              <cylinderGeometry args={[0.035, 0.035, 0.05, 10]} />
            </mesh>
          ))}
        </group>
      );
    }

    /* 15. MARS PATHFINDER LANDER */
    case 'mars-pathfinder': {
      return (
        <group ref={(r) => { refsOut.current.root = r; }}>
          {/* Central lander body */}
          <mesh position={[0, 0.5, 0]} material={m.whiteThermal} castShadow receiveShadow>
            <boxGeometry args={[0.72, 0.52, 0.72]} />
          </mesh>
          <mesh position={[0, 0.24, 0]} material={m.goldFoil} castShadow>
            <boxGeometry args={[0.76, 0.18, 0.76]} />
          </mesh>
          <mesh position={[0, 0.78, 0]} material={m.silverFoil}>
            <boxGeometry args={[0.76, 0.04, 0.76]} />
          </mesh>

          {/* Four triangular petals opened like a flower */}
          {[0, 1, 2, 3].map((i) => {
            const ang = (i * Math.PI) / 2;
            return (
              <group key={i} rotation={[0, ang, 0]}>
                <mesh position={[0, 0.2, 0.38]} rotation={[0, 0, Math.PI / 2]} material={m.darkCarbon}>
                  <cylinderGeometry args={[0.035, 0.035, 0.68, 8]} />
                </mesh>
                <mesh
                  position={[0, 0.1, 0.98]}
                  rotation={[-Math.PI / 2 + 0.12, 0, Math.PI / 2]}
                  material={m.solar}
                  castShadow
                >
                  <circleGeometry args={[1.0, 3]} />
                </mesh>
                <mesh
                  position={[0, 0.07, 0.98]}
                  rotation={[-Math.PI / 2 + 0.12, 0, Math.PI / 2]}
                  material={m.darkCarbon}
                >
                  <circleGeometry args={[1.04, 3]} />
                </mesh>
              </group>
            );
          })}

          {/* Rover ramp on the front petal */}
          <mesh position={[0, 0.11, 0.95]} rotation={[0.12, 0, 0]} material={m.titanium}>
            <boxGeometry args={[0.3, 0.02, 0.92]} />
          </mesh>

          {/* Sojourner rover deployed on the front petal */}
          <group position={[0, 0.16, 1.02]}>
            <mesh position={[0, 0.12, 0]} material={m.goldFoil} castShadow>
              <boxGeometry args={[0.24, 0.12, 0.3]} />
            </mesh>
            <mesh position={[0, 0.2, 0]} material={m.solar}>
              <boxGeometry args={[0.28, 0.02, 0.34]} />
            </mesh>
            {[-0.16, 0, 0.16].map((z, i) => (
              <group key={i}>
                <mesh position={[0.14, 0.045, z]} rotation={[0, 0, Math.PI / 2]} material={m.darkCarbon}>
                  <cylinderGeometry args={[0.045, 0.045, 0.03, 10]} />
                </mesh>
                <mesh position={[-0.14, 0.045, z]} rotation={[0, 0, Math.PI / 2]} material={m.darkCarbon}>
                  <cylinderGeometry args={[0.045, 0.045, 0.03, 10]} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Camera mast */}
          <mesh position={[0.28, 1.0, 0.2]} material={m.titanium}>
            <cylinderGeometry args={[0.02, 0.025, 0.55, 8]} />
          </mesh>
          <mesh position={[0.28, 1.3, 0.2]} material={m.whiteThermal} castShadow>
            <boxGeometry args={[0.14, 0.1, 0.12]} />
          </mesh>
          <mesh position={[0.28, 1.28, 0.27]} material={m.opticGlass}>
            <boxGeometry args={[0.06, 0.06, 0.02]} />
          </mesh>

          {/* Low-gain antenna and wind sensor boom */}
          <mesh position={[-0.3, 0.9, -0.22]} rotation={[0.3, 0.4, 0]} material={m.silverFoil}>
            <cylinderGeometry args={[0.12, 0.06, 0.08, 12]} />
          </mesh>
          <Strut
            from={[-0.4, 0.8, 0.1]}
            to={[-0.9, 1.15, 0.22]}
            radius={0.012}
            material={m.titanium}
          />
          <mesh position={[-0.9, 1.15, 0.22]} material={m.copper}>
            <sphereGeometry args={[0.04, 8, 8]} />
          </mesh>
        </group>
      );
    }

    /* 13. KEPLER SPACE TELESCOPE */
    case 'kepler-telescope':
    default: {
      return (
        <group ref={(r) => { refsOut.current.root = r; }} position={[0, 0.88, 0]}>
          {/* Hexagonal Spacecraft Bus */}
          <mesh position={[0, -0.78, 0]} material={m.silverFoil} castShadow>
            <cylinderGeometry args={[0.92, 0.98, 0.62, 6]} />
          </mesh>
          {/* Gold-Foil 1-m Aperture Telescope Barrel */}
          <mesh position={[0, 0.18, 0]} material={m.goldFoil} castShadow receiveShadow>
            <cylinderGeometry args={[0.78, 0.82, 1.56, 28]} />
          </mesh>
          {/* Angled Sunshield Aperture Hood */}
          <mesh position={[0, 1.06, 0]} rotation={[0.24, 0, 0]} material={m.darkCarbon} castShadow>
            <cylinderGeometry args={[0.79, 0.79, 0.4, 28, 1, true]} />
          </mesh>
          {/* 1.4-m Primary Mirror Interior */}
          <mesh position={[0, 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.opticGlass}>
            <circleGeometry args={[0.72, 28]} />
          </mesh>
          {/* Saddle-Mounted 4-Panel Angled Solar Array */}
          {[-0.98, 0.98].map((x, i) => (
            <mesh
              key={i}
              position={[x, -0.15, -0.35]}
              rotation={[0, i === 0 ? -0.45 : 0.45, 0]}
              material={m.solar}
              castShadow
            >
              <boxGeometry args={[0.98, 1.56, 0.05]} />
            </mesh>
          ))}
        </group>
      );
    }
  }
};
