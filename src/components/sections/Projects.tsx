import { motion } from 'framer-motion'
import { Section, GlassCard } from '@/components/ui'
import { hasProjects } from '@/data/projects'

export function Projects() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  // Si hay proyectos, mostrarlos (preparado para el futuro)
  if (hasProjects()) {
    // TODO: Implementar galería de proyectos cuando haya datos
    return null
  }

  // Placeholder elegante mientras no hay proyectos
  return (
    <Section id="proyectos">
      <motion.div
        variants={itemVariants}
        className="text-center mb-12"
      >
        <h2 className="heading-2 mb-4">
          Nuestros <span className="gradient-text">Proyectos</span>
        </h2>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard
          variant="subtle"
          hover={false}
          className="max-w-2xl mx-auto p-12 text-center"
        >
          {/* Animated rings */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border border-primary-400/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border border-accent-violet/20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary-400/20 to-accent-violet/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>

          <h3 className="font-display font-semibold text-xl text-white mb-3">
            Próximamente
          </h3>
          <p className="text-dark-400 max-w-md mx-auto">
            Estamos preparando casos de estudio detallados de nuestros proyectos.
            Mientras tanto, contactanos y te mostramos nuestro trabajo en una reunión.
          </p>
        </GlassCard>
      </motion.div>
    </Section>
  )
}
