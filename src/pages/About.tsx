import { ArrowUpRight } from "lucide-react";
import Layout from "@/components/Layout";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import profileImg from "@/assets/profile.jpg";
const principles = [
  {
    title: "Understand the system first.",
    text: "Map the data flow, name the service boundaries, and think through the failure modes before reaching for another dependency.",
  },
  {
    title: "Make the repetitive things disappear.",
    text: "Automation is most useful when it removes real work. Attendance workflows, certificate generation, and API integrations taught me to start with the person using the system.",
  },
  {
    title: "Leave a trail for the next engineer.",
    text: "Readable code, observable behavior, and documentation that explains decisions make a system easier to improve long after the first release.",
  },
];
export default function About() {
  return (
    <Layout>
      <section className="section-space">
        <div className="section-container">
          <div className="about-grid">
            <div>
              <p className="eyebrow">A LITTLE ABOUT ME</p>
              <h1 className="page-title">
                Curious about AI.
                <br />
                <span className="text-gradient">
                  Serious about engineering.
                </span>
              </h1>
              <p className="section-copy">
                I'm Anand Bora, an AI Engineer at{" "}
                <a
                  className="text-primary"
                  href="https://flid.ai/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Flid AI
                </a>
                , based in Pune, India. My work sits between applied AI, backend
                engineering, and data systems.
              </p>
              <p className="section-copy">
                Right now, I'm focused on agent architectures, distributed
                systems, and the practical ways Go, DuckDB, and Python fit
                together. I enjoy the questions around the model: how it gets
                context, uses tools, handles failure, and becomes part of a
                useful product.
              </p>
              <p className="section-copy">
                My path started with Python automation and grew into projects in
                cybersecurity, observability, MLOps, and data engineering. That
                variety keeps me curious—and keeps the emphasis on the problem
                rather than any one tool.
              </p>
              <a
                href="/Anand_Bora.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Download resume <ArrowUpRight size={18} />
              </a>
              <p className="text-sm text-muted-foreground mt-3">
                For my current role and focus, see the experience below.
              </p>
            </div>
            <div className="about-portrait">
              <img src={profileImg} alt="Anand Bora" width="768" height="703" />
              <p>Based in Pune. Building with curiosity.</p>
            </div>
          </div>
          <div className="principles-grid">
            {principles.map((principle, index) => (
              <article key={principle.title}>
                <span className="eyebrow">0{index + 1}</span>
                <h2>{principle.title}</h2>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ExperienceSection />
      <ContactSection />
    </Layout>
  );
}
