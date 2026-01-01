import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { getProjectBySlug } from '@/data/projects';


export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;


  if (!project) {
    return <Navigate to="/projects" replace />;
  }


  return (
    <Layout>
      <article className="py-24">
        <div className="section-container">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              to="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Back to Projects
            </Link>
          </motion.div>


          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded">
                {project.category}
              </span>
              {/* Status Badge */}
              {project.status && (
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  project.status === "Working On" 
                    ? "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-500/20" 
                    : "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border border-green-500/20"
                }`}>
                  {project.status}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {project.longDescription}
            </p>


            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mt-6">
              {project.techStack.map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1.5 text-sm font-mono text-foreground bg-secondary border border-border rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>


            {/* Links */}
            <div className="flex gap-4 mt-8">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="subtle" className="gap-2">
                    <Github size={16} />
                    View Code
                  </Button>
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="subtle" className="gap-2">
                    <ExternalLink size={16} />
                    Live Demo
                  </Button>
                </a>
              )}
            </div>
          </motion.header>


          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl"
          >
            <div className="space-y-12">
              {/* Problem */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-mono flex items-center justify-center">1</span>
                  The Problem
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  {project.problem}
                </p>
              </section>


              {/* Approach */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-mono flex items-center justify-center">2</span>
                  Approach & Architecture
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  {project.approach}
                </p>
              </section>


              {/* Challenges */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-mono flex items-center justify-center">3</span>
                  Challenges & Tradeoffs
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  {project.challenges}
                </p>
              </section>


              {/* Outcome */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-mono flex items-center justify-center">4</span>
                  Outcome
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  {project.outcome}
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
}
