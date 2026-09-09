import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  WebGLRenderer,
  WireframeGeometry,
} from "three";

/** A decorative scene: no pointer capture, external textures, or animation while hidden. */
export function createBackgroundScene(
  canvas: HTMLCanvasElement,
  onFailure: () => void,
) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 60);
  camera.position.z = 12;
  const world = new Group();
  scene.add(world);
  const colors = ["#a78bfa", "#50cddb", "#ebac6e"];
  const source = new IcosahedronGeometry(0.8, 0);
  const crystal = new WireframeGeometry(source);
  source.dispose();
  const ring = new TorusGeometry(1.1, 0.012, 5, 64);
  const bodies = Array.from({ length: 12 }, (_, i) => {
    const material =
      i % 3 === 0
        ? new MeshBasicMaterial({
            color: colors[i % 3],
            transparent: true,
            opacity: 0.32,
            depthWrite: false,
          })
        : new LineBasicMaterial({
            color: colors[i % 3],
            transparent: true,
            opacity: 0.24,
            depthWrite: false,
          });
    const body =
      i % 3 === 0
        ? new Mesh(ring, material as MeshBasicMaterial)
        : new LineSegments(crystal, material as LineBasicMaterial);
    const scale = 0.55 + (i % 4) * 0.28;
    body.scale.setScalar(scale);
    body.rotation.set(i * 0.7, i * 1.1, i * 0.3);
    world.add(body);
    return { body, material, phase: i * 2.39996, lane: (i % 4) / 3 };
  });
  const positions: number[] = [];
  const shades: number[] = [];
  // Deterministic distribution keeps the scene stable through resize and route changes.
  let seed = 241;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 180; i++) {
    positions.push(
      (random() - 0.5) * 36,
      (random() - 0.5) * 26,
      -random() * 14,
    );
    const color = new Color(colors[i % 3]);
    shades.push(color.r, color.g, color.b);
  }
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(positions, 3),
  );
  dustGeometry.setAttribute("color", new Float32BufferAttribute(shades, 3));
  const dustMaterial = new PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });
  const dust = new Points(dustGeometry, dustMaterial);
  world.add(dust);
  let frame = 0;
  let running = false;
  let disposed = false;
  let elapsed = 0;
  let previous = 0;
  let pointerX = 0;
  let pointerY = 0;
  let scroll = 0;
  let width = 1;
  let height = 1;
  const draw = () => {
    const span = Math.max(4, camera.aspect * 7);
    bodies.forEach(({ body, phase, lane }, i) => {
      body.position.set(
        (lane * 2 - 1) * span + Math.sin(elapsed * 0.12 + phase) * 1.6,
        ((i * 3.7 + elapsed * (0.17 + (i % 3) * 0.035)) % 22) - 11,
        -2 - (i % 3) * 2.4,
      );
      body.rotation.x = phase + elapsed * 0.045;
      body.rotation.y = phase * 0.7 + elapsed * 0.065;
    });
    world.rotation.y += (pointerX * 0.075 - world.rotation.y) * 0.035;
    world.rotation.x +=
      (pointerY * 0.045 + scroll * 0.06 - world.rotation.x) * 0.035;
    dust.rotation.z = elapsed * 0.008;
    renderer.render(scene, camera);
  };
  const tick = (now: number) => {
    if (!running || disposed) return;
    frame = requestAnimationFrame(tick);
    // Cap the decorative renderer at 30fps, independent of display refresh rate.
    if (now - previous < 1000 / 30) return;
    elapsed += Math.min((now - previous) / 1000, 0.07);
    previous = now;
    draw();
  };
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, width < 768 ? 1 : 1.25),
    );
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    draw();
  };
  const pointer = (event: PointerEvent) => {
    if (!running || event.pointerType !== "mouse") return;
    pointerX = (event.clientX / width) * 2 - 1;
    pointerY = (event.clientY / height) * 2 - 1;
  };
  const onScroll = () => {
    if (running)
      scroll =
        window.scrollY /
        Math.max(document.documentElement.scrollHeight - height, 1);
  };
  const lost = () => {
    running = false;
    cancelAnimationFrame(frame);
    onFailure();
  };
  canvas.addEventListener("webglcontextlost", lost);
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", pointer, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  resize();
  return {
    setRunning(next: boolean) {
      if (disposed || running === next) return;
      running = next;
      cancelAnimationFrame(frame);
      if (running) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    },
    dispose() {
      disposed = true;
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("webglcontextlost", lost);
      crystal.dispose();
      ring.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      bodies.forEach(({ material }) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
