import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Github, Search } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { projectGroups, projects, type ProjectGroup } from "@/content/projects";
import { useDocumentTitle } from "@/lib/hooks";

export default function Archive() {
  useDocumentTitle("Project archive — Anand Bora");
  const [params, setParams] = useSearchParams();
  const group = projectGroups.find((g) => g === params.get("group")) ?? null;
  const [query, setQuery] = useState("");
  const setGroup = (next: ProjectGroup | null) => setParams(next ? { group: next } : {}, { replace: true });
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (!group || p.group === group) &&
        (!q || [p.title, p.description, p.category, ...p.techStack].some((s) => s.toLowerCase().includes(q))),
    );
  }, [group, query]);
  return (
    <PageShell>
      <div className="container-narrow">
        <header className="archive-head">
          <p className="eyebrow">Archive</p>
          <h1 className="page-title">All projects</h1>
          <p className="lede">
            {projects.length} things I've built, from first Python scripts to data platforms.
          </p>
        </header>
        <div className="filters">
          <div className="chips" role="group" aria-label="Filter by area">
            <button type="button" className="chip" aria-pressed={!group} onClick={() => setGroup(null)}>
              All
            </button>
            {projectGroups.map((g) => (
              <button
                key={g}
                type="button"
                className="chip"
                aria-pressed={group === g}
                onClick={() => setGroup(group === g ? null : g)}
              >
                {g}
              </button>
            ))}
          </div>
          <label className="search">
            <Search size={15} aria-hidden="true" />
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or technology"
            />
          </label>
        </div>
        <table className="archive">
          <caption className="sr-only">Projects, filtered: {rows.length} shown</caption>
          <thead>
            <tr>
              <th scope="col">Project</th>
              <th scope="col" className="hide-sm">
                Area
              </th>
              <th scope="col" className="hide-md">
                Built with
              </th>
              <th scope="col" className="hide-sm">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.slug}>
                <th scope="row">
                  <Link to={`/projects/${p.slug}`} className="archive-link">
                    {p.title} <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                  <span className="archive-desc">{p.description}</span>
                </th>
                <td className="hide-sm">{p.group}</td>
                <td className="hide-md">
                  <span className="archive-stack">{p.techStack.slice(0, 4).join(" · ")}</span>
                </td>
                <td className="hide-sm">
                  {p.githubUrl ? (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" aria-label={`${p.title} on GitHub`}>
                      <Github size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="muted">Private</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="empty">
            Nothing matches that.{" "}
            <button
              type="button"
              className="inline-button"
              onClick={() => {
                setQuery("");
                setGroup(null);
              }}
            >
              Clear filters
            </button>
          </p>
        )}
      </div>
    </PageShell>
  );
}
