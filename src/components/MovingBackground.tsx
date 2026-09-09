import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { createBackgroundScene } from "./BackgroundScene";

export default function MovingBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ReturnType<typeof createBackgroundScene>>();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    let cancelled = false;
    const timer = window.setTimeout(() => {
      import("./BackgroundScene")
        .then(({ createBackgroundScene }) => {
          if (cancelled || !canvas.current) return;
          scene.current = createBackgroundScene(canvas.current, () =>
            setFailed(true),
          );
          setReady(true);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      scene.current?.dispose();
      scene.current = undefined;
      media.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    scene.current?.setRunning(
      ready && !failed && !paused && !reduced && !hidden,
    );
  }, [ready, failed, paused, reduced, hidden]);
  return (
    <>
      <div className="moving-background" aria-hidden="true">
        <div className="background-aura" />
        <canvas ref={canvas} className={failed ? "invisible" : ""} />
        <div className="background-reading-veil" />
      </div>
      {ready && !failed && !reduced && (
        <button
          className="background-motion-control"
          onClick={() => setPaused(!paused)}
          aria-label={
            paused ? "Play background animation" : "Pause background animation"
          }
          aria-pressed={paused}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          <span>Background motion</span>
        </button>
      )}
    </>
  );
}
