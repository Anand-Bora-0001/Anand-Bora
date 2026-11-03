import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  Path,
  Shape,
  Vector3,
} from "three";
import type { SceneProps } from "./Scene";
import { readPalette } from "@/lib/palette";

export interface AssemblyProps {
  exploded: boolean;
}

/** A spur gear outline with a bore, extruded into a solid. */
function gearGeometry(teeth = 18, outer = 0.86, root = 0.72, bore = 0.15, depth = 0.24) {
  const shape = new Shape();
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const points: [number, number][] = [
      [root, a],
      [outer, a + step * 0.18],
      [outer, a + step * 0.48],
      [root, a + step * 0.66],
    ];
    points.forEach(([r, angle], k) => {
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0 && k === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
  }
  shape.closePath();
  const hole = new Path();
  hole.absarc(0, 0, bore, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geometry = new ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 1 });
  geometry.center();
  return geometry;
}

interface PartSpec {
  name: string;
  geometry: BufferGeometry;
  position: [number, number, number];
  rotation?: [number, number, number];
  explode: [number, number, number];
  tone: "steel" | "accent" | "dark";
  spin?: boolean;
}

function Part({
  spec,
  exploded,
  running,
  colors,
}: {
  spec: PartSpec;
  exploded: boolean;
  running: boolean;
  colors: { steel: string; accent: string; dark: string; edge: string };
}) {
  const group = useRef<Group>(null);
  const home = useMemo(() => new Vector3(...spec.position), [spec.position]);
  const out = useMemo(() => new Vector3(...spec.explode).add(home), [spec.explode, home]);
  const edges = useMemo(() => new EdgesGeometry(spec.geometry, 28), [spec.geometry]);
  useFrame((_, delta) => {
    if (!group.current) return;
    const d = Math.min(delta, 0.05);
    group.current.position.lerp(exploded ? out : home, 1 - Math.pow(0.002, d));
    if (spec.spin && running) group.current.rotation.x += d * 0.6;
  });
  return (
    <group ref={group} position={spec.position}>
      <group rotation={spec.rotation}>
        <mesh geometry={spec.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={colors[spec.tone]}
            metalness={spec.tone === "accent" ? 0.35 : 0.55}
            roughness={spec.tone === "accent" ? 0.4 : 0.35}
          />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={colors.edge} transparent opacity={0.35} />
        </lineSegments>
      </group>
    </group>
  );
}

function Assembly({ light, running, exploded }: AssemblyProps & { light: boolean; running: boolean }) {
  const palette = useMemo(readPalette, [light]);
  const colors = {
    steel: light ? "#b9c1cd" : "#7d8798",
    dark: light ? "#8792a3" : "#4a5466",
    accent: palette.systems,
    edge: palette.ink,
  };
  const parts = useMemo<PartSpec[]>(() => {
    const bolt = new CylinderGeometry(0.09, 0.09, 0.42, 6);
    return [
      { name: "Base plate", geometry: new BoxGeometry(3.4, 0.22, 2.1), position: [0, -0.95, 0], explode: [0, -0.55, 0], tone: "dark" },
      { name: "Bearing block", geometry: new BoxGeometry(0.9, 0.95, 1.1), position: [-0.55, -0.37, 0], explode: [0, 0, 0], tone: "steel" },
      { name: "Bearing block", geometry: new BoxGeometry(0.9, 0.95, 1.1), position: [0.75, -0.37, 0], explode: [0, 0, 0], tone: "steel" },
      { name: "Shaft", geometry: new CylinderGeometry(0.13, 0.13, 3.6, 24), position: [0, -0.1, 0], rotation: [0, 0, Math.PI / 2], explode: [0, 0.75, 0], tone: "steel", spin: true },
      { name: "Spur gear", geometry: gearGeometry(), position: [1.62, -0.1, 0], rotation: [0, Math.PI / 2, 0], explode: [0.9, 0.75, 0], tone: "accent", spin: true },
      { name: "Pulley", geometry: new CylinderGeometry(0.42, 0.42, 0.22, 32), position: [-1.6, -0.1, 0], rotation: [0, 0, Math.PI / 2], explode: [-0.85, 0.75, 0], tone: "accent", spin: true },
      ...([
        [-1.45, -0.78],
        [1.45, -0.78],
        [-1.45, 0.78],
        [1.45, 0.78],
      ] as const).map(([x, z]): PartSpec => ({
        name: "Bolt",
        geometry: bolt,
        position: [x, -0.82, z],
        explode: [0, 0.9, 0],
        tone: "steel",
      })),
    ];
  }, []);
  return (
    <group rotation={[0, -0.5, 0]}>
      {parts.map((spec, i) => (
        <Part key={i} spec={spec} exploded={exploded} running={running} colors={colors} />
      ))}
      <gridHelper args={[8, 16, palette.ink, palette.ink]} position={[0, -1.6, 0]}>
        <lineBasicMaterial attach="material" color={palette.ink} transparent opacity={light ? 0.12 : 0.08} />
      </gridHelper>
    </group>
  );
}

export default function AssemblyScene({ light, running, onFailure, exploded }: AssemblyProps & SceneProps) {
  return (
    <Canvas
      camera={{ position: [5.6, 3.2, 6.4], fov: 32 }}
      dpr={[1, 1.75]}
      frameloop={running ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", onFailure, { once: true })}
    >
      <hemisphereLight args={[light ? "#ffffff" : "#c9d6ff", light ? "#cfd6e0" : "#0b1220", light ? 1.1 : 0.9]} />
      <directionalLight position={[4, 6, 5]} intensity={light ? 1.6 : 1.9} />
      <directionalLight position={[-5, 2, -4]} intensity={0.6} />
      <Assembly light={light} running={running} exploded={exploded} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={running && !exploded}
        autoRotateSpeed={0.7}
        enableDamping
        target={[0, -0.4, 0]}
        minPolarAngle={0.5}
        maxPolarAngle={1.45}
      />
    </Canvas>
  );
}
