import ArrowLink from "@/components/ui/ArrowLink";
import ProjectCard from "@/components/ProjectCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { featuredProjects, projects } from "@/content/projects";

export default function Projects() {
  return (
    <section className="section" aria-labelledby="projects-title" id="projects">
      <SectionTitle
        id="projects-title"
        index={4}
        label="Projects"
        lede="Things I've built on my own: applied AI, security, data platforms and the infrastructure between them."
      >
        Side <span className="accent">projects</span>
      </SectionTitle>
      <ul className="pcard-grid">
        {featuredProjects.slice(0, 6).map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
      <ArrowLink href="/projects" className="section-more button-link">
        Browse all {projects.length} projects
      </ArrowLink>
    </section>
  );
}
