import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/ui'
import { faqData } from '@/data/faq'

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900 rounded-lg transition-colors hover:text-primary-400"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-white pr-4">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 text-primary-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v12m6-6H6"
            />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="pb-5 text-dark-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <Section id="faq">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="text-center mb-12"
      >
        <h2 className="heading-2 mb-4">
          Preguntas <span className="gradient-text">Frecuentes</span>
        </h2>
        <p className="body-large max-w-2xl mx-auto">
          Algunas dudas comunes sobre nuestro trabajo y proceso.
          Si no encontrás lo que buscás, escribinos.
        </p>
      </motion.div>

      {/* FAQ List */}
      <motion.div
        variants={itemVariants}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white/[0.02] rounded-2xl border border-white/5 px-6">
          {faqData.map((item) => (
            <FAQItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>
      </motion.div>
    </Section>
  )
}
