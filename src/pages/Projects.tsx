import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import { projects, getFeaturedProjects } from "@/data/projects";
export default function Projects() {
  const featured = getFeaturedProjects();
  const archive = projects.filter((project) => !project.featured);
  return (
    <Layout>
      <section className="section-space">
        <div className="section-container">
          <div className="projects-intro">
            <div>
              <p className="eyebrow">DIRECTORY / PROJECTS</p>
              <h1 className="page-title">
                Ideas to
                <br />
                <span className="text-gradient">working systems_</span>
              </h1>
            </div>
            <p className="section-copy">
              Applied AI, security, data, and the infrastructure that connects
              them. Explore the problem, the decisions, and the code behind each
              build.
            </p>
          </div>
          <div className="section-heading">
            <h2>Selected work</h2>
            <span className="eyebrow">
              {String(featured.length).padStart(2, "0")} PROJECTS
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-7">
            {featured.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
          <div className="archive-heading">
            <p className="eyebrow">MORE FROM THE WORKBENCH</p>
            <h2>Earlier builds &amp; experiments</h2>
            <p>
              Smaller tools, course projects, and the ideas that came before.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archive.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
