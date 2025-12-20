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

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className="relative"
            >
              {/* Mobile line connector */}
              {index < processSteps.length - 1 && (
                <div className="lg:hidden absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-primary-400/30 to-transparent -mb-8" />
              )}

              <div className="relative flex flex-col items-center text-center lg:items-center">
                {/* Number circle */}
                <div className="relative z-10 mb-4">
                  <div className="w-12 h-12 rounded-full bg-dark-800 border border-primary-400/30 flex items-center justify-center">
                    <span className="text-primary-400 font-display font-bold text-lg">
                      {step.number}
                    </span>
                  </div>
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-full bg-primary-400/20 blur-xl opacity-50" />
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-lg text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-dark-400 max-w-[200px]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
