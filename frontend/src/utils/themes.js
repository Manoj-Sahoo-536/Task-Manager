export const themes = {
  default: {
    name: 'Default',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#111827'
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      success: '#14B8A6',
      warning: '#F97316',
      danger: '#F43F5E',
      background: '#E0F2FE',
      surface: '#F0F9FF',
      text: '#0C4A6E'
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#DC2626',
      background: '#ECFDF5',
      surface: '#F0FDF4',
      text: '#064E3B'
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: '#F97316',
      secondary: '#FB923C',
      success: '#84CC16',
      warning: '#FBBF24',
      danger: '#DC2626',
      background: '#FFF7ED',
      surface: '#FFFBEB',
      text: '#7C2D12'
    }
  },
  purple: {
    name: 'Purple Dream',
    colors: {
      primary: '#A855F7',
      secondary: '#C084FC',
      success: '#22C55E',
      warning: '#EAB308',
      danger: '#EF4444',
      background: '#FAF5FF',
      surface: '#FDF4FF',
      text: '#581C87'
    }
  },
  rose: {
    name: 'Rose Garden',
    colors: {
      primary: '#F43F5E',
      secondary: '#FB7185',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#DC2626',
      background: '#FFF1F2',
      surface: '#FFF5F7',
      text: '#881337'
    }
  }
};

export const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.default;
  const root = document.documentElement;
  
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-success', theme.colors.success);
  root.style.setProperty('--color-warning', theme.colors.warning);
  root.style.setProperty('--color-danger', theme.colors.danger);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text', theme.colors.text);
};
