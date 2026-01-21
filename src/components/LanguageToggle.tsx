import { useI18n } from '../i18n';

export function LanguageToggle() {
  const { t, toggleLanguage, language } = useI18n();

  return (
    <button
      className="language-toggle"
      onClick={toggleLanguage}
      title={t.language.switch}
    >
      <span className={language === 'de' ? 'active' : ''}>DE</span>
      <span className="separator">/</span>
      <span className={language === 'en' ? 'active' : ''}>EN</span>
    </button>
  );
}
