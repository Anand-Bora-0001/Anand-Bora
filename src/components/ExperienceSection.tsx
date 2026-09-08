import { ArrowUpRight, Briefcase, GraduationCap } from "lucide-react";
import { experiences } from "@/data/profile";
export default function ExperienceSection() {
  return (
    <section id="experience" className="section-space border-t border-border">
      <div className="section-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">04 / THE JOURNEY</p>
            <h2>
              Learning by building<span className="accent-period">.</span>
            </h2>
          </div>
        </div>
        <div className="experience-list">
          {experiences.map((exp) => (
            <article key={exp.organization} className="experience-row">
              <div className="experience-period">
                <Briefcase size={17} />
                <span>{exp.period}</span>
                {exp.current && <span className="status-dot" />}
              </div>
              <div>
                <div className="experience-title">
                  <div>
                    <h3>{exp.title}</h3>
                    {exp.href ? (
                      <a href={exp.href} target="_blank" rel="noreferrer">
                        {exp.organization} <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      <p>{exp.organization}</p>
                    )}
                  </div>
                </div>
                <p className="section-copy">{exp.description}</p>
                <ul className="experience-details">
                  {exp.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <div className="tag-list">
                  {exp.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          <article className="experience-row">
            <div className="experience-period">
              <GraduationCap size={18} />
              <span>2022 — 2026</span>
            </div>
            <div>
              <div className="experience-title">
                <h3>B.E. Computer Engineering</h3>
              </div>
              <p className="section-copy">
                Savitribai Phule Pune University
                <br />
                Genba Sopanrao Moze College of Engineering, Pune
              </p>
              <div className="tag-list">
                <span>CGPA 8.55</span>
                <span>Systems · Databases · Networks</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
