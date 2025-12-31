/**
 * ProjectPowerCellCard
 * 
 * Premium "Power Cell" project card component with Villex visual identity.
 * Features: blur preview, logo glow, energy core bar, circuit pattern, pins.
 * Maintains intrigue concept - click to reveal full project in modal.
 * 
 * On desktop: hover triggers charging animation (CSS only)
 * On mobile: Intersection Observer triggers animation when card enters viewport
 */

import { useEffect, useRef, useState } from 'react';

// Check if device is touch-based (mobile)
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

interface ProjectPowerCellCardProps {
  title: string;
  subtitle: string;
  logoSrc: string;
  logoScale?: number;
  previewSrc: string;
  initialCharge?: number; // 0-100, starting charge level (will fill to 100 on hover/view)
  onClick: () => void;
}

export function ProjectPowerCellCard({
  title,
  subtitle,
  logoSrc,
  logoScale = 1,
  previewSrc,
  initialCharge = 60,
  onClick,
}: ProjectPowerCellCardProps) {
  const totalSegments = 5;
  const initialFilledSegments = Math.round((initialCharge / 100) * totalSegments);
  
  // Track if card is in viewport (for mobile animation ONLY)
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullyCharged, setIsFullyCharged] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const chargeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(isTouchDevice() || window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(isTouchDevice() || window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection Observer for mobile scroll-triggered animation ONLY
  useEffect(() => {
    // Only apply on mobile devices
    if (!isMobile) {
      setIsInView(false);
      setIsFullyCharged(false);
      return;
    }

    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Small delay before triggering animation for better visual effect
            setTimeout(() => setIsInView(true), 200);
            // Show "CHARGED" after battery fills (5 segments * 80ms delay + 400ms animation)
            chargeTimeoutRef.current = setTimeout(() => setIsFullyCharged(true), 200 + 800);
          } else {
            // Reset when out of view so animation replays on re-entry
            setIsInView(false);
            setIsFullyCharged(false);
            if (chargeTimeoutRef.current) {
              clearTimeout(chargeTimeoutRef.current);
            }
          }
        });
      },
      {
        threshold: 0.9, // Only trigger when almost fully visible (centered in carousel)
        rootMargin: '-10% 0px',
      }
    );

    observer.observe(card);
    return () => {
      observer.disconnect();
      if (chargeTimeoutRef.current) {
        clearTimeout(chargeTimeoutRef.current);
      }
    };
  }, [isMobile]);

  // Desktop hover state tracking for delayed CHARGED label
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktopCharged, setIsDesktopCharged] = useState(false);
  const desktopChargeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
    // Show "CHARGED" after battery fills (5 segments * 80ms delay + 400ms animation)
    desktopChargeTimeoutRef.current = setTimeout(() => setIsDesktopCharged(true), 800);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    setIsDesktopCharged(false);
    if (desktopChargeTimeoutRef.current) {
      clearTimeout(desktopChargeTimeoutRef.current);
    }
  };

  // Mobile-specific animation state (only affects mobile)
  const mobileActive = isMobile && isInView;

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`power-cell group relative w-full text-left rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:ring-offset-2 focus:ring-offset-dark-900 ${mobileActive ? 'mobile-active' : ''}`}
      aria-label={`Ver proyecto: ${title}`}
    >
      {/* ===== PREVIEW AREA ===== */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Background preview image with Villex treatment */}
        <img
          src={previewSrc}
          alt=""
          aria-hidden="true"
          className="power-cell-preview absolute inset-0 w-full h-full object-cover object-center scale-110"
        />

        {/* Dark overlay base */}
        <div className="absolute inset-0 bg-dark-900/60" />

        {/* Chromatic tint overlay */}
        <div className="power-cell-chromatic absolute inset-0" />

        {/* ===== CIRCUIT PATTERN ===== */}
        <svg 
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 opacity-20 ${
            mobileActive ? 'opacity-40' : ''
          } group-hover:opacity-40`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id={`circuit-${title.replace(/\s/g, '-')}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <line x1="0" y1="20" x2="15" y2="20" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="0.5"/>
              <line x1="25" y1="20" x2="40" y2="20" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="0.5"/>
              <line x1="20" y1="0" x2="20" y2="15" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="0.5"/>
              <line x1="20" y1="25" x2="20" y2="40" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="0.5"/>
              <circle cx="20" cy="20" r="2" fill="rgba(0, 229, 255, 0.6)"/>
              <circle cx="0" cy="0" r="1" fill="rgba(139, 92, 246, 0.5)"/>
              <circle cx="40" cy="0" r="1" fill="rgba(139, 92, 246, 0.5)"/>
              <circle cx="0" cy="40" r="1" fill="rgba(139, 92, 246, 0.5)"/>
              <circle cx="40" cy="40" r="1" fill="rgba(139, 92, 246, 0.5)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#circuit-${title.replace(/\s/g, '-')})`} />
        </svg>

        {/* ===== LOGO CENTER ===== */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className={`power-cell-logo-glow transition-transform duration-300 ${
            mobileActive ? 'scale-105' : ''
          } group-hover:scale-110`}>
            <img
              src={logoSrc}
              alt={`${title} logo`}
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
              style={{ transform: `scale(${logoScale})` }}
            />
          </div>
        </div>

        {/* ===== ENERGY CORE BAR (Battery-style) ===== */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1">
          <div className="flex flex-col-reverse gap-1">
            {[...Array(totalSegments)].map((_, index) => {
              const isInitiallyFilled = index < initialFilledSegments;
              
              return (
                <div
                  key={index}
                  className={`
                    w-2 h-4 rounded-sm transition-all
                    ${isInitiallyFilled 
                      ? 'bg-primary-400/70 shadow-[0_0_6px_rgba(0,229,255,0.5)]' 
                      : 'bg-dark-600/50 border border-dark-500/30'
                    }
                    ${/* Desktop: hover fills all segments */ ''}
                    group-hover:bg-primary-400 
                    group-hover:shadow-[0_0_10px_rgba(0,229,255,0.9)]
                    group-hover:border-transparent
                    ${/* Mobile: in-view fills all segments */ ''}
                    ${mobileActive ? 'bg-primary-400 shadow-[0_0_10px_rgba(0,229,255,0.9)] border-transparent' : ''}
                  `}
                  style={{
                    transitionDuration: '400ms',
                    transitionDelay: `${index * 80}ms`,
                    transitionTimingFunction: 'ease-out',
                  }}
                />
              );
            })}
          </div>
          {/* Energy icon */}
          <svg 
            className={`w-3 h-3 text-primary-400 transition-opacity duration-300 opacity-60 ${
              mobileActive ? 'opacity-100' : ''
            } group-hover:opacity-100`}
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>

        {/* ===== CORNER FRAME ===== */}
        <div className="absolute top-2 left-2 z-10">
          <div className="w-4 h-px bg-primary-400/60" />
          <div className="w-px h-4 bg-primary-400/60" />
        </div>
        <div className="absolute top-2 right-2 z-10">
          <div className="w-4 h-px bg-primary-400/60 ml-auto" />
          <div className="w-px h-4 bg-primary-400/60 ml-auto" />
        </div>
        <div className="absolute bottom-2 left-2 z-10">
          <div className="w-px h-4 bg-primary-400/60" />
          <div className="w-4 h-px bg-primary-400/60" />
        </div>

        {/* ===== PINS/CONTACTS ===== */}
        <div className={`absolute bottom-4 left-4 z-10 flex gap-1.5 items-end transition-opacity opacity-70 ${
          mobileActive ? 'opacity-100' : ''
        } group-hover:opacity-100`}>
          <div className="w-1.5 h-3 bg-primary-400/80 rounded-sm" />
          <div className="w-2.5 h-2 bg-primary-400/60 rounded-sm" />
          <div className="w-1.5 h-2.5 bg-accent-violet/70 rounded-sm" />
          <div className="w-1 h-1.5 bg-primary-400/50 rounded-sm" />
        </div>

        {/* ===== STATUS INDICATOR ===== */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(0,229,255,0.8)] ${
            mobileActive || isHovered ? 'animate-pulse' : ''
          }`} />
          {/* Show CHARGED only after battery fills (with delay) */}
          <span className={`text-[10px] font-mono tracking-wider uppercase transition-colors ${
            (isMobile ? isFullyCharged : isDesktopCharged) ? 'text-primary-400' : 'text-primary-400/80'
          }`}>
            {(isMobile ? isFullyCharged : isDesktopCharged) ? 'CHARGED' : 'READY'}
          </span>
        </div>

        {/* ===== PARTICLES (appear when charged) ===== */}
        <div className={`power-cell-particles ${mobileActive ? 'active' : ''} group-hover:opacity-100`}>
          <div className="power-cell-particle" style={{ left: '5%' }} />
          <div className="power-cell-particle" />
          <div className="power-cell-particle" />
          <div className="power-cell-particle" />
          <div className="power-cell-particle" />
          <div className="power-cell-particle" />
          <div className="power-cell-particle" />
          <div className="power-cell-particle" />
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-dark-800 to-transparent pointer-events-none" />
      </div>

      {/* ===== INFO SECTION WITH VISIBLE BUTTON ===== */}
      <div className="relative p-4 bg-dark-800">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent" />
        <div className={`absolute top-0 left-4 right-4 h-px bg-primary-400/30 ${
          mobileActive ? 'animate-pulse' : ''
        } group-hover:animate-pulse`} />

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-display text-base sm:text-lg font-semibold tracking-tight transition-colors text-white ${
              mobileActive ? 'text-primary-100' : ''
            } group-hover:text-primary-100`}>
              {title}
            </h3>
            <p className="mt-0.5 text-xs sm:text-sm text-dark-400 line-clamp-1">
              {subtitle}
            </p>
          </div>
          
          {/* Visible "Ver" button - always visible, subtle design */}
          <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary-400/10 border border-primary-400/30 group-hover:bg-primary-400/20 group-hover:border-primary-400/50 transition-all duration-300">
            <span className="text-xs font-medium text-primary-400">Ver</span>
            <svg
              className="w-3 h-3 text-primary-400 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

export default ProjectPowerCellCard;
