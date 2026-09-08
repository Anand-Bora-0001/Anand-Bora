import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { getProjectBySlug, getFeaturedProjects } from "@/data/projects";
export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  if (!project) return <Navigate to="/projects" replace />;
  const sections = [
    ["The problem", project.problem],
    ["The approach", project.approach],
    ["System design", project.systemDesign],
    ["Implementation", project.implementationDetails],
    ["Challenges", project.challenges],
    ["Trade-offs", project.tradeOffs],
    ["Performance considerations", project.performanceOptimizations],
    ["The result", project.outcome],
    ["Next steps", project.futureImprovements],
  ].filter(([, text]) => text);
  const related = getFeaturedProjects()
    .filter((item) => item.slug !== slug)
    .slice(0, 2);
  return (
    <Layout>
      <article className="section-space">
        <div className="section-container">
          <Link to="/projects" className="text-link mb-10">
            <ArrowLeft size={16} />
            Back to work
          </Link>
          <header className="project-detail-header">
            <p className="eyebrow">
              PROJECT NOTES / {project.category.toUpperCase()}
            </p>
            <h1 className="page-title">{project.title}</h1>
            <p className="section-copy">{project.longDescription}</p>
            <div className="flex flex-wrap gap-3 mt-7">
              {project.githubUrl && (
                <Button asChild variant="hero">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    <Github size={17} />
                    Explore the code
                    <ArrowUpRight size={16} />
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button asChild variant="outline">
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    Live demo
                    <ArrowUpRight size={16} />
                  </a>
                </Button>
              )}
            </div>
          </header>
          {project.image && (
            <img
              src={project.image}
              alt={`${project.title} project preview`}
              className="project-detail-image"
              width="1200"
              height="675"
            />
          )}
          <div className="project-detail-grid">
            <div>
              {sections.map(([title, text], index) => (
                <section className="project-story-section" key={title}>
                  <p className="eyebrow">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h2>{title}</h2>
                    <p>{text}</p>
                  </div>
                </section>
              ))}
            </div>
            <aside className="project-sidebar">
              <h2>Under the hood</h2>
              <div className="tag-list">
                {project.techStack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              {project.features && (
                <>
                  <h2>What it brings together</h2>
                  <ul>
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </>
              )}
              <p className="text-sm text-muted-foreground mt-7 leading-relaxed">
                {project.githubUrl
                  ? "The repository is the source of truth for setup, implementation, and current project status."
                  : "This entry documents an earlier project. A public source link is currently unavailable."}
              </p>
            </aside>
          </div>
          <div className="related-projects">
            <p className="eyebrow">KEEP EXPLORING</p>
            {related.map((item) => (
              <Link key={item.slug} to={`/projects/${item.slug}`}>
                <span>{item.title}</span>
                <ArrowUpRight size={22} />
              </Link>
            ))}
          </div>
        </div>
      </article>
    </Layout>
  );
}
