export interface SkillCategory {
  id: "agents" | "systems" | "data" | "cloud";
  title: string;
  description: string;
  skills: string[];
}
export const skillCategories: SkillCategory[] = [
  {
    id: "agents",
    title: "Agents & applied AI",
    description: "Connecting models to useful product workflows.",
    skills: [
      "Agent architectures",
      "Tool orchestration",
      "MCP servers",
      "RAG",
      "LLM APIs",
      "FAISS",
      "Scikit-Learn",
      "MLOps",
    ],
  },
  {
    id: "systems",
    title: "Backend & systems",
    description: "Clear interfaces and dependable service boundaries.",
    skills: [
      "Go",
      "Rust",
      "Python",
      "TypeScript",
      "FastAPI",
      "gRPC",
      "Distributed systems",
    ],
  },
  {
    id: "data",
    title: "Data & analytics",
    description: "From events and datasets to governed, usable metrics.",
    skills: [
      "DuckDB",
      "DuckLake",
      "PostgreSQL",
      "Semantic models",
      "Tantivy",
      "Kafka",
      "Airflow",
      "Redis",
    ],
  },
  {
    id: "cloud",
    title: "Cloud & delivery",
    description: "Shipping software with visibility into how it behaves.",
    skills: [
      "Docker",
      "Kubernetes",
      "AWS",
      "Nix",
      "GitHub Actions",
      "OIDC & SCIM",
      "Playwright",
      "Prometheus",
    ],
  },
];
export const extendedSkills = [
  "React",
  "Next.js",
  "Three.js",
  "Tailwind CSS",
  "Accessibility (WCAG)",
  "Node.js",
  "Flask",
  "Django",
  "Celery",
  "MongoDB",
  "SQLite",
  "Elasticsearch",
  "Apache Spark",
  "SentenceTransformers",
  "TensorFlow",
  "PyTorch",
  "Gemini OCR",
  "Grafana",
  "Nginx",
  "Linux",
  "CI/CD",
  "JWT & OAuth2",
  "Microservices",
];
