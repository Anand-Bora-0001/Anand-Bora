export interface SkillCategory {
  title: string;
  description: string;
  skills: string[];
}
export const skillCategories: SkillCategory[] = [
  {
    title: "Agents & applied AI",
    description: "Connecting models to useful product workflows.",
    skills: [
      "Agent architectures",
      "Tool orchestration",
      "RAG",
      "Scikit-Learn",
      "MLOps",
      "LangChain",
    ],
  },
  {
    title: "Backend & systems",
    description: "Clear interfaces and dependable service boundaries.",
    skills: [
      "Go",
      "Python",
      "FastAPI",
      "Flask",
      "REST APIs",
      "Distributed systems",
    ],
  },
  {
    title: "Data & storage",
    description: "From events and datasets to usable information.",
    skills: ["DuckDB", "PostgreSQL", "Redis", "SQL", "Kafka", "Airflow"],
  },
  {
    title: "Cloud & delivery",
    description: "Shipping software with visibility into how it behaves.",
    skills: [
      "Docker",
      "Kubernetes",
      "AWS",
      "Linux",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
    ],
  },
];
export const extendedSkills = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "Django",
  "MongoDB",
  "SQLite",
  "TensorFlow",
  "PyTorch",
  "Vector Databases",
  "Apache Spark",
  "ETL",
  "Streaming",
  "Nginx",
  "Git",
  "GitHub",
  "CI/CD",
  "JWT",
  "OAuth",
  "Microservices",
];
