import { useEffect, useRef, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import type { SceneProps } from "./Scene";
import { worlds } from "./HeroWorlds";
import City, { type CityJourney } from "./CityJourney";
import Stage from "./Stage";
import { sections } from "@/content/site";
import { usePalette } from "@/lib/palette";

/**
 * The home page's 3D, fixed behind the content: a night city built from the work (CityJourney.tsx),
 * with the theme's object turning beside the headline over it (src/components/three/HeroWorlds.tsx).
 * Scrolling on, the object turns away and the camera flies through the city, one view per section.
 */
const stops = ["hero", ...sections.map((s) => s.id)];
const smooth = (t: number) => t * t * (3 - 2 * t);
type Journey = CityJourney & { target: number };

/** Where the visitor is on the page, as one continuous number: k when section k's top is 60% of
 *  the way down the screen, rising evenly while it is read, up to 7 at the bottom of the page. It is
 *  smoothed over time, so a jump of the scroll wheel glides rather than snaps. */
function useJourney() {
  const journey = useRef<Journey>({ travel: 0, target: 0, velocity: 0 });
  const last = useRef(window.scrollY);
  const anchors = useRef<number[]>([]);
  // Section positions, re-measured as the page changes size (images load, fonts swap).
  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      const starts = stops.slice(1).map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY - vh * 0.6 : Infinity;
      });
      anchors.current = [0, ...starts, document.documentElement.scrollHeight - vh];
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);
  // Runs before the rig and the light in each frame (lower priority runs first).
  useFrame((_, delta) => {
    const vh = window.innerHeight;
    const y = window.scrollY;
    const a = anchors.current;
    let target = 0;
    for (let k = 0; k < a.length - 1; k++) {
      if (y >= a[k + 1]) continue;
      target = k + Math.max(0, (y - a[k]) / Math.max(a[k + 1] - a[k], 1));
      break;
    }
    if (a.length && y >= a[a.length - 1]) target = a.length - 1;
    const j = journey.current;
    j.target = target;
    const speed = delta > 0 ? (y - last.current) / vh / delta : 0;
    last.current = y;
    j.velocity = MathUtils.damp(j.velocity, MathUtils.clamp(speed, -4, 4), 6, delta);
    j.travel = Math.abs(target - j.travel) < 0.0005 ? target : MathUtils.damp(j.travel, target, 3.5, delta);
  }, -1);
  return journey;
}

/** The theme's object, beside the headline and leaning toward the pointer. Scrolling on, it turns and
 *  shrinks away as the camera dives into the city. */
function HeroRig({ journey, x, y, scale, children }: { journey: MutableRefObject<Journey>; x: number; y: number; scale: number; children: ReactNode }) {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const leave = smooth(Math.min(journey.current.travel * 1.15, 1));
    const { x: px, y: py } = state.pointer;
    g.visible = leave < 0.995;
    g.position.x = MathUtils.damp(g.position.x, x + px * 0.12, 3, delta);
    g.position.y = MathUtils.damp(g.position.y, y, 3, delta);
    g.scale.setScalar(Math.max(scale * (1 - leave), 0.001));
    g.rotation.y = MathUtils.damp(g.rotation.y, px * 0.3 + leave * Math.PI * 1.5, 3, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, -py * 0.2, 3, delta);
  });
  return (
    <group ref={group} position={[x, y, 0]} scale={scale}>
      {children}
    </group>
  );
}

/** Everything 3D on the home page, fixed behind the content. */
function Scenery({ theme, light, running }: Pick<SceneProps, "theme" | "light" | "running">) {
  const palette = usePalette();
  const World = worlds[theme.scene];
  const { viewport, size } = useThree();
  const isWide = size.width / size.height > 1.05 && size.width > 900;
  // On wide screens the object sits beside the headline, clear of it however wide the window is;
  // on phones it sits behind the headline, dimmed.
  const x = isWide ? Math.min(viewport.width * 0.25, 3.3) : 0;
  const y = (isWide ? -0.01 : 0.23) * viewport.height;
  const scale = isWide ? 0.92 : 0.62;
  const journey = useJourney();
  const gl = useThree((state) => state.gl);
  useFrame(() => {
    const opacity = isWide || journey.current.travel > 0.5 ? "1" : "0.6";
    if (gl.domElement.style.opacity !== opacity) gl.domElement.style.opacity = opacity;
  });
  // Still (reduced motion): no frames run to fly the camera, so the scene simply goes once the hero has.
  useEffect(() => {
    if (running) return;
    const shown = isWide ? "1" : "0.6";
    const onScroll = () => (gl.domElement.style.opacity = window.scrollY < window.innerHeight * 0.6 ? shown : "0");
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [running, gl, isWide]);
  return (
    <>
      <Stage id={theme.id} palette={palette} light={light} />
      <City journey={journey} palette={palette} light={light} wide={isWide} />
      <HeroRig journey={journey} x={x} y={y} scale={scale}>
        <Appear key={theme.id} animate={running}>
          <World palette={palette} light={light} />
        </Appear>
      </HeroRig>
    </>
  );
}

/** A new theme's object grows and turns into place rather than popping in. When the scene is
 *  still (reduced motion, or off-screen) it starts in place, since there are no frames to grow in. */
function Appear({ children, animate }: { children: ReactNode; animate: boolean }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const s = MathUtils.damp(g.scale.x, 1, 5, delta);
    g.scale.setScalar(s);
    g.rotation.y = MathUtils.damp(g.rotation.y, 0, 4, delta);
  });
  return (
    <group ref={group} scale={animate ? 0.001 : 1} rotation={[0, animate ? -0.9 : 0, 0]}>
      {children}
    </group>
  );
}

export default function HeroScene({ light, theme, running, onFailure }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 38 }}
      // The city fills the screen, so the canvas stops short of full retina resolution.
      dpr={[1, 1.4]}
      frameloop={running ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
      eventSource={document.documentElement}
      eventPrefix="client"
      onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", onFailure, { once: true })}
    >
      <Scenery theme={theme} light={light} running={running} />
    </Canvas>
  );
}
