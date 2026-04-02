import './ThemeToggle.css';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getIconName = () => {
    switch (theme) {
      case 'light':
        return 'wb_sunny';
      case 'dark':
        return 'dark_mode';
      default:
        return 'brightness_auto';
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      default:
        return 'System theme';
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      title={getLabel()}
    >
      <span className="material-icons">{getIconName()}</span>
    </button>
  );
}
