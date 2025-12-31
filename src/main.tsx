import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './i18n/config'
import i18n from './i18n/config'
import App from './App.tsx'

// Load saved language preference
const savedLanguage = localStorage.getItem('language')
if (savedLanguage && savedLanguage !== i18n.language) {
  i18n.changeLanguage(savedLanguage)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
