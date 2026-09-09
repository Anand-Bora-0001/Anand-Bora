import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowUpRight, Pause, Play, RotateCcw, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  atlasDomains,
  getAtlasRenderPolicy,
  type AtlasFocus,
} from "@/data/atlas";
import AtlasPoster from "./AtlasPoster";
import { useTheme } from "next-themes";
const SystemsScene = lazy(() => import("./SystemsScene"));
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
function preference(query: string) {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}
export default function SystemsAtlas() {
  const { resolvedTheme } = useTheme();
  const light = resolvedTheme === "light";
  const [focus, setFocus] = useState<AtlasFocus>("agents");
  const [reduced, setReduced] = useState(() =>
    preference("(prefers-reduced-motion: reduce)"),
  );
  const [coarse, setCoarse] = useState(() => preference("(pointer: coarse)"));
  const [paused, setPaused] = useState(false);
  const [want3D, setWant3D] = useState(
    () => !preference("(prefers-reduced-motion: reduce)"),
  );
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setReduced(motion.matches);
      setCoarse(pointer.matches);
    };
    const visibility = () => setPageVisible(!document.hidden);
    motion.addEventListener("change", update);
    pointer.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    if (!window.WebGL2RenderingContext) setFailed(true);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    if (wrapper.current) observer.observe(wrapper.current);
    return () => {
      motion.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!visible || !want3D || failed || ready) return;
    const timer = window.setTimeout(() => setReady(true), 300);
    return () => clearTimeout(timer);
  }, [visible, want3D, failed, ready]);
  const { show3D, animate: running } = getAtlasRenderPolicy({
    want3D,
    ready,
    failed,
    paused,
    reducedMotion: reduced,
    inView: visible,
    pageVisible,
  });
  const poster = <AtlasPoster focus={focus} light={light} />;
  return (
    <div className="systems-atlas" ref={wrapper} data-focus={focus}>
      <div className="atlas-topbar">
        <span>
          <i />
          SYSTEMS ATLAS <small>AB / 01</small>
        </span>
        <span className="atlas-live-label">
          {show3D ? "INTERACTIVE 3D" : "INTERACTIVE MAP"}
        </span>
      </div>
      <div className="atlas-viewport" aria-hidden="true">
        <div className="atlas-coordinate atlas-coordinate-top">
          EXPLORE / ROTATE / CONNECT
        </div>
        {show3D ? (
          <SceneBoundary onFailure={() => setFailed(true)} fallback={poster}>
            <Suspense fallback={poster}>
              <SystemsScene
                light={light}
                focus={focus}
                onSelect={setFocus}
                running={running}
                coarse={coarse}
                resetToken={resetToken}
                onFailure={() => setFailed(true)}
              />
            </Suspense>
          </SceneBoundary>
        ) : (
          poster
        )}
        <div className="atlas-coordinate atlas-coordinate-bottom">
          {show3D && !coarse
            ? "DRAG TO ROTATE / SELECT A NODE"
            : "THREE CONNECTED PARTS OF MY WORK"}
        </div>
      </div>
      <div className="atlas-toolbar">
        <span>
          <Box size={14} />
          {failed
            ? "2D explorer"
            : show3D
              ? "Built to be explored"
              : "A map of what I build"}
        </span>
        <div>
          {!failed && (
            <button
              className="atlas-control"
              onClick={() => setWant3D(!want3D)}
              aria-label={want3D ? "Switch to 2D map" : "Explore in 3D"}
            >
              {want3D ? "2D view" : "Explore in 3D"}
            </button>
          )}
          {show3D && (
            <>
              <button
                className="atlas-icon-control"
                onClick={() => setPaused(!paused)}
                disabled={reduced}
                aria-label={
                  reduced
                    ? "Reduced motion enabled"
                    : paused
                      ? "Play animation"
                      : "Pause animation"
                }
                title={
                  reduced
                    ? "Reduced motion enabled"
                    : paused
                      ? "Play animation"
                      : "Pause animation"
                }
              >
                {paused || reduced ? <Play size={14} /> : <Pause size={14} />}
              </button>
              {!coarse && (
                <button
                  className="atlas-icon-control"
                  onClick={() => setResetToken((value) => value + 1)}
                  aria-label="Reset 3D view"
                  title="Reset view"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <Tabs
        value={focus}
        onValueChange={(value) => setFocus(value as AtlasFocus)}
        className="atlas-tabs"
      >
        <TabsList
          aria-label="Explore an engineering focus"
          className="atlas-tab-list"
        >
          {atlasDomains.map((domain) => (
            <TabsTrigger key={domain.id} value={domain.id}>
              <span>{domain.number}</span>
              {domain.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {atlasDomains.map((domain) => (
          <TabsContent
            key={domain.id}
            value={domain.id}
            className="atlas-detail"
          >
            <h2>{domain.title}</h2>
            <p>{domain.description}</p>
            <div className="atlas-detail-footer">
              <span>{domain.tools.join(" · ")}</span>
              <Link to={`/projects/${domain.project}`}>
                See it in practice <ArrowUpRight size={14} />
                <span className="sr-only">: {domain.projectLabel}</span>
              </Link>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
