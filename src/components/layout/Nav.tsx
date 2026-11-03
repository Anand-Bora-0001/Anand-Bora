import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { sections, site } from "@/content/site";
import { useScrollSpy } from "@/lib/hooks";

const ids = sections.map((s) => s.id);
const none: string[] = [];

/** Fixed top navigation. On the home page links are in-page anchors with scroll-spy. */
export default function Nav({ home = false }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(home ? ids : none);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label={`${site.name}, home`} onClick={() => setOpen(false)}>
          <span className="nav-mark" aria-hidden="true">
            ab<i>.</i>
          </span>
          <span className="nav-name">{site.name}</span>
        </Link>
        <nav className="nav-links" id="site-menu" aria-label="Main">
          <ul>
            {sections.map((s, i) => (
              <li key={s.id}>
                {home ? (
                  <a
                    href={`#${s.id}`}
                    className={active === s.id ? "is-active" : ""}
                    aria-current={active === s.id ? "location" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className="nav-index">{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                  </a>
                ) : (
                  <Link to={`/#${s.id}`} onClick={() => setOpen(false)}>
                    <span className="nav-index">{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <ThemeSwitcher />
          <a className="nav-resume" href={site.resume} target="_blank" rel="noreferrer">
            <FileText size={15} aria-hidden="true" /> Resume
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
