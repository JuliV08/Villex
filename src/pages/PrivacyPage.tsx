import { Navbar, Footer } from '@/components/layout'

function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-dark-900 text-white noise grid-bg">
      <Navbar />
      <main className="py-24">
        <div className="container-custom max-w-4xl">
          <div className="bg-white/[0.03] backdrop-blur-glass border border-white/10 rounded-2xl p-8 md:p-12">
            <h1 className="font-display text-4xl font-bold gradient-text mb-8">
              Política de Privacidad
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Información que Recopilamos</h2>
                <p className="text-dark-300 leading-relaxed">
                  En Villex, valoramos tu privacidad. Cuando te contactás con nosotros a través de nuestro formulario,
                  recopilamos únicamente la información necesaria para responder a tu consulta: nombre, email, teléfono
                  (opcional) y el mensaje que nos enviás.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Uso de la Información</h2>
                <p className="text-dark-300 leading-relaxed">
                  Utilizamos tu información exclusivamente para:
                </p>
                <ul className="list-disc list-inside text-dark-300 space-y-2 ml-4">
                  <li>Responder a tus consultas comerciales</li>
                  <li>Coordinar reuniones y presupuestos</li>
                  <li>Enviar información relacionada con nuestros servicios (solo si lo autorizaste)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. Protección de Datos</h2>
                <p className="text-dark-300 leading-relaxed">
                  No compartimos tu información personal con terceros. Tus datos están protegidos mediante
                  cifrado SSL y almacenados en servidores seguros. Cumplimos con la Ley de Protección de Datos
                  Personales de Argentina (Ley 25.326).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Tus Derechos</h2>
                <p className="text-dark-300 leading-relaxed">
                  Tenés derecho a acceder, rectificar o eliminar tus datos en cualquier momento. Para ejercer estos
                  derechos, contactanos a: <a href="mailto:villellijulian@gmail.com" className="text-primary-400 hover:underline">villellijulian@gmail.com</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Cookies</h2>
                <p className="text-dark-300 leading-relaxed">
                  Nuestro sitio utiliza cookies analíticas básicas para mejorar la experiencia de usuario. No utilizamos
                  cookies de terceros para publicidad.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Contacto</h2>
                <p className="text-dark-300 leading-relaxed">
                  Si tenés alguna pregunta sobre nuestra política de privacidad, escribinos a{' '}
                  <a href="mailto:villellijulian@gmail.com" className="text-primary-400 hover:underline">villellijulian@gmail.com</a>
                </p>
                <p className="text-dark-300 mt-4">
                  <strong className="text-white">Villex</strong><br />
                  Buenos Aires, Argentina<br />
                  Última actualización: Enero 2026
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PrivacyPage
