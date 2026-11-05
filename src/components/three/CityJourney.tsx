import { useEffect, useMemo, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BackSide,
  BoxGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  FogExp2,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  Vector4,
  type WebGLRenderer,
} from "three";
import { roles } from "@/content/experience";
import { featuredProjects } from "@/content/projects";
import { skillCategories } from "@/content/skills";
import type { ScenePalette } from "@/lib/palette";

/**
 * A night city built from the work, behind the whole home page. Four districts (agents, backend,
 * data, cloud) lit in the theme's tones, two landmark towers for the products, an avenue with a gate
 * per role, a district of 28 project towers, and a river with bridges. Nothing floats: what each
 * place is reads from billboards on its rooftops, signs on the towers and gates, and the moving
 * light is traffic. The camera moves the whole way down the page: each section has its own shot,
 * which plays out as the section is read, and a flight over the rooftops joins one to the next.
 */
export type CityJourney = { travel: number; velocity: number };

const PLAZA = 11;
const AVENUE_X = 21;
// In the order the Skills section lists them.
const districts = [
  { tone: 0, x: -38, z: -95 },
  { tone: 1, x: 6, z: -125 },
  { tone: 2, x: -40, z: -35 },
  { tone: 3, x: 50, z: -50 },
].map((d, i) => ({ ...d, title: skillCategories[i].title, tools: skillCategories[i].skills.slice(0, 4).join(" · ") }));
const towers = [
  { name: "LeapView", fact: "Open-source BI · 135+ PRs", x: -14, z: -44, h: 42 },
  { name: "Alloy Catalog", fact: "CAD → searchable catalog", x: -2, z: -54, h: 36 },
];
// Newest first, as the page lists them; the camera passes through them in that order.
const gates = roles.slice(0, 3).map((r, i) => ({ title: r.org.replace(" LLP", ""), line: `${r.title} · ${r.period.replace(" — ", "–")}`, z: -62 - i * 18 }));
const projectSpot = { x: 48, z: -112 };
const riverX = (z: number) => -68 + 9 * Math.sin(z * 0.03);

// Group ids the building shader reads: 2, 4 and 5 light with their section; the rest are scenery.
const G = { Plain: -1, Far: -2, Antenna: -3, Bridge: -4, Fixture: -5 } as const;
type Lot = { x: number; z: number; w: number; d: number; h: number; y: number; tone: number; group: number; seed: number };

function layout() {
  let s = 7;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const lots: Lot[] = [];
  const roofUnits = (l: Lot) => {
    const n = Math.floor(rand() * 3);
    for (let i = 0; i < n; i++) {
      const w = 0.5 + rand() * 0.6;
      lots.push({ x: l.x + (rand() - 0.5) * (l.w - w - 0.4), z: l.z + (rand() - 0.5) * (l.d - w - 0.4), w, d: w * (0.7 + rand() * 0.6), h: 0.5 + rand() * 0.9, y: l.y + l.h, tone: l.tone, group: G.Fixture, seed: rand() });
    }
  };
  for (let x = -84; x <= 84; x += 6) {
    for (let z = -170; z <= 40; z += 6) {
      if (Math.abs(x - AVENUE_X) < 6) continue;
      if ((x + 84) % 30 === 0 || (z + 170) % 30 === 0) continue; // streets
      if (Math.abs(x - riverX(z)) < 8) continue;
      if (towers.some((t) => Math.hypot(t.x - x, t.z - z) < 6)) continue;
      if (Math.hypot(projectSpot.x - x, projectSpot.z - z) < 15) continue;
      let best = 0;
      let bd = Infinity;
      districts.forEach((d, i) => {
        const dd = Math.hypot(d.x - x, d.z - z);
        if (dd < bd) [bd, best] = [dd, i];
      });
      if (bd < PLAZA) continue;
      const core = Math.max(0, 1 - bd / 34);
      const h = 2 + rand() * 6 + core * core * (10 + rand() * 18) + (rand() > 0.97 ? 12 : 0);
      const lot = { x: x + (rand() - 0.5), z: z + (rand() - 0.5), w: 3 + rand() * 1.6, d: 3 + rand() * 1.6, h, y: 0, tone: best, group: core > 0.5 ? 5 : G.Plain, seed: rand() };
      lots.push(lot);
      // Tall buildings step back near the top, and the tallest carry an antenna.
      if (h > 15) {
        const top = { ...lot, w: lot.w * 0.66, d: lot.d * 0.66, h: h * 0.3, y: h, seed: rand() };
        lots.push(top);
        if (h > 24) lots.push({ ...top, w: 0.16, d: 0.16, h: 4, y: h + top.h, group: G.Antenna, seed: rand() });
        else roofUnits(top);
      } else roofUnits(lot);
    }
  }
  towers.forEach((t) => {
    lots.push({ x: t.x, z: t.z, w: 5, d: 5, h: t.h, y: 0, tone: 0, group: 2, seed: rand() });
    lots.push({ x: t.x, z: t.z, w: 0.22, d: 0.22, h: 7, y: t.h, tone: 0, group: G.Antenna, seed: rand() });
  });
  for (let i = 0; i < 28; i++) {
    const a = i * 2.399;
    const r = 2.6 * Math.sqrt(i + 0.8);
    lots.push({ x: projectSpot.x + Math.cos(a) * r, z: projectSpot.z + Math.sin(a) * r, w: 2, d: 2, h: 6 + rand() * 12, y: 0, tone: i % 4, group: 4, seed: i / 28 });
  }
  for (let z = -170; z <= 40; z += 30) lots.push({ x: riverX(z), z, w: 14, d: 2.4, h: 0.8, y: 0, tone: 0, group: G.Bridge, seed: 0 });
  for (let i = 0; i < 260; i++) {
    const a = -Math.PI * 1.1 + rand() * Math.PI * 1.2;
    const r = 210 + rand() * 90;
    lots.push({ x: Math.cos(a) * r, z: Math.sin(a) * r - 60, w: 6 + rand() * 8, d: 6 + rand() * 8, h: 8 + rand() * rand() * 60, y: 0, tone: Math.floor(rand() * 4), group: G.Far, seed: rand() });
  }
  return lots;
}

/** A rooftop billboard's spot: the tallest plain roof (no step-back) near a point. */
function roofNear(lots: Lot[], x: number, z: number, radius: number, maxH = 15) {
  let best: Lot | undefined;
  for (const l of lots) {
    if (l.y !== 0 || l.h > maxH || l.group === G.Far || l.group === G.Bridge || l.group < -2) continue;
    if (Math.hypot(l.x - x, l.z - z) > radius) continue;
    if (!best || l.h > best.h) best = l;
  }
  return best!;
}

// ---------- The camera's route ----------
// Each key is [where on the page (section index + how far through it), camera, target]. Within a
// section the shot plays out; the last key of one and the first of the next are joined by a flight.
type Key = [number, [number, number, number], [number, number, number]];
const orbit = (at: number, span: number, n: number, cx: number, cz: number, r: number, h: number, a0: number, a1: number): Key[] =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / (n - 1);
    return [at + (span * i) / (n - 1), [cx + Math.cos(a) * r, h, cz + Math.sin(a) * r], [cx, 6, cz]];
  });
function route(): Key[] {
  const d = districts;
  const above = (k: number, x: number, z: number): Key => [k, [x + 14, 36, z + 42], [x, 6, z]];
  return [
    [0, [40, 50, 44], [-2, 0, -52]], // hero: the city from above
    [0.55, [34, 40, 28], [-6, 0, -58]],
    [1.05, [30, 20, 4], [-14, 6, -54]], // about: over the rooftops, toward the river
    [1.7, [2, 16, -6], [-50, 4, -52]],
    [2.05, [16, 22, -16], [-14, 28, -44]], // work: LeapView, then across to Alloy Catalog
    [2.4, [10, 30, -26], [-10, 26, -48]],
    [2.75, [18, 20, -44], [-2, 24, -54]],
    [3.05, [AVENUE_X - 1.2, 5.5, -40], [AVENUE_X + 0.4, 7, -110]], // experience: down the avenue, a gate per role
    [3.4, [AVENUE_X - 1.2, 5.2, -58], [AVENUE_X + 0.4, 7, -130]],
    [3.75, [AVENUE_X - 1.2, 5.2, -92], [AVENUE_X + 0.4, 7, -160]],
    ...orbit(4.05, 0.7, 4, projectSpot.x, projectSpot.z, 36, 24, 0.6, 2.4), // projects: around the district
    above(5.05, d[0].x, d[0].z), // skills: each district as its card is read
    above(5.3, d[1].x, d[1].z),
    above(5.55, d[2].x, d[2].z),
    above(5.8, d[3].x, d[3].z),
    [6.05, [-50, 24, 34], [0, 12, -70]], // contact: the city from its edge, everything lit
    [7, [-74, 58, 72], [0, 0, -64]],
  ];
}

const header = /* glsl */ `
  uniform float uTime, uGlow, uFocus, uLight, uFog, uDistrict, uDim, uTraffic, uArrive;
  uniform vec3 uBg, uBody, uLine, uAccent;
  uniform vec4 uWave;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float waveAt(vec2 xz, float width) {
    float front = (uTime - uWave.w) * 34.0;
    return exp(-pow((length(xz - uWave.xy) - front) / width, 2.0)) * smoothstep(110.0, 20.0, front);
  }
  // How much a section's subject is lit: while that section is on screen.
  float during(float k) { return smoothstep(k - 0.2, k + 0.05, uFocus) * (1.0 - smoothstep(k + 0.85, k + 1.1, uFocus)); }
  vec3 finish(vec3 col, vec3 world) {
    float d = length(world - cameraPosition);
    float fog = 1.0 - exp(-d * uFog);
    // Haze is lighter near the ground, as city light scatters in it.
    vec3 haze = mix(uBg, mix(uBg, uAccent, 0.02), (1.0 - smoothstep(0.0, 40.0, world.y)) * (1.0 - uLight));
    return mix(mix(col, haze, fog), uBg, uDim);
  }
`;

/** Lettering for a sign: a big first line and smaller lines under it, optionally on a dark panel. */
function textTexture(lines: string[], aspect: number, panel: boolean, anisotropy: number) {
  const w = 1024;
  const h = Math.round(w / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d")!;
  if (panel) {
    g.fillStyle = "rgba(8, 8, 10, 0.94)";
    g.beginPath();
    g.roundRect(4, 4, w - 8, h - 8, Math.min(h, w) * 0.06);
    g.fill();
    g.strokeStyle = "rgba(255, 255, 255, 0.55)";
    g.lineWidth = 6;
    g.stroke();
  }
  const weights = lines.map((_, i) => (i === 0 ? 1 : 0.62));
  const total = weights.reduce((a, b) => a + b, 0);
  const room = h * (panel ? 0.7 : 0.86);
  let y = (h - room) / 2;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#fff";
  lines.forEach((line, i) => {
    const band = (room * weights[i]) / total;
    let size = band * 0.78;
    const text = line.toUpperCase();
    const setFont = () => {
      g.font = `${i === 0 ? 600 : 500} ${size}px "Space Grotesk", "Inter Tight", system-ui, sans-serif`;
      g.letterSpacing = `${size * (i === 0 ? 0.06 : 0.1)}px`;
    };
    setFont();
    while (g.measureText(text).width > w * (panel ? 0.86 : 0.94) && size > 8) {
      size *= 0.95;
      setFont();
    }
    g.globalAlpha = i === 0 ? 1 : 0.78;
    g.fillText(text, w / 2, y + band / 2);
    y += band;
  });
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
}

function buildCity(gl: WebGLRenderer) {
  const scene = new Scene();
  scene.fog = new FogExp2(0x000000, 0.009);
  const camera = new PerspectiveCamera(46, 1, 0.5, 1200);
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);
  const shared = {
    uTime: { value: 0 },
    uBg: { value: new Color() },
    uBody: { value: new Color() },
    uLine: { value: new Color() },
    uAccent: { value: new Color() },
    uGlow: { value: 1 },
    uFocus: { value: 0 },
    uDistrict: { value: -1 },
    uWave: { value: new Vector4(0, 0, 0, -100) },
    uArrive: { value: -100 },
    uLight: { value: 0 },
    uFog: { value: 0.009 },
    uDim: { value: 0 },
    uTraffic: { value: 0.5 },
  };

  // ---------- Buildings ----------
  const lots = layout();
  // Rooftop billboards stand on real roofs; their legs are fixtures like the rest.
  type Board = { lines: string[]; x: number; y: number; z: number; w: number; h: number; rotY: number; stop: number; tone: number | "accent"; district?: number };
  const boards: Board[] = [];
  const keys = route();
  const board = (o: Omit<Board, "y" | "x" | "z" | "rotY"> & { on: Lot; face: [number, number] }) => {
    const { on } = o;
    const top = on.y + on.h;
    const lift = 1.1;
    const rotY = Math.atan2(o.face[0] - on.x, o.face[1] - on.z);
    for (const side of [-1, 1]) {
      const off = side * o.w * 0.32;
      lots.push({ x: on.x + Math.cos(rotY) * off, z: on.z - Math.sin(rotY) * off, w: 0.18, d: 0.18, h: lift + 0.2, y: top, tone: 0, group: G.Fixture, seed: 0 });
    }
    boards.push({ ...o, x: on.x, y: top + lift + o.h / 2, z: on.z, rotY });
  };
  districts.forEach((d, i) => {
    const cam = keys.find((k) => Math.abs(k[0] - (5.05 + i * 0.25)) < 0.01)![1];
    board({ lines: [d.title, d.tools], w: 14, h: 5, on: roofNear(lots, d.x, d.z + 8, 16), face: [cam[0], cam[2]], stop: 5, tone: i, district: i });
  });
  // The four tallest project towers each carry a project's name, facing out of the district.
  lots
    .filter((l) => l.group === 4)
    .sort((a, b) => b.h - a.h)
    .slice(0, 4)
    .forEach((l, i) => {
      const dx = l.x - projectSpot.x;
      const dz = l.z - projectSpot.z;
      board({ lines: [featuredProjects[i].title], w: 4.6, h: 1.25, on: l, face: [l.x + dx * 10, l.z + dz * 10], stop: 4, tone: i });
    });
  board({ lines: ["Anand Bora", "Full-stack · Pune"], w: 9, h: 3, on: roofNear(lots, -30, -62, 12), face: [2, -6], stop: 1, tone: "accent" });

  const box = keep(new BoxGeometry(1, 1, 1));
  box.translate(0, 0.5, 0);
  const buildingMat = keep(
    new ShaderMaterial({
      uniforms: shared,
      vertexShader: /* glsl */ `
        attribute vec3 aTone;
        attribute vec3 aInfo; // seed, group, district
        attribute vec3 aSize;
        varying vec3 vWorld, vNormal, vLocal, vTone, vInfo, vSize;
        void main() {
          vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vWorld = w.xyz;
          vLocal = position;
          vNormal = normalize(mat3(instanceMatrix) * normal);
          vTone = aTone;
          vInfo = aInfo;
          vSize = aSize;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${header}
        varying vec3 vWorld, vNormal, vLocal, vTone, vInfo, vSize;
        void main() {
          vec3 n = normalize(vNormal);
          float group = vInfo.y;
          float seed = vInfo.x;
          float plain = step(group, -2.5); // antennas, bridges, fixtures: no windows
          float focus = 0.0;
          if (group > 1.5 && group < 2.5) focus = during(2.0);
          if (group > 3.5 && group < 4.5) focus = during(4.0) * step(seed, (uTime - uArrive) * 0.55); // towers light one by one
          if (group > 4.5) focus = during(5.0) * (uDistrict < 0.0 ? 1.0 : mix(0.25, 1.0, step(abs(vInfo.z - uDistrict), 0.5)));
          if (group > -1.5) focus = max(focus, smoothstep(5.9, 6.4, uFocus) * 0.7); // contact: everything lights up

          // Facade: each building its own shade, darker toward the street, lit from the sky.
          vec3 V = normalize(cameraPosition - vWorld);
          float shade = 0.75 + 0.5 * hash(vec2(seed, 1.7));
          vec3 body = uBody * shade * (0.5 + 0.5 * max(dot(n, normalize(vec3(0.35, 0.85, 0.4))), 0.0));
          body *= mix(0.45, 1.0, smoothstep(0.0, 7.0, vWorld.y)); // contact shadow at the base
          body *= 1.0 - 0.08 * step(0.5, n.y);

          // Windows: a grid sized per building; some buildings are glass curtain walls.
          float glass = group > 1.5 && group < 2.5 ? 1.0 : step(0.72, hash(vec2(seed, 2.3)));
          vec2 face = abs(n.x) > 0.5 ? vec2(vWorld.z, vWorld.y) : vec2(vWorld.x, vWorld.y);
          vec2 dens = mix(vec2(1.3, 1.05), vec2(2.0, 1.25), hash(vec2(seed, 3.1)));
          vec2 g = face * dens;
          vec2 cell = floor(g), f = fract(g);
          vec2 frame = glass > 0.5 ? vec2(0.05, 0.1) : vec2(0.2, 0.26);
          float wall = (1.0 - step(0.5, abs(n.y))) * (1.0 - plain);
          float pane = step(frame.x, f.x) * step(f.x, 1.0 - frame.x) * step(frame.y, f.y) * step(f.y, 1.0 - frame.y) * wall;
          // Keep the ground floor and the top floor plain.
          pane *= step(1.6, vLocal.y * vSize.x) * step(vLocal.y * vSize.x, vSize.x - 0.7);
          // Unlit glass reflects the sky; lit windows are warm or cool rooms, tinted by the district.
          vec3 R = reflect(-V, n);
          vec3 skyRef = mix(uBg * 1.3 + 0.015, mix(uBg, uAccent, 0.1) * 1.5, smoothstep(-0.1, 0.4, R.y));
          vec3 glassCol = mix(body * 0.55, skyRef, mix(0.45, 0.85, glass)) * mix(1.0, 0.7, glass);
          float r = hash(cell + seed * 17.0);
          float lit = step(0.7 - focus * mix(0.45, 0.22, glass) + glass * 0.12 + (group < -1.5 && group > -2.5 ? 0.25 : 0.0), r);
          lit *= 0.75 + 0.25 * sin(uTime * (0.25 + hash(cell) * 0.9) + hash(cell.yx) * 6.28);
          vec3 room = mix(vec3(0.95, 0.84, 0.66), vec3(0.74, 0.82, 0.95), step(0.55, hash(cell + 3.0)));
          vec3 litCol = mix(mix(room, vec3(0.7, 0.8, 0.95), glass * 0.5), vTone, 0.25 + focus * 0.5) * (0.45 + 0.55 * hash(cell + 9.0)) * (0.32 + focus * 1.1);
          float wave = waveAt(vWorld.xz, 5.0) * exp(-vWorld.y * 0.05);
          vec3 col = mix(body, glassCol, pane);
          col += litCol * pane * lit * uGlow;
          // Floor lines on glass towers, and a light rim along the roof's edge.
          col += vTone * glass * wall * (1.0 - step(0.04, f.y)) * 0.12;
          float roof = step(0.5, n.y) * smoothstep(0.44, 0.5, max(abs(vLocal.x), abs(vLocal.z))) * (1.0 - plain);
          col += vTone * roof * (0.12 + focus * 1.2) * uGlow;
          col += vTone * wave * (0.25 + pane);
          // Bridges: a line of light along each edge of the deck.
          if (group < -3.5 && group > -4.5) col = body + vTone * (smoothstep(0.38, 0.5, abs(vLocal.z)) * step(0.5, vLocal.y) * 0.9 + wave);
          // Antennas: a red light at the tip, blinking.
          if (group < -2.5 && group > -3.5) col = mix(body, vec3(1.0, 0.16, 0.12), step(0.9, vLocal.y) * step(0.5, fract(uTime * 0.6 + seed)));
          // Daylight themes: no glow, windows tinted rather than lit.
          vec3 day = mix(body * 1.08, vTone, clamp((pane * lit * 0.35 + roof * 0.3 + wave * 0.4 + focus * pane * 0.4) * uGlow, 0.0, 1.0));
          day = mix(day, skyRef, pane * (1.0 - lit) * 0.25);
          col = mix(col, day, uLight);
          gl_FragColor = vec4(finish(col, vWorld), 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  const buildings = new InstancedMesh(box, buildingMat, lots.length);
  const toneAttr = new InstancedBufferAttribute(new Float32Array(lots.length * 3), 3);
  const infoAttr = new InstancedBufferAttribute(new Float32Array(lots.length * 3), 3);
  const sizeAttr = new InstancedBufferAttribute(new Float32Array(lots.length * 3), 3);
  const m = new Matrix4();
  const q = new Quaternion();
  lots.forEach((l, i) => {
    m.compose(new Vector3(l.x, l.y, l.z), q, new Vector3(l.w, l.h, l.d));
    buildings.setMatrixAt(i, m);
    infoAttr.setXYZ(i, l.seed, l.group, l.tone);
    sizeAttr.setXYZ(i, l.h, l.w, l.d);
  });
  box.setAttribute("aTone", toneAttr);
  box.setAttribute("aInfo", infoAttr);
  box.setAttribute("aSize", sizeAttr);
  buildings.frustumCulled = false;
  scene.add(buildings);

  // ---------- Signs ----------
  const anisotropy = gl.capabilities.getMaxAnisotropy();
  type Sign = { mesh: Mesh<PlaneGeometry, MeshBasicMaterial>; stop: number; tone: number | "accent"; lines: string[]; panel: boolean; district?: number };
  const signs: Sign[] = [];
  const sign = (lines: string[], o: { w: number; h: number; pos: [number, number, number]; rotY?: number; panel?: boolean; stop: number; tone?: number | "accent"; district?: number; double?: boolean }) => {
    const panel = o.panel ?? false;
    const material = keep(new MeshBasicMaterial({ map: textTexture(lines, o.w / o.h, panel, anisotropy), transparent: true, depthWrite: false, toneMapped: false }));
    const geometry = keep(new PlaneGeometry(o.w, o.h));
    for (const back of o.double ? [0, 1] : [0]) {
      const mesh = new Mesh(geometry, material);
      mesh.position.set(...o.pos);
      mesh.rotation.y = (o.rotY ?? 0) + back * Math.PI;
      mesh.renderOrder = 2;
      scene.add(mesh);
      if (!back) signs.push({ mesh, stop: o.stop, tone: o.tone ?? "accent", lines, panel, district: o.district });
    }
  };
  towers.forEach((t) => {
    const y = t.h - 1.6;
    sign([t.name], { w: 5.1, h: 1.7, pos: [t.x, y, t.z + 2.56], panel: true, stop: 2 });
    sign([t.name], { w: 5.1, h: 1.7, pos: [t.x + 2.56, y, t.z], rotY: Math.PI / 2, panel: true, stop: 2 });
    sign([t.fact], { w: 5.1, h: 1.1, pos: [t.x + 2.56, t.h * 0.55, t.z], rotY: Math.PI / 2, panel: true, stop: 2 });
  });
  gates.forEach((g) => sign([g.title, g.line], { w: 8.6, h: 2.4, pos: [AVENUE_X, 11.6, g.z + 0.2], panel: true, stop: 3 }));
  boards.forEach((b) => sign(b.lines, { w: b.w, h: b.h, pos: [b.x, b.y, b.z], rotY: b.rotY, panel: true, stop: b.stop, tone: b.tone, district: b.district, double: true }));
  // Redraw once the sign font has loaded.
  document.fonts?.ready.then(() =>
    signs.forEach((s) => {
      const { width, height } = s.mesh.geometry.parameters;
      s.mesh.material.map?.dispose();
      s.mesh.material.map = textTexture(s.lines, width / height, s.panel, anisotropy);
      s.mesh.material.needsUpdate = true;
    }),
  );

  // ---------- Gates ----------
  const gateMat = keep(new MeshBasicMaterial({ toneMapped: false }));
  const post = keep(new BoxGeometry(0.35, 10, 0.35));
  const lintel = keep(new BoxGeometry(9, 0.35, 0.35));
  gates.forEach((g) => {
    const frame = new Group();
    for (const x of [-4.5, 4.5]) {
      const p = new Mesh(post, gateMat);
      p.position.set(x, 5, 0);
      frame.add(p);
    }
    const top = new Mesh(lintel, gateMat);
    top.position.y = 10;
    frame.add(top);
    frame.position.set(AVENUE_X, 0, g.z);
    scene.add(frame);
  });

  // ---------- Ground: roads with traffic and street lamps, pavements, plazas, the river ----------
  const plazas = districts.map((d) => `vec2(${d.x.toFixed(1)}, ${d.z.toFixed(1)})`).join(", ");
  const groundMat = keep(
    new ShaderMaterial({
      uniforms: shared,
      vertexShader: /* glsl */ `varying vec3 vWorld; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        ${header}
        varying vec3 vWorld;
        float h1(float n) { return fract(sin(n * 91.7) * 43758.5453); }
        const vec2 plazas[4] = vec2[4](${plazas});
        // Cars along one road: headlights in one lane, tail lights in the other.
        vec3 cars(float along, float across, float id) {
          float s = h1(id);
          float lane = 1.0 - smoothstep(0.25, 0.5, abs(abs(across) - 1.3));
          float dir = sign(across);
          float c = fract(along * 0.05 - uTime * (0.08 + s * 0.06) * dir + s * 7.0 + step(0.0, across) * 0.37);
          float car = smoothstep(0.0, 0.01, c) * (1.0 - smoothstep(0.03, 0.06, c));
          vec3 head = vec3(1.0, 0.95, 0.85), tail = vec3(1.0, 0.18, 0.12);
          return mix(tail, head, step(0.0, dir)) * car * lane;
        }
        void main() {
          vec2 q = (vWorld.xz + vec2(84.0, 170.0)) / 30.0;
          vec2 id = floor(q + 0.5);
          vec2 sd = (fract(q - 0.5) - 0.5) * 30.0; // signed distance to the nearest road's centre line
          vec2 ad = abs(sd);
          float road = 1.0 - smoothstep(3.3, 3.5, min(ad.x, ad.y));
          float kerb = (1.0 - smoothstep(0.0, 0.15, abs(min(ad.x, ad.y) - 3.5)));
          float pavement = (1.0 - road) * (1.0 - smoothstep(4.6, 4.8, min(ad.x, ad.y)));
          float dash = (1.0 - smoothstep(0.06, 0.12, ad.x)) * step(0.5, fract(vWorld.z * 0.25)) * step(3.6, ad.y)
                     + (1.0 - smoothstep(0.06, 0.12, ad.y)) * step(0.5, fract(vWorld.x * 0.25)) * step(3.6, ad.x);
          vec3 traffic = (ad.x < 3.3 ? cars(vWorld.z, sd.x, id.x) : vec3(0.0)) + (ad.y < 3.3 ? cars(vWorld.x, -sd.y, id.y + 31.0) : vec3(0.0));
          // Street lamps along the pavements: warm pools of light.
          float lampX = exp(-(pow(ad.x - 4.0, 2.0) + pow(mod(vWorld.z, 12.0) - 6.0, 2.0)) / 6.0);
          float lampZ = exp(-(pow(ad.y - 4.0, 2.0) + pow(mod(vWorld.x, 12.0) - 6.0, 2.0)) / 6.0);
          float lamps = max(lampX, lampZ);
          float ave = 1.0 - smoothstep(0.0, 0.2, abs(abs(vWorld.x - ${AVENUE_X.toFixed(1)}) - 3.0));
          float ring = 0.0;
          for (int i = 0; i < 4; i++) {
            float on = uDistrict < 0.0 ? 0.5 : (abs(float(i) - uDistrict) < 0.5 ? 1.0 : 0.2);
            ring += (1.0 - smoothstep(0.0, 0.25, abs(length(vWorld.xz - plazas[i]) - ${(PLAZA - 1.5).toFixed(1)}))) * on;
          }
          vec3 asphalt = uBg * mix(0.85, 0.9, uLight);
          vec3 stone = mix(uBg, uBody, mix(0.35, 0.5, uLight));
          vec3 col = mix(stone, asphalt, road);
          col = mix(col, mix(uBg, uBody, 0.6), pavement * 0.35);
          col += vec3(0.5) * dash * road * mix(0.12, 0.25, uLight) * (1.0 - uLight * 2.0);
          col += uLine * kerb * 0.25;
          vec3 warm = vec3(1.0, 0.86, 0.66);
          col += warm * lamps * 0.05 * (1.0 - uLight);
          col += traffic * uTraffic * (1.0 - uLight * 0.7);
          col += uLine * (ave * 0.5 + waveAt(vWorld.xz, 3.0) * 0.8 + ring * 0.9);
          // The river: dark water with the city's light shimmering on it.
          float rd = abs(vWorld.x - (-68.0 + 9.0 * sin(vWorld.z * 0.03)));
          float water = 1.0 - smoothstep(5.2, 5.8, rd);
          float bank = (1.0 - smoothstep(0.0, 0.3, abs(rd - 5.5))) * 0.7;
          float phase = vWorld.z * 0.9 + uTime * 1.1 + sin(vWorld.x * 0.7 + vWorld.z * 0.13 + uTime * 0.5) * 1.6;
          float ripple = pow(0.5 + 0.5 * sin(phase), 8.0) * (1.0 - smoothstep(0.4, 1.2, fwidth(phase)));
          float glint = ripple * (0.3 + 0.7 * hash(floor(vWorld.xz * vec2(0.5, 0.2))));
          vec3 river = uBg * mix(0.6, 0.94, uLight) + (uLine + warm * 0.15) * glint * 0.9 + uLine * bank;
          col = mix(col, river, max(water, bank));
          gl_FragColor = vec4(finish(col, vWorld), 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  const ground = new Mesh(keep(new PlaneGeometry(900, 900)), groundMat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // ---------- Sky: dark overhead, a glow along the horizon ----------
  const sky = new Mesh(
    keep(new SphereGeometry(900, 32, 16)),
    keep(
      new ShaderMaterial({
        uniforms: shared,
        side: BackSide,
        depthWrite: false,
        vertexShader: /* glsl */ `varying vec3 vDir; void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          ${header}
          varying vec3 vDir;
          void main() {
            float y = vDir.y;
            vec3 glow = mix(uBg, uAccent, mix(0.09, 0.06, uLight));
            vec3 col = mix(glow, uBg, smoothstep(0.0, 0.22, y));
            col = mix(col, uBg, smoothstep(0.0, -0.05, y));
            gl_FragColor = vec4(mix(col, uBg, uDim), 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    ),
  );
  sky.renderOrder = -1;
  scene.add(sky);

  // Camera route as two curves, one key per point; a page position maps to a point between keys.
  const posCurve = new CatmullRomCurve3(keys.map((k) => new Vector3(...k[1])), false, "centripetal");
  const lookCurve = new CatmullRomCurve3(keys.map((k) => new Vector3(...k[2])), false, "centripetal");
  const routeAt = (p: number) => {
    let i = 0;
    while (i < keys.length - 2 && p >= keys[i + 1][0]) i++;
    const f = Math.min(Math.max((p - keys[i][0]) / (keys[i + 1][0] - keys[i][0]), 0), 1);
    // A flight from one section to the next lifts over the rooftops.
    const flight = Math.floor(keys[i][0]) !== Math.floor(keys[i + 1][0]) ? Math.sin(Math.PI * f) : 0;
    return { u: (i + f) / (keys.length - 1), flight };
  };
  const look = new Vector3();
  let section = 0;
  let turn = -1;
  let light = false;
  const gateColor = new Color();

  return {
    scene,
    camera,
    setPalette(p: ScenePalette, isLight: boolean) {
      light = isLight;
      const c = (hex: string) => new Color(hex);
      const bg = c(p.bg);
      const tones = [c(p.agents), c(p.systems), c(p.data), c(p.cloud)];
      shared.uBg.value.copy(bg);
      shared.uAccent.value.set(p.accent);
      shared.uLight.value = isLight ? 1 : 0;
      shared.uBody.value.copy(bg).lerp(isLight ? c("#a8a08a") : c("#3e3f4a"), isLight ? 0.6 : 0.38);
      shared.uLine.value.set(p.accent).multiplyScalar(isLight ? 0.25 : 0.35);
      shared.uFog.value = isLight ? 0.0065 : 0.0085;
      (scene.fog as FogExp2).color.copy(bg);
      (scene.fog as FogExp2).density = shared.uFog.value;
      lots.forEach((l, i) => {
        const tone = l.group === 2 ? c(p.accent) : tones[l.tone];
        toneAttr.setXYZ(i, tone.r, tone.g, tone.b);
      });
      toneAttr.needsUpdate = true;
      gateColor.set(p.accent);
      signs.forEach((s) => s.mesh.material.color.copy(s.tone === "accent" ? c(p.accent2) : tones[s.tone]));
    },
    update(o: { time: number; journey: CityJourney; pointer: { x: number; y: number }; width: number; height: number; wide: boolean }) {
      const { time: t, journey } = o;
      const p = journey.travel;
      const { u, flight } = routeAt(p);
      posCurve.getPoint(u, camera.position);
      lookCurve.getPoint(u, look);
      camera.position.y += flight * 14;
      camera.position.x += o.pointer.x * 1.6;
      camera.position.y += o.pointer.y * 0.8;
      camera.lookAt(look);
      camera.fov = 46 + Math.min(Math.abs(journey.velocity) * 5, 10);
      camera.aspect = o.width / o.height;
      // On wide screens the frame is shifted so each shot's subject lands right of the text.
      const skills = Math.min(Math.max((p - 4.85) * 5, 0), 1) * (1 - Math.min(Math.max((p - 5.9) * 5, 0), 1));
      if (o.wide) camera.setViewOffset(o.width, o.height, -o.width * 0.17 * (1 - skills), 0, o.width, o.height);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
      sky.position.copy(camera.position);

      // Entering a section sends a wave of light out from its subject.
      const now = Math.floor(p + 0.15);
      if (now !== section) {
        section = now;
        const at = [[-6, -46], [-24, -56], [-8, -48], [AVENUE_X, -62], [projectSpot.x, projectSpot.z], [districts[0].x, districts[0].z], [0, -60], [0, -60]][Math.min(now, 7)];
        shared.uWave.value.set(at[0], at[1], 0, t);
        if (now === 4) shared.uArrive.value = t;
      }
      // Skills: the district whose card is being read is the one lit.
      const next = p >= 4.95 && p < 6 ? Math.min(Math.max(Math.round((p - 5.05) / 0.25), 0), 3) : -1;
      if (next !== turn) {
        turn = next;
        if (turn >= 0) shared.uWave.value.set(districts[turn].x, districts[turn].z, 0, t);
      }
      shared.uDistrict.value = turn;
      shared.uTime.value = t;
      shared.uFocus.value = p;
      shared.uGlow.value = 0.9 + 0.25 * flight;
      shared.uTraffic.value = 0.6 + 0.4 * flight;
      // Behind the hero the city is in full view; behind a section's text it recedes, less in flight.
      const reading = Math.min(Math.max((p - 0.45) * 2, 0), 1) * (1 - flight * 0.6);
      shared.uDim.value = reading * (o.wide ? (light ? 0.5 : 0.5) : 0.64);
      gateMat.color.copy(gateColor).lerp(shared.uBg.value, shared.uDim.value * 0.8);
      for (const s of signs) {
        const near = Math.min(Math.max(1 - Math.abs(p - (s.stop + 0.45)) * 1.3, 0), 1);
        const lit = s.district !== undefined && turn >= 0 ? (s.district === turn ? 1 : 0.55) : 1;
        s.mesh.material.opacity = (0.3 + 0.7 * near) * lit * (1 - shared.uDim.value * 0.5);
      }
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
      signs.forEach((s) => s.mesh.material.map?.dispose());
      buildings.dispose();
    },
  };
}

/** The city, drawn first each frame; the rest of the canvas's scene (the hero object) goes on top. */
export default function City({ journey, palette, light, wide }: { journey: MutableRefObject<CityJourney>; palette: ScenePalette; light: boolean; wide: boolean }) {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const city = useMemo(() => buildCity(gl), [gl]);
  useEffect(() => () => city.dispose(), [city]);
  useEffect(() => {
    city.setPalette(palette, light);
    invalidate();
  }, [city, palette, light, invalidate]);
  // Priority 1: this frame callback renders, so it runs after every other one has moved things.
  useFrame((state) => {
    const { width, height } = state.size;
    city.update({ time: state.clock.elapsedTime, journey: journey.current, pointer: state.pointer, width, height, wide });
    gl.autoClear = false;
    gl.clear();
    gl.render(city.scene, city.camera);
    gl.clearDepth();
    gl.render(state.scene, state.camera);
  }, 1);
  return null;
}
