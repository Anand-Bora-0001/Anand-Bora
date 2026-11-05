import { lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Background from "@/components/layout/Background";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import ScrollProgress from "@/components/layout/ScrollProgress";
import Marquee from "@/components/Marquee";
import Scene from "@/components/three/Scene";
import About from "@/sections/About";
import Contact from "@/sections/Contact";
import Experience from "@/sections/Experience";
import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";
import Work from "@/sections/Work";
import { prefersReducedMotion, useDocumentTitle, useReveal } from "@/lib/hooks";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

export default function Home() {
  useDocumentTitle("Anand Bora — Full-Stack Developer at Flid AI");
  useReveal("home");
  const { hash } = useLocation();
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    else window.scrollTo(0, 0);
  }, [hash]);
  return (
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Background />
      {/* The theme's 3D object: fixed behind the page, it follows the visitor from section to section. */}
      <Scene scene={HeroScene} props={{}} className="page-canvas" fallback={<div className="hero-fallback" />} decorative />
      <ScrollProgress />
      <Nav home />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee />
        <div className="container">
          <About />
          <Work />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
