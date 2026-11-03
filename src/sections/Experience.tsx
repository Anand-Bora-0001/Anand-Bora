import { ArrowUpRight } from "lucide-react";
import ArrowLink from "@/components/ui/ArrowLink";
import SectionTitle from "@/components/ui/SectionTitle";
import Tags from "@/components/ui/Tags";
import { roles } from "@/content/experience";
import { site } from "@/content/site";

export default function Experience() {
  return (
    <section className="section" aria-labelledby="experience-title" id="experience">
      <SectionTitle id="experience-title" index={3} label="Experience">
        Where I've <span className="accent">worked</span>
      </SectionTitle>
      <ol className="timeline">
        {roles.map((role) => (
          <li key={role.title} className={`timeline-item ${role.current ? "is-current" : ""}`} data-reveal>
            <p className="timeline-period">
              {role.period}
              {role.current && <span className="timeline-now">Current</span>}
            </p>
            <div className="timeline-body">
              <h3 className="timeline-title">
                {role.title}{" "}
                {role.href ? (
                  <a href={role.href} target="_blank" rel="noreferrer">
                    @ {role.org} <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ) : (
                  <span>@ {role.org}</span>
                )}
              </h3>
              <p className="timeline-summary">{role.summary}</p>
              {role.points.length > 0 && (
                <ul className="timeline-points">
                  {role.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
              <Tags items={role.tags} />
            </div>
          </li>
        ))}
      </ol>
      <ArrowLink href={site.resume} className="section-more">
        View full resume
      </ArrowLink>
    </section>
  );
}
