import { motion } from 'framer-motion'
import { Section, GlassCard } from '@/components/ui'
import { services } from '@/data/services'

// Web icon
const WebIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

// System icon
const SystemIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

const iconMap = {
  web: WebIcon,
  system: SystemIcon,
}

export function Services() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <Section id="servicios" background="glow">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="text-center mb-16"
      >
        <h2 className="heading-2 mb-4">
          Lo que <span className="gradient-text">hacemos</span>
        </h2>
        <p className="body-large max-w-2xl mx-auto">
          Nos especializamos en desarrollo web a medida y sistemas que resuelven
          problemas reales de tu negocio.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon]
          return (
            <GlassCard
              key={service.id}
              glow
              glowColor={index === 0 ? 'cyan' : 'violet'}
              className="p-8"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl mb-6 ${
                index === 0 
                  ? 'bg-primary-400/10 text-primary-400' 
                  : 'bg-accent-violet/10 text-accent-violet'
              }`}>
                <Icon />
              </div>

              {/* Title */}
              <h3 className="heading-3 mb-3">{service.title}</h3>

              {/* Description */}
              <p className="body mb-6">{service.description}</p>

              {/* Features */}
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-dark-300">
                    <svg
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        index === 0 ? 'text-primary-400' : 'text-accent-violet'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )
        })}
      </div>
    </Section>
  )
}
