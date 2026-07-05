export interface SkillCategory {
  title: string;
  description?: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["Python", "JavaScript", "TypeScript", "SQL"],
  },
  {
    title: "Backend",
    skills: ["FastAPI", "Node.js", "Express", "Django", "Flask"],
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Cloud & DevOps",
    skills: ["Docker", "Kubernetes", "AWS", "Linux", "GitHub Actions", "Nginx"],
  },
  {
    title: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Redis", "SQLite"],
  },
  {
    title: "AI / Machine Learning",
    skills: ["TensorFlow", "PyTorch", "Scikit-Learn", "LangChain", "RAG", "Vector Databases", "MLOps"],
  },
  {
    title: "Data Engineering",
    skills: ["Kafka", "Apache Spark", "Airflow", "ETL", "Streaming", "Monitoring"],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "REST APIs", "CI/CD", "JWT", "OAuth", "Microservices"],
  },
];
