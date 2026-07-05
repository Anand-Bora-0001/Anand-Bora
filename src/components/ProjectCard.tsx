import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        to={`/projects/${project.slug}`}
        className="group block relative overflow-hidden h-full rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:border-primary/40 transition-all duration-500 transform hover:-translate-y-1"
      >
        {/* Advanced Glossy Gradient Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none transition-opacity duration-500 z-10" />
        
        {project.image && (
          <div className="aspect-video overflow-hidden bg-secondary relative">
            {/* Subtle inner shadow overlay */}
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] z-10 pointer-events-none" />
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
            />
          </div>
        )}
        <div className="p-6 relative z-20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Category and Status badges with proper spacing */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {project.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/20 border border-amber-500/20 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    ★ Featured
                  </span>
                )}
                <span className="inline-block px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded">
                  {project.category}
                </span>
                {project.status && (
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    project.status === "Working On" 
                      ? "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-500/20"
                      : project.status === "Maintained"
                      ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20"
                      : "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border border-green-500/20"
                  }`}>
                    {project.status}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span 
                    key={tech}
                    className="px-2 py-1 text-xs font-mono text-secondary-foreground bg-secondary rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 p-2 rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
