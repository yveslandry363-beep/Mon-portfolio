import { Project, Experience, Education } from './types';

export const SOCIALS = {
  email: "yveslandry363@gmail.com",
  phone: "+491793996576",
  location: "Pirmasens, 66953, Deutschland",
  github: "https://github.com/yveslandry",
  linkedin: "https://linkedin.com/in/yveslandry"
};

export const EXPERIENCE: Experience[] = [
  {
    company: "Psb intralogistics GmbH",
    role: "Werkstudent als Assistent Ingenieur",
    period: "Derzeit",
    location: "Pirmasens",
    details: [
      "Optimierung komplexer Produktionsprozesse durch datengestützte Analysen.",
      "Entwicklung automatisierter Reporting-Tools für das technische Management.",
      "Schnittstellenmanagement zwischen Engineering und Produktion."
    ]
  },
  {
    company: "Lern-Academy",
    role: "MINT-Tutor & Mentor",
    period: "Sep. 2024 - Dez. 2024",
    location: "Kaiserslautern",
    details: [
      "Didaktische Aufbereitung komplexer mathematischer Konzepte.",
      "Mentoring in Physik, Informatik und Sprachen für High-Potential Schüler."
    ]
  },
  {
    company: "DCON GmbH",
    role: "Data Analyst (Werkstudent)",
    period: "Aug. 2023 - Aug. 2024",
    location: "Kaiserslautern",
    details: [
      "Advanced SQL & Excel Modeling für strategische Geschäftsentscheidungen.",
      "Implementierung von ETL-Pipelines zur Datenautomatisierung.",
      "Qualitätssicherung großer Datensätze durch statistische Methoden."
    ]
  },
  {
    company: "BMW Group",
    role: "Software Engineer (Werkstudent)",
    period: "Juli 2022 - Juli 2023",
    location: "München",
    details: [
      "Full Stack Entwicklung interner Tools mit Python und JavaScript.",
      "Architektur-Analyse und Refactoring bestehender Softwarelösungen.",
      "Integration von CI/CD Pipelines in agilen Entwicklungsprozessen."
    ]
  }
];

export const EDUCATION: Education[] = [
  {
    institution: "RPTU Kaiserslautern-Landau",
    degree: "Mathematik (M.Sc. Candidate)",
    year: "2025 (Laufend)",
    details: [
      "Fokus: Numerische Mathematik & Algorithmen.",
      "Nebenfach: Informatik & High Performance Computing."
    ]
  },
  {
    institution: "Universität Douala",
    degree: "Bachelor of Science (Physik)",
    year: "2021",
    details: [
      "Schwerpunkte: Quantenmechanik & Theoretische Physik.",
      "Abschlussarbeit: Simulation dynamischer Systeme."
    ]
  },
  {
    institution: "Gymnasium von Deido",
    degree: "High School Diploma (Exzellenz)",
    year: "2019",
    details: [
      "Auszeichnung für herausragende Leistungen in MINT-Fächern."
    ]
  }
];

export const SKILLS = [
  "JavaScript (ES6+)", "Python", "React.js", "Next.js 14", "TypeScript", 
  "Three.js / WebGL", "Node.js", "PostgreSQL", "TensorFlow", "Docker", "AWS", "Git"
];

// COLLECTION CURÉE D'IMAGES UNSPLASH STABLES (High-Res, Dark, Tech, 3D)
// Ces IDs sont fixes et vérifiés pour éviter les images cassées.
const IMG_IDS = [
  "1635070041078-e363dbe005cb", // Dark Abstract Waves
  "1550751827-4bd374c3f58b",    // Cyberpunk City Tech
  "1618005182384-a83a8bd57fbe", // Liquid Metal 3D
  "1614728963977-93d0a2830637", // Dark Geometry
  "1526374965328-7f61d4dc18c5", // Matrix Code Screen
  "1620712943543-066f5237e588", // Dark Gradient Mesh
  "1518770660439-4636190af475", // Computer Chip Macro
  "1605810230434-7631ac76ec81", // Data Center Lights
  "1504333638969-843461dbe57d", // Architecture Geometry
  "1604871000636-074fa5117945", // Neon Particles
  "1451187580459-43490279c0fa", // Low Poly Abstract
  "1550745165-9bc0b252726f",    // Retro Tech Interface
  "1614332252739-60df937fc9ba", // Mathematical Shapes
  "1634017839464-5c339ebe3cb4"  // Dark Fluid Art
];

const generateProjects = (): Project[] => {
  const categories = ["Artificial Intelligence", "Quantum Web", "FinTech Core", "Immersive 3D", "EcoSystem"];
  const projects: Project[] = [];

  for (let i = 0; i < 50; i++) {
    const category = categories[i % categories.length];
    // Utilisation cyclique des IDs sûrs pour garantir qu'il n'y a pas de lien mort
    const imgId = IMG_IDS[i % IMG_IDS.length];
    
    projects.push({
      id: i + 1,
      title: `${category} Node ${i < 9 ? '0' : ''}${i + 1}`,
      category: category,
      description: `Une architecture système avancée explorant les limites de ${category}. Intègre des algorithmes génératifs, un rendu temps réel optimisé et une couche de données distribuée pour une scalabilité maximale.`,
      tech: ["Next.js", "WebGL", "Rust", "GraphQL"],
      // Optimisation force en haute qualité (q=90) et grande largeur (w=3840)
      imageUrl: `https://images.unsplash.com/photo-${imgId}?q=90&w=3840&auto=format&fit=crop`,
      link: "#"
    });
  }
  return projects;
};

export const PROJECTS = generateProjects();