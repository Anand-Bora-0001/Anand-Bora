import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import Home from "./pages/Home";
import RouteEffects from "./components/RouteEffects";
import MovingBackground from "./components/MovingBackground";
import CyberCursor from "./components/CyberCursor";
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <Sonner />
          <MovingBackground />
          <CyberCursor />
          <div className="site-content">
            <BrowserRouter>
              <RouteEffects />
              <Suspense
                fallback={
                  <div
                    role="status"
                    className="section-container py-32 text-muted-foreground"
                  >
                    Loading…
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:slug" element={<ProjectDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
