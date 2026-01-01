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
  status?: "Working On" | "Completed";
}

import railwayImage from '@/assets/railway-management.png';
import certificateVerificationImage from '@/assets/certificate-verification.png';
import bulkCertificateImage from '@/assets/bulk-certificate.png';
import honeycloudImage from '@/assets/honeycloud.png';
import licenseDetectorImage from '@/assets/license-detector.png';
import saasImage from '@/assets/saas-file-management.png';
import ecommerceMicroservicesImage from '@/assets/ecommerce-microservices.png';
import svfImage from '@/assets/secure-virtual-file-system.png';
export const projects: Project[] = [
    {
    slug: "honeycloud-honeypot-platform",
    title: "HoneyCloud – Smart Scalable Honeypot Platform",
    description: "Real-time honeypot system integrated with a live e-commerce website to detect and analyze cyber attacks.",
    longDescription: "HoneyCloud is a cloud-ready honeypot platform tightly integrated with a functional e-commerce system. It captures malicious activity in real time and visualizes attack patterns through a live dashboard. The system is fully containerized and designed for scalable deployment.",
    problem: "Traditional honeypots are isolated and fail to capture realistic attacker behavior. Security teams needed a system that attracts real-world attacks in a believable production-like environment.",
    approach: "Integrated a real e-commerce application with a honeypot backend. Used Docker Compose for service orchestration, FastAPI/Flask for APIs, JWT-based authentication, and a real-time dashboard for monitoring attack traffic.",
    challenges: "Coordinating multiple services, managing secure communication between components, and avoiding performance overhead on the e-commerce system.",
    outcome: "Successfully built a realistic attack surface with real-time monitoring. The platform demonstrates how deception-based security can enhance threat detection.",
    techStack: ["FastAPI", "Flask", "Docker", "JWT", "Tailwind CSS"],
    category: "Cybersecurity",
    featured: true,
    githubUrl: "#",
    image: honeycloudImage,
    status: "Working On",
  },
  
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
    githubUrl: "https://github.com/Anand-Bora-0001/Railway-Management-System",
    image: railwayImage,
    status: "Completed",
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
    githubUrl: "https://github.com/Anand-Bora-0001/certificate-verification-plugin",
    image: certificateVerificationImage,
    status: "Completed",
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
    githubUrl: "https://github.com/Anand-Bora-0001/Bulk-Certificate-Generator",
    image: bulkCertificateImage,
    status: "Completed",
  },
  {
    slug: "open-source-license-detector",
    title: "Open Source License Detector",
    description: "Web application that detects open-source licenses in text files using keyword-based analysis.",
    longDescription: "A lightweight web application that allows users to upload text or markdown files and instantly identify embedded open-source licenses. The system supports multiple popular licenses and provides real-time feedback.",
    problem: "Manually identifying licenses in documentation is error-prone and time-consuming, especially for developers reviewing third-party code or open-source repositories.",
    approach: "Built a Flask backend to process uploaded files and detect licenses using keyword matching. Designed a responsive frontend with real-time detection feedback and drag-and-drop support.",
    challenges: "Handling multiple license formats, ensuring UTF-8 compatibility, and safely validating uploaded content.",
    outcome: "Delivered a fast and user-friendly tool capable of detecting common licenses accurately. The system is secure, extensible, and suitable for future ML-based improvements.",
    techStack: ["Flask", "Python", "JavaScript", "HTML/CSS"],
    category: "Web Application",
    featured: true,
    githubUrl: "https://github.com/Anand-Bora-0001/Open-source-license-Detector",
    image: licenseDetectorImage,
    status: "Completed",
  },
  {
    slug: "cloud-based-saas-system",
    title: "Cloud-Based SaaS File Management System",
    description: "Secure SaaS platform for file upload, download, and management with role-based access control.",
    longDescription: "A cloud-based SaaS system that enables authenticated users to securely upload and download files. Includes role-based access control, protected APIs, and a modern React frontend.",
    problem: "Organizations needed a simple yet secure file management solution with controlled access and authentication.",
    approach: "Implemented a Flask backend with JWT authentication and SQLite for user management. Built a React frontend communicating via protected REST APIs with CORS enabled.",
    challenges: "Securing API endpoints, managing authentication tokens, and synchronizing frontend-backend communication.",
    outcome: "Delivered a functional SaaS platform with secure file handling and scalable architecture ready for cloud storage integrations.",
    techStack: ["Flask", "React.js", "JWT", "SQLite", "Axios"],
    category: "Full-Stack",
    featured: true,
    githubUrl: "https://github.com/Anand-Bora-0001/Cloud-SaaS-System",
    image: saasImage,
    status: "Completed",
  },
  {
    slug: "ecommerce-microservices",
    title: "E-Commerce Microservices Application",
    description: "Dockerized microservices-based e-commerce platform with Spring Boot and React.",
    longDescription: "A scalable e-commerce system built using microservices architecture. Each service handles a specific responsibility such as users, products, orders, payments, and notifications.",
    problem: "Monolithic architectures struggle with scalability and independent service deployment in large systems.",
    approach: "Designed independent Spring Boot microservices with Eureka for service discovery and Spring Cloud Gateway for routing. Used Docker Compose for containerized deployment and React with Redux for the frontend.",
    challenges: "Service communication, configuration management, and ensuring reliability across distributed components.",
    outcome: "Successfully deployed a fully functional microservices system that can be scaled and maintained independently.",
    techStack: ["Spring Boot", "React.js", "Docker", "MySQL", "Eureka"],
    category: "Microservices",
    featured: true,
    githubUrl: "https://github.com/Anand-Bora-0001/Ecommerce-App",
    image: ecommerceMicroservicesImage,
    status: "Completed",
  },
  {
    slug: "secure-virtual-file-system",
    title: "Secure Virtual File System (SVF)",
    description: "C++ based virtual file system with authentication, access control, and secure password handling.",
    longDescription: "SVF is a command-line virtual file system supporting user authentication, permission-based file access, and secure password storage using SHA-256 hashing via OpenSSL.",
    problem: "Basic file systems lack fine-grained access control and secure credential handling for multi-user environments.",
    approach: "Implemented a virtual file system in C++ with role-based access, OpenSSL-based password hashing, and cross-platform compatibility.",
    challenges: "Integrating OpenSSL across platforms and managing secure credential storage without external databases.",
    outcome: "Delivered a secure, portable virtual file system demonstrating low-level security and system programming skills.",
    techStack: ["C++", "OpenSSL", "SHA-256"],
    category: "System Programming",
    featured: true,
    githubUrl: "https://github.com/Anand-Bora-0001/SVF",
    image: svfImage,
    status: "Completed",
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter((project) => project.featured);
};
