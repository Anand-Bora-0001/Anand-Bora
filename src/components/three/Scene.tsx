import {
  Component,
  Suspense,
  useEffect,
  useState,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from "react";
import { hasWebGL, useInView, usePageVisible, useReducedMotion } from "@/lib/hooks";
import { useTheme } from "@/lib/theme";

class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Props every scene receives from the wrapper. */
export interface SceneProps {
  light: boolean;
  running: boolean;
  onFailure: () => void;
}

/**
 * Loads a WebGL scene once it nears the viewport, pauses it when off-screen, hidden,
 * or under reduced motion, and swaps in `fallback` if WebGL is missing or fails.
 */
export default function Scene<P extends object>({
  scene,
  props,
  fallback,
  className,
  label,
  decorative = false,
}: {
  scene: LazyExoticComponent<ComponentType<P & SceneProps>>;
  props: P;
  fallback: ReactNode;
  className: string;
  label?: string;
  decorative?: boolean;
}) {
  // lazy() erases the generic props; restore them for JSX.
  const LazyScene = scene as unknown as ComponentType<SceneProps & Record<string, unknown>>;
  const { theme } = useTheme();
  const { ref, inView, seen } = useInView<HTMLDivElement>("200px");
  const visible = usePageVisible();
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!hasWebGL()) setFailed(true);
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
    >
      {failed
        ? fallback
        : seen && (
            <Boundary onError={() => setFailed(true)}>
              <Suspense fallback={null}>
                <LazyScene
                  {...(props as Record<string, unknown>)}
                  light={theme === "light"}
                  running={inView && visible && !reduced}
                  onFailure={() => setFailed(true)}
                />
              </Suspense>
            </Boundary>
          )}
    </div>
  );
}
