import RichText from "@/components/ui/RichText";
import SectionTitle from "@/components/ui/SectionTitle";
import { about, site, stats } from "@/content/site";

export default function About() {
  return (
    <section className="section" aria-labelledby="about-title" id="about">
      <SectionTitle id="about-title" index={2} label="About">
        Engineer at the seam of <span className="accent">AI</span> and data.
      </SectionTitle>
      <div className="about">
        <figure className="about-photo" data-reveal>
          <img src={site.photo} alt="Anand Bora" width="768" height="703" />
          <figcaption>
            <span className="live-dot" aria-hidden="true" /> {site.location}
          </figcaption>
        </figure>
        <div className="about-text" data-reveal>
          {about.map((paragraph, i) => (
            <p key={i}>
              <RichText parts={paragraph} />
            </p>
          ))}
        </div>
      </div>
      <dl className="stats" data-reveal>
        {stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
