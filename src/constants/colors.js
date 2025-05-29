export const colors = {
  // Cores Principais
  primary: '#2B7C85',      // Verde Base - headers, textos principais
  secondary: '#4A9AA3',    // Verde Suave - ícones secundários
  action: '#E67E51',       // Laranja ajustado - mais suave e harmonioso com o verde

  // Cores de Suporte
  background: '#EDF6F7',   // Verde Claro - fundos de cards e inputs
  border: '#E5EEF0',       // Verde Azulado - bordas e separadores
  white: '#FFFFFF',        // Branco - fundo principal
  
  // Variações com Transparência
  overlay: 'rgba(43, 124, 133, 0.5)', // Verde Base com transparência para overlays
  
  // Texto
  text: {
    primary: '#2B7C85',    // Verde Base - textos principais
    secondary: '#4A9AA3',  // Verde Suave - textos secundários
    light: '#FFFFFF',      // Branco - textos sobre fundos escuros
  }
};

// Temas específicos para diferentes partes do app
export const headerTheme = {
  background: colors.primary,
  text: colors.text.light,
  icon: colors.action,
};

export const cardTheme = {
  background: colors.background,
  border: colors.border,
  text: colors.text.primary,
  value: colors.text.primary,
};

export const buttonTheme = {
  primary: {
    background: colors.action,
    text: colors.white,
  },
  secondary: {
    background: colors.background,
    text: colors.text.primary,
    border: colors.border,
  },
};

export const inputTheme = {
  background: colors.background,
  border: colors.border,
  text: colors.text.primary,
  placeholder: colors.text.secondary,
  icon: colors.secondary,
}; 