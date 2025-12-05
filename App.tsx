import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { 
  X, Menu, ArrowRight, Brain, 
  Layout, Database, CheckCircle, Mail, Phone, MapPin, ExternalLink, Download, Sun, Moon
} from 'lucide-react';
import { PROJECTS, EXPERIENCE, EDUCATION, SOCIALS } from './constants';
import { Project } from './types';

// --- CONFIGURATION ---
const MY_PORTRAIT_URL = "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=90&w=3840&auto=format&fit=crop";

// --- REAL-TIME DATABASE IMPLEMENTATION (LocalStorage) ---
const LocalStorageDB = {
  saveMessage: (data: any) => {
    try {
      const existing = JSON.parse(localStorage.getItem('yl_portfolio_messages') || '[]');
      const newMessage = { id: crypto.randomUUID(), ...data, timestamp: new Date().toISOString() };
      existing.push(newMessage);
      localStorage.setItem('yl_portfolio_messages', JSON.stringify(existing));
      return true;
    } catch (e) { console.error(e); return false; }
  },
  incrementVisits: () => {
    try {
      const current = parseInt(localStorage.getItem('yl_portfolio_visits') || '0');
      localStorage.setItem('yl_portfolio_visits', (current + 1).toString());
    } catch (e) {}
  }
};

// --- CONTEXT ---
const CursorContext = React.createContext<{
  setCursorVariant: (variant: 'default' | 'hover' | 'text') => void;
}>({ setCursorVariant: () => {} });

const ThemeContext = React.createContext<{
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}>({ theme: 'dark', toggleTheme: () => {} });

// --- UTILITIES ---

// 1. Theme Toggle Component
const ThemeToggle = () => {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white dark:text-white text-black"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-black" />}
    </button>
  );
};

// 2. Quantum Card Component
interface QuantumCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

const QuantumCard: React.FC<QuantumCardProps> = ({ children, className = "", delay = 0, onClick }) => {
  const { setCursorVariant } = React.useContext(CursorContext);
  const { theme } = React.useContext(ThemeContext);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`relative group overflow-hidden ${className} ${theme === 'dark' ? 'quantum-glass' : 'bg-white border border-gray-200 shadow-xl'}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
      onClick={onClick}
    >
      {theme === 'dark' && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.1),
                transparent 80%
              )
            `,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

// 3. Marvel Preloader (FULL SCREEN)
const MarvelPreloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPortrait, setShowPortrait] = useState(false);
  const images = PROJECTS.map(p => p.imageUrl);

  useEffect(() => {
    LocalStorageDB.incrementVisits();
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowPortrait(true), 200);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 40);

    return () => { clearInterval(timer); clearInterval(imageTimer); };
  }, [images.length]);

  useEffect(() => {
    if (showPortrait) {
      const finishTimer = setTimeout(onComplete, 2500);
      return () => clearTimeout(finishTimer);
    }
  }, [showPortrait, onComplete]);

  return (
    <motion.div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden" exit={{ opacity: 0, transition: { duration: 1 } }}>
      <div className="absolute inset-0 w-full h-full perspective-1000">
        {!showPortrait && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none mix-blend-difference">
            <h1 className="text-[25vw] font-display font-bold text-white tracking-tighter leading-none select-none">{count}</h1>
          </div>
        )}
        <AnimatePresence mode='popLayout'>
          {!showPortrait && (
            <motion.div key={currentImageIndex} className="absolute inset-0 w-full h-full overflow-hidden" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 1, zIndex: 0 }} transition={{ duration: 0.1 }}>
              <img src={images[currentImageIndex]} alt="Preview" className="w-full h-full object-cover grayscale contrast-125 brightness-50" />
              <div className="absolute inset-0 bg-noise opacity-30" />
              <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay" />
            </motion.div>
          )}
        </AnimatePresence>
        {showPortrait && (
          <motion.div className="absolute inset-0 w-full h-full bg-[#050505] flex items-center justify-center overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
             <motion.div className="absolute inset-0 bg-white z-[60]" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }} />
             <motion.div className="relative w-full h-full" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2.5 }}>
               <img src={MY_PORTRAIT_URL} alt="Yves-Landry" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
               <motion.div className="absolute bottom-[15%] left-0 right-0 text-center z-20" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
                 <h2 className="text-5xl md:text-8xl font-display font-bold text-white uppercase tracking-widest text-shadow-lg mb-4">Yves-Landry</h2>
                 <p className="text-sm md:text-xl font-mono text-gray-300 tracking-[0.5em] uppercase">Système Opérationnel</p>
               </motion.div>
             </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// 3. Magnetic Button
const MagneticButton = ({ children, className, onClick }: { children?: React.ReactNode, className?: string, onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { setCursorVariant } = React.useContext(CursorContext);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    x.set((clientX - (left + width / 2)) * 0.3);
    y.set((clientY - (top + height / 2)) * 0.3);
  };

  return (
    <motion.button
      ref={ref} className={className} onClick={onClick} onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorVariant('hover')} onMouseLeave={() => { x.set(0); y.set(0); setCursorVariant('default'); }}
      style={{ x, y }} whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// --- SECTIONS ---

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setCursorVariant } = React.useContext(CursorContext);
  
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 flex justify-between items-center mix-blend-difference text-white">
      <button onClick={() => scrollTo('home')} className="text-2xl font-display font-bold tracking-tighter hover:scale-105 transition-transform z-50">Y | S</button>
      
      <div className="hidden md:flex space-x-12 items-center">
        {['home', 'about', 'work', 'contact'].map((item) => (
          <button 
            key={item} 
            onClick={() => scrollTo(item)}
            className="text-xs font-bold uppercase tracking-widest relative group text-gray-400 hover:text-white transition-colors"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            {item}
            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </button>
        ))}
        <ThemeToggle />
      </div>

      <button className="md:hidden z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X /> : <Menu />}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#050505] z-40 flex flex-col items-center justify-center gap-8 md:hidden">
            {['home', 'about', 'work', 'contact'].map((item) => (
              <button key={item} onClick={() => scrollTo(item)} className="text-3xl uppercase font-bold tracking-widest text-white">{item}</button>
            ))}
            <ThemeToggle />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HomeSection = () => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 400]);

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden dark:bg-[#050505] bg-gray-50 transition-colors duration-500">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ y: yBg }} className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-purple-900/20 dark:bg-purple-900/20 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen" />
        <motion.div style={{ y: yBg }} className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-blue-900/20 dark:bg-blue-900/20 bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm md:text-lg font-mono dark:text-gray-500 text-gray-500 mb-6 tracking-[0.2em] uppercase"
        >
          Creative Technologist
        </motion.h2>
        <h1 className="text-[12vw] md:text-[8vw] font-display font-bold leading-[0.85] tracking-tighter mb-8 mix-blend-difference dark:text-white text-black">
          YVES-LANDRY<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">SIMO</span>
        </h1>
        <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
           className="max-w-xl text-lg md:text-xl dark:text-gray-400 text-gray-600 leading-relaxed font-light md:ml-2 mb-12"
        >
           Fusionnant Mathématiques avancées et Développement Web AAA.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col md:flex-row gap-6 md:ml-2 justify-center md:justify-start"
        >
           <MagneticButton onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 dark:bg-white bg-black dark:text-black text-white rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-colors">
             Explorer Projets <ArrowRight className="w-4 h-4" />
           </MagneticButton>
           
           <a href="/cv.pdf" download="Yves-Landry_CV.pdf" className="cursor-none">
             <MagneticButton className="px-8 py-4 border dark:border-white/20 border-black/20 dark:text-white text-black rounded-full font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
               Download CV <Download className="w-4 h-4" />
             </MagneticButton>
           </a>
        </motion.div>
      </div>
    </section>
  );
};

const InfoSection = () => {
  return (
    <section id="about" className="py-32 container mx-auto px-6 border-t dark:border-white/5 border-black/5 dark:bg-[#050505] bg-white transition-colors duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-gray-500 mb-8 uppercase tracking-[0.2em] flex items-center gap-2"
          >
            <span className="w-8 h-[1px] bg-gray-500"></span> À Propos
          </motion.h3>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-display font-bold mb-8 dark:text-white text-black"
          >
            Architecte de la <br/><span className="text-gray-500">Complexité.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="dark:text-gray-400 text-gray-600 text-lg leading-relaxed mb-8"
          >
            Je transforme des problèmes mathématiques complexes en interfaces numériques fluides. Mon approche combine rigueur scientifique et créativité artistique.
          </motion.p>
          <div className="grid grid-cols-2 gap-6">
             {[{icon: Brain, t:"Math"}, {icon: Layout, t:"Design"}, {icon: Database, t:"Data"}, {icon: CheckCircle, t:"Qualité"}].map((i, idx) => (
               <QuantumCard key={idx} delay={idx * 0.1} className="p-6 rounded-2xl flex flex-col items-start gap-4 h-full justify-center">
                 <i.icon className="text-blue-400 w-8 h-8" strokeWidth={1.5} />
                 <span className="font-bold dark:text-white text-black text-lg">{i.t}</span>
               </QuantumCard>
             ))}
          </div>
        </div>
        
        <div id="experience" className="relative pl-8 border-l dark:border-white/10 border-black/10">
           <motion.h3 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-xs font-mono text-gray-500 mb-12 uppercase tracking-[0.2em] absolute -left-[11px] top-0 dark:bg-[#050505] bg-white py-2"
           >
             Parcours
           </motion.h3>
           {[...EXPERIENCE, ...EDUCATION].slice(0, 4).map((item: any, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                className="mb-12 relative group"
              >
                <div className="absolute -left-[37px] top-2 w-3 h-3 bg-blue-500 rounded-full border-4 dark:border-[#050505] border-white group-hover:scale-125 transition-transform" />
                <span className="text-xs font-mono text-blue-400 mb-1 block">{item.year || item.period}</span>
                <h4 className="text-xl font-bold dark:text-white text-black">{item.role || item.degree}</h4>
                <p className="dark:text-gray-400 text-gray-600 text-sm mb-2">{item.company || item.institution}</p>
                <p className="text-gray-500 text-xs max-w-md">{item.details[0]}</p>
              </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

const WorkSection = () => {
  const [filter, setFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { setCursorVariant } = React.useContext(CursorContext);
  
  const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter);

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  return (
    <section id="work" className="py-32 dark:bg-[#050505] bg-gray-50 relative border-t dark:border-white/5 border-black/5 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-7xl font-display font-bold dark:text-white text-black">SÉLECTION<br/><span className="text-stroke-1 dark:text-transparent text-gray-300">PROJETS</span></h2>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-4 mt-8 md:mt-0 justify-end max-w-xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setVisibleCount(9); }}
                className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${filter === cat ? 'dark:bg-white bg-black dark:text-black text-white border-transparent' : 'bg-transparent text-gray-400 border-gray-300 dark:border-white/20 hover:border-black dark:hover:border-white'}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {displayedProjects.map((project) => (
              <QuantumCard 
                key={project.id}
                className="h-[450px] cursor-pointer rounded-2xl dark:border-white/5 border-black/5"
                onClick={() => setSelectedProject(project)}
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 scale-100 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                   <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     <span className="text-xs font-mono text-blue-400 mb-2 block">{project.category}</span>
                     <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                     <p className="text-sm text-gray-300 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{project.description}</p>
                   </div>
                </div>
              </QuantumCard>
            ))}
          </AnimatePresence>
        </motion.div>

        {displayedProjects.length < filteredProjects.length && (
          <div className="mt-20 flex justify-center">
            <MagneticButton onClick={() => setVisibleCount(prev => prev + 6)} className="px-10 py-4 border dark:border-white/20 border-black/20 rounded-full dark:hover:bg-white hover:bg-black dark:hover:text-black hover:text-white transition-colors uppercase text-xs font-bold tracking-widest dark:text-white text-black">
              Charger Plus
            </MagneticButton>
          </div>
        )}
      </div>

      {/* FULL SCREEN MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button 
                onClick={() => setSelectedProject(null)} 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-colors"
              >
                <X />
              </motion.button>
              
              <div className="relative h-1/2 md:h-full w-full overflow-hidden">
                <img src={selectedProject.imageUrl} className="w-full h-full object-cover" alt={selectedProject.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-blue-500 font-mono text-sm mb-4 tracking-widest uppercase">{selectedProject.category}</div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">{selectedProject.title}</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">{selectedProject.description}</p>
                
                <div className="mb-8">
                  <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map(t => (
                      <span key={t} className="px-3 py-1 border border-white/10 rounded text-sm text-gray-300">{t}</span>
                    ))}
                  </div>
                </div>

                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                  <MagneticButton className="w-max px-8 py-4 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    Voir Live Demo <ExternalLink size={16} />
                  </MagneticButton>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ContactSection = () => {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    LocalStorageDB.saveMessage(Object.fromEntries(formData.entries()));
    setStatus('success');
  };

  return (
    <section id="contact" className="py-32 dark:bg-[#020202] bg-white relative border-t dark:border-white/5 border-black/5 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
             <h2 className="text-6xl md:text-8xl font-display font-bold dark:text-white text-black mb-12 tracking-tighter">LET'S<br/>CREATE</h2>
             <div className="space-y-8">
               <div className="flex items-center gap-6 dark:text-white text-black"><Mail size={24} /><span className="text-xl">{SOCIALS.email}</span></div>
               <div className="flex items-center gap-6 dark:text-white text-black"><Phone size={24} /><span className="text-xl">{SOCIALS.phone}</span></div>
               <div className="flex items-center gap-6 dark:text-white text-black"><MapPin size={24} /><span className="text-xl">Allemagne</span></div>
             </div>
          </div>

          <QuantumCard className="p-10 rounded-3xl">
             {status === 'success' ? (
               <div className="text-center py-20">
                 <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                 <h3 className="text-2xl font-bold dark:text-white text-black mb-2">Message Reçu</h3>
                 <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-gray-400 underline">Envoyer un autre</button>
               </div>
             ) : (
               <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <input required name="name" type="text" placeholder="Nom" className="w-full bg-transparent border-b dark:border-white/20 border-black/20 py-4 dark:text-white text-black text-xl focus:border-blue-500 outline-none transition-colors" />
                  <input required name="email" type="email" placeholder="Email" className="w-full bg-transparent border-b dark:border-white/20 border-black/20 py-4 dark:text-white text-black text-xl focus:border-blue-500 outline-none transition-colors" />
                  <textarea required name="message" rows={4} placeholder="Message" className="w-full bg-transparent border-b dark:border-white/20 border-black/20 py-4 dark:text-white text-black text-xl focus:border-blue-500 outline-none transition-colors resize-none" />
                  <button type="submit" className="w-full py-6 dark:bg-white bg-black dark:text-black text-white font-bold uppercase tracking-widest hover:opacity-90 transition-colors rounded-xl flex items-center justify-center gap-3">
                    Envoyer Le Message
                  </button>
               </form>
             )}
          </QuantumCard>
        </div>
      </div>
    </section>
  );
};

// --- APP ENTRY ---
const AppContent = () => (
  <main className="min-h-screen dark:bg-[#050505] bg-white dark:text-white text-black selection:bg-blue-500/20 transition-colors duration-500">
    <Navbar />
    <HomeSection />
    <InfoSection />
    <WorkSection />
    <ContactSection />
    <footer className="py-8 border-t dark:border-white/5 border-black/5 text-center text-xs text-gray-600 font-mono">
       © 2025 YVES-LANDRY SIMO. SYSTEM ONLINE.
    </footer>
  </main>
);

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'text'>('default');

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", moveMouse);
    return () => window.removeEventListener("mousemove", moveMouse);
  }, []);

  const variants = {
    default: { width: 12, height: 12, x: -6, y: -6, backgroundColor: "#3B82F6", mixBlendMode: "difference" as const },
    hover: { width: 60, height: 60, x: -30, y: -30, backgroundColor: "#3B82F6", mixBlendMode: "difference" as const },
    text: { width: 4, height: 30, x: -2, y: -15, backgroundColor: "#3B82F6", mixBlendMode: "normal" as const }
  };

  return (
    <CursorContext.Provider value={{ setCursorVariant }}>
       <motion.div className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block" variants={variants} animate={cursorVariant} style={{ left: useSpring(cursorX, {damping: 25, stiffness: 400}), top: useSpring(cursorY, {damping: 25, stiffness: 400}) }} />
       <AppContent />
    </CursorContext.Provider>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AnimatePresence mode="wait">
        {loading && <MarvelPreloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && <CustomCursor />}
    </ThemeContext.Provider>
  );
};

export default App;
