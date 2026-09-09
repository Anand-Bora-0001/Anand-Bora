import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function CyberCursor() {
  const reticle = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = reticle.current;
    if (!element) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const contrast = window.matchMedia("(forced-colors: active)");
    const root = document.documentElement;
    let frame = 0;
    let visible = false;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let previous = 0;
    const allowed = () => fine.matches && !reduced.matches && !contrast.matches;
    const hide = () => {
      visible = false;
      element.dataset.visible = "false";
      element.dataset.pressed = "false";
      root.classList.remove("cyber-cursor-enabled");
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const classify = (target: Element | null) => {
      const native = target?.closest(
        "input, textarea, select, [contenteditable]:not([contenteditable='false']), [data-native-cursor]",
      );
      element.dataset.native = String(Boolean(native));
      const interactive = target?.closest(
        "a[href], button, summary, [role='button'], [role='tab']",
      );
      const disabled = interactive?.matches(
        ":disabled, [aria-disabled='true']",
      );
      element.dataset.mode =
        interactive && !disabled
          ? "link"
          : target?.closest("canvas")
            ? "orbit"
            : "idle";
    };
    const draw = (now: number) => {
      frame = 0;
      if (!visible) return;
      const weight = 1 - Math.exp(-Math.min(now - previous, 50) / 38);
      previous = now;
      x += (targetX - x) * weight;
      y += (targetY - y) * weight;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.15)
        frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (!allowed() || event.pointerType !== "mouse") {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      classify(event.target instanceof Element ? event.target : null);
      if (!visible) {
        x = targetX;
        y = targetY;
        previous = performance.now();
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        visible = true;
        element.dataset.visible = "true";
        root.classList.add("cyber-cursor-enabled");
      }
      if (!frame) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        hide();
        return;
      }
      element.dataset.pressed = "true";
    };
    const up = () => {
      element.dataset.pressed = "false";
    };
    const out = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const scroll = () => {
      if (visible) classify(document.elementFromPoint(targetX, targetY));
    };
    const visibility = () => {
      if (document.hidden) hide();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", hide);
    window.addEventListener("pointerout", out);
    window.addEventListener("blur", hide);
    window.addEventListener("keydown", hide);
    window.addEventListener("scroll", scroll, { passive: true, capture: true });
    document.addEventListener("visibilitychange", visibility);
    for (const media of [fine, reduced, contrast])
      media.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", hide);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("blur", hide);
      window.removeEventListener("keydown", hide);
      window.removeEventListener("scroll", scroll, true);
      document.removeEventListener("visibilitychange", visibility);
      for (const media of [fine, reduced, contrast])
        media.removeEventListener("change", hide);
    };
  }, []);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      ref={reticle}
      className="cyber-cursor"
      aria-hidden="true"
      data-visible="false"
    >
      <div className="cyber-cursor-ring">
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>,
    document.body,
  );
}
