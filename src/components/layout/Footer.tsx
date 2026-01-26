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
                href="https://www.linkedin.com/in/villellijulian"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
              <motion.a
                href="https://github.com/JulianVillella"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-primary-400 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
