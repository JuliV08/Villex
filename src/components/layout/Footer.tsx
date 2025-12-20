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

            {/* Copyright with subtle animation */}
            <motion.div 
              className="text-sm text-dark-500"
              whileHover={{ color: 'rgb(148, 163, 184)' }}
              transition={{ duration: 0.3 }}
            >
              © {currentYear} VILLEX. Todos los derechos reservados.
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
