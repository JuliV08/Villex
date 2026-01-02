export interface LeadFormData {
  nombre: string
  contacto: string
  tipoProyecto: 'web' | 'sistema' | 'otro'
  mensaje: string
  // Qualification fields
  timeframe: string
  budgetRange: string
  referenceUrl: string
  hasDomainHosting: boolean | null
  // Anti-spam
  honeypot?: string
  company?: string // Additional honeypot
}

export interface LeadApiResponse {
  success: boolean
  lead_token: string
  requires_email_confirmation: boolean
  // Only present if requires_email_confirmation is false
  thank_you_url?: string
  calendly_url?: string
  whatsapp_url?: string
  // Only present if requires_email_confirmation is true
  email_sent?: boolean
  message?: string
}

export interface SubmitResult {
  success: boolean
  message: string
  requiresEmailConfirmation?: boolean
  data?: LeadApiResponse
}

export async function submitLead(data: LeadFormData): Promise<SubmitResult> {
  // Anti-spam check - honeypot fields
  if (data.honeypot || data.company) {
    // Bot detected, pretend success but don't actually process
    return {
      success: true,
      message: 'Gracias por tu mensaje.',
      requiresEmailConfirmation: false,
      data: {
        success: true,
        lead_token: '',
        requires_email_confirmation: false,
        thank_you_url: '/',
        calendly_url: '/',
        whatsapp_url: getWhatsAppUrl(data),
      }
    }
  }

  const apiUrl = import.meta.env.VITE_API_URL

  try {
    if (apiUrl) {
      // Mode A: Backend propio (Django)
      const response = await fetch(`${apiUrl}/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.nombre,
          contact: data.contacto,
          project_type: data.tipoProyecto,
          message: data.mensaje,
          timeframe: data.timeframe,
          budget_range: data.budgetRange,
          reference_url: data.referenceUrl,
          has_domain_hosting: data.hasDomainHosting,
          honeypot: data.honeypot,
          company: data.company,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: result.error || 'Error al enviar el formulario'
        }
      }

      const apiResponse = result as LeadApiResponse

      // Check if email confirmation is required
      if (apiResponse.requires_email_confirmation) {
        return {
          success: true,
          message: apiResponse.message || 'Revisá tu email para confirmar y agendar tu llamada.',
          requiresEmailConfirmation: true,
          data: apiResponse,
        }
      }

      return {
        success: true,
        message: '¡Mensaje enviado!',
        requiresEmailConfirmation: false,
        data: apiResponse,
      }
    }

    // Mode B: Fallback - Formspree
    const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL

    if (formspreeUrl) {
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nombre: data.nombre,
          contacto: data.contacto,
          tipoProyecto: data.tipoProyecto,
          mensaje: data.mensaje,
          timeframe: data.timeframe,
          budgetRange: data.budgetRange,
          referenceUrl: data.referenceUrl,
          hasDomainHosting: data.hasDomainHosting,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar el formulario')
      }

      return {
        success: true,
        message: '¡Mensaje enviado! Te contactaremos pronto.',
        requiresEmailConfirmation: false,
      }
    }

    // No backend configured - return instructions
    return {
      success: false,
      message: 'Por favor, usá el botón de WhatsApp para contactarnos.'
    }
  } catch (error) {
    console.error('Submit error:', error)
    return {
      success: false,
      message: 'Hubo un error. Intentá de nuevo o contactanos por WhatsApp.'
    }
  }
}

/**
 * Submit lead and redirect to the specified destination
 */
export async function submitAndRedirect(
  data: LeadFormData,
  redirectType: 'thank_you' | 'whatsapp'
): Promise<SubmitResult> {
  const result = await submitLead(data)

  if (!result.success || !result.data) {
    return result
  }

  // 1. Handle WhatsApp: Always open if URL exists, regardless of email confirmation status
  if (redirectType === 'whatsapp' && result.data.whatsapp_url) {
    window.open(result.data.whatsapp_url, '_blank')
    return result
  }

  // 2. Handle Thank You Page: Only if NO email confirmation required
  if (redirectType === 'thank_you') {
    if (result.requiresEmailConfirmation) {
      // Don't redirect, let the UI show "Check your email"
      return result
    }
    
    if (result.data.thank_you_url) {
      window.location.href = result.data.thank_you_url
    }
  }

  return result
}

export function getWhatsAppUrl(data?: Partial<LeadFormData>): string {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '5491100000000'
  let message = '¡Hola! Me interesa contactarlos por un proyecto.'

  if (data?.nombre) {
    message = `¡Hola! Soy ${data.nombre}.`
    if (data.tipoProyecto) {
      const tipos = {
        web: 'una web custom',
        sistema: 'un sistema/backoffice',
        otro: 'un proyecto',
      }
      message += ` Me interesa ${tipos[data.tipoProyecto]}.`
    }
    if (data.mensaje) {
      message += ` ${data.mensaje}`
    }
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Confirm email token and get Calendly URL
 */
export interface ConfirmEmailResponse {
  success: boolean
  error?: string
  can_resend?: boolean
  already_confirmed?: boolean
  lead_token?: string
  calendly_url?: string
  name?: string
  email?: string
}

export async function confirmEmail(token: string): Promise<ConfirmEmailResponse> {
  const apiUrl = import.meta.env.VITE_API_URL
  
  if (!apiUrl) {
    return { success: false, error: 'API no configurada' }
  }

  try {
    const response = await fetch(`${apiUrl}/leads/confirm?token=${encodeURIComponent(token)}`)
    const result = await response.json()
    
    return result as ConfirmEmailResponse
  } catch (error) {
    console.error('Confirm email error:', error)
    return { success: false, error: 'Error de conexión' }
  }
}

/**
 * Resend confirmation email
 */
export async function resendConfirmEmail(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const apiUrl = import.meta.env.VITE_API_URL
  
  if (!apiUrl) {
    return { success: false, error: 'API no configurada' }
  }

  try {
    const response = await fetch(`${apiUrl}/leads/resend-confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    return await response.json()
  } catch (error) {
    console.error('Resend email error:', error)
    return { success: false, error: 'Error de conexión' }
  }
}
