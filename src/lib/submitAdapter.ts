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
  thank_you_url: string
  calendly_url: string
  whatsapp_url: string
}

export interface SubmitResult {
  success: boolean
  message: string
  data?: LeadApiResponse
}

export async function submitLead(data: LeadFormData): Promise<SubmitResult> {
  // Anti-spam check - honeypot fields
  if (data.honeypot || data.company) {
    // Bot detected, pretend success but don't actually process
    return { 
      success: true, 
      message: 'Gracias por tu mensaje.',
      data: {
        success: true,
        lead_token: '',
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
      const response = await fetch(`${apiUrl}/api/leads/`, {
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

      return { 
        success: true, 
        message: '¡Mensaje enviado!',
        data: result as LeadApiResponse,
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
        message: '¡Mensaje enviado! Te contactaremos pronto.' 
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
  
  if (result.success && result.data) {
    const targetUrl = redirectType === 'whatsapp' 
      ? result.data.whatsapp_url 
      : result.data.thank_you_url

    // For thank-you page, navigate in same window
    // For WhatsApp, open in new tab then stay on page
    if (redirectType === 'whatsapp') {
      window.open(targetUrl, '_blank')
    } else {
      // Redirect to thank-you page (could be backend URL or Calendly directly)
      const apiUrl = import.meta.env.VITE_API_URL
      if (apiUrl && result.data.thank_you_url) {
        window.location.href = `${apiUrl}${result.data.thank_you_url}`
      }
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
