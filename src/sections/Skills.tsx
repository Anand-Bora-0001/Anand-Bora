import SkillsGlobe from "@/components/SkillsGlobe";
import SectionTitle from "@/components/ui/SectionTitle";
import Tags from "@/components/ui/Tags";
import { extendedSkills, skillCategories } from "@/content/skills";

export default function Skills() {
  return (
    <section className="section" aria-labelledby="skills-title" id="skills">
      <SectionTitle id="skills-title" index={5} label="Skills">
        The <span className="accent">toolkit</span>
      </SectionTitle>
      <div className="skills">
        <SkillsGlobe />
        <div className="skill-list">
          {skillCategories.map((category) => (
            <article key={category.id} className={`skill tone-${category.id}`} data-reveal>
              <h3>
                <span className="skill-dot" aria-hidden="true" />
                {category.title}
              </h3>
              <p>{category.description}</p>
              <Tags items={category.skills} label={category.title} />
            </article>
          ))}
        </div>
      </div>
      <div className="skill-extra" data-reveal>
        <h3>Also comfortable with</h3>
        <Tags items={extendedSkills} label="Other skills" />
      </div>
    </section>
  );
}
