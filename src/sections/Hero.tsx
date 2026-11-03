import { lazy } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Scene from "@/components/three/Scene";
import SocialIcon from "@/components/ui/SocialIcon";
import { site, socials } from "@/content/site";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Scene scene={HeroScene} props={{}} className="hero-canvas" fallback={<div className="hero-fallback" />} decorative />
      <div className="hero-inner">
        <p className="hero-status">
          <span className="live-dot" aria-hidden="true" />
          {site.status}
        </p>
        <h1 id="hero-title" className="hero-title">
          <span className="hero-line">
            <span>Anand</span>
          </span>
          <span className="hero-line">
            <span className="hero-accent">Bora</span>
          </span>
        </h1>
        <p className="hero-role">
          {site.role} at{" "}
          <a href={site.companyUrl} target="_blank" rel="noreferrer">
            {site.company} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <span className="hero-sep" aria-hidden="true" />
          {site.location}
        </p>
        <p className="hero-lede">
          I build AI agents and the data systems they stand on. Right now that's{" "}
          <Link to="/work/leapview">LeapView</Link>, open-source BI, and{" "}
          <Link to="/work/alloy-catalog">Alloy Catalog</Link>, a searchable 3D catalog for CAD.
        </p>
        <div className="hero-actions">
          <a className="button" href="#work">
            See the work <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a className="button-ghost" href="#contact">
            Get in touch
          </a>
        </div>
      </div>
      <div className="hero-foot">
        <ul className="hero-socials" aria-label="Elsewhere">
          {socials.map((s) => (
            <li key={s.id}>
              <a href={s.href} target={s.id === "email" ? undefined : "_blank"} rel="noreferrer" aria-label={s.label} title={s.label}>
                <SocialIcon id={s.id} size={18} />
              </a>
            </li>
          ))}
        </ul>
        <a className="hero-scroll" href="#work">
          <span>Scroll</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
