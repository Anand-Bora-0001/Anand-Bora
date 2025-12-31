export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  problem: string;
  approach: string;
  challenges: string;
  outcome: string;
  techStack: string[];
  category: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

import railwayImage from '@/assets/railway-management.png';
import certificateVerificationImage from '@/assets/certificate-verification.png';
import bulkCertificateImage from '@/assets/bulk-certificate.png';

export const projects: Project[] = [
  {
    slug: "railway-management-system",
    title: "Railway Management System",
    description: "Full-stack railway booking and management platform with real-time seat availability and automated scheduling.",
    longDescription: "A comprehensive railway management system built to handle ticket booking, train scheduling, and passenger management. The system needed to handle concurrent bookings and maintain data consistency across multiple train routes.",
    problem: "Manual railway booking systems are prone to double-booking errors and lack real-time availability updates. Station staff needed a reliable system that could handle peak booking periods without data conflicts.",
    approach: "Built a Flask backend with MySQL for ACID-compliant transactions. Implemented optimistic locking for seat reservations to prevent double-bookings. Used JavaScript for dynamic UI updates without full page reloads.",
    challenges: "The main challenge was handling concurrent booking requests. Initial implementation had race conditions that occasionally allowed double-bookings. Solved this by implementing database-level locks and transaction isolation.",
    outcome: "Delivered a stable booking system that handles concurrent users reliably. The transaction isolation approach eliminated booking conflicts entirely.",
    techStack: ["Flask", "MySQL", "JavaScript", "HTML/CSS"],
    category: "Full-Stack",
    featured: true,
    githubUrl: "#",
    image: railwayImage,
  },
  {
    slug: "certificate-verification-plugin",
    title: "WordPress Certificate Verification Plugin",
    description: "Custom WordPress plugin enabling instant certificate authenticity verification through unique identifier lookup.",
    longDescription: "Developed a WordPress plugin for educational institutions to issue and verify digital certificates. Organizations can upload certificate data, and anyone can verify authenticity by entering the certificate ID.",
    problem: "Educational institutions faced certificate fraud issues. Manual verification was time-consuming and required staff intervention for each verification request.",
    approach: "Created a WordPress plugin with custom database tables for certificate storage. Built a public-facing verification form and an admin interface for bulk certificate uploads. Used prepared statements for all database queries to prevent SQL injection.",
    challenges: "WordPress plugin architecture required careful consideration of hooks and filters. Had to ensure the plugin worked across different WordPress versions and themes without conflicts.",
    outcome: "Plugin successfully deployed for multiple institutions. Verification requests now take seconds instead of days, and the admin interface reduced data entry time by 80%.",
    techStack: ["PHP", "WordPress", "MySQL", "JavaScript"],
    category: "Plugin Development",
    featured: true,
    githubUrl: "#",
    image: certificateVerificationImage,
  },
  {
    slug: "bulk-certificate-generation",
    title: "Bulk Certificate Generation System",
    description: "Automated PDF certificate generation system processing hundreds of certificates from spreadsheet data.",
    longDescription: "Built an automation system to generate personalized PDF certificates at scale. The system reads participant data from spreadsheets, applies it to certificate templates, and outputs print-ready PDFs.",
    problem: "Manual certificate creation was taking hours for events with hundreds of participants. Staff were copy-pasting names into templates one by one, leading to errors and inconsistencies.",
    approach: "Developed a Flask application that parses CSV/Excel files, validates data, and generates PDFs using template rendering. Implemented batch processing to handle large datasets without memory issues.",
    challenges: "PDF generation at scale caused memory issues. Solved this by processing certificates in batches and implementing proper garbage collection. Also had to handle various edge cases in name formatting and special characters.",
    outcome: "Reduced certificate generation time from hours to minutes. System has processed thousands of certificates with zero formatting errors.",
    techStack: ["Flask", "Python", "PDF Generation", "CSV Processing"],
    category: "Automation",
    featured: true,
    githubUrl: "#",
    image: bulkCertificateImage,
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter((project) => project.featured);
};
