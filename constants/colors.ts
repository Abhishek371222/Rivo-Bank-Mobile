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
  primary: "#6366f1",
  primaryDark: "#4f46e5",
  secondary: "#8b5cf6",
  accent: "#a78bfa",
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#0ea5e9",
  background: "#f8f9fc",
  surface: "#ffffff",
  surfaceVariant: "#f3f4f6",
  cardGradientStart: "#6366f1",
  cardGradientEnd: "#8b5cf6",
  text: "#1f2937",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  inputBg: "#f3f4f6",
  overlay: "rgba(0, 0, 0, 0.5)",
  shadow: "rgba(0, 0, 0, 0.1)",
};

const darkColors: ColorScheme = {
  primary: "#818cf8",
  primaryDark: "#6366f1",
  secondary: "#a78bfa",
  accent: "#c4b5fd",
  success: "#34d399",
  error: "#f87171",
  warning: "#fbbf24",
  info: "#38bdf8",
  background: "#0f172a",
  surface: "#1e293b",
  surfaceVariant: "#334155",
  cardGradientStart: "#4f46e5",
  cardGradientEnd: "#7c3aed",
  text: "#f1f5f9",
  textSecondary: "#cbd5e1",
  textMuted: "#94a3b8",
  border: "#334155",
  borderLight: "#475569",
  inputBg: "#1e293b",
  overlay: "rgba(0, 0, 0, 0.7)",
  shadow: "rgba(0, 0, 0, 0.3)",
};

// Legacy export for backward compatibility
const Colors = {
  ...lightColors,
  light: lightColors,
  dark: darkColors,
};

export { lightColors, darkColors };
export default Colors;

