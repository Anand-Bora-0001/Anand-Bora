import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ArrowLink from "@/components/ui/ArrowLink";
import Tags from "@/components/ui/Tags";
import LeapViewVisual from "./LeapViewVisual";
import CatalogVisual from "./CatalogVisual";
import type { CaseStudy } from "@/content/work";

/** A full-width product panel on the home page: the story on one side, the live visual on the other. */
export default function Showcase({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <article className={`showcase tone-${study.tone} ${index % 2 ? "is-flipped" : ""}`} data-reveal>
      <div className="showcase-visual">
        {study.visual === "leapview" ? <LeapViewVisual large /> : <CatalogVisual large />}
      </div>
      <div className="showcase-body">
        <p className="showcase-kicker">
          <span className="showcase-index">{String(index + 1).padStart(2, "0")}</span>
          {study.kicker}
          <span className="showcase-status">{study.status}</span>
        </p>
        <h3 className="showcase-name">
          <Link to={`/work/${study.slug}`}>
            {study.name}
            <ArrowRight aria-hidden="true" className="showcase-arrow" />
          </Link>
        </h3>
        <p className="showcase-tagline">{study.tagline}</p>
        <p className="showcase-summary">{study.summary}</p>
        <dl className="showcase-metrics">
          {study.metrics.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
        <Tags items={study.stack} />
        <div className="showcase-links">
          <ArrowLink href={`/work/${study.slug}`} className="button-link">
            Read the case study
          </ArrowLink>
          {study.links.slice(0, 1).map((l) => (
            <ArrowLink key={l.href} href={l.href}>
              {l.label}
            </ArrowLink>
          ))}
        </div>
      </div>
    </article>
  );
}
