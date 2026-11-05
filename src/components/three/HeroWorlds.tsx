import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  BoxGeometry,
  BufferAttribute,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  OctahedronGeometry,
  PlaneGeometry,
  ShaderMaterial,
  TorusGeometry,
  Vector3,
} from "three";
import type { ScenePalette } from "@/lib/palette";
import type { SceneId } from "@/lib/themes";

/**
 * One object per theme, each its own shape so no two themes look alike: a data lattice, dashboard
 * sheets, a neon portal, a synthwave sunset, a CAD assembly, a bar-chart city, a knotted ribbon,
 * glass crystals, a cairn of stones and a gyroscope. All share one size (about 2.4 units across) so
 * the page's layout is the same in every theme.
 */
export interface WorldProps {
  palette: ScenePalette;
  light: boolean;
}

const dummy = new Object3D();

/** Matte Black: an icosahedral network, its vertices as nodes, a solid core inside. */
function Lattice({ palette, light }: WorldProps) {
  const group = useRef<Group>(null);
  const shell = useMemo(() => new IcosahedronGeometry(1.75, 1), []);
  const edges = useMemo(() => new EdgesGeometry(shell), [shell]);
  const nodes = useMemo(() => {
    const seen = new Map<string, Vector3>();
    const pos = shell.getAttribute("position");
    for (let i = 0; i < pos.count; i++) {
      const v = new Vector3().fromBufferAttribute(pos, i);
      seen.set(v.toArray().map((n) => n.toFixed(3)).join(), v);
    }
    return [...seen.values()];
  }, [shell]);
  const dots = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = dots.current;
    if (!mesh) return;
    nodes.forEach((v, i) => {
      dummy.position.copy(v);
      dummy.scale.setScalar(i % 5 === 0 ? 1.7 : 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, new Color(i % 5 === 0 ? palette.accent : palette.ink));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [nodes, palette]);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.12;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
  });
  return (
    <group ref={group}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={palette.accent} transparent opacity={light ? 0.6 : 0.45} />
      </lineSegments>
      <instancedMesh ref={dots} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial />
      </instancedMesh>
      <mesh>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial color={palette.surface} metalness={0.4} roughness={0.35} flatShading />
      </mesh>
    </group>
  );
}

/** Lupine: a fanned stack of dashboard sheets, each with a few rows and a small chart. */
function Sheets({ palette }: WorldProps) {
  const group = useRef<Group>(null);
  const sheets = useRef<(Group | null)[]>([]);
  const count = 5;
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    sheets.current.forEach((sheet, i) => {
      if (!sheet) return;
      const spread = 0.9 + Math.sin(t * 0.5) * 0.08;
      sheet.position.set((i - 2) * 0.32 * spread, (i - 2) * -0.2 * spread + Math.sin(t * 0.8 + i) * 0.04, (i - 2) * 0.42 * spread);
    });
    if (group.current) group.current.rotation.y = -0.55 + Math.sin(t * 0.25) * 0.08;
  });
  const bars = [0.35, 0.6, 0.45, 0.8, 0.55, 0.95];
  return (
    <group ref={group} rotation={[-0.32, -0.55, 0.06]}>
      {Array.from({ length: count }, (_, i) => (
        <group key={i} ref={(el) => (sheets.current[i] = el)}>
          <RoundedBox args={[2.6, 1.7, 0.04]} radius={0.06} smoothness={4}>
            <meshStandardMaterial color={palette.surface} roughness={0.85} />
          </RoundedBox>
          <mesh position={[-0.55, 0.55, 0.025]}>
            <planeGeometry args={[1.2, 0.08]} />
            <meshBasicMaterial color={palette.ink} transparent opacity={0.75} />
          </mesh>
          {[0.32, 0.18].map((y, r) => (
            <mesh key={r} position={[-0.45 - r * 0.15, y, 0.025]}>
              <planeGeometry args={[1.4 - r * 0.3, 0.04]} />
              <meshBasicMaterial color={palette.ink} transparent opacity={0.22} />
            </mesh>
          ))}
          {i === count - 1 &&
            bars.map((h, b) => (
              <mesh key={b} position={[-0.95 + b * 0.38, -0.62 + h * 0.35, 0.03]}>
                <planeGeometry args={[0.22, h * 0.7]} />
                <meshBasicMaterial color={b === 3 ? palette.accent : palette.accent2} transparent opacity={b === 3 ? 1 : 0.55} />
              </mesh>
            ))}
        </group>
      ))}
    </group>
  );
}

/** Tokyo Night: a twisting tunnel of neon frames, a wave of light running through it. */
function Portal({ palette }: WorldProps) {
  const count = 9;
  const frames = useRef<(Mesh | null)[]>([]);
  const colors = useMemo(() => {
    const a = new Color(palette.accent);
    const b = new Color(palette.accent2);
    return Array.from({ length: count }, (_, i) => a.clone().lerp(b, i / (count - 1)));
  }, [palette]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    frames.current.forEach((m, i) => {
      if (!m) return;
      // Each frame twists a little further than the one before, and a pulse travels down the tunnel.
      m.rotation.z = Math.PI / 4 + i * 0.14 + Math.sin(t * 0.6 - i * 0.35) * 0.18;
      const pulse = Math.max(0, Math.sin(t * 1.4 - i * 0.6));
      m.scale.setScalar((1.75 - i * 0.13) * (1 + pulse * 0.06));
      const material = m.material as MeshBasicMaterial;
      material.opacity = 0.35 + pulse * 0.65;
    });
  });
  return (
    <group rotation={[0.18, -0.62, 0]}>
      {colors.map((color, i) => (
        <mesh key={i} ref={(el) => (frames.current[i] = el)} position={[0, 0, (i - (count - 1) / 2) * -0.42]}>
          {/* Four segments round: a torus drawn as a square frame. */}
          <torusGeometry args={[1, 0.035, 8, 4]} />
          <meshBasicMaterial color={color} transparent toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 0, ((count - 1) / 2) * 0.42 + 0.2]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshBasicMaterial color={palette.accent2} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Retro 82: a synthwave sunset, a striped sun sinking behind a rolling wireframe grid. */
function Sunset({ palette, light }: WorldProps) {
  const geometry = useMemo(() => new PlaneGeometry(4.4, 3.2, 36, 26), []);
  const base = useMemo(() => Float32Array.from(geometry.getAttribute("position").array), [geometry]);
  const sun = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        uniforms: { uTop: { value: new Color() }, uBottom: { value: new Color() }, uTime: { value: 0 } },
        vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
          uniform vec3 uTop; uniform vec3 uBottom; uniform float uTime; varying vec2 vUv;
          void main() {
            vec2 c = vUv - 0.5;
            if (length(c) > 0.5) discard;
            // Bands cut across the lower half, thicker toward the horizon and drifting down.
            float y = vUv.y;
            float band = fract(y * 9.0 + uTime * 0.25);
            if (y < 0.5 && band < (0.5 - y) * 1.1) discard;
            gl_FragColor = vec4(mix(uBottom, uTop, smoothstep(0.1, 0.9, y)), 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [],
  );
  useEffect(() => {
    sun.uniforms.uTop.value.set(palette.accent);
    sun.uniforms.uBottom.value.set(palette.systems);
  }, [sun, palette]);
  useEffect(() => () => sun.dispose(), [sun]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    sun.uniforms.uTime.value = t;
    const pos = geometry.getAttribute("position") as BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      // Flat down the middle (the road), hills to either side, rolling toward the viewer.
      const side = Math.min(Math.abs(x) / 1.6, 1);
      pos.setZ(i, side * side * (0.35 + 0.3 * Math.sin(x * 2.1 + (y + t * 0.6) * 2.4)));
    }
    pos.needsUpdate = true;
  });
  return (
    <group position={[0, -0.1, 0]}>
      <mesh position={[0, 0.55, -1.2]} material={sun}>
        <circleGeometry args={[1.25, 64]} />
      </mesh>
      <mesh geometry={geometry} rotation={[-1.32, 0, 0]} position={[0, -0.55, 0.2]}>
        <meshBasicMaterial color={palette.accent2} wireframe transparent opacity={light ? 0.8 : 0.7} />
      </mesh>
    </group>
  );
}

/** Flexoki: a shaft, flanges, housing and bolts drawn as lines, easing apart and back. */
function Assembly({ palette }: WorldProps) {
  const parts = useMemo(() => {
    const bolt = new CylinderGeometry(0.07, 0.07, 0.5, 6);
    return [
      { geo: new CylinderGeometry(0.16, 0.16, 3.4, 20), at: [0, 0, 0], out: [0, 0, 0], rot: [0, 0, Math.PI / 2] },
      { geo: new BoxGeometry(1.1, 1.1, 1.1), at: [0, 0, 0], out: [0, 0.55, 0], rot: [0, 0, 0] },
      { geo: new CylinderGeometry(0.7, 0.7, 0.18, 28), at: [-0.75, 0, 0], out: [-0.75, 0, 0], rot: [0, 0, Math.PI / 2] },
      { geo: new CylinderGeometry(0.7, 0.7, 0.18, 28), at: [0.75, 0, 0], out: [0.75, 0, 0], rot: [0, 0, Math.PI / 2] },
      { geo: new TorusGeometry(0.45, 0.06, 8, 32), at: [1.45, 0, 0], out: [0.7, 0, 0], rot: [0, Math.PI / 2, 0] },
      ...[0, 1, 2, 3].map((k) => ({
        geo: bolt,
        at: [0, Math.sin((k * Math.PI) / 2) * 0.35, Math.cos((k * Math.PI) / 2) * 0.35],
        out: [0, Math.sin((k * Math.PI) / 2) * 0.5, Math.cos((k * Math.PI) / 2) * 0.5],
        rot: [0, 0, Math.PI / 2],
      })),
    ].map((p) => ({ ...p, edges: new EdgesGeometry(p.geo, 20), at: new Vector3(...p.at), out: new Vector3(...p.out) }));
  }, []);
  const refs = useRef<(Group | null)[]>([]);
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    const spread = (1 - Math.cos(state.clock.elapsedTime * 0.5)) / 2;
    refs.current.forEach((g, i) => g && g.position.copy(parts[i].at).addScaledVector(parts[i].out, spread * 0.9));
    if (group.current) group.current.rotation.y += delta * 0.1;
  });
  return (
    <group ref={group} rotation={[0.35, -0.6, 0]}>
      {parts.map((p, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} rotation={p.rot as [number, number, number]}>
          <lineSegments geometry={p.edges}>
            <lineBasicMaterial color={i === 1 ? palette.accent2 : palette.accent} />
          </lineSegments>
          <mesh geometry={p.geo}>
            <meshBasicMaterial color={palette.accent} transparent opacity={0.05} depthWrite={false} />
          </mesh>
        </group>
      ))}
      <gridHelper args={[3.6, 12, palette.border, palette.border]} position={[0, -1.25, 0]} />
    </group>
  );
}

/** Hackerman: a small city of bars, rising and settling like a live chart. */
function Bars({ palette }: WorldProps) {
  const n = 7;
  const mesh = useRef<InstancedMesh>(null);
  const group = useRef<Group>(null);
  const colors = useMemo(
    () => ({ high: new Color(palette.accent), mid: new Color(palette.accent2), low: new Color(palette.surface) }),
    [palette],
  );
  const tint = useMemo(() => new Color(), []);
  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    let k = 0;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const h = 0.25 + 1.5 * (0.5 + 0.5 * Math.sin(i * 0.8 + t * 0.55) * Math.cos(j * 0.6 - t * 0.4));
        dummy.position.set((i - (n - 1) / 2) * 0.36, h / 2 - 0.9, (j - (n - 1) / 2) * 0.36);
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        m.setMatrixAt(k, dummy.matrix);
        m.setColorAt(k, h > 1.35 ? colors.high : tint.copy(colors.low).lerp(colors.mid, Math.min(h / 1.6, 1) * 0.8));
        k++;
      }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    if (group.current) group.current.rotation.y += delta * 0.08;
  });
  return (
    <group ref={group} rotation={[0.42, 0.6, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, n * n]}>
        <boxGeometry args={[0.28, 1, 0.28]} />
        <meshStandardMaterial roughness={0.6} />
      </instancedMesh>
      <mesh position={[0, -0.92, 0]}>
        <boxGeometry args={[2.75, 0.04, 2.75]} />
        <meshStandardMaterial color={palette.surface} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Ristretto: a glossy torus knot with a faint wire twin. */
function Ribbon({ palette }: WorldProps) {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.15;
    g.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });
  return (
    <group ref={group}>
      <mesh>
        <torusKnotGeometry args={[1.15, 0.3, 240, 28, 2, 3]} />
        <meshPhysicalMaterial
          color={palette.accent}
          roughness={0.22}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.15}
          sheen={1}
          sheenColor={palette.accent2}
          iridescence={0.5}
          iridescenceIOR={1.3}
        />
      </mesh>
      <mesh scale={1.04}>
        <torusKnotGeometry args={[1.15, 0.3, 120, 12, 2, 3]} />
        <meshBasicMaterial color={palette.accent2} wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/** Lumon: a cluster of faceted glass crystals, bobbing slightly out of step. */
function Crystal({ palette }: WorldProps) {
  const crystals = useMemo(
    () =>
      [
        { at: [0, 0, 0], s: [0.9, 1.7, 0.9], tone: "accent" },
        { at: [-0.95, -0.35, 0.3], s: [0.55, 1.05, 0.55], tone: "accent2" },
        { at: [0.95, -0.25, -0.2], s: [0.6, 1.2, 0.6], tone: "systems" },
        { at: [0.45, -0.75, 0.75], s: [0.38, 0.7, 0.38], tone: "accent" },
        { at: [-0.4, -0.8, -0.7], s: [0.42, 0.8, 0.42], tone: "cloud" },
      ] as const,
    [],
  );
  const geometry = useMemo(() => new OctahedronGeometry(1, 0), []);
  const group = useRef<Group>(null);
  const refs = useRef<(Mesh | null)[]>([]);
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((m, i) => m && (m.position.y = crystals[i].at[1] + Math.sin(t * 0.7 + i * 1.3) * 0.06));
    if (group.current) group.current.rotation.y += delta * 0.12;
  });
  return (
    <group ref={group} rotation={[0.1, 0, 0.08]}>
      {crystals.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          geometry={geometry}
          position={c.at as unknown as [number, number, number]}
          scale={c.s as unknown as [number, number, number]}
          rotation={[0, i * 0.7, 0]}
        >
          <meshPhysicalMaterial
            color={palette[c.tone]}
            transmission={0.82}
            thickness={0.9}
            roughness={0.08}
            ior={1.45}
            clearcoat={1}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

/** Osaka Jade: a cairn of polished jade stones, the top one gold, swaying to keep its balance. */
function Cairn({ palette }: WorldProps) {
  const stones = [
    { w: 1.05, h: 0.42, y: -1.05, tone: "accent2" },
    { w: 0.86, h: 0.38, y: -0.36, tone: "accent2" },
    { w: 0.7, h: 0.33, y: 0.24, tone: "systems" },
    { w: 0.54, h: 0.28, y: 0.76, tone: "accent2" },
    { w: 0.36, h: 0.22, y: 1.18, tone: "accent" },
  ] as const;
  const refs = useRef<(Mesh | null)[]>([]);
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // Higher stones sway further, each a beat behind the one below.
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.x = Math.sin(t * 0.9 - i * 0.5) * 0.03 * i;
      m.rotation.z = Math.sin(t * 0.9 - i * 0.5) * 0.04 * i;
    });
    if (group.current) group.current.rotation.y += delta * 0.15;
  });
  return (
    <group ref={group} rotation={[0.12, 0, 0]}>
      {stones.map((s, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} position={[0, s.y, 0]} scale={[s.w, s.h, s.w * 0.86]} rotation={[0, i * 1.1, 0]}>
          <sphereGeometry args={[1, 48, 32]} />
          {s.tone === "accent" ? (
            <meshStandardMaterial color={palette.accent} metalness={0.9} roughness={0.25} />
          ) : (
            <meshPhysicalMaterial color={palette[s.tone]} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} sheen={0.6} sheenColor={palette.accent} />
          )}
        </mesh>
      ))}
    </group>
  );
}

/** Rosé Pine: a gyroscope, three gimbal rings turning on their own axes round a glassy core. */
function Gyroscope({ palette, light }: WorldProps) {
  const rings = useRef<(Group | null)[]>([]);
  const bead = useRef<Mesh>(null);
  const spec = [
    { r: 1.75, tube: 0.05, axis: [1, 0, 0], speed: 0.35, tone: "accent" },
    { r: 1.4, tube: 0.045, axis: [0, 1, 0], speed: -0.5, tone: "accent2" },
    { r: 1.05, tube: 0.04, axis: [0, 0, 1], speed: 0.7, tone: "ink" },
  ] as const;
  useFrame((state, delta) => {
    rings.current.forEach((g, i) => {
      if (!g) return;
      const [x, y, z] = spec[i].axis;
      g.rotation.x += x * spec[i].speed * delta;
      g.rotation.y += y * spec[i].speed * delta;
      g.rotation.z += z * spec[i].speed * delta;
    });
    const t = state.clock.elapsedTime * 0.8;
    bead.current?.position.set(Math.cos(t) * 1.75, Math.sin(t) * 1.75, 0);
  });
  return (
    <group rotation={[0.35, 0.5, 0.15]}>
      <mesh>
        <sphereGeometry args={[0.5, 48, 48]} />
        <meshPhysicalMaterial color={palette.accent2} roughness={0.15} clearcoat={1} metalness={0.1} transmission={light ? 0.35 : 0.2} thickness={0.6} />
      </mesh>
      {spec.map((ring, i) => (
        <group key={i} ref={(el) => (rings.current[i] = el)} rotation={[i * 0.9, i * 0.6, 0]}>
          <mesh>
            <torusGeometry args={[ring.r, ring.tube, 20, 160]} />
            <meshStandardMaterial color={palette[ring.tone]} metalness={0.55} roughness={0.28} />
          </mesh>
          {i === 0 && (
            <mesh ref={bead}>
              <sphereGeometry args={[0.1, 20, 20]} />
              <meshStandardMaterial color={palette.ink} emissive={palette.accent} emissiveIntensity={0.4} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

export const worlds: Record<SceneId, (props: WorldProps) => JSX.Element> = {
  lattice: Lattice,
  sheets: Sheets,
  portal: Portal,
  sunset: Sunset,
  assembly: Assembly,
  bars: Bars,
  ribbon: Ribbon,
  crystal: Crystal,
  cairn: Cairn,
  gyroscope: Gyroscope,
};
