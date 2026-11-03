import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import type { socials } from "@/content/site";

const icons = { github: Github, linkedin: Linkedin, email: Mail, whatsapp: MessageCircle };

export default function SocialIcon({ id, size = 18 }: { id: (typeof socials)[number]["id"]; size?: number }) {
  const Icon = icons[id];
  return <Icon size={size} aria-hidden="true" />;
}
