export interface LeadFormData {
  nombre: string
  contacto: string
  tipoProyecto: 'web' | 'sistema' | 'otro'
  mensaje: string
  honeypot?: string // Anti-spam field
}

export interface SubmitResult {
  success: boolean
  message: string
}

export async function submitLead(data: LeadFormData): Promise<SubmitResult> {
  // Anti-spam check
  if (data.honeypot) {
    // Bot detected, pretend success
    return { success: true, message: 'Gracias por tu mensaje.' }
  }

  const apiUrl = import.meta.env.VITE_API_URL

  try {
    if (apiUrl) {
      // Mode A: Backend propio (Django futuro)
      const response = await fetch(`${apiUrl}/api/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: data.nombre,
          contacto: data.contacto,
          tipo_proyecto: data.tipoProyecto,
          mensaje: data.mensaje,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar el formulario')
      }

      return { success: true, message: '¡Mensaje enviado! Te contactaremos pronto.' }
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
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar el formulario')
      }

      return { success: true, message: '¡Mensaje enviado! Te contactaremos pronto.' }
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
