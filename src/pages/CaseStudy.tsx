import { Link, useParams } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import ArrowLink from "@/components/ui/ArrowLink";
import Tags from "@/components/ui/Tags";
import LeapViewVisual from "@/components/work/LeapViewVisual";
import CatalogVisual from "@/components/work/CatalogVisual";
import { caseStudies, getCaseStudy } from "@/content/work";
import { useDocumentTitle, useReveal } from "@/lib/hooks";
import NotFound from "./NotFound";

export default function CaseStudy() {
  const { slug = "" } = useParams();
  const study = getCaseStudy(slug);
  useDocumentTitle(study ? `${study.name} — Anand Bora` : "Not found — Anand Bora");
  useReveal(slug);
  if (!study) return <NotFound />;
  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length];
  return (
    <PageShell>
      <article className={`case-page tone-${study.tone}`}>
        <header className="case-hero container-narrow">
          <p className="eyebrow">{study.kicker}</p>
          <h1 className="page-title">{study.name}</h1>
          <p className="case-page-tagline">{study.tagline}</p>
          <p className="lede">{study.summary}</p>
          <dl className="case-meta">
            <div>
              <dt>Role</dt>
              <dd>{study.role}</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>{study.period}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{study.status}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{study.stack.slice(0, 4).join(", ")}</dd>
            </div>
          </dl>
          {study.links.length > 0 && (
            <div className="link-row">
              {study.links.map((l) => (
                <ArrowLink key={l.href} href={l.href} className="button-link">
                  {l.label}
                </ArrowLink>
              ))}
            </div>
          )}
          {study.note && (
            <p className="case-note">
              <Lock size={14} aria-hidden="true" /> {study.note}
            </p>
          )}
        </header>

        <div className="case-showcase container" data-reveal>
          {study.visual === "leapview" ? <LeapViewVisual large /> : <CatalogVisual large />}
        </div>

        <div className="container-narrow case-content">
          <section className="case-block" data-reveal>
            <h2>The product</h2>
            {study.context.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section className="case-block" data-reveal>
            <h2>How it fits together</h2>
            <ol className="pipeline">
              {study.pipeline.map((stage, i) => (
                <li key={stage.step}>
                  <span className="pipeline-index">{String(i + 1).padStart(2, "0")}</span>
                  <strong>{stage.step}</strong>
                  <span>{stage.detail}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="case-block" data-reveal>
            <h2>What I built</h2>
            <div className="contribution-grid">
              {study.contributions.map((c) => (
                <article key={c.title} className="contribution">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <Tags items={c.tags} />
                </article>
              ))}
            </div>
          </section>

          <section className="case-block case-split" data-reveal>
            <div>
              <h2>By the numbers</h2>
              <dl className="metrics">
                {study.metrics.map((m) => (
                  <div key={m.label}>
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2>Recently shipped</h2>
              <ul className="shipped">
                {study.shipped.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="case-block" data-reveal>
            <h2>Built with</h2>
            <Tags items={study.stack} />
          </section>

          <Link to={`/work/${next.slug}`} className="next-case" data-reveal>
            <span className="eyebrow">Next case study</span>
            <span className="next-case-name">
              {next.name} <ArrowRight size={22} aria-hidden="true" />
            </span>
            <span className="next-case-tagline">{next.tagline}</span>
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
