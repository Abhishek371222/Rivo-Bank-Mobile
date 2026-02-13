export interface ColorScheme {
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  cardGradientStart: string;
  cardGradientEnd: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  inputBg: string;
  overlay: string;
  shadow: string;
}

const lightColors: ColorScheme = {
  primary: "#0f172a", // Slate 900 - Sophisticated Dark
  primaryDark: "#020617", // Slate 950
  secondary: "#334155", // Slate 700
  accent: "#10b981", // Emerald 500 - Money Green
  success: "#059669", // Emerald 600
  error: "#dc2626", // Red 600
  warning: "#d97706", // Amber 600
  info: "#0284c7", // Sky 600
  background: "#f8fafc", // Slate 50 - Clean
  surface: "#ffffff", // Pure White
  surfaceVariant: "#f1f5f9", // Slate 100
  cardGradientStart: "#0f172a", // Slate 900
  cardGradientEnd: "#334155", // Slate 700
  text: "#0f172a", // Slate 900
  textSecondary: "#64748b", // Slate 500
  textMuted: "#94a3b8", // Slate 400
  border: "#e2e8f0", // Slate 200
  borderLight: "#f1f5f9", // Slate 100
  inputBg: "#f1f5f9", // Slate 100
  overlay: "rgba(15, 23, 42, 0.6)", // Slate 900 with opacity
  shadow: "rgba(15, 23, 42, 0.08)", // Slate shadow
};

const darkColors: ColorScheme = {
  primary: "#f8fafc", // Slate 50 - White text on dark
  primaryDark: "#e2e8f0", // Slate 200
  secondary: "#94a3b8", // Slate 400
  accent: "#34d399", // Emerald 400 - Bright Green
  success: "#10b981", // Emerald 500
  error: "#f87171", // Red 400
  warning: "#fbbf24", // Amber 400
  info: "#38bdf8", // Sky 400
  background: "#020617", // Slate 950 - Deep Dark
  surface: "#0f172a", // Slate 900
  surfaceVariant: "#1e293b", // Slate 800
  cardGradientStart: "#1e293b", // Slate 800
  cardGradientEnd: "#334155", // Slate 700
  text: "#f8fafc", // Slate 50
  textSecondary: "#cbd5e1", // Slate 300
  textMuted: "#64748b", // Slate 500
  border: "#1e293b", // Slate 800
  borderLight: "#334155", // Slate 700
  inputBg: "#1e293b", // Slate 800
  overlay: "rgba(0, 0, 0, 0.8)",
  shadow: "rgba(0, 0, 0, 0.5)",
};

// Legacy export for backward compatibility
const Colors = {
  ...lightColors,
  light: lightColors,
  dark: darkColors,
};

export { lightColors, darkColors };
export default Colors;

