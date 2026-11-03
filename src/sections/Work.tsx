import SectionTitle from "@/components/ui/SectionTitle";
import Showcase from "@/components/work/Showcase";
import { caseStudies } from "@/content/work";

export default function Work() {
  return (
    <section className="section" aria-labelledby="work-title" id="work">
      <SectionTitle
        id="work-title"
        index={1}
        label="Now building"
        lede="At Flid AI I build two products end to end: the agents, the data underneath, and the interface people use every day."
      >
        Selected <span className="accent">work</span>
      </SectionTitle>
      <div className="showcase-list">
        {caseStudies.map((study, i) => (
          <Showcase key={study.slug} study={study} index={i} />
        ))}
      </div>
    </section>
  );
}
