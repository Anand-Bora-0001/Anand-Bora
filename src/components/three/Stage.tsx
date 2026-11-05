import { Environment, Lightformer } from "@react-three/drei";
import type { ScenePalette } from "@/lib/palette";

/** Studio lighting in the theme's colors, baked once into an environment map (no fetch), plus
 *  direct light. Shared by the hero and the theme picker's previews so a theme looks the same in both. */
export default function Stage({ id, palette, light }: { id: string; palette: ScenePalette; light: boolean }) {
  return (
    <>
      <Environment key={`${id}-${palette.accent}`} resolution={128} frames={1}>
        <color attach="background" args={[light ? "#dcdcd8" : "#16171b"]} />
        <Lightformer form="rect" intensity={5} color={palette.accent} position={[-5, 2, 3]} scale={[6, 9, 1]} />
        <Lightformer form="rect" intensity={4} color={palette.accent2} position={[5, -2, 3]} scale={[5, 8, 1]} />
        <Lightformer form="ring" intensity={3} color="#ffffff" position={[0, 5, 0]} scale={4} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, 0, 8]} scale={[14, 2, 1]} />
      </Environment>
      <ambientLight intensity={light ? 0.75 : 0.35} />
      <directionalLight position={[-4, 5, 5]} intensity={light ? 1.3 : 1.5} />
      <directionalLight position={[5, -2, 4]} intensity={0.6} color={palette.accent2} />
    </>
  );
}
