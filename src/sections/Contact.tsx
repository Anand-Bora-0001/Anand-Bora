import { ArrowUpRight } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import SocialIcon from "@/components/ui/SocialIcon";
import { site, socials } from "@/content/site";

export default function Contact() {
  return (
    <section className="section contact" aria-labelledby="contact-title" id="contact">
      <p className="section-label" data-reveal>
        <span>06</span> Contact
      </p>
      <h2 id="contact-title" className="contact-heading" data-reveal>
        Let's build something <span className="accent">useful.</span>
      </h2>
      <div className="contact-grid">
        <div className="contact-info" data-reveal>
          <p className="section-lede">
            Open to conversations about AI products, agent tooling, data systems and open source. The
            fastest way to reach me is email.
          </p>
          <a className="contact-email" href={`mailto:${site.email}`}>
            {site.email}
            <ArrowUpRight aria-hidden="true" />
          </a>
          <ul className="contact-socials">
            {socials
              .filter((s) => s.id !== "email")
              .map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    <SocialIcon id={s.id} size={16} /> {s.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
