import { ArrowUp, ArrowUpRight, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { profile } from "@/data/profile";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-container">
        <div className="footer-top">
          <Link to="/" className="brand">
            <span className="brand-monogram">
              ab<span>.</span>
            </span>
            <span className="brand-name">
              Curiosity → code → something useful.
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              <Github size={16} /> GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href={`mailto:${profile.email}`} className="text-link">
              Email <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Anand Bora · Pune, India</p>
          <p>Built with React, TypeScript &amp; a little curiosity.</p>
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "instant"
                  : "smooth",
              })
            }
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
