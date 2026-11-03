import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

/** A text link with an arrow that nudges on hover. External links open in a new tab. */
export default function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const external = isExternal(href);
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const body = (
    <>
      <span>{children}</span>
      <Arrow size={15} aria-hidden="true" className="arrow-link-icon" />
    </>
  );
  return external ? (
    <a
      href={href}
      className={`arrow-link ${className}`}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noreferrer"
    >
      {body}
    </a>
  ) : (
    <Link to={href} className={`arrow-link ${className}`}>
      {body}
    </Link>
  );
}
