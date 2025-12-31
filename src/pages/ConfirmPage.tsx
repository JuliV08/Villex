/**
 * ConfirmPage - Email confirmation and Calendly scheduling page
 * 
 * Route: /confirm?token=...
 * 
 * States:
 * - Loading: Verifying token
 * - Success: Show Calendly embed
 * - Error: Show error message with resend option
 */

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { confirmEmail, resendConfirmEmail, ConfirmEmailResponse } from '@/lib/submitAdapter'

// Inline Calendly popup widget
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}

export default function ConfirmPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [data, setData] = useState<ConfirmEmailResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendResult, setResendResult] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Token de confirmación no encontrado.')
      return
    }

    const verify = async () => {
      const result = await confirmEmail(token)
      
      if (result.success) {
        setStatus('success')
        setData(result)
      } else if (result.can_resend) {
        setStatus('expired')
        setErrorMessage(result.error || 'El link ha expirado.')
        setResendEmail(result.email || '')
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Token inválido.')
      }
    }

    verify()
  }, [token])

  const handleResend = async () => {
    if (!resendEmail) return
    
    setIsResending(true)
    setResendResult(null)
    
    const result = await resendConfirmEmail(resendEmail)
    
    setIsResending(false)
    setResendResult(result.message || result.error || 'Revisá tu email.')
  }

  const openCalendly = () => {
    if (data?.calendly_url) {
      // Try to use Calendly popup if available
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url: data.calendly_url })
      } else {
        // Fallback to new window
        window.open(data.calendly_url, '_blank')
      }
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
              <p className="text-dark-400">Verificando tu email...</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && data && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {data.already_confirmed ? '¡Ya estás confirmado!' : '¡Email confirmado!'}
                </h1>
                <p className="text-dark-400">
                  Hola <span className="text-primary-400 font-medium">{data.name}</span>, 
                  ya podés agendar tu llamada de 30 minutos.
                </p>
              </div>

              <button
                onClick={openCalendly}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-400 to-accent-violet text-dark-900 font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2}/>
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2}/>
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2}/>
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2}/>
                </svg>
                Agendar mi llamada
              </button>

              <p className="text-sm text-dark-500">
                O copiá este link: <a href={data.calendly_url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                  Abrir Calendly
                </a>
              </p>
            </div>
          )}

          {/* Expired State */}
          {status === 'expired' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Link expirado</h1>
                <p className="text-dark-400">{errorMessage}</p>
              </div>

              {resendEmail && (
                <div className="space-y-3">
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="w-full px-6 py-3 bg-primary-400/20 text-primary-400 font-medium rounded-xl border border-primary-400/30 hover:bg-primary-400/30 transition-colors disabled:opacity-50"
                  >
                    {isResending ? 'Enviando...' : 'Reenviar link de confirmación'}
                  </button>
                  
                  {resendResult && (
                    <p className="text-sm text-dark-400">{resendResult}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
                <p className="text-dark-400">{errorMessage}</p>
              </div>

              <a
                href="/"
                className="inline-block px-6 py-3 bg-dark-700 text-white font-medium rounded-xl hover:bg-dark-600 transition-colors"
              >
                Volver al inicio
              </a>
            </div>
          )}
        </div>

        {/* VILLEX branding */}
        <div className="text-center mt-8">
          <p className="text-dark-600 text-sm">
            <span className="text-dark-500 font-semibold">VILLEX</span> · Digital Studio
          </p>
        </div>
      </motion.div>

      {/* Calendly widget script */}
      <script src="https://assets.calendly.com/assets/external/widget.js" async />
    </div>
  )
}
