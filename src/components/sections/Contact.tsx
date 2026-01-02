import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, Button, GlassCard } from '@/components/ui'
import { submitAndRedirect, LeadFormData, getWhatsAppUrl, submitLead } from '@/lib/submitAdapter'

// WhatsApp icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// Calendar icon
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

interface FormErrors {
  nombre?: string
  contacto?: string
  mensaje?: string
}

// Options for select fields
const timeframeOptions = [
  { value: '', label: 'Seleccioná un plazo…' },
  { value: '1-2 semanas', label: '1-2 semanas' },
  { value: '1 mes', label: '1 mes' },
  { value: '2-3 meses', label: '2-3 meses' },
  { value: 'explorando', label: 'Estoy explorando' },
]

const budgetOptions = [
  { value: '', label: 'Seleccioná un rango…' },
  { value: 'menos-400k', label: 'Menos de ARS 400.000' },
  { value: '400k-800k', label: 'ARS 400.000 - 800.000' },
  { value: '800k-1200k', label: 'ARS 800.000 - 1.200.000' },
  { value: 'mas-1200k', label: 'Más de ARS 1.200.000' },
]

export function Contact() {
  const [formData, setFormData] = useState<LeadFormData>({
    nombre: '',
    contacto: '',
    tipoProyecto: 'web',
    mensaje: '',
    timeframe: '',
    budgetRange: '',
    referenceUrl: '',
    hasDomainHosting: null,
    honeypot: '',
    company: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitAction, setSubmitAction] = useState<'agenda' | 'whatsapp' | null>(null)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)
  const [emailConfirmationPending, setEmailConfirmationPending] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }
    
    if (!formData.contacto.trim()) {
      newErrors.contacto = 'El email o teléfono es requerido'
    } else if (
      !formData.contacto.includes('@') && 
      !/^\+?[\d\s-]{8,}$/.test(formData.contacto)
    ) {
      newErrors.contacto = 'Ingresá un email o teléfono válido'
    }
    
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'Contanos sobre tu proyecto'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (action: 'agenda' | 'whatsapp') => {
    if (!validate()) return
    
    setIsSubmitting(true)
    setSubmitAction(action)
    setSubmitResult(null)
    
    // NEW: Handle WhatsApp synchronously to avoid popup blockers
    if (action === 'whatsapp') {
      const waUrl = getWhatsAppUrl(formData)
      window.open(waUrl, '_blank')
      
      // Just submit the lead, don't ask for redirect
      const result = await submitLead(formData)
      setSubmitResult(result)
      
      if (result.success) {
        if (result.requiresEmailConfirmation) {
          setEmailConfirmationPending(true)
          setSubmittedEmail(formData.contacto)
        }
        resetForm()
      }
    } else {
      // Agenda flow: Submit and handle redirect logic
      const result = await submitAndRedirect(formData, 'thank_you')
      setSubmitResult(result)
      
      if (result.success) {
        if (result.requiresEmailConfirmation) {
          setEmailConfirmationPending(true)
          setSubmittedEmail(formData.contacto)
        }
        resetForm()
      }
    }
    
    setIsSubmitting(false)
    setSubmitAction(null)
  }
  
  const resetForm = () => {
    setFormData({
      nombre: '',
      contacto: '',
      tipoProyecto: 'web',
      mensaje: '',
      timeframe: '',
      budgetRange: '',
      referenceUrl: '',
      hasDomainHosting: null,
      honeypot: '',
      company: '',
    })
  }

  // Helper for duplicate logic causing issues? No, I'll just refactor resetForm out or duplicate it inline for safety to match strict replacement.
  // Actually, extracting resetForm is cleaner but might break replacement if I don't replace the whole block.
  // I will duplicate the reset logic inline to keep it simple and safe with "replace_file_content".

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleDomainHostingChange = (value: boolean | null) => {
    setFormData((prev) => ({ ...prev, hasDomainHosting: value }))
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const inputClasses = `
    w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
    text-white placeholder:text-dark-500
    focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20
    transition-all duration-200
  `

  const errorClasses = 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'

  return (
    <Section id="contacto" background="glow">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="text-center mb-12"
      >
        <h2 className="heading-2 mb-4">
          Empezá tu <span className="gradient-text">Proyecto</span>
        </h2>
        <p className="body-large max-w-2xl mx-auto">
          Contanos qué tenés en mente. Te respondemos en menos de 24 horas.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="max-w-2xl mx-auto"
      >
        <GlassCard variant="strong" hover={false} className="p-8">
          {emailConfirmationPending ? (
            /* Email Confirmation Pending State */
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary-400/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">¡Revisá tu email!</h3>
              <p className="text-dark-400 max-w-md mx-auto">
                Te enviamos un email a <span className="text-primary-400 font-medium">{submittedEmail}</span> con un link para confirmar y agendar tu llamada.
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-dark-500">
                  ¿No lo encontrás? Revisá tu carpeta de spam o 
                  <button 
                    type="button"
                    onClick={() => setEmailConfirmationPending(false)}
                    className="text-primary-400 hover:text-primary-300 ml-1 underline"
                  >
                    envialo de nuevo
                  </button>
                </p>
              </div>
            </div>
          ) : (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Honeypots - hidden from users, visible to bots */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              className="absolute opacity-0 pointer-events-none"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="absolute opacity-0 pointer-events-none"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              placeholder="Company"
            />

            {/* Row 1: Nombre + Contacto */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-dark-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`${inputClasses} ${errors.nombre ? errorClasses : ''}`}
                  placeholder="Tu nombre"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-400">{errors.nombre}</p>
                )}
              </div>

              {/* Contacto */}
              <div>
                <label htmlFor="contacto" className="block text-sm font-medium text-dark-300 mb-2">
                  Email o teléfono *
                </label>
                <input
                  type="text"
                  id="contacto"
                  name="contacto"
                  value={formData.contacto}
                  onChange={handleChange}
                  className={`${inputClasses} ${errors.contacto ? errorClasses : ''}`}
                  placeholder="tu@email.com o +54 9 11..."
                />
                {errors.contacto && (
                  <p className="mt-1 text-sm text-red-400">{errors.contacto}</p>
                )}
              </div>
            </div>

            {/* Row 2: Tipo de proyecto + Plazo */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Tipo de proyecto */}
              <div>
                <label htmlFor="tipoProyecto" className="block text-sm font-medium text-dark-300 mb-2">
                  Tipo de proyecto
                </label>
                <select
                  id="tipoProyecto"
                  name="tipoProyecto"
                  value={formData.tipoProyecto}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="web" className="bg-dark-900 text-white">Web custom</option>
                  <option value="sistema" className="bg-dark-900 text-white">Sistema / Backoffice</option>
                  <option value="otro" className="bg-dark-900 text-white">Otro</option>
                </select>
              </div>

              {/* Plazo */}
              <div>
                <label htmlFor="timeframe" className="block text-sm font-medium text-dark-300 mb-2">
                  Plazo estimado
                </label>
                <select
                  id="timeframe"
                  name="timeframe"
                  value={formData.timeframe}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  {timeframeOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-dark-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Presupuesto + Dominio/Hosting */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Presupuesto */}
              <div>
                <label htmlFor="budgetRange" className="block text-sm font-medium text-dark-300 mb-2">
                  Presupuesto aproximado
                </label>
                <select
                  id="budgetRange"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  {budgetOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-dark-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dominio/Hosting */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  ¿Ya tenés dominio/hosting?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleDomainHostingChange(true)}
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 ${
                      formData.hasDomainHosting === true
                        ? 'bg-primary-400/20 border-primary-400/50 text-white'
                        : 'bg-white/5 border-white/10 text-dark-400 hover:border-white/20'
                    }`}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDomainHostingChange(false)}
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 ${
                      formData.hasDomainHosting === false
                        ? 'bg-primary-400/20 border-primary-400/50 text-white'
                        : 'bg-white/5 border-white/10 text-dark-400 hover:border-white/20'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Reference URL */}
            <div>
              <label htmlFor="referenceUrl" className="block text-sm font-medium text-dark-300 mb-2">
                Link de referencia (opcional)
              </label>
              <input
                type="url"
                id="referenceUrl"
                name="referenceUrl"
                value={formData.referenceUrl}
                onChange={handleChange}
                className={inputClasses}
                placeholder="https://ejemplo.com (diseño que te guste)"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-dark-300 mb-2">
                Contanos sobre tu proyecto *
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows={4}
                className={`${inputClasses} resize-none ${errors.mensaje ? errorClasses : ''}`}
                placeholder="¿Qué tenés en mente? Cuanto más detalle, mejor..."
              />
              {errors.mensaje && (
                <p className="mt-1 text-sm text-red-400">{errors.mensaje}</p>
              )}
            </div>

            {/* Submit result */}
            {submitResult && (
              <div
                className={`p-4 rounded-xl ${
                  submitResult.success
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {submitResult.message}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                size="lg"
                icon={<CalendarIcon />}
                isLoading={isSubmitting && submitAction === 'agenda'}
                disabled={isSubmitting}
                className="flex-1"
                onClick={() => handleSubmit('agenda')}
              >
                Enviar y agendar llamada (30 min)
              </Button>
              <Button
                type="button"
                variant="whatsapp"
                size="lg"
                icon={<WhatsAppIcon />}
                isLoading={isSubmitting && submitAction === 'whatsapp'}
                disabled={isSubmitting}
                className="flex-1"
                onClick={() => handleSubmit('whatsapp')}
              >
                Enviar por WhatsApp
              </Button>
            </div>

            <p className="text-center text-sm text-dark-500">
              Al enviar, guardamos tu consulta para poder responderte. 
              <br className="hidden sm:block" />
              Nunca compartimos tus datos con terceros.
            </p>
          </form>
          )}
        </GlassCard>
      </motion.div>
    </Section>
  )
}
