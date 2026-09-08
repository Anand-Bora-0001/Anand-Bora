import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
