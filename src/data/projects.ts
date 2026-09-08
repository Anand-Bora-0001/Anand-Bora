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
  status?: "Working On" | "Completed" | "Maintained";

  // Extended Details
  overview?: string;
  architectureDiagram?: string;
  systemDesign?: string;
  features?: string[];
  implementationDetails?: string;
  tradeOffs?: string;
  performanceOptimizations?: string;
  futureImprovements?: string;
  screenshots?: string[];
  relatedProjects?: string[];
}

import railwayImage from "@/assets/railway-management.png";
import certificateVerificationImage from "@/assets/certificate-verification.png";
import bulkCertificateImage from "@/assets/bulk-certificate.png";
import honeycloudImage from "@/assets/honeycloud.png";
import licenseDetectorImage from "@/assets/license-detector.png";
import saasImage from "@/assets/saas-file-management.png";
import ecommerceMicroservicesImage from "@/assets/ecommerce-microservices.png";
import svfImage from "@/assets/secure-virtual-file-system.png";

const originalProjects: Project[] = [
  // --- FLAGSHIP PROJECTS (Featured) ---
  {
    slug: "observability-platform",
    title: "Enterprise Identity & Cloud Observability",
    description:
      "Identity, access management, and cloud observability in one engineering project.",
    longDescription:
      "An event-driven Identity & Access Management (IAM) and Cloud Infrastructure Observability platform designed to demonstrate deep expertise in modern identity, distributed systems, and AIOps.",
    problem:
      "Enterprise scale requires robust identity management coupled with deep observability to quickly diagnose distributed system failures.",
    approach:
      "Built an event-driven architecture using Kafka in KRaft mode. Developed a Go-based Identity Engine for gRPC and OAuth2, and a Python-based API for infrastructure and AIOps.",
    challenges:
      "Synchronizing state across polyglot microservices (Go, Python) while managing high-throughput tracing and metric ingestion without dropping data.",
    outcome:
      "Successfully deployed a scalable, observable, and secure platform featuring automated root cause analysis via LLMs.",
    techStack: [
      "Golang",
      "Python",
      "FastAPI",
      "React",
      "Vue 3",
      "Kafka",
      "Kubernetes",
      "Prometheus",
      "Grafana",
      "Jaeger",
    ],
    category: "Cloud & DevOps",
    featured: true,
    githubUrl: "https://github.com/Anand-Bora-0001/observability-platform",
    status: "Completed",
    overview:
      "A highly scalable observability and identity management platform featuring dual frontends, polyglot microservices, and AI-assisted root cause analysis.",
    systemDesign:
      "Polyglot microservices (Go Identity Engine, Python Core API, AI Ops API) sit behind an NGINX Gateway. They communicate asynchronously via Kafka and persist to PostgreSQL and Redis. The three pillars of observability are implemented via Prometheus (Metrics), Jaeger (Traces), and Grafana Loki (Logs).",
    features: [
      "OAuth2 & OIDC identity management",
      "Event-Driven Microservices via Apache Kafka",
      "AI-Assisted Operations (AIOps) for RCA",
      "Dynamic Security with AWS Secrets Manager",
      "Dual Frontends: Vue 3 Admin Portal & React NOC Dashboard",
    ],
    implementationDetails:
      "Organized as a monorepo. Uses Helm charts for Kubernetes deployment and Cypress for E2E automation. Integrated with AWS IAM Roles for Service Accounts (IRSA).",
  },
  {
    slug: "cloud-monitoring-dashboard",
    title: "Cloud Infrastructure Observability & Monitoring",
    description:
      "Enterprise-grade cloud-native monitoring and observability platform.",
    longDescription:
      "A unified platform providing deep insights into AWS, Azure, GCP, Kubernetes, and bare-metal servers, mirroring capabilities of industry leaders like Datadog and Dynatrace.",
    problem:
      "Fragmented visibility across hybrid and multi-cloud environments makes it difficult to predict capacity exhaustion and track service dependencies.",
    approach:
      "Developed a distributed, microservices-oriented architecture using Python FastAPI and React. Integrated asynchronous Celery workers to handle synthetic monitoring, AI capacity forecasting, and alerting.",
    challenges:
      "Designing an auto-discovery cascade engine that accurately maps parent-child relationships across disparate cloud services.",
    outcome:
      "Delivered proactive alerting, AI-driven capacity planning, and complete visibility across complex hybrid-cloud architectures.",
    techStack: [
      "Python",
      "FastAPI",
      "React",
      "Celery",
      "PostgreSQL",
      "Redis",
      "Prometheus",
      "Kubernetes",
      "Helm",
    ],
    category: "Cloud & DevOps",
    featured: true,
    githubUrl: "https://github.com/Anand-Bora-0001/cloud-monitoring-dashboard",
    status: "Completed",
    overview:
      "A comprehensive solution offering auto-discovery, synthetic monitoring, global heat maps, and AI-based capacity forecasting.",
    systemDesign:
      "The backend uses FastAPI and SQLAlchemy for core routing and configuration, delegating heavy lifting to specialized Celery workers for AI predictions, standard alerts, and synthetic checks (SSL/Uptime). The React frontend displays dynamic dependency graphs and heat maps.",
    features: [
      "Auto Discovery Engine & Service Dependency Mapping",
      "AI-Based Capacity Forecasting (7, 30, 90-day horizons)",
      "Synthetic Monitoring & SSL Certificate Monitoring",
      "AWS Cost Analytics integration via Cost Explorer API",
      "Global Heat Maps & Compliance Dashboard",
    ],
    implementationDetails:
      "Containerized deployment managed via Docker Compose locally and Kubernetes Helm charts in production. Enforces a robust QA suite utilizing Pytest, Vitest, and Playwright on GitHub Actions.",
  },
  {
    slug: "real-time-data-engineering",
    title: "Real-Time Data Engineering & ML Platform",
    description:
      "Enterprise streaming data pipeline with real-time analytics, ETL/ELT, and ML Inference.",
    longDescription:
      "An end-to-end, enterprise-scale Data Engineering and Machine Learning platform bridging the gap between raw data generation and actionable BI/AI predictions.",
    problem:
      "Processing, storing, validating, and serving massive amounts of data in real-time requires a cohesive architecture to prevent data silos and stale insights.",
    approach:
      "Designed a comprehensive streaming architecture. Data is ingested via Apache Kafka, processed by PySpark Structured Streaming, stored in Delta Lake on MinIO, and orchestrated via Apache Airflow.",
    challenges:
      "Maintaining data quality across streaming pipelines and managing stateful aggregations at scale.",
    outcome:
      "Successfully decreased data latency, enforced data quality rules with Great Expectations, and seamlessly served ML predictions via FastAPI.",
    techStack: [
      "Python",
      "Apache Spark",
      "Kafka",
      "Airflow",
      "Delta Lake",
      "MLflow",
      "PostgreSQL",
      "FastAPI",
      "Terraform",
      "Kubernetes",
    ],
    category: "Data Engineering",
    featured: true,
    githubUrl:
      "https://github.com/Anand-Bora-0001/Real-Time-Data-Engineering-Platform",
    status: "Working On",
    overview:
      "A massive data processing pipeline that ingests events, cleans and transforms them in real-time, and feeds both Business Intelligence dashboards and Machine Learning models.",
    systemDesign:
      "Events flow from Kafka into a Medallion Architecture (Raw -> Curated) built on Delta Lake. Airflow DAGs orchestrate batch aggregations and reverse ETL into PostgreSQL. A unified feature store feeds an MLflow tracking server and FastAPI inference endpoints.",
    features: [
      "Real-Time Streaming (Kafka to Delta Lake)",
      "Batch & Reverse ETL pipelines",
      "Data Quality validation using Great Expectations",
      "End-to-End ML Pipeline (Feature Store -> MLflow -> API)",
      "Business Intelligence dashboards via Metabase",
    ],
    implementationDetails:
      "Infrastructure is defined using Terraform for AWS (S3, MSK, EMR, RDS). Kubernetes manifests handle stateless FastAPI deployments. Local development is powered by a multi-container Docker Compose setup.",
  },
  {
    slug: "enterprise-mlops",
    title: "Enterprise MLOps Platform",
    description:
      "Production-ready, full-stack Machine Learning Operations platform.",
    longDescription:
      "An open-source, enterprise-scale MLOps platform bridging the gap between experimentation and production by offering a complete end-to-end lifecycle for machine learning models.",
    problem:
      "The machine learning lifecycle is often fragmented across separate tools for dataset management, experiment tracking, model registry, and real-time inference.",
    approach:
      "Built a full-stack platform using Python/FastAPI and React. Integrated MLflow for experiment tracking and Celery + Redis for asynchronous, distributed model training.",
    challenges:
      "Managing model loading, training jobs, and inference across the model lifecycle.",
    outcome:
      "Delivered a centralized MLOps ecosystem capable of handling everything from tabular data ingestion to real-time, explainable AI inference.",
    techStack: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "PostgreSQL",
      "MLflow",
      "Scikit-learn",
      "SHAP",
      "Celery",
      "Kubernetes",
    ],
    category: "AI / Machine Learning",
    featured: true,
    githubUrl: "https://github.com/Anand-Bora-0001/Enterprise-MLOps-Platform",
    status: "Completed",
    overview:
      "A comprehensive suite for AI/ML teams featuring multi-tenant dataset management, stage-gated model registries, and explainable AI insights.",
    systemDesign:
      "The platform operates on a decoupled architecture. A FastAPI backend governs multi-tenant IAM (JWT/RBAC) and delegates distributed training jobs to Celery workers. MLflow tracks metrics and artifacts, while a high-throughput inference engine serves predictions.",
    features: [
      "Distributed Experiment Tracking (MLflow, Celery)",
      "Model Registry & Stage Gating",
      "High-Throughput Real-Time Inference",
      "Explainable AI (XAI) using SHAP TreeExplainer",
      "Multi-tenant Identity & Access Management (RBAC)",
    ],
    implementationDetails:
      "Designed for cloud-native deployment using highly optimized, multi-stage Dockerfiles and full Kubernetes apps/v1 manifests (Deployments, Services, NGINX Ingress). System observability is powered by Prometheus and Grafana.",
  },
  {
    slug: "honeycloud-x",
    title: "HoneyCloud-X",
    description:
      "Next-Generation AI-Powered Honeypot & SOC Intelligence Platform.",
    longDescription:
      "A state-of-the-art, production-ready honeypot orchestration and Security Operations Center (SOC) intelligence platform that shifts the asymmetrical advantage back to the defenders.",
    problem:
      "Don't wait for attackers to hit your real servers. Security researchers need high-fidelity threat intelligence without exposing real infrastructure to risk.",
    approach:
      "Deploys lightweight decoy nodes across regions. Uses a FastAPI backend and an advanced Machine Learning pipeline (Random Forest, Isolation Forest, LSTM) to classify payloads. Features a React-based SOC Dashboard for real-time telemetry and alerting via Telegram/Email.",
    challenges:
      "Making decoys convincing while isolating them. Ensuring ML models can process streams in real time without OOM errors on limited hardware.",
    outcome:
      "Safely logs zero-day exploits, traps attackers in heavily monitored deception environments, and automatically generates enterprise-grade PDF/Excel threat reports.",
    techStack: [
      "React",
      "FastAPI",
      "Python",
      "SQLAlchemy",
      "Scikit-Learn",
      "Docker",
      "Tailwind CSS",
    ],
    category: "Cybersecurity",
    featured: true,
    image: honeycloudImage,
    githubUrl: "https://github.com/Anand-Bora-0001/HoneyCloud-X",
    status: "Maintained",
    overview:
      "HoneyCloud attracts malicious actors, traps them in deception environments, and leverages AI to classify their behavior in real-time.",
    systemDesign:
      "Built on a decoupled microservices architecture. Decoy nodes intercept traffic and forward it to a FastAPI Backend, where the ML Threat Engine analyzes payloads. A React SOC dashboard pulls telemetry for analysts.",
    features: [
      "Distributed decoy network (Shadow Nodes)",
      "Real-time behavioral ML engine & Deep Learning (LSTM)",
      "SOC Dashboard with live telemetry & Global Threat Map",
      "Automated threat profiling (MITRE ATT&CK mapping)",
      "Multi-channel alerting (Telegram, Email, Webhooks)",
    ],
    implementationDetails:
      "Backend utilizes FastAPI and SQLAlchemy, integrating Scikit-Learn for ML feature extraction (e.g., payload entropy). Frontend is built with React 18, Vite, and Tailwind CSS. The ML pipeline supports automated retraining via Celery background tasks.",
  },
  {
    slug: "railway-management-system",
    title: "Railway Management System",
    description: "A railway management application built with Flask and MySQL.",
    longDescription:
      "A railway management application for registration, train search, booking, and administration.",
    problem:
      "Railway operations involve connected passenger, train, booking, and cancellation records.",
    approach:
      "Built application routes and database operations for the railway booking workflow.",
    challenges: "Optimizing database queries to prevent locks.",
    outcome:
      "A working application covering core railway administration and passenger workflows.",
    techStack: ["Flask", "MySQL", "Python"],
    category: "Backend",
    featured: true,
    image: railwayImage,
    githubUrl: "https://github.com/Anand-Bora-0001/Railway-Management-System",
    status: "Completed",
  },

  // --- ARCHIVED PROJECTS (Not Featured) ---
  {
    slug: "demo-ecommerce",
    title: "Demo Ecommerce (Python)",
    description: "A python-based e-commerce demonstration application.",
    longDescription:
      "Built an e-commerce platform demonstrating modern development practices.",
    problem: "Needed a scalable store template.",
    approach: "Developed in Python with a solid architectural foundation.",
    challenges: "Handling inventory and sessions.",
    outcome: "A fully working boilerplate.",
    techStack: ["Python"],
    category: "Backend",
    featured: false,
    githubUrl: "https://github.com/Anand-Bora-0001/demo-ecommerce",
    status: "Completed",
  },
  {
    slug: "sentinelgrid-ai",
    title: "SentinelGrid-AI",
    description: "AI-powered grid security and analysis platform.",
    longDescription:
      "An AI solution built in Python for analyzing grid security.",
    problem: "Grid monitoring required automated threat detection.",
    approach: "Implemented machine learning models in Python.",
    challenges: "Processing large data streams.",
    outcome: "Improved anomaly detection rates.",
    techStack: ["Python"],
    category: "AI / Machine Learning",
    featured: false,
    githubUrl: "https://github.com/Anand-Bora-0001/SentinelGrid-AI",
    status: "Completed",
  },
  {
    slug: "e-voting-dapp",
    title: "E-Voting DApp",
    description: "Decentralized voting application built on blockchain.",
    longDescription:
      "A secure and transparent electronic voting system leveraging smart contracts.",
    problem: "Traditional voting lacks transparency.",
    approach: "Used JavaScript and blockchain tools to build a dApp.",
    challenges: "Smart contract security.",
    outcome: "A tamper-proof voting system prototype.",
    techStack: ["JavaScript", "Blockchain"],
    category: "Web3",
    featured: false,
    status: "Completed",
  },
  {
    slug: "student-feedback-portal",
    title: "Student Feedback Portal",
    description: "System for collecting and analyzing student feedback.",
    longDescription:
      "A Python application allowing educational institutions to track feedback.",
    problem: "Manual feedback collection is inefficient.",
    approach: "Developed a portal with analytics dashboards.",
    challenges: "Ensuring anonymity while preventing spam.",
    outcome: "Streamlined the feedback process.",
    techStack: ["Python"],
    category: "Web Application",
    featured: false,
    status: "Completed",
  },
  {
    slug: "transport-project",
    title: "Transport Management Project",
    description: "System for managing transport logistics.",
    longDescription: "Logistics software for scheduling and routing.",
    problem: "Route planning was entirely manual.",
    approach: "Built a centralized routing database.",
    challenges: "Algorithm optimization for routing.",
    outcome: "Reduced route planning time.",
    techStack: ["Various"],
    category: "Logistics",
    featured: false,
    status: "Completed",
  },
  {
    slug: "digital-guard-toolkit",
    title: "Digital Guard Toolkit",
    description: "A toolkit for digital security implementations.",
    longDescription:
      "Built with TypeScript to provide various digital guard utilities.",
    problem: "Scattered security tools.",
    approach: "Unified toolkit interface.",
    challenges: "Type safety across multiple APIs.",
    outcome: "Robust security toolkit.",
    techStack: ["TypeScript"],
    category: "Cybersecurity",
    featured: false,
    status: "Completed",
  },
  {
    slug: "bulk-certificate-generation",
    title: "Bulk Certificate Generation System",
    description: "Automated PDF certificate generation system.",
    longDescription:
      "Automation system to generate personalized PDF certificates at scale.",
    problem: "Manual creation took hours.",
    approach: "Flask application parsing CSV.",
    challenges: "Memory issues at scale.",
    outcome: "Reduced generation time from hours to minutes.",
    techStack: ["HTML", "Python"],
    category: "Automation",
    featured: false,
    image: bulkCertificateImage,
    githubUrl: "https://github.com/Anand-Bora-0001/Bulk-Certificate-Generator",
    status: "Completed",
  },
  {
    slug: "certificate-verification-plugin",
    title: "WordPress Certificate Verification Plugin",
    description: "Custom WordPress plugin enabling instant verification.",
    longDescription:
      "Developed for educational institutions to issue and verify certificates.",
    problem: "Manual verification took days.",
    approach: "Custom PHP plugin.",
    challenges: "WordPress hook compatibility.",
    outcome: "Instant verification.",
    techStack: ["PHP"],
    category: "Plugin Development",
    featured: false,
    image: certificateVerificationImage,
    githubUrl:
      "https://github.com/Anand-Bora-0001/certificate-verification-plugin",
    status: "Completed",
  },
  {
    slug: "secure-virtual-file-system",
    title: "Secure Virtual File System (SVF)",
    description: "C++ based virtual file system with secure password handling.",
    longDescription:
      "SVF is a command-line virtual file system supporting authentication.",
    problem: "Lack of fine-grained access control.",
    approach: "C++ implementation with OpenSSL.",
    challenges: "Cross-platform compatibility.",
    outcome: "Secure local storage.",
    techStack: ["C++"],
    category: "System Programming",
    featured: false,
    image: svfImage,
    githubUrl: "https://github.com/Anand-Bora-0001/SVF",
    status: "Completed",
  },
  {
    slug: "shadowfox",
    title: "ShadowFox",
    description: "Java-based application utility.",
    longDescription: "A versatile application utility built in Java.",
    problem: "Need for a cross-platform desktop utility.",
    approach: "Used Java for maximum portability.",
    challenges: "UI responsiveness in Java.",
    outcome: "A functional desktop app.",
    techStack: ["Java"],
    category: "Desktop Application",
    featured: false,
    githubUrl: "https://github.com/Anand-Bora-0001/ShadowFox",
    status: "Completed",
  },
  {
    slug: "ecommerce-microservices",
    title: "E-Commerce App (Java)",
    description: "Java-based e-commerce platform.",
    longDescription: "A scalable e-commerce system built using Java.",
    problem: "Needed a reliable backend for a store.",
    approach: "Implemented in Java with standard frameworks.",
    challenges: "Database schema design.",
    outcome: "Successfully deployed system.",
    techStack: ["Java"],
    category: "Microservices",
    featured: false,
    image: ecommerceMicroservicesImage,
    githubUrl: "https://github.com/Anand-Bora-0001/Ecommerce-App",
    status: "Completed",
  },
  {
    slug: "cloud-based-saas-system",
    title: "Cloud SaaS System",
    description: "Secure SaaS platform for file management.",
    longDescription: "A Python-based cloud system that enables secure uploads.",
    problem: "Need for simple secure file management.",
    approach: "Python backend.",
    challenges: "Auth token management.",
    outcome: "Functional SaaS platform.",
    techStack: ["Python"],
    category: "Cloud",
    featured: false,
    image: saasImage,
    githubUrl: "https://github.com/Anand-Bora-0001/Cloud-SaaS-System",
    status: "Completed",
  },
  {
    slug: "monitor-google-sheet",
    title: "Monitor Google Sheet",
    description: "Python script to monitor Google Sheets changes.",
    longDescription: "Automated tool to track edits and trigger notifications.",
    problem: "Manual tracking of sheet changes.",
    approach: "Used Google Sheets API via Python.",
    challenges: "API rate limits.",
    outcome: "Automated alert system.",
    techStack: ["Python"],
    category: "Automation",
    featured: false,
    status: "Completed",
  },
  {
    slug: "absence-detection-system",
    title: "Absence Detection System",
    description: "System to detect and log absences automatically.",
    longDescription: "A Python application designed for tracking attendance.",
    problem: "Manual attendance is error prone.",
    approach: "Automated logging using Python.",
    challenges: "Data validation.",
    outcome: "Improved tracking accuracy.",
    techStack: ["Python"],
    category: "Automation",
    featured: false,
    githubUrl: "https://github.com/Anand-Bora-0001/Absence-Detection-System",
    status: "Completed",
  },
  {
    slug: "rent-a-bike",
    title: "Rent-A-Bike",
    description: "Bike rental management system.",
    longDescription: "Python application to manage bike inventory and rentals.",
    problem: "Tracking rentals on paper.",
    approach: "Built a CLI/GUI application in Python.",
    challenges: "Handling concurrent rentals.",
    outcome: "Digitized the rental workflow.",
    techStack: ["Python"],
    category: "Backend",
    featured: false,
    githubUrl: "https://github.com/Anand-Bora-0001/Rent-A-Bike",
    status: "Completed",
  },
  {
    slug: "contact-management-app",
    title: "Contact Management App",
    description: "Application for managing personal/business contacts.",
    longDescription: "Python based contact book with search and export.",
    problem: "Need a simple local contact manager.",
    approach: "Python script with local database.",
    challenges: "Search optimization.",
    outcome: "Fast contact retrieval.",
    techStack: ["Python"],
    category: "Utility",
    featured: false,
    githubUrl: "https://github.com/Anand-Bora-0001/Contact-Management-App",
    status: "Completed",
  },
  {
    slug: "fermi-pico-bagel-game",
    title: "Fermi Pico Bagel Game",
    description: "Classic logic game implemented in Python.",
    longDescription: "A terminal-based implementation of the deduction game.",
    problem: "Wanted to recreate a classic game.",
    approach: "Used Python's random and logic constructs.",
    challenges: "Input validation.",
    outcome: "A fun terminal game.",
    techStack: ["Python"],
    category: "Game",
    featured: false,
    githubUrl: "https://github.com/Anand-Bora-0001/Fermi-Pico-Bagel-Game",
    status: "Completed",
  },
];

const projectUpdates: Record<string, Partial<Project>> = {
  "honeycloud-x": {
    description:
      "Decoy services, ML threat classification, and a SOC dashboard. Co-built with Ganesh Kambli.",
    longDescription:
      "A collaborative honeypot and SOC intelligence project connecting decoy services to a FastAPI backend, a threat-classification pipeline, and a React dashboard.",
    outcome:
      "A connected workflow for collecting intrusion attempts, classifying behavior, and reviewing alerts and reports.",
    tradeOffs:
      "The lightweight Scikit-Learn pipeline is the practical default on constrained hosting. Deep-learning components are optional.",
    category: "Cybersecurity",
  },
  "enterprise-mlops": {
    image: "/projects/mlops.png",
    description:
      "A complete model workflow: datasets, experiments, registry, and explainable inference.",
  },
  "sentinelgrid-ai": {
    title: "SentinelGrid AI",
    category: "Cybersecurity",
    description:
      "Behavioral threat detection, threat-intelligence retrieval, and response workflows.",
    longDescription:
      "A cyber-resilience project bringing security telemetry, behavioral analysis, threat intelligence, and response orchestration together.",
    techStack: ["Python", "FastAPI", "React", "PostgreSQL", "ChromaDB"],
    outcome:
      "A project exploring the connection between threat detection, explanation, and response.",
  },
};
const newProjects: Project[] = [
  {
    slug: "amex-pulse",
    title: "AmEx Pulse AI",
    category: "Applied AI",
    featured: true,
    description:
      "Reconstructing customer journeys across channels, with AI-assisted insight into friction and next steps.",
    longDescription:
      "A customer-journey intelligence prototype developed for the American Express CodeStreet Hackathon 2026. Journey Replay connects events across mobile, web, and support so an agent can understand the path that led to a problem.",
    problem:
      "Support interactions lose context when customers move between channels. A useful next action depends on understanding the whole journey.",
    approach:
      "Combine a FastAPI backend and React interface with a journey timeline, analytics, and an AI copilot that explains customer friction.",
    challenges:
      "Connecting events into a coherent journey while making AI recommendations understandable to a support agent.",
    outcome:
      "A working prototype with customer profiles, journey replay, analytics, and a support command center. Impact figures in the repository are prototype goals, not measured customer outcomes.",
    techStack: ["Python", "FastAPI", "React", "AI copilots"],
    githubUrl: "https://github.com/Anand-Bora-0001/amex-pulse",
    image: "/projects/amex-pulse.png",
    features: [
      "Cross-channel journey replay",
      "Customer profiles and journey timelines",
      "AI-assisted recommendations with explanations",
      "Journey analytics and frustration heatmaps",
    ],
  },
  {
    slug: "resumeiq-ai",
    title: "ResumeIQ AI",
    category: "Applied AI",
    featured: true,
    description:
      "Turning a resume and a job description into actionable, AI-assisted feedback.",
    longDescription:
      "A resume-review SaaS project that compares uploaded documents with job descriptions and presents feedback on keywords, formatting, and ATS compatibility.",
    problem:
      "Job seekers need specific feedback on how their resume fits a role, rather than a generic score with no explanation.",
    approach:
      "Use a Next.js interface, document upload, and an AI analysis workflow to present scores and actionable suggestions. Prisma stores application records.",
    challenges:
      "Keeping document handling, model feedback, and account workflows understandable across local development and deployment.",
    outcome:
      "A functional local-mode project with AI review flows. Authentication and subscription billing are mocked in local mode and require configuration for production.",
    techStack: ["Next.js", "TypeScript", "Prisma", "OpenAI API"],
    githubUrl: "https://github.com/Anand-Bora-0001/resumeiq-ai",
    features: [
      "PDF and DOCX resume input",
      "Job-description comparison",
      "Keyword and formatting feedback",
      "Visual scoring and review dashboard",
    ],
  },
];
const selectedSlugs = [
  "amex-pulse",
  "honeycloud-x",
  "enterprise-mlops",
  "resumeiq-ai",
  "observability-platform",
  "cloud-monitoring-dashboard",
  "real-time-data-engineering",
  "sentinelgrid-ai",
];
export const projects: Project[] = [
  ...newProjects,
  ...originalProjects.map((project) => ({
    ...project,
    ...projectUpdates[project.slug],
    featured: selectedSlugs.includes(project.slug),
  })),
];
export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);
export const getFeaturedProjects = (): Project[] =>
  selectedSlugs
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is Project => Boolean(project));
