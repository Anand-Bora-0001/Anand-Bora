export interface SkillCategory {
  title: string;
  description: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
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
  },
];
