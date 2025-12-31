import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { trackEvent } from './GoogleAnalytics'
import './LanguageSwitcher.css'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
    
    // Track language change
    trackEvent('language_changed', {
      from: i18n.language,
      to: newLang,
    })
  }

  return (
    <div className="language-switcher">
      <button
        className="language-btn"
        onClick={toggleLanguage}
        title={t('language.switch')}
      >
        <Globe size={16} />
        <span>{i18n.language === 'en' ? '中文' : 'English'}</span>
      </button>
    </div>
  )
}

