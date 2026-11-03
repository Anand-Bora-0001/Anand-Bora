import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { site } from "@/content/site";
import { createContactDraft } from "@/lib/contact";

export default function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
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
    <form className="contact-form" onSubmit={submit}>
      <div className="field-row">
        <label className="field">
          <span>Name</span>
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
      </div>
      <label className="field">
        <span>Subject</span>
        <input name="subject" required maxLength={150} placeholder="A project, a role, an idea…" />
      </label>
      <label className="field">
        <span>Message</span>
        <textarea name="message" required maxLength={4000} rows={4} />
      </label>
      <div className="form-foot">
        <button type="submit" className="button">
          <Send size={16} aria-hidden="true" /> Open email draft
        </button>
        <p className="form-note">Opens your email app with this message; nothing is sent from the site.</p>
      </div>
      {prepared && (
        <p className="form-status" role="status">
          Your email app was asked to open. If it didn't, write to {site.email}.
        </p>
      )}
    </form>
  );
}
