import { useTranslation } from 'react-i18next'
import './LanguageSwitcher.css'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <div className="language-switcher">
      <button
        className="language-btn"
        onClick={toggleLanguage}
        title={t('language.switch')}
      >
        {i18n.language === 'en' ? '中文' : 'English'}
      </button>
    </div>
  )
}

