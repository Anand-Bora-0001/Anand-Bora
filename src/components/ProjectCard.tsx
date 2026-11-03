import type { PointerEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Bot, Boxes, Cloud, Database, Server, Shield } from "lucide-react";
import Tags from "@/components/ui/Tags";
import type { Project, ProjectGroup } from "@/content/projects";
import { prefersReducedMotion } from "@/lib/hooks";

export const groupIcons: Record<ProjectGroup, typeof Bot> = {
  "Applied AI": Bot,
  Data: Database,
  "Cloud & DevOps": Cloud,
  Security: Shield,
  Backend: Server,
  "Web & tools": Boxes,
};

/** Tilts the card toward the pointer and moves a soft glare with it. */
function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
  el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
  el.style.setProperty("--gx", `${x * 100}%`);
  el.style.setProperty("--gy", `${y * 100}%`);
}

function untilt(event: PointerEvent<HTMLElement>) {
  ["--rx", "--ry", "--gx", "--gy"].forEach((p) => event.currentTarget.style.removeProperty(p));
}

/** A project as a 3D-tilting card. The whole card is the link. */
export default function ProjectCard({ project }: { project: Project }) {
  const Icon = groupIcons[project.group];
  return (
    <li className="pcard-wrap" data-reveal>
      <Link to={`/projects/${project.slug}`} className="pcard" onPointerMove={tilt} onPointerLeave={untilt}>
        <div className="pcard-media">
          {project.image ? (
            <img src={project.image} alt="" width="640" height="360" loading="lazy" decoding="async" />
          ) : (
            <span className="pcard-icon" aria-hidden="true">
              <Icon size={44} strokeWidth={1.2} />
            </span>
          )}
        </div>
        <div className="pcard-body">
          <p className="pcard-meta">{project.group}</p>
          <h3 className="pcard-title">
            {project.title}
            <ArrowUpRight size={18} aria-hidden="true" className="pcard-arrow" />
          </h3>
          <p className="pcard-text">{project.description}</p>
          <Tags items={project.techStack.slice(0, 4)} />
        </div>
        <span className="pcard-glare" aria-hidden="true" />
      </Link>
    </li>
  );
}
