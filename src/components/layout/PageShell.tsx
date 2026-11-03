import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Background from "./Background";
import ScrollProgress from "./ScrollProgress";
import Footer from "./Footer";
import Nav from "./Nav";

/** Shell for inner pages (case studies, archive, project pages): the shared nav and one column. */
export default function PageShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Background />
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1} className="page-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
