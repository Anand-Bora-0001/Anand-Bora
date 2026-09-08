import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getProjectBySlug } from "@/data/projects";
import { profile } from "@/data/profile";
export default function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const project = pathname.startsWith("/projects/")
      ? getProjectBySlug(pathname.split("/")[2])
      : undefined;
    const page =
      project?.title ??
      (pathname === "/projects"
        ? "Selected projects"
        : pathname === "/about"
          ? "About Anand"
          : "AI Engineer at Flid AI");
    const description =
      project?.description ??
      "Anand Bora, AI Engineer at Flid AI in Pune. Building agent architectures, reliable backend systems, and data workflows with Go, DuckDB, and Python.";
    document.title = `${page} | Anand Bora`;
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ])
      document.querySelector(selector)?.setAttribute("content", description);
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ])
      document.querySelector(selector)?.setAttribute("content", document.title);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", profile.url + pathname);
    for (const selector of [
      'meta[property="og:url"]',
      'meta[name="twitter:url"]',
    ])
      document
        .querySelector(selector)
        ?.setAttribute("content", profile.url + pathname);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let observer: MutationObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (hash) {
      const scroll = () => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
          observer?.disconnect();
          return true;
        }
        return false;
      };
      if (!scroll()) {
        observer = new MutationObserver(scroll);
        observer.observe(document.getElementById("root")!, {
          childList: true,
          subtree: true,
        });
        timer = setTimeout(() => observer?.disconnect(), 5000);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    return () => {
      observer?.disconnect();
      clearTimeout(timer);
    };
  }, [pathname, hash]);
  return null;
}
