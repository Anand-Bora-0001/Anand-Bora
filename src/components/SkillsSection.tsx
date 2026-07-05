import { motion } from 'framer-motion';
import { skillCategories } from '@/data/skills';
import { 
  SiPython, SiJavascript, SiTypescript, SiPostgresql, 
  SiFastapi, SiNodedotjs, SiExpress, SiDjango, SiFlask,
  SiReact, SiNextdotjs, SiTailwindcss,
  SiDocker, SiKubernetes, SiLinux, SiGithubactions, SiNginx,
  SiMongodb, SiRedis, SiSqlite,
  SiTensorflow, SiPytorch, SiScikitlearn, SiLangchain,
  SiApachekafka, SiApachespark, SiApacheairflow,
  SiGit, SiGithub, SiJsonwebtokens
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { Database, Server, Settings, Code, Network, Brain, BarChart, Shield } from 'lucide-react';

const getIconForSkill = (skill: string) => {
  const iconMap: Record<string, any> = {
    "Python": SiPython,
    "JavaScript": SiJavascript,
    "TypeScript": SiTypescript,
    "SQL": Database,
    "FastAPI": SiFastapi,
    "Node.js": SiNodedotjs,
    "Express": SiExpress,
    "Django": SiDjango,
    "Flask": SiFlask,
    "React": SiReact,
    "Next.js": SiNextdotjs,
    "Tailwind CSS": SiTailwindcss,
    "Docker": SiDocker,
    "Kubernetes": SiKubernetes,
    "AWS": FaAws,
    "Linux": SiLinux,
    "GitHub Actions": SiGithubactions,
    "Nginx": SiNginx,
    "PostgreSQL": SiPostgresql,
    "MongoDB": SiMongodb,
    "Redis": SiRedis,
    "SQLite": SiSqlite,
    "TensorFlow": SiTensorflow,
    "PyTorch": SiPytorch,
    "Scikit-Learn": SiScikitlearn,
    "LangChain": SiLangchain,
    "RAG": Brain,
    "Vector Databases": Database,
    "MLOps": Settings,
    "Kafka": SiApachekafka,
    "Apache Spark": SiApachespark,
    "Airflow": SiApacheairflow,
    "ETL": Server,
    "Streaming": Network,
    "Monitoring": BarChart,
    "Git": SiGit,
    "GitHub": SiGithub,
    "REST APIs": Code,
    "CI/CD": Settings,
    "JWT": SiJsonwebtokens,
    "OAuth": Shield,
    "Microservices": Network
  };
  
  return iconMap[skill] || null;
};

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 bg-card/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-2">Technical Skills</h2>
          <p className="text-muted-foreground">Technologies I use to build scalable systems</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:border-primary/40 transition-all duration-500 transform hover:-translate-y-1 p-6 flex flex-col h-full"
            >
              {/* Glossy Gradient Overlay on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none transition-opacity duration-500 z-0" />
              
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">{category.title}</h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-5">{category.description}</p>
                )}
                <div className="flex flex-wrap gap-2.5 mt-auto">
                  {category.skills.map((skill) => {
                    const Icon = getIconForSkill(skill);
                    return (
                      <span
                        key={skill}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-mono font-medium text-foreground/80 bg-background/50 border border-border/50 rounded-lg shadow-sm hover:border-primary/50 hover:text-primary hover:bg-background/80 transition-all cursor-default backdrop-blur-sm"
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
