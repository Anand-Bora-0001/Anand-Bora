import { useRef, type PointerEvent } from "react";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { prefersReducedMotion } from "@/lib/hooks";

/** The real LeapView dashboard in a browser frame, tilted in 3D, with the agent layered in front. */
export default function LeapViewVisual({ large = false }: { large?: boolean }) {
  const { theme } = useTheme();
  const stage = useRef<HTMLDivElement>(null);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.current?.style.setProperty("--ry", `${-10 + x * 10}deg`);
    stage.current?.style.setProperty("--rx", `${8 - y * 8}deg`);
  };
  const reset = () => {
    stage.current?.style.removeProperty("--ry");
    stage.current?.style.removeProperty("--rx");
  };
  return (
    <div className={`lv ${large ? "is-large" : ""}`} onPointerMove={move} onPointerLeave={reset}>
      <div className="lv-stage" ref={stage}>
        <figure className="lv-window">
          <div className="lv-chrome" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>leapview.dev / dashboards / executive-sales</span>
          </div>
          <img
            src={theme === "light" ? "/work/leapview-light.png" : "/work/leapview-dark.png"}
            alt="LeapView's Executive Sales dashboard: date, state and category filters, order and revenue KPIs, and monthly revenue."
            width="1296"
            height="704"
            loading="lazy"
          />
        </figure>
        <div className="lv-agent" aria-hidden="true">
          <span className="lv-agent-head">
            <Sparkles size={13} /> Ask LeapView
          </span>
          <p className="lv-q">Revenue by state for the last 12 months?</p>
          <p className="lv-a">
            Drafted 4 tiles from the governed <b>revenue</b> metric. Preview ready.
          </p>
        </div>
        <div className="lv-yaml" aria-hidden="true">
          <span>metrics/revenue.yaml</span>
          <code>
            <b>expr:</b> sum(payment_value)
          </code>
          <code>
            <b>mask:</b> customer_email
          </code>
        </div>
      </div>
    </div>
  );
}
