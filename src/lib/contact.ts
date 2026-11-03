import { site } from "@/content/site";

export interface ContactDraft {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function createContactDraft(draft: ContactDraft): string {
  const subject = encodeURIComponent(`Portfolio: ${draft.subject}`);
  const body = encodeURIComponent(`Hi Anand,\n\n${draft.message}\n\n${draft.name}\n${draft.email}`);
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}
