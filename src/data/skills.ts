export interface SkillCategory {
  title: string;
<<<<<<< HEAD
  description?: string;
=======
  description: string;
>>>>>>> 285b6236e8a509b4a43dd7c13146cc3e4b4e923a
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
<<<<<<< HEAD
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
=======
    title: "Strong",
    description: "Daily drivers in projects and internship work",
    skills: ["Python", "Flask", "MySQL", "Git", "GitHub Actions"],
  },
  {
    title: "Working Knowledge",
    description: "Used in projects, comfortable building with",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "PHP", "WordPress"],
  },
  {
    title: "Fundamentals",
    description: "Solid understanding from coursework and practice",
    skills: ["Java", "C++", "DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks"],
>>>>>>> 285b6236e8a509b4a43dd7c13146cc3e4b4e923a
  },
];
