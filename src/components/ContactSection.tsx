import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  MessageCircle,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { profile } from "@/data/profile";
import { createContactDraft } from "@/lib/contact";
export default function ContactSection() {
  const [prepared, setPrepared] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    window.location.href = createContactDraft({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
    });
    setPrepared(true);
  };
  return (
    <section id="contact" className="section-space contact-section">
      <div className="section-container">
        <div className="contact-grid">
          <div>
            <p className="eyebrow">05 / SAY HELLO</p>
            <h2>
              Let's build
              <br />
              <span className="text-gradient">something useful.</span>
            </h2>
            <p className="section-copy">
              An AI product, an interesting systems problem, or an open-source
              collaboration. I'd love to hear what you're working on.
            </p>
            <a href={`mailto:${profile.email}`} className="contact-email">
              {profile.email}
              <ArrowUpRight size={21} />
            </a>
            <p className="contact-location">
              <MapPin size={16} />
              {profile.location}
            </p>
            <div className="contact-socials">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Anand on GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Anand on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={profile.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="Contact Anand on WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="contact-form">
            <h3>A note to Anand</h3>
            <p>
              Opens a draft in your email app. You review and send it there.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Your email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">What's it about?</Label>
              <Input
                id="subject"
                name="subject"
                required
                maxLength={150}
                placeholder="A project, a collaboration, an idea…"
              />
            </div>
            <div>
              <Label htmlFor="message">Your message</Label>
              <Textarea
                id="message"
                name="message"
                required
                maxLength={4000}
                rows={4}
                placeholder="Tell me a little about it."
              />
            </div>
            <Button variant="hero" type="submit" className="w-full h-12">
              <Mail size={17} />
              Open email draft
              <ArrowUpRight size={17} />
            </Button>
            {prepared && (
              <p className="form-status" role="status">
                Your email app was requested. If it didn't open, email{" "}
                {profile.email} directly. Your message is still here.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
