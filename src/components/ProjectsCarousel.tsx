/**
 * ProjectsCarousel - Premium Futuristic Carousel
 * 
 * Features:
 * - Center card prominence with scale/z-index
 * - Side cards with opacity/blur for depth
 * - Autoplay with pause on hover/drag
 * - Mobile snap/swipe support
 * - "Coming Soon" empty battery card
 * - Villex aesthetic: cyan/magenta/violet, glassmorphism, HUD elements
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ProjectPowerCellCard } from './ProjectPowerCellCard';

// =============================================================================
// CONFIGURABLE PARAMETERS
// =============================================================================
const CAROUSEL_CONFIG = {
  // Autoplay
  autoplayDelay: 5200,
  autoplayStopOnInteraction: false,
  autoplayStopOnMouseEnter: false, // We handle this manually
  
  // Transitions
  transitionDuration: 700,
  
  // Card scales
  centerScale: 1.05,
  sideScale: 0.92,
  
  // Card opacities
  centerOpacity: 1,
  sideOpacity: 0.5,
  
  // Blur
  sideBlur: 2, // px
  
  // Resume autoplay after X seconds of inactivity
  resumeAutoplayDelay: 4000,
};

// =============================================================================
// PROJECT DATA
// =============================================================================
interface Project {
  id: string;
  name: string;
  type: string;
  vibeLine: string;
  liveUrl: string;
  coverImage: string;
  favicon: string;
  logoScale?: number;
  images: string[];
  mobileImages?: string[];
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
    logoScale: 0.65,
    images: [
      "/images/Gympas/HeroGympas.png",
      "/images/Gympas/ConoceGympas.png",
      "/images/Gympas/ModalsGympas.png",
      "/images/Gympas/FormularioGympas.png",
    ],
    mobileImages: [
      "/images/ProjectsMobile/GympasarMobile/GympasarHero-Mobile.jpeg",
      "/images/ProjectsMobile/GympasarMobile/GympasarGestion-Mobile.jpeg",
      "/images/ProjectsMobile/GympasarMobile/GympasarModulos-Mobile.jpeg",
      "/images/ProjectsMobile/GympasarMobile/GympasarRecursos-Mobile.jpeg",
    ],
    accent: "#6366f1",
  },
  {
    id: "dym-cosmeticos",
    name: "DyM Cosméticos",
    type: "Vidriera digital · Catálogo premium",
    vibeLine: "Estética limpia, sistema de stock pro",
    liveUrl: "https://dymcosmeticos.com.ar",
    coverImage: "/images/Dym/Hero.png",
    favicon: "/images/Dym/DymFavicon.png",
    images: [
      "/images/Dym/Hero.png",
      "/images/Dym/Captura de pantalla 2025-12-30 175306.png",
      "/images/Dym/Captura de pantalla 2025-12-30 175124.png",
      "/images/Dym/Captura de pantalla 2025-12-30 175306.png",
    ],
    mobileImages: [
      "/images/ProjectsMobile/dymmobile/DymHero-Mobile.jpeg",
      "/images/ProjectsMobile/dymmobile/DymCatalogo-Mobile.jpeg",
      "/images/ProjectsMobile/dymmobile/DymDestacados-Mobile.jpeg",
      "/images/ProjectsMobile/dymmobile/DymAdmin-Mobile.jpeg",
    ],
    accent: "#ec4899",
  },
  {
    id: "power-gym",
    name: "Power Gym",
    type: "Web institucional · Marca física",
    vibeLine: "Identidad fuerte, fotos reales",
    liveUrl: "https://powergym.ar",
    coverImage: "/images/PowerGym/HeroPower.png",
    favicon: "/images/PowerGym/faviconPower.png",
    images: [
      "/images/PowerGym/HeroPower.png",
      "/images/PowerGym/GaleriaPower.png",
      "/images/PowerGym/faqsPower.png",
    ],
    mobileImages: [
      "/images/ProjectsMobile/PowergymMobile/PowergymHero-Mobile.jpeg",
      "/images/ProjectsMobile/PowergymMobile/PowergymFotos-Mobile.jpeg",
      "/images/ProjectsMobile/PowergymMobile/PowergymIG-Mobile.jpeg",
    ],
    accent: '#ef4444',
  },
];

// =============================================================================
// COMING SOON CARD COMPONENT
// =============================================================================
function ComingSoonCard() {
  const totalSegments = 5;
  
  return (
    <div
      className="power-cell group relative w-full text-left rounded-xl overflow-hidden cursor-not-allowed"
      aria-label="Próximo proyecto - Próximamente"
    >
      {/* Preview area with empty socket aesthetic */}
      <div className="relative aspect-[4/3] sm:aspect-[3/2] overflow-hidden bg-dark-900">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0,229,255,0.1) 1px, transparent 1px),
              linear-gradient(rgba(0,229,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Empty socket center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Socket outline */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-dark-600 flex items-center justify-center">
              {/* Question mark or empty indicator */}
              <span className="text-4xl sm:text-5xl text-dark-600 font-light">?</span>
            </div>
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-2xl border border-primary-400/20 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 z-10">
          <div className="w-4 h-px bg-dark-600" />
          <div className="w-px h-4 bg-dark-600" />
        </div>
        <div className="absolute top-2 right-2 z-10">
          <div className="w-4 h-px bg-dark-600 ml-auto" />
          <div className="w-px h-4 bg-dark-600 ml-auto" />
        </div>
        <div className="absolute bottom-2 left-2 z-10">
          <div className="w-px h-4 bg-dark-600" />
          <div className="w-4 h-px bg-dark-600" />
        </div>
        
        {/* Status indicator (matches power cell style) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-dark-500 animate-pulse" style={{ animationDuration: '2s' }} />
          <span className="text-[10px] font-mono tracking-wider uppercase text-dark-500">
            STANDBY
          </span>
        </div>

        {/* Battery bar - VERTICAL SEGMENTS matching power cell style */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="flex flex-col-reverse gap-1 px-2 py-2 rounded-lg bg-dark-800/90 backdrop-blur-sm border border-dark-700">
            {[...Array(totalSegments)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-4 rounded-sm bg-dark-600/50 border border-dark-500/30"
              />
            ))}
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-dark-800 to-transparent pointer-events-none" />
      </div>

      {/* Info section */}
      <div className="relative p-4 bg-dark-800">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-600 to-transparent" />
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base sm:text-lg font-semibold tracking-tight text-dark-500">
              Próximamente
            </h3>
            <p className="mt-0.5 text-xs sm:text-sm text-dark-600 line-clamp-1">
              Nuevo proyecto en desarrollo
            </p>
          </div>
          
          {/* Disabled button */}
          <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-dark-700/30 border border-dark-700/50">
            <span className="text-xs font-medium text-dark-600">...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CAROUSEL DOT INDICATORS
// =============================================================================
interface DotButtonProps {
  selected: boolean;
  onClick: () => void;
  index: number;
}

function DotButton({ selected, onClick, index }: DotButtonProps) {
  return (
    <button
      className={`relative h-1.5 rounded-full transition-all duration-300 ${
        selected 
          ? 'w-8 bg-primary-400 shadow-[0_0_10px_rgba(0,229,255,0.5)]' 
          : 'w-1.5 bg-dark-600 hover:bg-dark-500'
      }`}
      onClick={onClick}
      aria-label={`Ir al proyecto ${index + 1}`}
    />
  );
}

// =============================================================================
// CAROUSEL ARROW BUTTONS
// =============================================================================
interface ArrowButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}

function ArrowButton({ direction, onClick, disabled }: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full 
        bg-dark-800/80 backdrop-blur-sm border border-dark-700/50 
        flex items-center justify-center
        transition-all duration-300
        ${disabled 
          ? 'opacity-30 cursor-not-allowed' 
          : 'hover:bg-dark-700 hover:border-primary-400/30 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]'
        }
        ${direction === 'prev' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'}
      `}
      aria-label={direction === 'prev' ? 'Proyecto anterior' : 'Siguiente proyecto'}
    >
      <svg 
        className={`w-5 h-5 text-dark-300 ${direction === 'next' ? 'rotate-180' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

// =============================================================================
// MODAL COMPONENT (simplified from original)
// =============================================================================
interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const currentImages = viewMode === 'mobile' && project.mobileImages 
    ? project.mobileImages 
    : project.images;
  
  const hasMobileImages = project.mobileImages && project.mobileImages.length > 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div
        className="relative z-10 w-full max-w-6xl max-h-[90vh] rounded-2xl bg-dark-800/95 border shadow-2xl overflow-hidden"
        style={{
          borderColor: 'rgba(0, 229, 255, 0.25)',
          boxShadow: '0 0 60px rgba(0, 229, 255, 0.1)',
        }}
      >
        <div className="max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: `${project.accent}60 transparent` }}>
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-start justify-between gap-4 p-6 bg-dark-800/95 border-b border-dark-700 backdrop-blur-sm">
            <div className="flex-1">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {project.name}
              </h2>
              <p className="mt-1 text-sm text-dark-400">{project.type}</p>
            </div>
            
            {hasMobileImages && (
              <div className="flex items-center gap-1 p-1 rounded-lg bg-dark-700/50 border border-dark-600">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'desktop' ? 'bg-primary-400/20 text-primary-400 border border-primary-400/40' : 'text-dark-400 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'mobile' ? 'bg-primary-400/20 text-primary-400 border border-primary-400/40' : 'text-dark-400 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-700 hover:bg-dark-600 text-dark-400 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            <div className={viewMode === 'mobile' ? 'flex justify-center' : ''}>
              <button 
                onClick={() => setLightboxImage(currentImages[0])}
                className={`relative overflow-hidden rounded-xl bg-dark-700 cursor-zoom-in group/hero ${
                  viewMode === 'mobile' ? 'w-[280px] sm:w-[320px] aspect-[9/16]' : 'w-full aspect-video'
                }`}
              >
                <img
                  src={currentImages[0]}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/hero:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-2 py-1 rounded-md bg-dark-900/70 backdrop-blur-sm text-xs text-primary-400 font-medium">
                  {viewMode === 'mobile' ? '📱 Mobile' : '🖥️ Desktop'}
                </div>
              </button>
            </div>

            <p
              className="text-xl sm:text-2xl font-light italic tracking-widest text-center uppercase"
              style={{ color: project.accent, textShadow: `0 0 30px ${project.accent}50` }}
            >
              {project.vibeLine}
            </p>

            {currentImages.length > 1 && (
              <div className={`relative ${viewMode === 'mobile' ? '' : '-mx-6 px-6'}`}>
                <div className={`flex gap-4 pb-4 ${
                  viewMode === 'mobile' ? 'flex-wrap justify-center' : 'overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-dark-600'
                }`}>
                  {currentImages.slice(1).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setLightboxImage(image)}
                      className={`flex-shrink-0 cursor-zoom-in group/thumb ${
                        viewMode === 'mobile' ? 'w-[140px] sm:w-[160px]' : 'w-[280px] sm:w-[360px] snap-start'
                      }`}
                    >
                      <div className={`relative overflow-hidden rounded-lg bg-dark-700 border border-dark-600/50 transition-all group-hover/thumb:border-dark-500 ${
                        viewMode === 'mobile' ? 'aspect-[9/16]' : 'aspect-[16/10]'
                      }`}>
                        <img src={image} alt="" className="w-full h-full object-cover transition-transform group-hover/thumb:scale-105" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                style={{ backgroundColor: project.accent, color: '#fff' }}
              >
                Ver sitio en vivo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN CAROUSEL COMPONENT
// =============================================================================
export function ProjectsCarousel() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressKeyRef = useRef(0);

  // No autoplay plugin - we handle it manually
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    // Reset progress bar on each slide change
    progressKeyRef.current += 1;
  }, [emblaApi]);

  // Manual autoplay with setInterval
  const startAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    autoplayIntervalRef.current = setInterval(() => {
      if (emblaApi && !isPaused) {
        emblaApi.scrollNext();
      }
    }, CAROUSEL_CONFIG.autoplayDelay);
  }, [emblaApi, isPaused]);

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  // Start autoplay on mount
  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    
    // Start autoplay
    startAutoplay();
    
    return () => {
      emblaApi.off('select', onSelect);
      stopAutoplay();
    };
  }, [emblaApi, onSelect, startAutoplay, stopAutoplay]);

  // Restart autoplay when isPaused changes
  useEffect(() => {
    if (!isPaused) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  }, [isPaused, startAutoplay, stopAutoplay]);

  // Handle mouse enter/leave on carousel container
  const handleCarouselMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleCarouselMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // All slides: projects + coming soon
  const allSlides = [...projects, { id: 'coming-soon' }];
  const totalSlides = allSlides.length;

  // Handle card click - center first, then open modal on second click
  const handleCardClick = useCallback((index: number, project: Project | null) => {
    if (index !== selectedIndex) {
      // Not centered - scroll to center it first
      scrollTo(index);
    } else if (project) {
      // Already centered - open modal
      setSelectedProject(project);
    }
  }, [selectedIndex, scrollTo]);

  return (
    <section id="proyectos" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-900">
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px),
              linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-gradient-radial from-primary-400/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-400/10 border border-primary-400/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-xs font-mono tracking-wider text-primary-400 uppercase">
              Portfolio Activo
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-magenta to-accent-violet">Proyectos</span>
          </h2>
          <p className="text-lg text-dark-400 max-w-2xl mx-auto">
            Cada proyecto es una power cell cargada con innovación y resultados reales.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-4 sm:px-12 md:px-16">
          {/* Arrow buttons */}
          <ArrowButton direction="prev" onClick={scrollPrev} disabled={false} />
          <ArrowButton direction="next" onClick={scrollNext} disabled={false} />
          
          <div 
            ref={emblaRef} 
            className="overflow-visible py-8"
            onMouseEnter={handleCarouselMouseEnter}
            onMouseLeave={handleCarouselMouseLeave}
          >
            <div 
              className="flex"
              style={{ 
                transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
                transitionDuration: `${CAROUSEL_CONFIG.transitionDuration}ms`,
              }}
            >
              {allSlides.map((slide, index) => {
                const isCenter = index === selectedIndex;
                const isComingSoon = slide.id === 'coming-soon';
                
                // Calculate distance from center for progressive effects
                const distance = Math.abs(index - selectedIndex);
                const wrappedDistance = Math.min(distance, totalSlides - distance);
                
                const scale = isCenter ? CAROUSEL_CONFIG.centerScale : CAROUSEL_CONFIG.sideScale;
                const opacity = isCenter ? CAROUSEL_CONFIG.centerOpacity : CAROUSEL_CONFIG.sideOpacity;
                const blur = isCenter ? 0 : CAROUSEL_CONFIG.sideBlur * wrappedDistance;
                const zIndex = isCenter ? 20 : 10 - wrappedDistance;

                return (
                  <div
                    key={slide.id}
                    className="flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_38%] min-w-0 px-2 sm:px-4"
                    style={{
                      transform: `scale(${scale})`,
                      opacity,
                      filter: blur > 0 ? `blur(${blur}px)` : 'none',
                      zIndex,
                      transition: `all ${CAROUSEL_CONFIG.transitionDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
                    }}
                  >
                    {isComingSoon ? (
                      <ComingSoonCard />
                    ) : (
                      <ProjectPowerCellCard
                        title={(slide as Project).name}
                        subtitle={(slide as Project).type}
                        logoSrc={(slide as Project).favicon}
                        logoScale={(slide as Project).logoScale}
                        previewSrc={(slide as Project).coverImage}
                        initialCharge={[40, 65, 55][index % 3]}
                        isActive={isCenter}
                        onClick={() => handleCardClick(index, slide as Project)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {allSlides.map((_, index) => (
              <DotButton
                key={index}
                selected={index === selectedIndex}
                onClick={() => scrollTo(index)}
                index={index}
              />
            ))}
          </div>

          {/* Autoplay progress bar - synced with key to restart animation */}
          <div className="flex justify-center mt-4">
            <div className="w-32 h-1 rounded-full bg-dark-700 overflow-hidden">
              <div 
                key={selectedIndex} // Reset animation on slide change
                className="h-full bg-gradient-to-r from-primary-400 to-accent-violet rounded-full animate-[progress_linear_forwards]"
                style={{
                  animationDuration: `${CAROUSEL_CONFIG.autoplayDelay}ms`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Keyframe for progress bar */}
      <style>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}

export default ProjectsCarousel;
