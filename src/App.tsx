import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import { ThemeProvider } from "@/lib/theme";

const CaseStudy = lazy(() => import("@/pages/CaseStudy"));
const Archive = lazy(() => import("@/pages/Archive"));
const ProjectPage = lazy(() => import("@/pages/ProjectPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="page-loading" role="status">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/projects" element={<Archive />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="/about" element={<Navigate to="/#about" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
