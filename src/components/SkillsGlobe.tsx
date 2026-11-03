import { useEffect, useMemo, useRef } from "react";
import { skillCategories } from "@/content/skills";
import { useInView, useReducedMotion } from "@/lib/hooks";

/** Evenly spread points on a unit sphere (Fibonacci lattice). */
function sphere(count: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r] as const;
  });
}

/**
 * Every core skill on a slowly turning sphere; the pointer steers the spin.
 * Decorative — the same skills are listed as text next to it.
 */
export default function SkillsGlobe() {
  const items = useMemo(() => skillCategories.flatMap((c) => c.skills.map((label) => ({ label, tone: c.id }))), []);
  const points = useMemo(() => sphere(items.length), [items.length]);
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const cloud = useRef<HTMLDivElement>(null);
  const motion = useRef({ ax: -0.35, ay: 0, vy: 0.0035, tx: -0.35 });

  useEffect(() => {
    const root = cloud.current;
    if (!root) return;
    const nodes = Array.from(root.children) as HTMLElement[];
    const m = motion.current;
    let frame = 0;
    const render = () => {
      const radius = root.clientWidth * 0.42;
      const [sx, cx, sy, cy] = [Math.sin(m.ax), Math.cos(m.ax), Math.sin(m.ay), Math.cos(m.ay)];
      nodes.forEach((node, i) => {
        const [x, y, z] = points[i];
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const depth = (z2 + 1) / 2;
        node.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${0.62 + depth * 0.5})`;
        node.style.opacity = String(0.18 + depth * 0.82);
        node.style.zIndex = String(Math.round(depth * 100));
      });
    };
    const tick = () => {
      m.ay += m.vy;
      m.ax += (m.tx - m.ax) * 0.04;
      render();
      frame = requestAnimationFrame(tick);
    };
    render();
    if (inView && !reduced) frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, points]);

  const steer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    motion.current.vy = x * 0.02;
    motion.current.tx = -0.35 + y * 0.9;
  };
  const release = () => {
    motion.current.vy = 0.0035;
    motion.current.tx = -0.35;
  };

  return (
    <div className="globe" ref={ref} onPointerMove={steer} onPointerLeave={release} aria-hidden="true">
      <div className="globe-ring" />
      <div className="globe-cloud" ref={cloud}>
        {items.map((item) => (
          <span key={item.label} className={`globe-tag tone-${item.tone}`}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
