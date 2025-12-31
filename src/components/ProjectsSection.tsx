import { useState, useEffect, useRef, useCallback } from "react";

// =============================================================================
// DATOS DE PROYECTOS
// Reemplace los placeholders "PLACEHOLDER_..." con URLs reales de imágenes
// =============================================================================

interface Project {
  id: string;
  name: string;
  type: string;
  vibeLine: string;
  liveUrl: string;
  coverImage: string;
  favicon: string;
  logoScale?: number; // Opcional: escala del logo (default 1)
  images: string[];
  accent: string;
}

const projects: Project[] = [
  {
    id: "gympas",
    name: "Gympas",
    type: "Plataforma SaaS · Gestión integral de gimnasios",
    vibeLine: "Producto real, datos en acción",
    liveUrl: "https://gympas.ar",
    coverImage: "/images/Gympas/HeroGympas.png",
    favicon: "/images/Gympas/gympas-logo.svg",
    logoScale: 0.65, // Logo de Gympas más chico
    images: [
      // REEMPLAZAR: hero landing
      "/images/Gympas/HeroGympas.png",
      // REEMPLAZAR: dashboard / módulo
      "/images/Gympas/ConoceGympas.png",
      // REEMPLAZAR: cards módulos
      "/images/Gympas/ModalsGympas.png",
      // REEMPLAZAR: precios / contacto (opcional)
      "/images/Gympas/FormularioGympas.png",
    ],
    accent: "#6366f1", // indigo
  },
  {
    id: "dym-cosmeticos",
    name: "DyM Cosméticos",
    type: "Vidriera digital · Catálogo premium",
    vibeLine: "Estética limpia, sistema de stock pro",
    liveUrl: "https://dymcosmeticos.com.ar",
    // REEMPLAZAR: imagen de portada para la card
    coverImage: "/images/Dym/Hero.png",
    // REEMPLAZAR: favicon/logo del proyecto
    favicon: "/images/Dym/DymFavicon.png",
    images: [
      "/images/Dym/Hero.png",
      "/images/Dym/Captura de pantalla 2025-12-30 175306.png",
      "/images/Dym/Captura de pantalla 2025-12-30 175124.png",
      "/images/Dym/Captura de pantalla 2025-12-30 175306.png",
    ],
    accent: "#ec4899", // pink
  },
  {
    id: "power-gym",
    name: "Power Gym",
    type: "Web institucional · Marca física",
    vibeLine: "Identidad fuerte, fotos reales",
    liveUrl: "https://powergym.ar",
    // REEMPLAZAR: imagen de portada para la card
    coverImage: "/images/PowerGym/HeroPower.png",
    // REEMPLAZAR: favicon/logo del proyecto
    favicon: "/images/PowerGym/faviconPower.png",
    images: [
      // REEMPLAZAR: hero
      "/images/PowerGym/HeroPower.png",
      // REEMPLAZAR: galería
      "/images/PowerGym/GaleriaPower.png",
      // REEMPLAZAR: contacto (opcional)
      "/images/PowerGym/faqsPower.png",
    ],
    accent: '#ef4444', // red
  },
];

// =============================================================================
// MODAL DE PROYECTO
// =============================================================================

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Foco inicial en botón cerrar
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // ESC cierra modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Click afuera cierra modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Proyecto: ${project.name}`}
    >
      {/* Overlay oscuro con blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      />

      {/* Contenedor del modal - borde exterior */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-6xl max-h-[90vh] rounded-2xl bg-dark-800/95 border shadow-2xl overflow-hidden"
        style={{
          borderColor: `${project.accent}40`,
        }}
      >
        {/* Contenedor interior con scroll */}
        <div 
          className="max-h-[90vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${project.accent}60 transparent`,
          }}
        >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-start justify-between p-6 bg-dark-800/95 border-b border-dark-700 backdrop-blur-sm">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              {project.name}
            </h2>
            <p className="mt-1 text-sm text-dark-400">{project.type}</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-700 hover:bg-dark-600 text-dark-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
            aria-label="Cerrar modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-8">
          {/* Hero grande (primera imagen) - clickeable */}
          <button 
            onClick={() => setLightboxImage(project.images[0])}
            className="relative aspect-video w-full overflow-hidden rounded-xl bg-dark-700 cursor-zoom-in group/hero"
          >
            <img
              src={project.images[0]}
              alt={`${project.name} - Vista principal`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/hero:scale-105"
            />
            {/* Gradient overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />
            {/* Icono de zoom */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </button>

          {/* Vibe Line */}
          <p
            className="text-xl sm:text-2xl font-light italic tracking-widest text-center uppercase"
            style={{ 
              color: project.accent,
              textShadow: `0 0 30px ${project.accent}50`,
            }}
          >
            {project.vibeLine}
          </p>

          {/* Slider horizontal simple */}
          {project.images.length > 1 && (
            <div className="relative -mx-6 px-6">
              <div className={`flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-dark-600 scrollbar-track-transparent ${project.images.length <= 3 ? 'justify-center' : ''}`}>
                {project.images.slice(1).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxImage(image)}
                    className="flex-shrink-0 w-[280px] sm:w-[360px] md:w-[420px] snap-start cursor-zoom-in group/thumb"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-dark-700 border border-dark-600/50 transition-all duration-300 group-hover/thumb:border-dark-500">
                      <img
                        src={image}
                        alt={`${project.name} - Imagen ${index + 2}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                      />
                      {/* Icono de zoom */}
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lightbox para ver imágenes en grande */}
          {lightboxImage && (
            <div 
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              onClick={() => setLightboxImage(null)}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
              
              {/* Imagen */}
              <div 
                className="relative z-10 max-w-[95vw] max-h-[90vh] animate-[fadeInScale_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={lightboxImage}
                  alt="Vista ampliada"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  style={{
                    boxShadow: `0 0 100px ${project.accent}30`,
                  }}
                />
                
                {/* Botón cerrar */}
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-dark-700/80 hover:bg-dark-600 text-white flex items-center justify-center transition-colors"
                  aria-label="Cerrar imagen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Hint para cerrar */}
              <p className="absolute bottom-6 left-0 right-0 text-center text-dark-500 text-sm">
                Click en cualquier lugar para cerrar
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="flex justify-center pt-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900"
              style={{
                backgroundColor: project.accent,
                boxShadow: `0 4px 24px ${project.accent}40`,
              }}
            >
              Ver proyecto
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
        {/* Fin contenedor interior con scroll */}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CARD DE PROYECTO
// =============================================================================

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left rounded-xl overflow-hidden bg-dark-800 border border-dark-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 hover:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
    >
      {/* Cover con favicon overlay */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Imagen de fondo con blur sutil */}
        <img
          src={project.coverImage}
          alt={project.name}
          className="absolute inset-0 w-full h-full object-cover object-center blur-[2px] scale-110 transition-transform duration-500 group-hover:scale-115"
        />
        {/* Overlay oscuro - extendido más allá del contenedor */}
        <div className="absolute -inset-2 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
        {/* Gradient overlay - extendido y fusionado con el fondo */}
        <div className="absolute -inset-2 bg-gradient-to-t from-dark-800 via-dark-800/50 to-transparent opacity-95" />
        
        {/* Favicon centrado con glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="transition-transform duration-300 group-hover:scale-110"
            style={{
              filter: `drop-shadow(0 0 20px ${project.accent}) drop-shadow(0 0 40px ${project.accent}60)`,
            }}
          >
            <img
              src={project.favicon}
              alt={`${project.name} - Logo`}
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
              style={{
                transform: `scale(${project.logoScale || 1})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Accent line en hover - fuera del contenedor de imagen */}
      <div
        className="h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: project.accent }}
      />

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-white tracking-tight group-hover:text-dark-200 transition-colors">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-dark-400 line-clamp-1">
          {project.type}
        </p>
      </div>
    </button>
  );
}

// =============================================================================
// SECCIÓN PRINCIPAL
// =============================================================================

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  // Scroll del carousel
  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.offsetWidth * 0.85; // 85vw
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  return (
    <section id="proyectos" className="section-padding">
      <div className="container-custom">
        {/* Header de sección */}
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">
            Nuestros <span className="gradient-text">Proyectos</span>
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Experiencias digitales que conectan marcas con personas
          </p>
        </div>

        {/* Carousel wrapper con flechas - solo visible en mobile */}
        <div className="relative">
          {/* Flecha izquierda */}
          <button
            onClick={() => scrollCarousel('left')}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-800/90 backdrop-blur-sm border border-dark-600 flex items-center justify-center transition-all duration-300 hover:border-primary-400/50 hover:shadow-lg hover:shadow-primary-400/20 -translate-x-1"
            aria-label="Proyecto anterior"
          >
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Flecha derecha */}
          <button
            onClick={() => scrollCarousel('right')}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-800/90 backdrop-blur-sm border border-dark-600 flex items-center justify-center transition-all duration-300 hover:border-primary-400/50 hover:shadow-lg hover:shadow-primary-400/20 translate-x-1"
            aria-label="Proyecto siguiente"
          >
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards - Carousel centrado en mobile, Grid en desktop */}
          <div 
            ref={carouselRef}
            className="
              flex gap-4 overflow-x-auto snap-x snap-mandatory
              px-[7.5vw]
              md:grid md:grid-cols-2 md:overflow-visible md:px-0
              lg:grid-cols-3 md:gap-6 lg:gap-8
            "
            style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* IE/Edge */
            }}
          >
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center md:w-auto md:max-w-none"
              >
                <ProjectCard
                  project={project}
                  onClick={() => handleOpenModal(project)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </section>
  );
}
