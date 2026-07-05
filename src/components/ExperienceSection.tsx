import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Trophy, Code } from 'lucide-react';

const experiences = [
  {
    type: 'internship',
    title: 'Python Developer Intern',
    organization: 'AI Adventures LLP',
    date: '2024',
    icon: Briefcase,
    details: [
      'Built absence detection system for automated attendance tracking.',
      'Developed Google Sheets automation using Python and API integration.',
      'Implemented CI/CD workflows using GitHub Actions.',
      'Contributed to Moodle platform customization and bulk certificate automation.'
    ]
  },
  {
    type: 'education',
    title: 'BE Computer Engineering (CGPA: 8.55)',
    organization: 'Savitribai Phule Pune University',
    date: '2022 - 2026',
    icon: GraduationCap,
    details: [
      'Genba Sopanrao Moze College of Engineering, Pune.',
      'Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks.'
    ]
  },

];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 border-t border-border">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="text-3xl font-semibold text-foreground mb-4">Experience & Journey</h2>
          <p className="text-muted-foreground">
            My professional timeline, education, and notable achievements.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line connecting timeline items */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-border"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-12 md:pl-24"
                >
                  {/* Timeline node */}
                  <div className="absolute left-0 md:left-4 top-1 w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>

                  <div className="card-elevated p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{exp.title}</h3>
                        <p className="text-sm font-medium text-primary mt-1">{exp.organization}</p>
                      </div>
                      <span className="inline-block px-3 py-1 text-xs font-mono text-muted-foreground bg-secondary rounded-full whitespace-nowrap">
                        {exp.date}
                      </span>
                    </div>

                    <ul className="space-y-2 mt-4 text-muted-foreground text-sm">
                      {exp.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1.5 opacity-60">•</span>
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
