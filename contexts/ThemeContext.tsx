import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from "react-native-reanimated";
import { lightColors, darkColors, ColorScheme } from "@/constants/colors";
import { getItem, setItem, KEYS } from "@/lib/storage";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
    theme: ThemeMode;
    colors: ColorScheme;
    isDark: boolean;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>("light");
    const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

    // Determine actual theme based on mode
    const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");
    const colors = isDark ? darkColors : lightColors;

    // Animation value for smooth transitions
    const themeProgress = useSharedValue(isDark ? 1 : 0);

    useEffect(() => {
        // Load saved theme preference
        loadTheme();

        // Listen to system theme changes
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemTheme(colorScheme);
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        // Animate theme transition
        themeProgress.value = withTiming(isDark ? 1 : 0, { duration: 300 });
    }, [isDark]);

    async function loadTheme() {
        try {
            const savedTheme = await getItem<ThemeMode>("theme");
            if (savedTheme) {
                setThemeState(savedTheme);
            }
        } catch (error) {
            console.error("Failed to load theme:", error);
        }
    }

    async function setTheme(newTheme: ThemeMode) {
        setThemeState(newTheme);
        try {
            await setItem("theme", newTheme);
        } catch (error) {
            console.error("Failed to save theme:", error);
        }
    }

    function toggleTheme() {
        const newTheme = isDark ? "light" : "dark";
        setTheme(newTheme);
    }

    const value: ThemeContextValue = {
        theme,
        colors,
        isDark,
        setTheme,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}

// Animated wrapper component for smooth theme transitions
export function ThemedView({
    children,
    style
}: {
    children: ReactNode;
    style?: any;
}) {
    const { colors } = useTheme();

    return (
        <Animated.View style={[{ backgroundColor: colors.background }, style]}>
            {children}
        </Animated.View>
    );
}
