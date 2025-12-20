import { motion } from 'framer-motion'
import { Section, Badge, GlassCard } from '@/components/ui'
import { techStack, guarantees } from '@/data/services'

// Icons for guarantees
const GuaranteeIcons = {
  performance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  seo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  responsive: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12" y2="18"/>
    </svg>
  ),
  accesibilidad: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="4" r="2"/>
      <path d="M12 6v8"/>
      <path d="M8 10l4 2 4-2"/>
      <path d="M8 20l4-4 4 4"/>
    </svg>
  ),
}

export function Stack() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <Section id="stack" background="glow">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="text-center mb-16"
      >
        <h2 className="heading-2 mb-4">
          Stack & <span className="gradient-text">Estándares</span>
        </h2>
        <p className="body-large max-w-2xl mx-auto">
          Tecnologías modernas y buenas prácticas que garantizan
          calidad, velocidad y escalabilidad.
        </p>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        variants={itemVariants}
        className="grid sm:grid-cols-3 gap-6 mb-16"
      >
        {techStack.map((category) => (
          <GlassCard
            key={category.name}
            variant="subtle"
            hover={false}
            className="p-6"
          >
            <h3 className="font-display font-semibold text-white mb-4">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.techs.map((tech) => (
                <Badge key={tech} variant="primary" size="sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Guarantees */}
      <motion.div variants={itemVariants}>
        <h3 className="heading-3 text-center mb-8">Lo que garantizamos</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {guarantees.map((guarantee) => (
            <div
              key={guarantee.id}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary-400/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary-400/10 flex items-center justify-center text-primary-400 mb-4">
                {GuaranteeIcons[guarantee.id as keyof typeof GuaranteeIcons]}
              </div>
              <h4 className="font-semibold text-white mb-1">{guarantee.title}</h4>
              <p className="text-sm text-dark-400">{guarantee.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  )
}
