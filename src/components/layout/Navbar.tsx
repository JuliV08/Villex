import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui'
import { useScrollTo } from '@/hooks'
import { cn } from '@/lib/utils'

const navLinks = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'proceso', label: 'Proceso' },
  { id: 'stack', label: 'Stack' },
  { id: 'faq', label: 'FAQ' },
]

// Premium NavLink component with hover animations
function NavLink({ 
  id, 
  label, 
  onClick 
}: { 
  id: string
  label: string
  onClick: (id: string) => void 
}) {
  return (
    <motion.button
      onClick={() => onClick(id)}
      className="relative text-sm text-dark-300 transition-colors group py-2"
      whileHover="hover"
      initial="initial"
    >
      {/* Text with gradient on hover */}
      <motion.span
        className="relative z-10 bg-clip-text"
        variants={{
          initial: { 
            color: 'rgb(148, 163, 184)',
          },
          hover: { 
            color: 'transparent',
            backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #f472b6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
          },
        }}
        transition={{ duration: 0.3 }}
      >
        {label}
      </motion.span>
      
      {/* Animated underline */}
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-400 via-accent-violet to-accent-pink"
        variants={{
          initial: { width: 0, opacity: 0 },
          hover: { width: '100%', opacity: 1 },
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      
      {/* Subtle glow effect */}
      <motion.span
        className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-primary-400/0 via-accent-violet/0 to-accent-pink/0"
        variants={{
          initial: { opacity: 0 },
          hover: { 
            opacity: 1,
            background: 'radial-gradient(ellipse at center, rgba(129, 140, 248, 0.15) 0%, transparent 70%)',
          },
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

export function Navbar() {
  const scrollTo = useScrollTo()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (id: string) => {
    scrollTo(id)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'bg-dark-900/80 backdrop-blur-glass border-b border-white/5' 
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="container-custom h-16 md:h-20 flex items-center justify-between">
          {/* Logo with premium hover */}
          <motion.button
            onClick={() => handleNavClick('inicio')}
            className="font-display font-bold text-2xl gradient-text relative"
            aria-label="Ir al inicio"
            whileHover={{ 
              scale: 1.05,
              filter: 'drop-shadow(0 0 12px rgba(129, 140, 248, 0.5))',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            VILLEX
          </motion.button>

          {/* Desktop Nav with premium links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                id={link.id}
                label={link.label}
                onClick={handleNavClick}
              />
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button size="sm" onClick={() => handleNavClick('contacto')}>
              Agendar
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-5 relative flex flex-col justify-center gap-1.5">
              <motion.span
                className="w-full h-0.5 bg-current origin-center"
                animate={isMobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className="w-full h-0.5 bg-current"
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="w-full h-0.5 bg-current origin-center"
                animate={isMobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              />
            </div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-dark-900/95 backdrop-blur-glass"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu content */}
            <motion.nav
              className="absolute inset-x-0 top-16 bottom-0 flex flex-col items-center justify-center gap-8 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="text-2xl font-display font-semibold text-white hover:text-primary-400 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.05 }}
              >
                <Button size="lg" onClick={() => handleNavClick('contacto')}>
                  Agendar reunión
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
