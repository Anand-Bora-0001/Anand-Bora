import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Layout from '@/components/Layout';
import ContactSection from '@/components/ContactSection';

export default function About() {
  return (
    <Layout>
      <section className="py-24">
        <div className="section-container">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">About</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6 text-muted-foreground leading-relaxed"
            >
              <p>
                Final-year Computer Engineering student at Savitribai Phule Pune University (CGPA 8.42), 
                working across full-stack and backend development, automation systems,
                and engineering tools that streamline real-world workflows.
</p>


              <p>
                My approach to engineering comes from a simple observation: most valuable software 
                isn't flashy—it's reliable. The systems that matter are the ones that run quietly 
                in the background, processing data correctly, handling edge cases gracefully, 
                and scaling without drama.
              </p>
            </motion.div>

            {/* Engineering Philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">Engineering Philosophy</h2>
              <div className="grid gap-6">
                <div className="card-elevated p-6">
                  <h3 className="text-lg font-medium text-foreground mb-2">Understand Before Building</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    I spend significant time understanding the problem space before writing code. 
                    This means mapping data flows, identifying failure modes, and questioning assumptions. 
                    A clear mental model prevents expensive rewrites later.
                  </p>
                </div>

                <div className="card-elevated p-6">
                  <h3 className="text-lg font-medium text-foreground mb-2">Automate the Boring Stuff</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    If a task is repetitive, it should be automated. My internship work focused heavily 
                    on this—building systems that eliminated manual data entry, automated certificate 
                    generation, and reduced human error through scripts and workflows.
                  </p>
                </div>

                <div className="card-elevated p-6">
                  <h3 className="text-lg font-medium text-foreground mb-2">Write for the Next Developer</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Code is read more than it's written. I prioritize clarity over cleverness, 
                    document edge cases, and structure projects so that anyone inheriting the 
                    codebase can understand the reasoning behind decisions.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">Experience</h2>
              <div className="card-elevated p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground">AI Adventures LLP</h3>
                    <p className="text-sm text-muted-foreground">Software Engineering Intern</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">2024</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Built absence detection system for automated attendance tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Developed Google Sheets automation using Python and API integration
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Implemented CI/CD workflows using GitHub Actions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Contributed to Moodle platform customization and bulk certificate automation
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">Education</h2>
              <div className="card-elevated p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground">BE Computer Engineering</h3>
                    <p className="text-sm text-muted-foreground">Savitribai Phule Pune University</p>
                    <p className="text-sm text-muted-foreground">Genba Sopanrao Moze College of Engineering, Pune</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-muted-foreground">2022–2026</span>
                    <p className="text-sm font-medium text-primary mt-1">CGPA: 8.42</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Currently Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">Currently Exploring</h2>
              <div className="flex flex-wrap gap-3">
                {['System Design', 'Cloud Architecture', 'DevOps Practices', 'Performance Optimization'].map((topic) => (
                  <span 
                    key={topic}
                    className="px-4 py-2 text-sm font-mono text-foreground bg-secondary border border-border rounded-md"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Resume Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 pt-8 border-t border-border"
            >
              <a 
                href="#"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Download Resume (PDF)
                <ArrowUpRight size={16} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <ContactSection />
    </Layout>
  );
}
