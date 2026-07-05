import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';

export default function Projects() {
  const featuredProjects = projects.filter(p => p.featured);
  const archivedProjects = projects.filter(p => !p.featured);
  return (
    <Layout>
      <section className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Projects</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A collection of engineering projects focused on automation, data systems, and web development. 
              Each project includes technical decisions, challenges faced, and lessons learned.
            </p>
          </motion.div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Featured Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          </div>

          {archivedProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Project Archive</h2>
              <div className="grid md:grid-cols-2 gap-6 opacity-80">
                {archivedProjects.map((project, index) => (
                  <ProjectCard key={project.slug} project={project} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
