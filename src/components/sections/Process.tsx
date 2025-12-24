import { motion } from 'framer-motion'
import { Section } from '@/components/ui'
import { processSteps } from '@/data/services'

export function Process() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <Section id="proceso">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="text-center mb-16"
      >
        <h2 className="heading-2 mb-4">
          Cómo <span className="gradient-text">trabajamos</span>
        </h2>
        <p className="body-large max-w-2xl mx-auto">
          Un proceso claro y transparente, de principio a fin.
          Siempre vas a saber en qué etapa está tu proyecto.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Line connector - desktop */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent -translate-y-1/2" />

        {/* Line connector - mobile: línea continua vertical con glow */}
        <div className="lg:hidden absolute left-1/2 top-6 bottom-6 -translate-x-1/2">
          {/* Glow effect */}
          <div className="absolute inset-0 w-1 -translate-x-[1px] bg-primary-400/30 blur-sm" />
          {/* Main line */}
          <div className="w-px h-full bg-gradient-to-b from-primary-400/60 via-primary-400/40 to-primary-400/60" />
        </div>

        {/* Steps - Mobile: single column, Desktop: 5 columns */}
        <div className="relative flex flex-col lg:grid lg:grid-cols-5 lg:gap-4 items-center gap-6">
          {processSteps.map((step) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className="relative w-full max-w-[280px] lg:max-w-none"
            >
              <div className="relative flex flex-col items-center text-center">
                {/* Number circle */}
                <div className="relative z-10 mb-4">
                  <div className="w-12 h-12 rounded-full bg-dark-800/90 backdrop-blur-sm border border-primary-400/50 flex items-center justify-center">
                    <span className="text-primary-400 font-display font-bold text-lg">
                      {step.number}
                    </span>
                  </div>
                  {/* Glow del círculo */}
                  <div className="absolute inset-0 rounded-full bg-primary-400/20 blur-xl opacity-50" />
                </div>

                {/* Content card - con fondo para que la línea pase detrás elegantemente */}
                <div className="relative z-10 bg-dark-800/80 backdrop-blur-sm border border-dark-700/50 rounded-xl px-4 py-3 lg:bg-transparent lg:border-0 lg:p-0">
                  {/* Title */}
                  <h3 className="font-display font-semibold text-lg text-white mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-dark-400 max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

