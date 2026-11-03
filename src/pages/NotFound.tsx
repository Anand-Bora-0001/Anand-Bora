import PageShell from "@/components/layout/PageShell";
import ArrowLink from "@/components/ui/ArrowLink";
import { useDocumentTitle } from "@/lib/hooks";

export default function NotFound() {
  useDocumentTitle("Not found — Anand Bora");
  return (
    <PageShell>
      <div className="container-narrow not-found">
        <p className="eyebrow">404</p>
        <h1 className="page-title">
          This page isn't <span className="accent">here</span>.
        </h1>
        <p className="lede">The link may be old, or the page may have moved.</p>
        <ArrowLink href="/">Back to the home page</ArrowLink>
      </div>
    </PageShell>
  );
}
