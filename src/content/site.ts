export const site = {
  name: "Anand Bora",
  role: "Full-Stack Developer",
  company: "Flid AI",
  companyUrl: "https://flid.ai/",
  location: "Pune, India",
  email: "anandbora241@gmail.com",
  photo: "/profile.jpg",
  resume: "/Anand_Bora.pdf",
  url: "https://anand-bora.vercel.app",
  tagline: "I build AI agents and the data systems they stand on.",
  status: "Building LeapView & Alloy Catalog",
};

export const socials = [
  { id: "github", label: "GitHub", href: "https://github.com/Anand-Bora-0001" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/anand-bora/" },
  { id: "email", label: "Email", href: `mailto:${site.email}` },
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/917821025663" },
] as const;

/** Home page sections, in order. The nav and scroll-spy read this. */
export const sections = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

/** Inline text with optional links: plain strings, or { text, href } for a link. */
export type Rich = (string | { text: string; href: string })[];

export const about: Rich[] = [
  [
    "I'm a full-stack developer at ",
    { text: "Flid AI", href: "https://flid.ai/" },
    " in Pune. I work where applied AI, backend engineering, and data systems meet: how an agent gets context and uses tools, how data moves through a system, and how to make the whole thing dependable and easy to understand.",
  ],
  [
    "Today I'm building two products. ",
    { text: "LeapView", href: "/work/leapview" },
    " is open-source business intelligence: metrics defined in Git, explored in dashboards, APIs and AI chat, all under governed access. ",
    { text: "Alloy Catalog", href: "/work/alloy-catalog" },
    " turns engineering CAD files into a searchable catalog of parts and assemblies, with an agent you can ask and 3D views of what you find.",
  ],
  [
    "My path started with Python automation and grew through cybersecurity, observability, MLOps, and data engineering. The variety keeps me curious, and keeps the emphasis on the problem rather than any one tool.",
  ],
];

/** Headline numbers for the About section. */
export const stats = [
  { value: "135+", label: "PRs merged into LeapView" },
  { value: "2", label: "products in use at Flid AI" },
  { value: "28", label: "projects built and shipped" },
  { value: "8.55", label: "CGPA, B.E. Computer Eng." },
];

export const facts = [
  { label: "Role", value: "Full-Stack Developer, Flid AI" },
  { label: "Based in", value: "Pune, India" },
  { label: "Education", value: "B.E. Computer Eng. · CGPA 8.55" },
  { label: "Core stack", value: "Go · Rust · DuckDB · Python · TypeScript" },
];

export const principles = [
  {
    title: "Understand the system first",
    text: "Map the data flow, name the boundaries, and think through failure modes before adding another dependency.",
  },
  {
    title: "Make repetitive work disappear",
    text: "Automation is most useful when it removes real work for a real person.",
  },
  {
    title: "Leave a trail",
    text: "Readable code, observable behavior, and docs that explain decisions.",
  },
];
