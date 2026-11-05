import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import { paletteFor } from "@/lib/palette";
import type { ThemeInfo } from "@/lib/themes";
import { worlds } from "./HeroWorlds";
import Stage from "./Stage";

/**
 * The theme picker's 3D: a live, rotatable view of the selected theme's object, and a studio
 * that renders every theme's object once to a still image for the cards around it.
 * Both frame the object the same way, so the still and the live view line up when they cross-fade.
 */
const camera = { position: [0, 0, 8] as [number, number, number], fov: 34 };
const frame = { position: [0, 0.2, 0] as [number, number, number], scale: 0.9 };
/** Sized for the hero's side column; a few read better a little larger on a card of their own. */
const zoom: Partial<Record<ThemeInfo["scene"], number>> = { assembly: 1.3 };

/** Centers and sizes the object; on a tall card (phones) it shrinks to keep its full width in view. */
function Fit({ scene, children }: { scene: ThemeInfo["scene"]; children: ReactNode }) {
  const { width, height } = useThree((state) => state.size);
  const scale = frame.scale * (zoom[scene] ?? 1) * Math.min(1, width / height / 1.1);
  return (
    <group position={frame.position} scale={scale}>
      {children}
    </group>
  );
}

/** Pointer drag, in pixels, not yet applied to the object. The picker adds to it; the scene drains it. */
export type Drag = { x: number; y: number; held: boolean };

/** Sways the object gently on its own, and turns it fully by drag: the whole object can be seen, not one side. */
function Turntable({ drag, spinning, children }: { drag: MutableRefObject<Drag>; spinning: boolean; children: ReactNode }) {
  const group = useRef<Group>(null);
  const turn = useRef({ x: 0, y: 0, time: 0 });
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const d = drag.current;
    const t = turn.current;
    if (spinning && !d.held) t.time += delta;
    t.y += d.x * 0.012;
    t.x = MathUtils.clamp(t.x + d.y * 0.01, -1.2, 1.2);
    // Let go and it leans back to level, but keeps the turn.
    if (!d.held) t.x = MathUtils.damp(t.x, 0, 1.5, delta);
    d.x = 0;
    d.y = 0;
    g.rotation.y = MathUtils.damp(g.rotation.y, t.y + Math.sin(t.time * 0.45) * 0.55, 6, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, t.x, 6, delta);
  });
  return <group ref={group}>{children}</group>;
}

export function LivePreview({
  theme,
  drag,
  running,
  onReady,
  onFailure,
}: {
  theme: ThemeInfo;
  drag: MutableRefObject<Drag>;
  running: boolean;
  onReady: () => void;
  onFailure: () => void;
}) {
  const palette = useMemo(() => paletteFor(theme.id), [theme.id]);
  const light = theme.scheme === "light";
  const World = worlds[theme.scene];
  return (
    <Canvas
      camera={camera}
      dpr={[1, 2]}
      frameloop={running ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onFailure, { once: true });
        onReady();
      }}
    >
      <Stage id={theme.id} palette={palette} light={light} />
      <Fit scene={theme.scene}>
        <Turntable key={theme.id} drag={drag} spinning={running}>
          <World palette={palette} light={light} />
        </Turntable>
      </Fit>
    </Canvas>
  );
}

/** Captures the canvas a few frames after a theme mounts (time for animated parts to settle). */
function Shutter({ onShot }: { onShot: (url: string) => void }) {
  const frames = useRef(0);
  useFrame(({ gl }) => {
    frames.current += 1;
    if (frames.current === 4) onShot(gl.domElement.toDataURL("image/webp", 0.88));
  });
  return null;
}

/** Renders the first theme in `queue`, reports its image, and moves on as the queue shrinks. */
export function SnapshotStudio({ queue, onShot }: { queue: ThemeInfo[]; onShot: (theme: ThemeInfo, url: string) => void }) {
  const theme = queue[0];
  if (!theme) return null;
  const palette = paletteFor(theme.id);
  const light = theme.scheme === "light";
  const World = worlds[theme.scene];
  return (
    <div className="picker-studio" aria-hidden="true">
      <Canvas camera={camera} dpr={1.5} frameloop="always" gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}>
        <Stage id={theme.id} palette={palette} light={light} />
        {/* Keyed inside a fixed group: keyed straight under the scene, old objects were left behind. */}
        <Fit scene={theme.scene}>
          <group key={theme.id}>
            <World palette={palette} light={light} />
          </group>
        </Fit>
        <Shutter key={theme.id} onShot={(url) => onShot(theme, url)} />
      </Canvas>
    </div>
  );
}
