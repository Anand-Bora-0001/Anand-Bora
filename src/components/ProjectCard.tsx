import { Link } from "react-router-dom";
import { ArrowUpRight, Braces, Database, Shield, Bot } from "lucide-react";
import type { Project } from "@/data/projects";
const icons = [Bot, Shield, Database, Braces];
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const Icon = icons[index % icons.length];
  return (
    <article className={`project-card project-accent-${index % 4}`}>
      <Link to={`/projects/${project.slug}`} className="project-card-link">
        <div className="project-visual">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} project preview`}
              loading="lazy"
              decoding="async"
              width="960"
              height="540"
            />
          ) : (
            <div className="project-typographic">
              <Icon size={38} strokeWidth={1} />
              <span>{project.title}</span>
              <p>{project.techStack.slice(0, 3).join(" / ")}</p>
            </div>
          )}
          <span className="project-number">
            {String(index + 1).padStart(2, "0")} / PROJECT
          </span>
        </div>
        <div className="project-card-content">
          <div className="project-meta">
            <span>{project.category}</span>
            {project.status === "Working On" && <span>In development</span>}
          </div>
          <div className="project-title-row">
            <h3>{project.title}</h3>
            <ArrowUpRight size={24} />
          </div>
          <p className="project-description">{project.description}</p>
          <div className="tag-list">
            {project.techStack.slice(0, 4).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <span className="project-case-link">
            Read the project story <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
    </article>
  );
}
