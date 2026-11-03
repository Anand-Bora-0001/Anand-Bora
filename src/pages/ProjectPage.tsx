import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import ArrowLink from "@/components/ui/ArrowLink";
import Tags from "@/components/ui/Tags";
import { getProject, projects } from "@/content/projects";
import { useDocumentTitle, useReveal } from "@/lib/hooks";
import NotFound from "./NotFound";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  useDocumentTitle(project ? `${project.title} — Anand Bora` : "Not found — Anand Bora");
  useReveal(slug);
  if (!project) return <NotFound />;
  const i = projects.indexOf(project);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const story = [
    ["The problem", project.problem],
    ["The approach", project.approach],
    ["The hard part", project.challenges],
    ["The outcome", project.outcome],
    ["System design", project.systemDesign],
    ["Implementation", project.implementationDetails],
    ["Trade-offs", project.tradeOffs],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  return (
    <PageShell>
      <article className="container-narrow project-page">
        <header>
          <p className="eyebrow">
            {project.category} · {project.status === "Working On" ? "In progress" : project.status}
          </p>
          <h1 className="page-title">{project.title}</h1>
          <p className="lede">{project.longDescription}</p>
          <div className="link-row">
            {project.githubUrl && (
              <ArrowLink href={project.githubUrl} className="button-link">
                Source on GitHub
              </ArrowLink>
            )}
            {project.liveUrl && (
              <ArrowLink href={project.liveUrl} className="button-link">
                Live demo
              </ArrowLink>
            )}
          </div>
        </header>
        {project.image && (
          <figure className="project-shot" data-reveal>
            <img src={project.image} alt={`${project.title} interface`} width="1280" height="720" />
          </figure>
        )}
        <div className="project-layout">
          <div className="project-story">
            {project.overview && <p className="lede">{project.overview}</p>}
            {story.map(([title, text]) => (
              <section key={title} data-reveal>
                <h2>{title}</h2>
                <p>{text}</p>
              </section>
            ))}
          </div>
          <aside className="project-aside">
            <h2>Built with</h2>
            <Tags items={project.techStack} />
            {project.features && (
              <>
                <h2>Key features</h2>
                <ul className="bullets">
                  {project.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
        {project.gallery && (
          <section className="project-gallery" aria-labelledby="screens">
            <h2 id="screens">More screens</h2>
            <ul>
              {project.gallery.map((shot) => (
                <li key={shot.src} data-reveal>
                  <a href={shot.src} target="_blank" rel="noreferrer">
                    <img src={shot.src} alt={`${project.title}: ${shot.caption}`} loading="lazy" decoding="async" />
                  </a>
                  <p>{shot.caption}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
        <nav className="pager" aria-label="More projects">
          <Link to={`/projects/${prev.slug}`}>
            <small>
              <ArrowLeft size={14} aria-hidden="true" /> Previous
            </small>
            {prev.title}
          </Link>
          <Link to={`/projects/${next.slug}`} className="is-next">
            <small>
              Next <ArrowRight size={14} aria-hidden="true" />
            </small>
            {next.title}
          </Link>
        </nav>
      </article>
    </PageShell>
  );
}
