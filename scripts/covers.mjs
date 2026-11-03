/*
  Renders a 16:10 cover for every project without a real screenshot.

  Each project has a spec in scripts/cover-specs/<slug>.json, researched from its repository:
    - "dashboard": the app's real name, navigation, metric names, chart, panel and table columns.
    - "terminal":  a command-line app's real menu, prompts and output.
  Values in them are sample data. A project without a spec falls back to a generic dashboard for
  its area, using its features and stack. Charts are seeded from the slug so covers are stable.

    npm run covers                     # every project whose image is /projects/covers/<slug>.jpg
    node scripts/covers.mjs rent-a-bike

  Needs a Chromium binary (CHROMIUM_PATH, default /usr/bin/chromium) and network for Google Fonts.
*/
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as Icons from "lucide-react";
import { chromium } from "playwright-core";
import { load, root } from "./load.mjs";

const { projects } = load("src/content/projects.ts");

const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const icon = (name, size = 16, color = "currentColor") =>
  renderToStaticMarkup(createElement(Icons[name], { size, strokeWidth: 1.8, color }));
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/** Small deterministic PRNG so covers don't change between runs. */
function rng(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const series = (rand, n, base = 0.5, swing = 0.35) => {
  let v = base;
  return Array.from({ length: n }, () => (v = Math.min(0.95, Math.max(0.08, v + (rand() - 0.47) * swing))));
};

/* ---------- Charts (SVG) ---------- */
const gridLines = (w, h) =>
  [0.25, 0.5, 0.75].map((g) => `<line x1="0" x2="${w}" y1="${h * g}" y2="${h * g}" stroke="#ffffff" stroke-opacity=".06"/>`).join("");
const path = (values, w, h) => {
  const step = w / (values.length - 1);
  return values.map((v, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${(h - v * h).toFixed(1)}`).join(" ");
};
const area = (values, w, h, tone, id) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${tone}" stop-opacity=".35"/><stop offset="1" stop-color="${tone}" stop-opacity="0"/></linearGradient></defs>
    ${gridLines(w, h)}
    <path d="${path(values, w, h)} L${w},${h} L0,${h} Z" fill="url(#${id})"/><path d="${path(values, w, h)}" fill="none" stroke="${tone}" stroke-width="2.2"/>
  </svg>`;
const lines = (sets, w, h, colors) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${gridLines(w, h)}
    ${sets.map((vals, k) => `<path d="${path(vals, w, h)}" fill="none" stroke="${colors[k]}" stroke-width="2" stroke-opacity="${k ? 0.7 : 1}"/>`).join("")}
  </svg>`;
const bars = (values, w, h, tone, highlight = -1, stacked) => {
  const bw = w / values.length;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${values
      .map((v, i) => {
        const x = i * bw + bw * 0.18;
        const bh = v * h * 0.8;
        const top = stacked ? `<rect x="${x}" y="${h - bh - stacked[i] * h * 0.2 - 2}" width="${bw * 0.64}" height="${stacked[i] * h * 0.2}" rx="2" fill="${tone}" opacity=".3"/>` : "";
        return `<rect x="${x}" y="${h - bh}" width="${bw * 0.64}" height="${bh}" rx="3" fill="${tone}" opacity="${i === highlight ? 1 : 0.6}"/>${top}`;
      })
      .join("")}
  </svg>`;
};
const spark = (values, tone) => `<svg width="84" height="28"><path d="${path(values, 84, 28)}" fill="none" stroke="${tone}" stroke-width="1.8"/></svg>`;
const ring = (pct, tone, size = 92, label = "") => {
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  return `<div class="ring"><svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="#ffffff14" stroke-width="8" fill="none"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${tone}" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="${(c * pct) / 100} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>
    <b>${pct}%</b><small>${escape(label)}</small></div>`;
};
const badge = (text, kind) => `<span class="badge ${kind}">${escape(text)}</span>`;
const card = (title, body) => `<section class="card"><h3>${title}</h3>${body}</section>`;
const meter = (label, value, pct, tone, mono = false) =>
  `<div class="stage"><span class="${mono ? "mono" : ""}">${label}</span><div class="track"><i style="width:${pct}%;background:${tone}"></i></div><b>${value}</b></div>`;

/* ---------- One dashboard type per project area ---------- */
const kinds = {
  "Applied AI": {
    tone: "#c6f135",
    nav: [["LayoutDashboard", "Overview"], ["MessageSquare", "Assistant"], ["Sparkles", "Insights"], ["Database", "Datasets"], ["Settings", "Settings"]],
    kpis: (r) => [["Requests today", `${(8 + r() * 9).toFixed(1)}k`, "+12%"], ["Avg. latency", `${Math.round(600 + r() * 500)} ms`, "-8%"], ["Answer accuracy", `${(91 + r() * 7).toFixed(1)}%`, "+2.1%"], ["Active users", Math.round(700 + r() * 1200).toLocaleString("en"), "+5%"]],
    rows: ["Document parsing", "Semantic matching", "Insight generation", "Feedback summary", "Batch evaluation"],
    main: (p, r, t) => card(`Model requests <i>· last 30 days</i>`, area(series(r, 30, 0.45), 560, 190, t, "a")),
    side: (p, r, t) =>
      card(
        "Assistant",
        `<div class="chat"><p class="q">${escape(clip(`What can ${p.title} do for me?`, 52))}</p>
         <p class="a"><span>${icon("Sparkles", 13, t)} AI</span>${escape(clip(p.description, 120))}</p>
         <div class="input">Ask anything… ${icon("ArrowUp", 14)}</div></div>`,
      ),
  },
  Data: {
    tone: "#ffc65c",
    nav: [["Workflow", "Pipelines"], ["Activity", "Streams"], ["Warehouse", "Warehouse"], ["ShieldCheck", "Quality"], ["Bell", "Alerts"]],
    kpis: (r) => [["Events / sec", `${(20 + r() * 40).toFixed(1)}k`, "+9%"], ["Consumer lag", `${(0.4 + r() * 2).toFixed(1)} s`, "-31%"], ["Jobs succeeded", `${(98 + r() * 1.9).toFixed(1)}%`, "+0.4%"], ["Stored", `${(6 + r() * 30).toFixed(1)} TB`, "+3%"]],
    rows: ["orders_stream → bronze", "bronze → silver (dedupe)", "silver → gold aggregates", "reverse ETL → CRM", "quality checks"],
    main: (p, r, t) => card(`Throughput <i>· events per minute</i>`, bars(series(r, 24, 0.55, 0.3), 560, 190, t, 17, series(r, 24, 0.5))),
    side: (p, r, t) =>
      card("Pipeline stages", ["Ingest", "Transform", "Validate", "Serve"].map((s) => { const v = Math.round(72 + r() * 27); return meter(s, `${v}%`, v, t); }).join("")),
  },
  "Cloud & DevOps": {
    tone: "#7cc8ff",
    nav: [["LayoutDashboard", "Overview"], ["Server", "Services"], ["LineChart", "Metrics"], ["ScrollText", "Logs"], ["Bell", "Alerts"]],
    kpis: (r) => [["Uptime", `${(99.9 + r() * 0.09).toFixed(2)}%`, "+0.02%"], ["p95 latency", `${Math.round(120 + r() * 120)} ms`, "-14%"], ["Error rate", `${(0.1 + r() * 0.4).toFixed(2)}%`, "-0.1%"], ["Active alerts", `${1 + Math.floor(r() * 5)}`, "-2"]],
    rows: ["api-gateway", "auth-service", "metrics-collector", "notification-worker", "billing-service"],
    main: (p, r, t) => card(`Latency <i>· p50 / p95 / p99</i>`, lines([series(r, 40, 0.3, 0.12), series(r, 40, 0.5, 0.18), series(r, 40, 0.72, 0.22)], 560, 190, [t, "#b9a8ff", "#ffc65c"])),
    side: (p, r) =>
      card(
        "Service health",
        `<div class="grid">${Array.from({ length: 24 }, () => { const x = r(); return `<i class="${x > 0.93 ? "bad" : x > 0.82 ? "warn" : "ok"}"></i>`; }).join("")}</div>
         <div class="legend"><span><i class="ok"></i>Healthy</span><span><i class="warn"></i>Degraded</span><span><i class="bad"></i>Down</span></div>`,
      ),
  },
  Security: {
    tone: "#ff7d8e",
    nav: [["ShieldAlert", "Threats"], ["Radar", "Sensors"], ["Siren", "Incidents"], ["Globe", "Intel"], ["FileText", "Reports"]],
    kpis: (r) => [["Attacks blocked", Math.round(1500 + r() * 3000).toLocaleString("en"), "+18%"], ["Critical", `${Math.round(4 + r() * 14)}`, "-3"], ["Time to detect", `${(2 + r() * 4).toFixed(1)} min`, "-22%"], ["Sensors online", "24 / 24", "100%"]],
    rows: ["SSH brute force", "SQL injection probe", "Port scan sweep", "Credential stuffing", "Malware beacon"],
    main: (p, r, t) => card(`Attack volume <i>· by hour</i>`, bars(series(r, 24, 0.45, 0.45), 560, 190, t, 14)),
    side: (p, r, t) => card("Severity mix", `<div class="rings">${ring(Math.round(12 + r() * 12), t, 92, "Critical")}${ring(Math.round(30 + r() * 15), "#ffc65c", 92, "High")}${ring(Math.round(40 + r() * 20), "#7cc8ff", 92, "Low")}</div>`),
  },
  Backend: {
    tone: "#b9a8ff",
    nav: [["LayoutDashboard", "Dashboard"], ["Package", "Orders"], ["Boxes", "Catalog"], ["Users", "Customers"], ["Plug", "API"]],
    kpis: (r) => [["Requests", `${(0.6 + r() * 1.8).toFixed(1)}M`, "+7%"], ["p99 latency", `${Math.round(140 + r() * 160)} ms`, "-9%"], ["Records", Math.round(900 + r() * 4000).toLocaleString("en"), "+4%"], ["Uptime", `${(99.5 + r() * 0.49).toFixed(2)}%`, "+0.1%"]],
    rows: ["GET /api/items", "POST /api/orders", "GET /api/users/:id", "PUT /api/bookings", "DELETE /api/sessions"],
    main: (p, r, t) => card(`API traffic <i>· requests per minute</i>`, area(series(r, 36, 0.5, 0.25), 560, 190, t, "b")),
    side: (p, r, t) =>
      card("Slowest endpoints", ["/search", "/orders", "/auth/login", "/reports"].map((e) => { const v = Math.round(60 + r() * 240); return meter(e, `${v} ms`, v / 3.2, t, true); }).join("")),
  },
  "Web & tools": {
    tone: "#5fe3c8",
    nav: [["Home", "Home"], ["Table", "Records"], ["BarChart3", "Reports"], ["Users", "Users"], ["Settings", "Settings"]],
    kpis: (r) => [["Total records", Math.round(300 + r() * 3000).toLocaleString("en"), "+11%"], ["Completed", `${Math.round(70 + r() * 28)}%`, "+6%"], ["This week", `${Math.round(20 + r() * 200)}`, "+14%"], ["Avg. time", `${(1 + r() * 4).toFixed(1)} min`, "-12%"]],
    rows: ["New entry created", "Report exported", "Record updated", "Reminder sent", "Batch completed"],
    main: (p, r, t) => card(`Activity <i>· last 14 days</i>`, bars(series(r, 14, 0.55, 0.35), 560, 190, t, 11)),
    side: (p, r, t) => card("Progress", `<div class="rings solo">${ring(Math.round(62 + r() * 34), t, 140, "complete")}</div>`),
  },
};


/* ---------- Researched specs ---------- */
const specFor = (slug) => {
  const file = resolve(root, "scripts/cover-specs", `${slug}.json`);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
};

/** Picks a nav icon from the words in a label. */
const navIcons = [
  [/log ?in|sign ?in|sign ?up|register/i, "LogIn"], [/dash|home|overview|summary/i, "LayoutDashboard"], [/student|user|people|customer|member|voter|passenger|team/i, "Users"],
  [/report|export|document/i, "FileText"], [/setting|config|admin|profile/i, "Settings"], [/alert|incident|notif/i, "Bell"],
  [/\blogs?\b|audit|history|activity/i, "ScrollText"], [/search|discover|explore|catalog/i, "Search"], [/train|rail/i, "TrainFront"],
  [/ticket|book|reserv/i, "Ticket"], [/order|cart|checkout/i, "Package"], [/product|inventory|stock|item/i, "Boxes"],
  [/file|folder|storage|upload/i, "Folder"], [/vote|election|ballot|candidate/i, "Vote"], [/certif|template|award/i, "Award"],
  [/pipeline|workflow|process|bpmn|job/i, "Workflow"], [/data|dataset|table|lineage|quality/i, "Database"],
  [/model|ml|predict|train|experiment/i, "Brain"], [/threat|attack|honeypot|security|sensor|ids/i, "ShieldAlert"],
  [/map|geo|route|transport|vehicle/i, "Map"], [/analytic|metric|chart|insight|monitor/i, "BarChart3"],
  [/feedback|chat|message|ask|review|resume/i, "MessageSquare"], [/pay|invoice|bill|ledger|rent/i, "Receipt"],
  [/service|server|cloud|cluster|infra/i, "Server"], [/identity|auth|access|role|iam/i, "KeyRound"],
];
const navIcon = (label) => navIcons.find(([re]) => re.test(label))?.[1] ?? "Circle";

const statusKinds = [
  [/^(active|approved|success|succeeded|completed|complete|done|shipped|delivered|confirmed|verified|valid|healthy|resolved|passed|online|present|available|paid|published|closed|ok|returned)$/i, "ok"],
  [/^(pending|queued|processing|in progress|running|open|review|scheduled|warning|medium|on leave|booked|draft|absent)$/i, "warn"],
  [/^(failed|error|blocked|critical|high|rejected|invalid|revoked|denied|down|cancelled|overdue|malicious|expired)$/i, "bad"],
  [/^(low|info|new|info only)$/i, "info"],
];
const cell = (text) => {
  const kind = statusKinds.find(([re]) => re.test(String(text).trim().replace(/\s*\(\d+\)$/, "")))?.[1];
  return kind ? badge(text, kind) : escape(clip(String(text), 40));
};

function specView(project, spec, r, t) {
  const chartBody = {
    area: () => area(series(r, 30, 0.45), 560, 190, t, "s"),
    bars: () => bars(series(r, 20, 0.55, 0.35), 560, 190, t, 15),
    lines: () => lines([series(r, 40, 0.3, 0.12), series(r, 40, 0.5, 0.18), series(r, 40, 0.72, 0.22)], 560, 190, [t, "#b9a8ff", "#ffc65c"]),
  }[spec.chart.type ?? "area"]();
  const items = spec.panel.items ?? [];
  const pct = (it, i) => Math.max(4, Math.min(100, Number.isFinite(it.pct) ? it.pct : [82, 64, 47, 30][i] ?? 50));
  const panelBody = {
    meters: () => items.map((it, i) => meter(escape(clip(it.label, 17)), escape(it.value ?? `${pct(it, i)}%`), pct(it, i), t)).join(""),
    rings: () => `<div class="rings">${items.slice(0, 3).map((it, i) => ring(pct(it, i), [t, "#ffc65c", "#7cc8ff"][i], 92, clip(it.label, 14))).join("")}</div>`,
    chat: () => `<div class="chat">${items.map((it) => (/user|q/i.test(it.label) ? `<p class="q">${escape(clip(it.value, 70))}</p>` : `<p class="a"><span>${icon("Sparkles", 13, t)} ${escape(spec.appName)}</span>${escape(clip(it.value, 120))}</p>`)).join("")}<div class="input">Ask anything… ${icon("ArrowUp", 14)}</div></div>`,
    list: () => `<ul class="plist">${items.map((it, i) => `<li><i style="background:${[t, "#7cc8ff", "#ffc65c", "#b9a8ff"][i % 4]}"></i><span>${escape(clip(it.label, 22))}</span><b>${escape(it.value ?? "")}</b></li>`).join("")}</ul>`,
    grid: () => `<div class="grid">${Array.from({ length: 24 }, () => { const x = r(); return `<i class="${x > 0.93 ? "bad" : x > 0.82 ? "warn" : "ok"}"></i>`; }).join("")}</div>
      <div class="legend">${items.slice(0, 3).map((it, i) => `<span><i class="${["ok", "warn", "bad"][i]}"></i>${escape(clip(it.label, 14))}</span>`).join("")}</div>`,
  }[spec.panel.type ?? "list"]();
  const cols = spec.table.columns;
  return {
    brand: spec.appName,
    title: spec.pageTitle,
    nav: spec.nav.slice(0, 5).map((label) => [navIcon(label), label]),
    kpis: spec.kpis.slice(0, 4).map((k) => [k.label, k.value, k.delta]),
    main: card(`${escape(spec.chart.title)} <i>· ${escape(spec.chart.subtitle ?? "")}</i>`, chartBody),
    side: card(escape(spec.panel.title), panelBody),
    table: card(
      escape(spec.table.title),
      `<table><thead><tr>${cols.map((c) => `<th>${escape(c)}</th>`).join("")}</tr></thead><tbody>
        ${spec.table.rows.slice(0, 5).map((row) => `<tr>${row.slice(0, cols.length).map((c) => `<td>${cell(c)}</td>`).join("")}</tr>`).join("")}
      </tbody></table>`,
    ),
  };
}

function templateView(project, r, t) {
  const kind = kinds[project.group];
  const rows = (project.features?.length ? project.features : kind.rows).slice(0, 5);
  // Feature rows read as shipped capabilities; activity rows as recent events.
  const statuses = project.features?.length
    ? [["Shipped", "ok"], ["Shipped", "ok"], ["Shipped", "ok"], ["In progress", "info"], ["Shipped", "ok"]]
    : [["Done", "ok"], ["Running", "info"], ["Done", "ok"], ["Queued", "warn"], ["Done", "ok"]];
  return {
    brand: project.title,
    title: project.title,
    nav: kind.nav,
    kpis: kind.kpis(r),
    main: kind.main(project, r, t),
    side: kind.side(project, r, t),
    table: card(
      project.features?.length ? "Capabilities" : "Recent activity",
      `<table><thead><tr><th>Name</th><th>Status</th><th>Updated</th></tr></thead><tbody>
        ${rows.map((row, i) => `<tr><td>${escape(clip(row, 64))}</td><td>${badge(...statuses[i])}</td><td class="muted">${[2, 9, 14, 31, 48][i]} min ago</td></tr>`).join("")}
      </tbody></table>`,
    ),
  };
}

/** A command-line app: its real session in a terminal window. */
function terminalPage(project, spec, t) {
  const tone = (line) => {
    if (/^\s*\$ /.test(line)) return "cmd";
    if (/^\s*#\s/.test(line)) return "note";
    if (/^\s*(>|>>>|sqlite>)\s/.test(line)) return "input";
    if (/^\s*(=|-|\*|#|╔|║|╚|─|━){3,}/.test(line) || /^\s*[=*#-]+.*[=*#-]+\s*$/.test(line)) return "rule";
    if (/(error|invalid|failed|not found|denied|wrong)/i.test(line)) return "bad";
    if (/(success|added|saved|created|correct|congrat|you win|✓|done|sent|updated|verified)/i.test(line)) return "ok";
    if (/^\s*(enter|would you|choose|select|guess|please|do you|what|how many|press)\b/i.test(line) || /\?\s*(\(.*\))?:?\s*\S*$/.test(line)) return "prompt";
    if (/^\s*\d+[.)]\s/.test(line)) return "menu";
    return "";
  };
  const lines = spec.terminal.lines.slice(0, 22);
  // Show the run command once: either the session already starts with it, or prepend it.
  const session = lines.some((l) => /^\s*\$ /.test(l)) ? lines : [`$ ${spec.terminal.title}`, ...lines];
  // Shrink the type so every line fits the window (568px of text area).
  const size = Math.min(17, Math.floor(568 / (session.length * 1.62)));
  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&family=JetBrains+Mono:wght@400;500;700&display=block">
  <style>
    * { margin: 0; box-sizing: border-box; }
    body { width: 1280px; height: 800px; overflow: hidden; background: #09090b; font-family: Inter, sans-serif; position: relative; }
    .grid { position: absolute; inset: 0; background-image: linear-gradient(rgb(250 250 249 / .04) 1px, transparent 1px), linear-gradient(90deg, rgb(250 250 249 / .04) 1px, transparent 1px); background-size: 64px 64px; }
    .glow { position: absolute; inset: 0; background: radial-gradient(50% 60% at 80% 0%, ${t}2e, transparent 70%), radial-gradient(40% 50% at 0% 100%, ${t}14, transparent 70%); }
    .win { position: absolute; left: 110px; top: 70px; width: 1060px; height: 660px; border-radius: 16px; background: #0f0f13f2; border: 1px solid #2a2a31; box-shadow: 0 60px 120px -40px #000, 0 0 0 1px #ffffff08 inset; overflow: hidden; }
    .bar { height: 44px; display: flex; align-items: center; gap: 8px; padding: 0 18px; background: #16161b; border-bottom: 1px solid #23232b; }
    .bar i { width: 12px; height: 12px; border-radius: 50%; background: #3d3d46; }
    .bar i:nth-child(1) { background: #ff6b6b; } .bar i:nth-child(2) { background: #ffc65c; } .bar i:nth-child(3) { background: #5fe3c8; }
    .bar span { margin-left: 14px; font: 500 14px "JetBrains Mono", monospace; color: #8b8b95; }
    .bar b { margin-left: auto; font: 600 12px Inter, sans-serif; color: ${t}; padding: 3px 10px; border-radius: 99px; background: ${t}1a; }
    pre { padding: 24px 28px; font: 400 ${size}px/1.62 "JetBrains Mono", monospace; color: #d4d4d8; white-space: pre; }
    .cmd { color: #fafaf9; font-weight: 700; } .cmd::before { content: ""; }
    .rule { color: ${t}; font-weight: 500; } .prompt { color: ${t}; } .menu { color: #e7e7ea; }
    .ok { color: #5fe3c8; } .bad { color: #ff7d8e; } .note { color: #6b6b75; } .input { color: #fafaf9; font-weight: 500; }
    .caret { display: inline-block; width: 10px; height: 20px; background: ${t}; vertical-align: -3px; }
  </style></head><body>
    <div class="grid"></div><div class="glow"></div>
    <div class="win">
      <div class="bar"><i></i><i></i><i></i><span>${escape(spec.terminal.title)}</span><b>${escape(project.title)}</b></div>
      <pre>${session.map((l) => `<span class="${tone(l)}">${escape(clip(l, 76))}</span>`).join("\n")} <span class="caret"></span></pre>
    </div>
  </body></html>`;
}

function page(project) {
  const t = kinds[project.group].tone;
  const r = rng(project.slug);
  const spec = specFor(project.slug);
  if (spec?.kind === "terminal") return terminalPage(project, spec, t);
  const view = spec ? specView(project, spec, r, t) : templateView(project, r, t);
  const initials = view.brand.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=block">
  <style>
    * { margin: 0; box-sizing: border-box; }
    body { width: 1280px; height: 800px; overflow: hidden; background: #0a0a0d; color: #e7e7ea; font: 14px/1.4 Inter, sans-serif; display: flex; }
    i { font-style: normal; }
    .side { width: 224px; flex: none; background: #0e0e12; border-right: 1px solid #1f1f26; padding: 22px 16px; display: flex; flex-direction: column; gap: 26px; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; min-width: 0; }
    .logo { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: ${t}; color: #09090b; font-weight: 700; font-size: 13px; flex: none; }
    .brand b { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    nav { display: grid; gap: 4px; }
    nav a { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; color: #8b8b95; font-weight: 500; }
    nav a.on { background: ${t}1f; color: ${t}; }
    .side-foot { margin-top: auto; display: flex; flex-wrap: wrap; gap: 6px; }
    .side-foot span { padding: 3px 8px; border-radius: 6px; background: #17171d; border: 1px solid #23232b; color: #a9a9b3; font: 500 11px "JetBrains Mono", monospace; }
    main { flex: 1; padding: 22px 28px; display: flex; flex-direction: column; gap: 18px; min-width: 0; }
    .top { display: flex; align-items: center; gap: 14px; }
    .top h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .live { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: ${t}1a; color: ${t}; font-size: 12px; font-weight: 600; flex: none; }
    .live::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: ${t}; }
    .search { margin-left: auto; width: 230px; flex: none; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 9px; background: #14141a; border: 1px solid #23232b; color: #6b6b75; font-size: 13px; }
    .avatar { width: 34px; height: 34px; border-radius: 50%; flex: none; background: linear-gradient(135deg, ${t}, #7cc8ff); }
    .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .kpi { background: #131318; border: 1px solid #1f1f26; border-radius: 14px; padding: 14px 16px; display: grid; grid-template-columns: 1fr auto; gap: 4px 8px; align-items: end; }
    .kpi small { grid-column: 1 / -1; color: #8b8b95; font-size: 12px; font-weight: 500; }
    .kpi b { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; white-space: nowrap; }
    .kpi em { font-style: normal; font-size: 12px; font-weight: 600; color: ${t}; grid-column: 1; }
    .kpi svg { grid-column: 2; grid-row: 2 / 4; }
    .row { display: grid; grid-template-columns: 600px 1fr; gap: 14px; height: 258px; }
    .row .card { overflow: hidden; }
    .card { background: #131318; border: 1px solid #1f1f26; border-radius: 14px; padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
    .card h3 { font-size: 14px; font-weight: 600; }
    .card h3 i { color: #6b6b75; font-weight: 500; }
    .chat { display: flex; flex-direction: column; gap: 10px; font-size: 13px; }
    .chat .q { align-self: flex-end; max-width: 88%; background: ${t}; color: #09090b; padding: 8px 12px; border-radius: 12px 12px 3px 12px; font-weight: 500; }
    .chat .a { background: #1a1a21; padding: 10px 12px; border-radius: 12px 12px 12px 3px; color: #d4d4d8; display: grid; gap: 4px; }
    .chat .a span { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: ${t}; }
    .chat .input { display: flex; justify-content: space-between; align-items: center; padding: 9px 12px; border-radius: 10px; border: 1px solid #23232b; color: #6b6b75; }
    .stage { display: grid; grid-template-columns: 128px 1fr 56px; align-items: center; gap: 10px; font-size: 13px; color: #a9a9b3; margin-top: 6px; }
    .stage span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .stage b { text-align: right; color: #e7e7ea; font-weight: 600; font-size: 12px; }
    .mono { font: 500 12px "JetBrains Mono", monospace; }
    .track { height: 8px; border-radius: 99px; background: #ffffff10; overflow: hidden; }
    .track i { display: block; height: 100%; border-radius: inherit; }
    .grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 7px; }
    .grid i, .legend i { display: block; aspect-ratio: 1; border-radius: 6px; background: #5fe3c8; opacity: .85; }
    .grid i.warn, .legend i.warn { background: #ffc65c; }
    .grid i.bad, .legend i.bad { background: #ff7d8e; }
    .legend { display: flex; gap: 14px; font-size: 12px; color: #8b8b95; }
    .legend span { display: flex; align-items: center; gap: 6px; }
    .legend i { width: 10px; border-radius: 3px; }
    .rings { display: flex; justify-content: space-around; align-items: center; flex: 1; }
    .ring { position: relative; display: grid; justify-items: center; }
    .ring b { position: absolute; top: 0; height: var(--s, 92px); display: grid; place-items: center; font-size: 18px; font-weight: 700; }
    .ring small { color: #8b8b95; font-size: 12px; margin-top: 6px; }
    .solo .ring { --s: 140px; }
    .solo .ring b { font-size: 28px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; color: #6b6b75; font-weight: 500; font-size: 12px; padding: 0 0 8px; border-bottom: 1px solid #1f1f26; }
    td { padding: 9px 0; border-bottom: 1px solid #1a1a20; color: #d4d4d8; white-space: nowrap; }
    td:first-child { max-width: 560px; overflow: hidden; text-overflow: ellipsis; padding-right: 20px; }
    td.muted { color: #8b8b95; }
    .badge { padding: 2px 9px; border-radius: 99px; font-size: 11px; font-weight: 600; }
    .badge.ok { background: #5fe3c81f; color: #5fe3c8; }
    .badge.info { background: #7cc8ff1f; color: #7cc8ff; }
    .badge.warn { background: #ffc65c1f; color: #ffc65c; }
    .badge.bad { background: #ff7d8e1f; color: #ff7d8e; }
    .plist { list-style: none; padding: 0; display: grid; gap: 12px; margin-top: 4px; }
    .plist li { display: grid; grid-template-columns: 10px 1fr auto; align-items: center; gap: 10px; font-size: 13px; color: #a9a9b3; padding-bottom: 10px; border-bottom: 1px solid #1a1a20; }
    .plist li i { width: 10px; height: 10px; border-radius: 3px; }
    .plist li b { color: #e7e7ea; font-weight: 600; }
  </style></head><body>
    <aside class="side">
      <div class="brand"><span class="logo">${escape(initials)}</span><b>${escape(view.brand)}</b></div>
      <nav>${view.nav.map(([ic, label], i) => `<a class="${i === 0 ? "on" : ""}">${icon(ic)}${label}</a>`).join("")}</nav>
      <div class="side-foot">${project.techStack.slice(0, 4).map((s) => `<span>${escape(s)}</span>`).join("")}</div>
    </aside>
    <main>
      <header class="top"><h1>${escape(view.title)}</h1><span class="live">Sample data</span>
        <div class="search">${icon("Search", 14)} Search…</div><div class="avatar"></div></header>
      <div class="kpis">${view.kpis.map(([label, value, delta]) => `<div class="kpi"><small>${escape(label)}</small><b>${escape(value)}</b><em>${escape(delta)}</em>${spark(series(r, 12, 0.5, 0.4), t)}</div>`).join("")}</div>
      <div class="row">${view.main}${view.side}</div>
      ${view.table}
    </main>
  </body></html>`;
}

const only = process.argv.slice(2);
const targets = projects.filter((p) => (only.length ? only.includes(p.slug) : p.image?.startsWith("/projects/covers/")));
const outDir = resolve(root, "public/projects/covers");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium" });
const tab = await browser.newPage({ viewport: { width: 1280, height: 800 } });
for (const project of targets) {
  await tab.setContent(page(project), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: resolve(outDir, `${project.slug}.jpg`), type: "jpeg", quality: 88 });
  console.log(`cover: ${project.slug}`);
}
await browser.close();
