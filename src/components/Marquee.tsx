const words = ["AI agents", "MCP", "Go", "Rust", "DuckDB", "Semantic layers", "Tantivy", "TypeScript", "Three.js", "Python", "Open source"];

/** A slow, endless strip of the stack. Decorative: the same skills are listed as text below. */
export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <li key={w}>
          {w}
          <span className="marquee-star">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
