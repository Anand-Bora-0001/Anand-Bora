import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, MathUtils, Mesh } from "three";
import type { SceneProps } from "./Scene";
import { readPalette } from "@/lib/palette";

/** One orbit: a thin ring with a few nodes ("agents") travelling around it. */
const orbits = [
  { radius: 2.15, tilt: [1.2, 0.2, 0.3], speed: 0.32, nodes: 3, tone: "agents" },
  { radius: 2.65, tilt: [1.75, -0.5, -0.2], speed: -0.22, nodes: 2, tone: "systems" },
  { radius: 3.15, tilt: [1.0, 0.9, 0.6], speed: 0.16, nodes: 4, tone: "ink" },
] as const;

function Orbit({ spec, color }: { spec: (typeof orbits)[number]; color: string }) {
  const nodes = useRef<Group>(null);
  useFrame((_, delta) => {
    if (nodes.current) nodes.current.rotation.z += delta * spec.speed;
  });
  return (
    <group rotation={spec.tilt as unknown as [number, number, number]}>
      <mesh>
        <torusGeometry args={[spec.radius, 0.0045, 8, 220]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      <group ref={nodes}>
        {Array.from({ length: spec.nodes }, (_, i) => {
          const angle = (i / spec.nodes) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(angle) * spec.radius, Math.sin(angle) * spec.radius, 0]}>
              <mesh>
                <sphereGeometry args={[0.055, 16, 16]} />
                <meshBasicMaterial color={color} />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.16} blending={AdditiveBlending} depthWrite={false} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

/** A shell of faint dust around the core. */
function Dust({ color, light }: { color: string; light: boolean }) {
  const geometry = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions.set([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)], i * 3);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return g;
  }, []);
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });
  return (
    <points ref={ref as never} geometry={geometry}>
      <pointsMaterial color={color} size={0.028} sizeAttenuation transparent opacity={light ? 0.45 : 0.6} depthWrite={false} />
    </points>
  );
}

function Rig({ light }: { light: boolean }) {
  const palette = useMemo(readPalette, [light]);
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const { viewport, size } = useThree();
  const wide = size.width / size.height > 1.05;
  // On wide screens the core sits right of the headline; on narrow ones it floats above it.
  const base = wide ? { x: Math.min(viewport.width * 0.25, 3.3), y: -0.1, scale: 0.86 } : { x: 0, y: 1.25, scale: 0.6 };

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    const { x, y } = state.pointer;
    g.rotation.y = MathUtils.damp(g.rotation.y, x * 0.35 + scroll * 0.8, 3, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, -y * 0.25 + scroll * 0.3, 3, delta);
    g.position.x = MathUtils.damp(g.position.x, base.x + x * 0.15, 3, delta);
    g.position.y = MathUtils.damp(g.position.y, base.y + scroll * 1.6, 4, delta);
    if (core.current) core.current.rotation.y += delta * 0.12;
  });

  const colors = { agents: palette.agents, systems: palette.systems, ink: palette.ink };
  return (
    <group ref={group} position={[base.x, base.y, 0]} scale={base.scale}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.35, 48]} />
        <MeshDistortMaterial
          color={light ? "#e4e4df" : "#55555f"}
          metalness={0.85}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={1}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[120, 520]}
          distort={0.3}
          speed={1.4}
          envMapIntensity={light ? 1.1 : 1.6}
        />
      </mesh>
      {/* A faint wire shell: the "mesh" of data around the core. */}
      <mesh scale={1.22}>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshBasicMaterial color={palette.agents} wireframe transparent opacity={light ? 0.22 : 0.14} />
      </mesh>
      {orbits.map((spec) => (
        <Orbit key={spec.radius} spec={spec} color={colors[spec.tone]} />
      ))}
      <Dust color={palette.ink} light={light} />
    </group>
  );
}

/** Full-bleed hero scene: a chrome "data core" with agent nodes orbiting it. */
export default function HeroScene({ light, running, onFailure }: SceneProps) {
  const palette = useMemo(readPalette, [light]);
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 38 }}
      dpr={[1, 1.75]}
      frameloop={running ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
      eventSource={document.documentElement}
      eventPrefix="client"
      onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", onFailure, { once: true })}
    >
      {/* Studio lighting baked once into an environment map: no network fetch. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={[light ? "#d9d8d2" : "#141418"]} />
        <Lightformer form="rect" intensity={6} color={palette.agents} position={[-5, 2, 3]} scale={[6, 9, 1]} />
        <Lightformer form="rect" intensity={5} color={palette.systems} position={[5, -2, 3]} scale={[5, 8, 1]} />
        <Lightformer form="ring" intensity={4} color="#ffffff" position={[0, 5, 0]} scale={4} />
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[0, 0, 8]} scale={[14, 2, 1]} />
        <Lightformer form="rect" intensity={2} color={palette.cloud} position={[0, -6, 2]} scale={[10, 3, 1]} />
      </Environment>
      <ambientLight intensity={light ? 0.6 : 0.25} />
      <directionalLight position={[-4, 4, 5]} intensity={1.4} color={palette.agents} />
      <directionalLight position={[5, -2, 4]} intensity={1.1} color={palette.systems} />
      <Rig light={light} />
    </Canvas>
  );
}
