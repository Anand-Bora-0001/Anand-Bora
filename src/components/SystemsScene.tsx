import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Group, Mesh, Vector3, QuadraticBezierCurve3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { atlasDomains, type AtlasFocus } from "@/data/atlas";
import { getSceneTheme } from "@/data/sceneTheme";
interface Props {
  light: boolean;
  focus: AtlasFocus;
  onSelect: (focus: AtlasFocus) => void;
  running: boolean;
  coarse: boolean;
  resetToken: number;
  onFailure: () => void;
}
function Signal({
  end,
  color,
  running,
  active,
}: {
  end: [number, number, number];
  color: string;
  running: boolean;
  active: boolean;
}) {
  const particle = useRef<Mesh>(null);
  const progress = useRef(0.35);
  const curve = useMemo(
    () =>
      new QuadraticBezierCurve3(
        new Vector3(0, 0.1, 0),
        new Vector3(end[0] * 0.65, 1.4, end[2] * 0.55),
        new Vector3(...end),
      ),
    [end],
  );
  useFrame((_, delta) => {
    if (running && particle.current) {
      progress.current = (progress.current + Math.min(delta, 0.05) * 0.22) % 1;
      particle.current.position.copy(curve.getPoint(progress.current));
    }
  });
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 32, 0.012, 5, false]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.75 : 0.17}
        />
      </mesh>
      <mesh ref={particle} position={curve.getPoint(0.35)}>
        <sphereGeometry args={[active ? 0.047 : 0.025, 10, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
function Core({
  focus,
  running,
  light,
}: {
  focus: AtlasFocus;
  running: boolean;
  light: boolean;
}) {
  const core = useRef<Group>(null);
  const palette = getSceneTheme(light);
  const color = palette[focus];
  useFrame((_, delta) => {
    if (running && core.current) {
      core.current.rotation.y += Math.min(delta, 0.05) * 0.2;
      core.current.rotation.z = Math.sin(core.current.rotation.y) * 0.12;
    }
  });
  return (
    <group ref={core} position={[0, 0.1, 0]}>
      <mesh>
        <icosahedronGeometry args={[0.66, 0]} />
        <meshStandardMaterial
          color={palette.surface}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.22}
          metalness={0.72}
          flatShading
        />
      </mesh>
      <mesh scale={1.025}>
        <icosahedronGeometry args={[0.66, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.25, 0.2]}>
        <torusGeometry args={[0.97, 0.022, 8, 80]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh rotation={[0.6, 1.2, -0.3]}>
        <torusGeometry args={[1.1, 0.008, 6, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
function Scene({ focus, onSelect, running, coarse, resetToken, light }: Props) {
  const palette = getSceneTheme(light);
  const domains = atlasDomains.map((domain) => ({
    ...domain,
    color: palette[domain.id],
  }));
  const controls = useRef<OrbitControlsImpl>(null);
  useEffect(() => {
    controls.current?.reset();
  }, [resetToken]);
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[2, 5, 4]} intensity={3} color="#ffffff" />
      <pointLight position={[-3, 1, 2]} intensity={5} color={palette.agents} />
      <pointLight position={[3, 0, 2]} intensity={4} color={palette.systems} />
      <group rotation={[0, -0.28, 0]}>
        <Core focus={focus} running={running} light={light} />
        {domains.map((domain, index) => (
          <group key={domain.id}>
            <Signal
              end={domain.position}
              color={domain.color}
              running={running}
              active={focus === domain.id}
            />
            <group
              position={domain.position}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(domain.id);
              }}
            >
              <mesh rotation={[0.15, 0.4, 0.1]}>
                {index === 0 ? (
                  <octahedronGeometry args={[0.38, 0]} />
                ) : index === 1 ? (
                  <boxGeometry args={[0.57, 0.57, 0.57]} />
                ) : (
                  <cylinderGeometry args={[0.35, 0.35, 0.43, 32]} />
                )}
                <meshStandardMaterial
                  color={domain.color}
                  emissive={domain.color}
                  emissiveIntensity={focus === domain.id ? 0.4 : 0.07}
                  metalness={0.5}
                  roughness={0.28}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.37, 0]}>
                <torusGeometry
                  args={[0.55, focus === domain.id ? 0.022 : 0.009, 8, 48]}
                />
                <meshBasicMaterial
                  color={domain.color}
                  transparent
                  opacity={focus === domain.id ? 0.8 : 0.25}
                />
              </mesh>
              <Html
                position={[0, 0.6, 0]}
                center
                style={{ pointerEvents: "none" }}
              >
                <div
                  className={`atlas-node-label ${focus === domain.id ? "is-active" : ""}`}
                  style={{ color: domain.color }}
                >
                  {domain.label}
                  <small>{domain.tools[0]}</small>
                </div>
              </Html>
            </group>
          </group>
        ))}
        <mesh rotation={[Math.PI / 2, 0.12, 0]} position={[0, -0.5, 0]}>
          <torusGeometry args={[2.7, 0.006, 6, 120]} />
          <meshBasicMaterial color={palette.guide} transparent opacity={0.45} />
        </mesh>
        <mesh rotation={[1.04, 0.6, 0.1]}>
          <torusGeometry args={[2.48, 0.005, 6, 120]} />
          <meshBasicMaterial color={palette.guide} transparent opacity={0.35} />
        </mesh>
        <Html position={[0, -1, 0]} center style={{ pointerEvents: "none" }}>
          <span className="atlas-core-label">ANAND / SYSTEMS ATLAS</span>
        </Html>
      </group>
      {!coarse && (
        <OrbitControls
          ref={controls}
          makeDefault
          enabled={!coarse}
          enableZoom={false}
          enablePan={false}
          enableDamping={running}
          autoRotate={running}
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI / 3.3}
          maxPolarAngle={Math.PI / 1.9}
        />
      )}
    </>
  );
}
export default function SystemsScene(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 2.25, 7.8], fov: 43 }}
      dpr={[1, props.coarse ? 1 : 1.5]}
      frameloop={props.running ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", props.onFailure, {
          once: true,
        });
        gl.setClearColor("#000000", 0);
        gl.domElement.style.touchAction = props.coarse ? "pan-y" : "none";
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
