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
    let colorIndex = 0;
    let colorKey = "";
    const recolor = () => {
      const dark = root.classList.contains("dark");
      const key = `${dark}:${colorIndex}`;
      if (key === colorKey) return;
      colorKey = key;
      const palette = dark
        ? ["#43f5da", "#ff609f", "#d6f65a", "#bb9aff", "#ffa86a", "#6dc9ff"]
        : ["#006b73", "#b52362", "#586900", "#7037b0", "#a24612", "#17629b"];
      const color = palette[colorIndex];
      const stroke = dark ? "#07191f" : "#ffffff";
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M3 2L3 21L8 16L12 24L16 22L12 14L20 14Z" fill="${color}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
      root.style.setProperty(
        "--cyber-pointer",
        `url("data:image/svg+xml,${encodeURIComponent(svg)}") 3 2, auto`,
      );
      root.style.setProperty("--cursor-hover-color", color);
    };
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
      const mode =
        interactive && !disabled
          ? "link"
          : target?.closest("canvas")
            ? "orbit"
            : target?.closest("img, picture, video, svg")
              ? "image"
              : target?.closest(
                    "h1, h2, h3, h4, h5, h6, p, span, small, strong, em, label, li, code, pre, blockquote",
                  )
                ? "text"
                : "surface";
      element.dataset.mode = mode;
      colorIndex =
        mode === "link"
          ? 1
          : mode === "orbit"
            ? 2
            : mode === "text"
              ? 3
              : mode === "image"
                ? 4
                : 0;
      if (mode === "surface" && target) {
        // Stable variations make different panels and sections respond individually.
        const section =
          target.closest("section, article, header, footer, aside, main") ??
          target;
        const key = `${section.tagName}:${section.id}:${section.className}`;
        let hash = 0;
        for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
        colorIndex = [0, 2, 5][hash % 3];
      }
      recolor();
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
    const themeObserver = new MutationObserver(recolor);
    themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });
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
      themeObserver.disconnect();
      hide();
      root.style.removeProperty("--cyber-pointer");
      root.style.removeProperty("--cursor-hover-color");
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
