import { motion } from 'framer-motion'
import { useScrollTo } from '@/hooks'

const footerLinks = [
  { id: 'servicios', label: 'Servicios' },
  { id: 'proceso', label: 'Proceso' },
  { id: 'stack', label: 'Stack' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contacto', label: 'Contacto' },
]

// Premium FooterLink component with hover animations (matching Navbar)
function FooterLink({ 
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
      className="relative text-sm text-dark-400 transition-colors group py-1"
      whileHover="hover"
      initial="initial"
    >
      {/* Text with gradient on hover */}
      <motion.span
        className="relative z-10 bg-clip-text"
        variants={{
          initial: { 
            color: 'rgb(100, 116, 139)',
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

export function Footer() {
  const scrollTo = useScrollTo()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-16">
      <div className="container-custom">
        {/* Premium glassmorphism card */}
        <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-glass border border-white/10 p-8 md:p-12">
          {/* Gradient border glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/20 via-accent-violet/20 to-accent-pink/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 -z-10" />
          
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Logo with premium hover */}
            <div className="flex flex-col items-center gap-2">
              <motion.button
                onClick={() => scrollTo('inicio')}
                className="font-display font-bold text-3xl gradient-text relative"
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
              <p className="text-sm text-dark-400">
                Webs 100% a medida. Sistemas cuando hace falta.
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Premium Links - centered */}
            <nav className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link) => (
                <FooterLink
                  key={link.id}
                  id={link.id}
                  label={link.label}
                  onClick={scrollTo}
                />
              ))}
            </nav>

            {/* Divider */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Social Links */}
            <div className="flex gap-4 items-center">
              <motion.a
                href="https://www.instagram.com/julivillelli_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </motion.a>
            </div>

            {/* Legal & Privacy */}
            <div className="flex flex-col items-center gap-2 text-xs text-dark-500">
              <p className="font-medium text-dark-400">
                Villex - Desarrollo de Software a Medida
              </p>
              <p>Buenos Aires, Argentina</p>
              <a
                href="/privacy"
                className="underline hover:text-primary-400 transition-colors"
              >
                Política de Privacidad
              </a>
            </div>

            {/* Copyright with subtle animation */}
            <motion.div 
              className="text-sm text-dark-500"
              whileHover={{ color: 'rgb(148, 163, 184)' }}
              transition={{ duration: 0.3 }}
            >
              © {currentYear} Villex. Todos los derechos reservados.
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
