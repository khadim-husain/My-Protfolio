// Every fact below comes from SDE_Resume.pdf (public/resume.pdf). Nothing is invented.
// The phone number is intentionally never included.

export const profile = {
  name: "KHADIMHUSAIN",
  fullName: "Khadimhusain Nagalpara",
  role: "FULL STACK DEVELOPER | AI ENGINEER",
  location: "Bengaluru, Karnataka, India",
  intro:
    "MCA student and Software Engineer Intern with hands-on experience building backend systems, REST APIs, database integrations, and full-stack applications. Experienced in Python, Java, FastAPI, and AI/LLM API integration, with a strong interest in Software Engineering and Generative AI.",
  email: "nagalparakhadim440@gmail.com",
  github: "https://github.com/khadim-husain",
  githubLabel: "github.com/khadim-husain",
  linkedin: "https://www.linkedin.com/in/khadimhusain",
  linkedinLabel: "linkedin.com/in/khadimhusain",
  resume: "/Khadimhusain_Software_Engineer_Resume.pdf",
  resumeSde: "/Khadimhusain_Software_Engineer_Resume.pdf",
  resumeAi: "/Khadimhusain_AI_Engineer_Resume.pdf",
};

export const stats = [
  { value: "8.30", suffix: "/10", label: "BCA CGPA" },
  { value: "3", suffix: "", label: "Featured projects" },
  { value: "1", suffix: "", label: "Software engineering internship" },
];

export type Project = {
  name: string;
  tag: string;
  description: string;
  problem: string;
  features: string[];
  tech: string[];
};

export const projects: Project[] = [
  {
    name: "AI Career Nexus",
    tag: "AI · Full Stack",
    description:
      "AI-powered career guidance platform featuring resume analysis, job matching, and personalized career recommendations.",
    problem:
      "Gives job seekers career direction through intelligent resume evaluation and automated job role matching.",
    features: [
      "Resume analysis",
      "Job matching",
      "Personalized career recommendations",
      "FastAPI REST endpoints",
      "MySQL integration",
      "React.js frontend",
    ],
    tech: ["React.js", "Python", "FastAPI", "OpenAI API", "MySQL", "CSS"],
  },
  {
    name: "Smart Grocery Expiry Tracker",
    tag: "Java · Desktop",
    description:
      "Java desktop application to manage grocery inventory and track product expiry dates.",
    problem:
      "Helps keep track of grocery stock and flags products by expiry status so they are noticed in time.",
    features: [
      "Grocery inventory management",
      "Expiry-status classification",
      "Expiry alerts",
      "JDBC and MySQL database operations",
    ],
    tech: ["Java", "Java Swing", "JDBC", "MySQL", "OOP"],
  },
  {
    name: "AI-Powered Budget Finance Tracker",
    tag: "Python · AI",
    description:
      "Object-oriented Python finance tracker for expense tracking, budget monitoring, and AI-assisted financial insights.",
    problem:
      "Automates personal expense tracking and delivers AI-driven insights to manage personal finances effectively.",
    features: [
      "Expense tracking",
      "Budget monitoring",
      "AI-assisted financial insights",
      "MySQL database integration",
    ],
    tech: ["Python", "AI API", "MySQL", "OOP"],
  },
];

export const techStack = [
  "Python", "Java", "C++", "JavaScript", "Rust", "FastAPI", "React.js",
  "OpenAI API", "Gemini API", "Node.js", "Express.js", "SQL", "MySQL",
  "PostgreSQL", "JDBC", "Git", "GitHub", "Postman", "VS Code", "OOP", "DSA", "DBMS",
];

export type TimelineItem = {
  kind: "work" | "education";
  title: string;
  org: string;
  period: string;
  note?: string;
  points?: string[];
};

// Most recent start date first.
export const timeline: TimelineItem[] = [
  {
    kind: "work",
    title: "Software Engineer Intern",
    org: "Infiposts Private Limited",
    period: "April 2026 – October 2026",
    points: [
      "Contributed to Rust-based backend components and database integration for an AI Customer Support Copilot.",
      "Developed Windows automation skills and scripts using Hermes Agent for the Binary Agent project.",
      "Designed database schemas and created technical documentation for an annotation project.",
      "Developed and enhanced frontend pages for a B2B application.",
    ],
  },
  {
    kind: "education",
    title: "Master of Computer Applications (MCA)",
    org: "REVA University, Bengaluru",
    period: "2025–2027",
    note: "Currently pursuing",
  },
  {
    kind: "education",
    title: "Bachelor of Computer Applications (BCA)",
    org: "Sankalchand Patel University",
    period: "2022–2025",
    note: "CGPA: 8.30/10",
  },
];

export const about = {
  me: "I'm an MCA student and Software Engineer Intern with hands-on experience building backend systems, REST APIs, database integrations, and full-stack applications. Experienced in Python, Java, FastAPI, and AI/LLM API integration, with a strong interest in Software Engineering and Generative AI.",
  interests: [
    "Backend systems",
    "REST APIs",
    "Database integration",
    "AI & LLM API Integration",
    "Full-stack applications",
    "Rust backend development",
  ],
  philosophy:
    "Write clean, maintainable code that the next person can read, extend and debug.",
  approach:
    "Start from the fundamentals: data structures, algorithms and the database design underneath, then debug methodically until the behaviour is understood.",
};

export const skillGroups = [
  { label: "Programming", items: ["Python", "Java", "C++", "JavaScript", "Rust"] },
  { label: "AI & Generative AI", items: ["OpenAI API", "Gemini API", "LLM API Integration", "Prompt Engineering"] },
  { label: "Backend", items: ["FastAPI", "REST APIs", "Node.js", "Express.js", "API Integration"] },
  { label: "Databases", items: ["SQL", "MySQL", "PostgreSQL", "JDBC", "Database Schema Design"] },
  { label: "Frontend", items: ["React.js", "JavaScript", "CSS"] },
  { label: "Core Computer Science", items: ["OOP", "DSA", "DBMS", "Operating Systems"] },
  { label: "Tools", items: ["Git", "GitHub", "Postman", "VS Code"] },
];

export const principles = [
  { title: "Clean code", text: "Readable, maintainable code is a feature, not a luxury." },
  { title: "Solid fundamentals", text: "OOP, DSA and database design come before frameworks." },
  { title: "Debug with intent", text: "Understand the behaviour first, then fix the cause." },
  { title: "Integrate thoughtfully", text: "APIs and AI services should slot cleanly into the system." },
];
