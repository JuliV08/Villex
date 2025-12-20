import { Navbar, Footer } from '@/components/layout'
import {
  Hero,
  Services,
  Process,
  Stack,
  Projects,
  FAQ,
  Contact,
} from '@/components/sections'

function App() {
  return (
    <div className="relative min-h-screen bg-dark-900 text-white noise grid-bg">
      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main>
        <Hero />
        <Services />
        <Process />
        <Stack />
        <Projects />
        <FAQ />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
