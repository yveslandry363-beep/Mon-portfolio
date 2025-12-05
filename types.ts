export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  imageUrl: string;
  link: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  details: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  details: string[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}