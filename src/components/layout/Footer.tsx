import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-mark" aria-hidden="true">
          {site.name}
          <span>.</span>
        </p>
        <div className="footer-meta">
          <p>
            Designed and built by {site.name} in {site.location.split(",")[0]}. Set in Bricolage
            Grotesque and Inter; made with React and Three.js.
          </p>
          <p>© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
