import { motion } from 'framer-motion';
import { MessageCircle, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '7821025663';
const WHATSAPP_URL = `https://wa.me/91${WHATSAPP_NUMBER}`;

export default function ContactSection() {
  return (
    <section id="contact" className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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
      </div>
    </section>
  );
}
