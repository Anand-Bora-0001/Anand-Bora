import { Link } from "react-router-dom";
import type { Rich } from "@/content/site";

export default function RichText({ parts }: { parts: Rich }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : part.href.startsWith("/") ? (
          <Link key={i} to={part.href} className="inline-link">
            {part.text}
          </Link>
        ) : (
          <a key={i} href={part.href} className="inline-link" target="_blank" rel="noreferrer">
            {part.text}
          </a>
        ),
      )}
    </>
  );
}
