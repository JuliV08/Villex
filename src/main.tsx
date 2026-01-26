import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import ConfirmPage from './pages/ConfirmPage'
import PrivacyPage from './pages/PrivacyPage'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
