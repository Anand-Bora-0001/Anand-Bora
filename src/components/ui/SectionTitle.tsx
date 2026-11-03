import type { ReactNode } from "react";

/** Section header: a numbered mono label, a large display title, and an optional lede. */
export default function SectionTitle({
  id,
  index,
  label,
  children,
  lede,
}: {
  id: string;
  index: number;
  label: string;
  children: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <header className="section-head" data-reveal>
      <p className="section-label">
        <span>{String(index).padStart(2, "0")}</span> {label}
      </p>
      <h2 id={id} className="section-heading">
        {children}
      </h2>
      {lede && <p className="section-lede">{lede}</p>}
    </header>
  );
}
