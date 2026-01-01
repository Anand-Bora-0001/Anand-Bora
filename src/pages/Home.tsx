import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, MessageCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import NetworkScene from '@/components/NetworkScene';
import ProjectCard from '@/components/ProjectCard';
import SkillsSection from '@/components/SkillsSection';
import ContactSection from '@/components/ContactSection';
import { getFeaturedProjects } from '@/data/projects';
import profileImg from '@/assets/profile.jpg';

const WHATSAPP_NUMBER = '7821025663';
const WHATSAPP_URL = `https://wa.me/91${WHATSAPP_NUMBER}`;

export default function Home() {
  const featuredProjects = getFeaturedProjects();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'var(--gradient-hero)' }}
        />
        
        {/* 3D Scene */}
        <div className="absolute right-0 top-0 w-full md:w-1/2 h-full opacity-60 md:opacity-100">
          <NetworkScene />
        </div>

        <div className="section-container relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Profile Image - Left Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 300 }}
              className="relative flex-shrink-0 cursor-pointer"
            >
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72">
                {/* Gradient border ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1 transition-shadow duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)]">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    {/* Replace this with your image */}
                    <img 
                      src={profileImg} 
                      alt="Anand Bora"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        // Fallback to initials if image not found
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-4xl md:text-5xl font-bold text-primary">AB</span>
                    </div>
                  </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl -z-10" />
              </div>
            </motion.div>

            {/* Text Content - Right Side */}
            <div className="max-w-2xl flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-3 py-1 text-xs font-medium font-mono text-primary bg-primary/10 border border-primary/20 rounded-full mb-6">
                  Computer Engineering · Pune, India
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                Anand Bora
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
              >
                 Full-stack and backend-focused engineer building automation systems, data pipelines, and scalable web applications. 
                 I write the code that powers everything behind the scenes.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/projects">
                  <Button variant="hero" size="lg" className="gap-2">
                    View Projects
                    <ArrowUpRight size={18} />
                  </Button>
                </Link>
                <a href="/Anand_Bora.pdf" target="_blank" rel="noopener noreferrer">
                  <Button variant="subtle" size="lg" className="gap-2">
                    <FileText size={18} />
                    View Resume
                  </Button>
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="subtle" size="lg" className="gap-2">
                    <MessageCircle size={18} />
                    Contact Me
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-muted-foreground"
          >
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* How I Think Section */}
      <section className="py-24 border-t border-border">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-6">How I Think as a Developer</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
             <p>
              I approach engineering problems by first understanding system boundaries. Before writing code, 
              I map data flows across the stack and identify where failures are most likely to occur. 
              This mindset comes from building full-stack and automation systems, where silent failures 
              are far more dangerous than loud crashes.
              </p>
              <p>
                My internship at AI Adventures reinforced that production code isn’t about cleverness—it’s 
                about reliability. Working across the stack, I learned to write code that someone else can 
                debug at 2 AM, and to document the “why,” not just the “what.”
                </p>
                <p>
                  I’m drawn to full-stack and backend engineering because I enjoy problems with clear success criteria. 
                  Either the data pipeline runs correctly, or it doesn’t. Either the system scales, or it breaks. 
                  There’s a deep satisfaction in building end-to-end systems that simply work.
                </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 border-t border-border">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Featured Projects</h2>
              <p className="text-muted-foreground">Selected work demonstrating engineering thinking</p>
            </div>
            <Link 
              to="/projects"
              className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all projects
              <ArrowUpRight size={14} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>

          <Link 
            to="/projects"
            className="flex sm:hidden items-center justify-center gap-1 mt-8 text-sm text-primary hover:underline"
          >
            View all projects
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Resume Section */}
      <section className="py-24 border-t border-border">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">My Resume</h2>
            <p className="text-muted-foreground mb-8">
              Download my resume to learn more about my education, experience, and skills.
            </p>
            <a href="/Anand_Bora.pdf" target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="lg" className="gap-2">
                <FileText size={18} />
                View Resume
                <ArrowUpRight size={18} />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <SkillsSection />

      {/* Contact Section */}
      <ContactSection />
    </Layout>
  );
}
