import { Bot, Braces, Database, Cloud } from "lucide-react";
import { skillCategories, extendedSkills } from "@/data/skills";
const icons = [Bot, Braces, Database, Cloud];
export default function SkillsSection() {
  return (
    <section id="skills" className="section-space">
      <div className="section-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / THE TOOLBOX</p>
            <h2>
              The right tools.
              <br />A clear purpose.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Go, DuckDB, and Python at the center. A broader toolkit for the rest
            of the system.
          </p>
        </div>
        <div className="skills-grid">
          {skillCategories.map((category, index) => {
            const Icon = icons[index];
            return (
              <article
                className={`skill-panel skill-${index}`}
                key={category.title}
              >
                <Icon size={25} strokeWidth={1.5} />
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <div className="tag-list">
                  {category.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
        <details className="extended-skills">
          <summary>
            Also in my toolkit{" "}
            <span>Frontend, ML libraries &amp; developer tools</span>
          </summary>
          <div className="tag-list">
            {extendedSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
