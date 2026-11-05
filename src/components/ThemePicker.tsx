import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Copy, FileText, Hash, Move3d, X } from "lucide-react";
import SocialIcon from "@/components/ui/SocialIcon";
import { Boundary } from "@/components/three/Scene";
import type { Drag } from "@/components/three/ThemePreview";
import { sections, site, socials } from "@/content/site";
import { hasWebGL, useReducedMotion } from "@/lib/hooks";
import { useTheme } from "@/lib/theme";
import { themes, type ThemeId, type ThemeInfo } from "@/lib/themes";

const LivePreview = lazy(() => import("@/components/three/ThemePreview").then((m) => ({ default: m.LivePreview })));
const SnapshotStudio = lazy(() => import("@/components/three/ThemePreview").then((m) => ({ default: m.SnapshotStudio })));

/** Opens the picker from anywhere (the nav button uses it). */
export const openThemePicker = () => window.dispatchEvent(new Event("open-theme-picker"));

/** Still images of each theme's 3D object, rendered once per visit when the picker first opens. */
const stills: Partial<Record<ThemeId, string>> = {};

const count = themes.length;
/** Signed distance from the selected card, the short way round: the carousel loops. */
const offsetOf = (index: number, active: number) => {
  const d = (((index - active) % count) + count) % count;
  return d > count / 2 ? d - count : d;
};

/** Where a card sits: the selected one faces you; the rest fan out behind it, turned inward. */
function placement(offset: number): CSSProperties {
  const away = Math.abs(offset);
  const side = Math.sign(offset);
  const x = side * (away === 0 ? 0 : 64 + (away - 1) * 30);
  const z = away === 0 ? 0 : -220 - (away - 1) * 140;
  return {
    transform: `translate(-50%, -50%) translate3d(${x}%, 0, ${z}px) rotateY(${side * 34}deg)`,
    opacity: away > 3 ? 0 : 1,
    zIndex: 10 - away,
    ["--dim" as string]: Math.min(away * 0.28, 0.75),
  };
}

const SLIDE_MS = 420;

/**
 * Ctrl/⌘ K: a full-screen theme picker. Every theme is a large card showing its own 3D object;
 * ← and → (or a click on a card) bring a theme forward and preview it on the page behind; the
 * selected theme's object is live and can be dragged round to see every side. Enter, a double
 * click or Apply keeps it; Escape puts the old one back. The page's sections and links sit underneath (↓ to reach them).
 * Built as a dialog with a horizontal listbox, so screen readers hear each theme as it's chosen.
 */
export default function ThemePicker() {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const items = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const original = useRef<ThemeId | null>(null);
  const drag = useRef<Drag>({ x: 0, y: 0, held: false });
  const gesture = useRef<{ x: number; y: number; rotate: boolean; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const downOnLive = useRef(false);
  const wheel = useRef({ sum: 0, until: 0 });

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [active, setActive] = useState(0);
  const [settled, setSettled] = useState(true);
  const [liveReady, setLiveReady] = useState(false);
  const [live3d, setLive3d] = useState(true);
  const [shots, setShots] = useState(stills);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { theme: shown, setPreference, preview } = useTheme();
  const isMac = useMemo(() => /Mac|iPhone|iPad/.test(navigator.platform), []);
  const current = themes[active];

  const close = useCallback(
    (keepPreview = false) => {
      if (!keepPreview) preview(null);
      setClosing(true);
    },
    [preview],
  );
  const apply = (theme: ThemeInfo) => {
    setPreference(theme.id);
    close(true);
  };
  const move = (step: number) => setActive((i) => (i + step + count) % count);

  // Open on Ctrl/⌘ K (toggle) or when something calls openThemePicker().
  useEffect(() => {
    const show = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setClosing(false);
      setCopied(false);
      setOpen(true);
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) close();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-theme-picker", show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-theme-picker", show);
    };
  }, [close]);

  useEffect(() => {
    const el = dialog.current;
    if (!el || !open || el.open) return;
    el.showModal();
    // Start on the theme being shown, so arrowing previews its neighbours.
    original.current = shown;
    setActive(Math.max(0, themes.findIndex((t) => t.id === shown)));
    setLive3d(hasWebGL());
    stage.current?.focus();
    // Only when opening: the shown theme changes as the visitor previews.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Finish closing once the exit animation ends (or straight away without animations).
  useEffect(() => {
    if (!closing) return;
    const el = dialog.current;
    const done = () => {
      el?.close();
      setOpen(false);
      setClosing(false);
      setLiveReady(false);
      returnFocus.current?.focus?.();
    };
    if (reduced || !el) return done();
    const timer = window.setTimeout(done, 260);
    return () => window.clearTimeout(timer);
  }, [closing, reduced]);

  // Live preview: the selected theme is on the page while it is selected.
  useEffect(() => {
    if (open && !closing) preview(current.id);
  }, [current, open, closing, preview]);

  // The live 3D view fades in once the cards stop sliding, over the selected card's still.
  useEffect(() => {
    if (reduced) return setSettled(true);
    setSettled(false);
    const timer = window.setTimeout(() => setSettled(true), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [active, reduced]);

  // Stills to render, nearest the selected card first.
  const queue = useMemo(
    () =>
      themes
        .map((t, i) => ({ t, d: Math.abs(offsetOf(i, active)) }))
        .filter(({ t }) => !shots[t.id])
        .sort((a, b) => a.d - b.d)
        .map(({ t }) => t),
    [shots, active],
  );
  const onShot = useCallback((theme: ThemeInfo, url: string) => {
    stills[theme.id] = url;
    setShots({ ...stills });
  }, []);

  const focusItem = (step: number | "first") => {
    const all = [...(items.current?.querySelectorAll<HTMLElement>(".picker-chip") ?? [])];
    if (step === "first") return all[0]?.focus();
    const at = all.indexOf(document.activeElement as HTMLElement);
    all[Math.min(Math.max(at + step, 0), all.length - 1)]?.focus();
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    const inItems = items.current?.contains(event.target as Node);
    const key = event.key;
    if (key === "Escape") close();
    else if (inItems) {
      if (key === "ArrowRight") focusItem(1);
      else if (key === "ArrowLeft") focusItem(-1);
      else if (key === "ArrowUp") stage.current?.focus();
      else return;
    } else if (key === "ArrowRight") move(1);
    else if (key === "ArrowLeft") move(-1);
    else if (key === "Home") setActive(0);
    else if (key === "End") setActive(count - 1);
    else if (key === "ArrowDown") focusItem("first");
    else if ((key === "Enter" || key === " ") && event.target === stage.current) apply(current);
    else if (/^[1-9]$/.test(key) && Number(key) <= count) setActive(Number(key) - 1);
    else return;
    event.preventDefault();
  };

  // Mouse: drag the live object to turn it. Touch: swipe to change theme. Click a side card to bring it forward.
  const onPointerDown = (event: ReactPointerEvent) => {
    const rotate = event.pointerType === "mouse" && Boolean((event.target as Element).closest(".picker-live"));
    gesture.current = { x: event.clientX, y: event.clientY, rotate, moved: false };
    downOnLive.current = rotate;
    suppressClick.current = false;
    if (rotate) {
      drag.current.held = true;
      (event.currentTarget as Element).setPointerCapture(event.pointerId);
    }
  };
  const onPointerMove = (event: ReactPointerEvent) => {
    const g = gesture.current;
    if (!g) return;
    if (Math.hypot(event.clientX - g.x, event.clientY - g.y) > 6) g.moved = true;
    if (g.rotate) {
      drag.current.x += event.movementX;
      drag.current.y += event.movementY;
    }
  };
  const onPointerUp = (event: ReactPointerEvent) => {
    const g = gesture.current;
    gesture.current = null;
    drag.current.held = false;
    if (!g) return;
    const dx = event.clientX - g.x;
    const dy = event.clientY - g.y;
    if (!g.rotate && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
    suppressClick.current = g.moved;
  };
  // Trackpad swipes and the mouse wheel step through themes, one per gesture.
  const onWheel = (event: ReactWheelEvent) => {
    const w = wheel.current;
    const now = performance.now();
    if (now < w.until) return;
    w.sum += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(w.sum) < 40) return;
    move(w.sum > 0 ? 1 : -1);
    w.sum = 0;
    w.until = now + 320;
  };

  const go = (to: string) => () => {
    close();
    navigate(to);
  };
  const showLive = live3d && liveReady && settled;

  return (
    <dialog
      ref={dialog}
      className={`picker ${closing ? "is-closing" : ""}`}
      aria-label="Themes"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      {open && (
        <div className="picker-shell" onKeyDown={onKeyDown}>
          <header className="picker-head">
            <p className="picker-kicker">
              Themes
              <span>
                {active + 1} / {count}
              </span>
            </p>
            <button type="button" className="picker-close" onClick={() => close()} aria-label="Close and keep the current theme">
              <kbd>esc</kbd>
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div
            ref={stage}
            className="picker-stage"
            role="listbox"
            aria-label="Themes"
            aria-orientation="horizontal"
            aria-activedescendant={`picker-${current.id}`}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
            // The drag captures the pointer, so a double click on the live object lands here.
            onDoubleClick={() => downOnLive.current && !suppressClick.current && apply(current)}
          >
            {themes.map((theme, index) => {
              const offset = offsetOf(index, active);
              const isActive = offset === 0;
              return (
                <div
                  key={theme.id}
                  id={`picker-${theme.id}`}
                  role="option"
                  aria-selected={isActive}
                  aria-label={`${theme.name}: ${theme.blurb}, ${theme.sceneName}`}
                  data-theme={theme.id}
                  className={`picker-card ${isActive ? "is-active" : ""}`}
                  style={placement(offset)}
                  // One click only brings a card forward; applying takes Enter, a double click or Apply.
                  onClick={() => !suppressClick.current && !isActive && setActive(index)}
                  onDoubleClick={() => isActive && apply(theme)}
                >
                  <div className="picker-art" aria-hidden="true">
                    {shots[theme.id] && (
                      <img src={shots[theme.id]} alt="" draggable={false} className={isActive && showLive ? "is-hidden" : undefined} />
                    )}
                  </div>
                  <div className="picker-card-bar" aria-hidden="true">
                    <span className="picker-card-name">{theme.name}</span>
                    <span className="picker-card-scene">{theme.sceneName}</span>
                    <span className="picker-swatch">
                      {theme.swatch.map((color, i) => (
                        <i key={i} style={{ background: color }} />
                      ))}
                    </span>
                  </div>
                  {theme.id === original.current && (
                    <span className="picker-badge">
                      <Check size={12} aria-hidden="true" /> In use
                    </span>
                  )}
                </div>
              );
            })}

            {live3d && (
              <div
                className={`picker-live ${showLive ? "is-shown" : ""}`}
                aria-hidden="true"
              >
                <Boundary onError={() => setLive3d(false)}>
                  <Suspense fallback={null}>
                    <LivePreview
                      theme={current}
                      drag={drag}
                      running={!reduced}
                      onReady={() => setLiveReady(true)}
                      onFailure={() => setLive3d(false)}
                    />
                  </Suspense>
                </Boundary>
              </div>
            )}
          </div>

          <div className="picker-caption">
            <h2 className="picker-title" aria-live="polite">
              {current.name}
            </h2>
            <p className="picker-meta">
              <span>{current.scheme === "dark" ? "Dark" : "Light"}</span>
              <span>{current.sceneName}</span>
              <span>{current.blurb}</span>
            </p>
            <button type="button" className="picker-apply" onClick={() => apply(current)}>
              <Check size={16} aria-hidden="true" />
              Apply {current.name}
              <kbd aria-hidden="true">enter</kbd>
            </button>
            <div className="picker-dots" aria-hidden="true">
              {themes.map((theme, index) => (
                <button
                  key={theme.id}
                  type="button"
                  tabIndex={-1}
                  className={index === active ? "is-active" : undefined}
                  style={{ ["--dot" as string]: theme.swatch[2] }}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          </div>

          <nav ref={items} className="picker-items" aria-label="Go to">
            {sections.map((s) => (
              <button key={s.id} type="button" className="picker-chip" onClick={go(`/#${s.id}`)}>
                <Hash size={14} aria-hidden="true" />
                {s.label}
              </button>
            ))}
            <button type="button" className="picker-chip" onClick={go("/work/leapview")}>
              <ArrowRight size={14} aria-hidden="true" />
              LeapView
            </button>
            <button type="button" className="picker-chip" onClick={go("/work/alloy-catalog")}>
              <ArrowRight size={14} aria-hidden="true" />
              Alloy Catalog
            </button>
            <span className="picker-sep" aria-hidden="true" />
            {socials
              .filter((s) => s.id !== "email")
              .map((s) => (
                <a key={s.id} className="picker-chip" href={s.href} target="_blank" rel="noopener noreferrer" onClick={() => close()}>
                  <SocialIcon id={s.id} size={14} />
                  {s.label}
                </a>
              ))}
            <button
              type="button"
              className="picker-chip"
              onClick={() => {
                void navigator.clipboard?.writeText(site.email);
                setCopied(true);
              }}
            >
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              <span aria-live="polite">{copied ? "Email copied" : "Copy email"}</span>
            </button>
            <a className="picker-chip" href={site.resume} target="_blank" rel="noopener" onClick={() => close()}>
              <FileText size={14} aria-hidden="true" />
              Resume
            </a>
          </nav>

          <footer className="picker-keys" aria-hidden="true">
            <span>
              <kbd>←</kbd>
              <kbd>→</kbd> browse
            </span>
            <span>click to select</span>
            <span>
              <kbd>enter</kbd> or double-click to apply
            </span>
            <span>
              <kbd>↓</kbd> go to
            </span>
            {live3d && (
              <span>
                <Move3d size={14} /> drag to turn
              </span>
            )}
            <span>
              <kbd>esc</kbd> cancel
            </span>
            <span className="picker-keys-touch">Swipe to browse · tap Apply to keep it</span>
            <span className="picker-shortcut">
              <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
              <kbd>K</kbd>
            </span>
          </footer>

          {live3d && queue.length > 0 && (
            <Boundary onError={() => undefined}>
              <Suspense fallback={null}>
                <SnapshotStudio queue={queue} onShot={onShot} />
              </Suspense>
            </Boundary>
          )}
        </div>
      )}
    </dialog>
  );
}
