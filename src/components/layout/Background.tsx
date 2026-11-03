import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

/** Fixed page backdrop: a faint grid, two soft glows, and a spotlight that follows the cursor. */
export default function Background() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        root.style.setProperty("--mx", `${event.clientX}px`);
        root.style.setProperty("--my", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-grid" />
      <div className="backdrop-glow" />
      <div className="backdrop-spotlight" />
    </div>
  );
}
