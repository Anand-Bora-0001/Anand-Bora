import { createServer } from "vite";
process.env.NODE_ENV = "development";
const { default: React } = await import("react");
const { renderToString } = await import("react-dom/server");
const { MemoryRouter } = await import("react-router-dom");
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  mode: "production",
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const { default: Atlas } = await server.ssrLoadModule(
    "/src/components/SystemsAtlas.tsx",
  );
  const html = renderToString(
    React.createElement(MemoryRouter, null, React.createElement(Atlas)),
  );
  if (
    !html.includes("atlas-poster") ||
    !html.includes("See it in practice") ||
    !html.includes('role="tab"')
  )
    throw new Error("2D fallback or accessible navigation missing");
  console.log(
    "Initial atlas renders its 2D fallback and accessible project navigation without WebGL.",
  );
} finally {
  await server.close();
}

