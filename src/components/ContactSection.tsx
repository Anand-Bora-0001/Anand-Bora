<<<<<<< HEAD
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Github, Linkedin, Mail, MapPin, Globe, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl -z-10" />

=======
import { motion } from 'framer-motion';
import { MessageCircle, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '7821025663';
const WHATSAPP_URL = `https://wa.me/91${WHATSAPP_NUMBER}`;

export default function ContactSection() {
  return (
    <section id="contact" className="py-24">
>>>>>>> 285b6236e8a509b4a43dd7c13146cc3e4b4e923a
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
<<<<<<< HEAD
          className="text-center mb-16"
        >
          {/* Open to Full-Time Banner */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium font-mono text-green-500 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Open to Full-Time Opportunities
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let's Build Something
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you have a question, a project idea, or just want to connect, I'm always open to discussing new engineering challenges.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            <div className="card-elevated p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Contact Details</h3>
              <div className="space-y-6">
                <a href="mailto:anandbora@example.com" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm">Contact me via email</p>
                  </div>
                </a>
                
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Location</p>
                    <p className="text-sm">Pune, India</p>
                  </div>
                </div>

                <a href="https://anand-bora.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Portfolio</p>
                    <p className="text-sm">View my latest work</p>
                  </div>
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-4">Connect on Socials</h4>
                <div className="flex items-center gap-4">
                  <a href="https://github.com/Anand-Bora-0001" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/anand-bora/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="https://wa.me/917821025663" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card-elevated p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="John Doe" 
                      className="w-full px-4 py-3 rounded-md bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="john@example.com" 
                      className="w-full px-4 py-3 rounded-md bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    placeholder="Project Inquiry" 
                    className="w-full px-4 py-3 rounded-md bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    placeholder="How can we help you?" 
                    className="w-full px-4 py-3 rounded-md bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none"
                  ></textarea>
                </div>
                <Button type="submit" variant="hero" className="w-full gap-2 mt-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
=======
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Let's Build Something
          </h2>
          <p className="text-muted-foreground mb-8">
            Open to internships, freelance work, and impactful engineering opportunities. 
            If you're building a product that needs robust backend systems, full-stack development, or automation, let’s connect.
            </p>


          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="lg" className="gap-2">
                <MessageCircle size={18} />
                Get in Touch
              </Button>
            </a>
            <a href="https://github.com/Anand-Bora-0001" target="_blank" rel="noopener noreferrer">
              <Button variant="subtle" size="lg" className="gap-2">
                <Github size={18} />
                View GitHub
                <ArrowUpRight size={14} />
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/Anand-Bora-0001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/anand-bora/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle size={24} />
            </a>
          </div>
        </motion.div>
>>>>>>> 285b6236e8a509b4a43dd7c13146cc3e4b4e923a
      </div>
    </section>
  );
}
