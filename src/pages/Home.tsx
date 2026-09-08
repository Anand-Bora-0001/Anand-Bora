import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Linkedin,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import { getFeaturedProjects } from "@/data/projects";
import SystemsAtlas from "@/components/SystemsAtlas";
import profileImg from "@/assets/profile.jpg";

export default function Home() {
  return (
    <Layout>
      <section className="hero-section atlas-hero section-container">
        <div className="hero-topline">
          <span className="eyebrow">ANAND BORA / THE SYSTEMS EDITION</span>
          <span className="location-label">
            <MapPin size={14} /> Pune, India
          </span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <a
              className="current-role"
              href="https://flid.ai/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="status-dot" /> Currently building at Flid AI{" "}
              <ArrowUpRight size={14} />
            </a>
            <h1>
              A little curious.
              <br />
              <span className="text-gradient">A lot of</span>
              <br />
              <span className="hero-building">
                building<span className="accent-period">.</span>
              </span>
            </h1>
            <p className="hero-intro">
              I'm Anand, an AI Engineer connecting{" "}
              <strong>agents, data, and the systems between them.</strong> I
              like making the complicated feel surprisingly simple.
            </p>
            <p className="hero-stack">
              <span>Go</span>
              <span>DuckDB</span>
              <span>Python</span>
              <span>Distributed systems</span>
            </p>
            <div className="hero-actions">
              <Button asChild variant="hero" size="lg">
                <Link to="/projects">
                  Explore my work <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#contact">Let's talk</a>
              </Button>
            </div>
            <div className="hero-socials">
              <a
                href="https://github.com/Anand-Bora-0001"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={17} /> GitHub <ArrowUpRight size={13} />
              </a>
              <a
                href="https://www.linkedin.com/in/anand-bora/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={17} /> LinkedIn <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <SystemsAtlas />
        </div>
        <div className="hero-signature">
          <img src={profileImg} alt="Anand Bora" width="48" height="48" />
          <div>
            <span>The human behind the systems.</span>
            <Link to="/about">
              Meet Anand <ArrowUpRight size={13} />
            </Link>
          </div>
          <span className="signature-line" />
          <span className="signature-note">
            Pune, India
            <br />
            Always a work in progress.
          </span>
        </div>
        <a href="#selected-work" className="scroll-cue">
          <ArrowDown size={16} /> SCROLL TO EXPLORE THE WORK
        </a>
      </section>

      <section
        id="selected-work"
        className="section-space border-t border-border"
      >
        <div className="section-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / SELECTED WORK</p>
              <h2>
                Proof of curiosity<span className="accent-period">.</span>
              </h2>
            </div>
            <Link to="/projects" className="text-link">
              All projects <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="selected-projects-grid">
            {getFeaturedProjects()
              .slice(0, 4)
              .map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                />
              ))}
          </div>
        </div>
      </section>

      <section className="section-space engineering-section">
        <div className="section-container engineering-grid">
          <div>
            <p className="eyebrow">02 / HOW I THINK</p>
            <h2>
              Beyond the model.
              <br />
              Into the system.
            </h2>
            <p className="section-copy">
              The interesting part is making everything work together. Clear
              APIs. Useful tools. Data you can trust. Enough visibility to
              understand what happened when something goes wrong.
            </p>
            <Link to="/about" className="text-link">
              A little more about me <ArrowUpRight size={18} />
            </Link>
          </div>
          <div
            className="system-map"
            role="img"
            aria-label="Engineering focus: a request enters an API, reaches an agent, uses tools and data, and produces an observable result."
          >
            <div className="system-map-heading">
              <span className="status-dot" /> FROM INTENT TO INSIGHT
            </div>
            <div className="system-row">
              <span>Request</span>
              <i />
              <span>API</span>
              <i />
              <span className="system-agent">Agent</span>
            </div>
            <div className="system-branch">
              <span>Tools</span>
              <span>Data</span>
              <span>Context</span>
            </div>
            <div className="system-result">
              <span className="status-dot" /> Observable, useful outcomes
            </div>
            <p>Design the flow. Understand the failure modes.</p>
          </div>
        </div>
      </section>
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </Layout>
  );
}
