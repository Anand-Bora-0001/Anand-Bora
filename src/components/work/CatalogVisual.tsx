import { lazy, useState } from "react";
import { Boxes, Expand, Move3d } from "lucide-react";
import Scene from "@/components/three/Scene";

const AssemblyScene = lazy(() => import("@/components/three/AssemblyScene"));

/** An interactive demo assembly, standing in for Alloy Catalog's 3D part and assembly views. */
export default function CatalogVisual({ large = false }: { large?: boolean }) {
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const exploded = hover || pinned;
  return (
    <div
      className={`catalog ${large ? "is-large" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Scene
        scene={AssemblyScene}
        props={{ exploded }}
        className="catalog-canvas"
        label="A 3D demo assembly — base plate, bearing blocks, shaft, gear, pulley and bolts — that separates into its parts."
        fallback={
          <div className="catalog-fallback">
            <Boxes size={40} strokeWidth={1.2} aria-hidden="true" />
            <span>3D view needs WebGL</span>
          </div>
        }
      />
      <div className="catalog-chip" aria-hidden="true">
        <span className="catalog-chip-id">ASM-2041</span> Gearbox mount · 10 parts
      </div>
      <div className="catalog-bar">
        <span className="catalog-hint" aria-hidden="true">
          <Move3d size={14} /> Drag to rotate
        </span>
        <button type="button" className="catalog-toggle" aria-pressed={pinned} onClick={() => setPinned(!pinned)}>
          <Expand size={14} aria-hidden="true" /> {exploded ? "Assembled" : "Exploded"} view
        </button>
      </div>
    </div>
  );
}
