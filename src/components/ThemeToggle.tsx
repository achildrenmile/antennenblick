import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { MoonIcon, SunIcon, MonitorIcon } from './Icons';

type Theme = 'dark' | 'light' | 'system';

export function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('antennenblick-theme');
    return (saved as Theme) || 'system';
  });

  useEffect(() => {
    const applyTheme = (currentTheme: Theme) => {
      let effectiveTheme = currentTheme;

      if (currentTheme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }

      document.documentElement.setAttribute('data-theme', effectiveTheme);
    };

    applyTheme(theme);
    localStorage.setItem('antennenblick-theme', theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const cycleTheme = () => {
    const themes: Theme[] = ['dark', 'light', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'dark': return <MoonIcon size={14} />;
      case 'light': return <SunIcon size={14} />;
      case 'system': return <MonitorIcon size={14} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'dark': return t.theme?.dark || 'Dunkel';
      case 'light': return t.theme?.light || 'Hell';
      case 'system': return t.theme?.system || 'System';
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={cycleTheme}
      title={t.theme?.toggle || 'Theme wechseln'}
    >
      <span className="theme-icon">{getIcon()}</span>
      <span className="theme-label">{getLabel()}</span>
    </button>
  );
}
