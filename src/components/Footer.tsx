import { Github, Linkedin, Mail } from 'lucide-react';

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/Anand-Bora-0001',
    label: 'GitHub',
    external: true,
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/anand-bora/',
    label: 'LinkedIn',
    external: true,
  },
  {
    icon: Mail,
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=anandbora241@gmail.com',
    label: 'Email',
    external: true,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <p className="text-sm text-muted-foreground text-center md:text-left">
            Built with intention. Designed for clarity.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Anand Bora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
