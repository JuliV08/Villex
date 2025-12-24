import { motion } from 'framer-motion'
import { Section } from '@/components/ui'
import { processSteps } from '@/data/services'

// Conector curvo SVG para mobile
function MobileCurveConnector({ isEven }: { isEven: boolean }) {
  return (
    <div className="lg:hidden w-full h-12 flex justify-center overflow-visible">
      <svg
        width="60"
        height="48"
        viewBox="0 0 60 48"
        fill="none"
        className="overflow-visible"
      >
        <path
          d={isEven
            ? "M30 0 Q60 24 30 48" // Curva hacia la derecha
            : "M30 0 Q0 24 30 48"  // Curva hacia la izquierda
          }
          stroke="url(#curveGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

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

        {/* Steps - Mobile: single column with curves, Desktop: 5 columns */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-4 items-center">
          {processSteps.map((step, index) => (
            <div key={step.id} className="w-full flex flex-col items-center">
              <motion.div
                variants={itemVariants}
                className="relative w-full max-w-[280px] lg:max-w-none"
              >
                <div className="relative flex flex-col items-center text-center">
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

              {/* Mobile curve connector - between steps */}
              {index < processSteps.length - 1 && (
                <MobileCurveConnector isEven={index % 2 === 0} />
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

