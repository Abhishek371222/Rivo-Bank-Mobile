import React from "react";
import { Pressable, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    withSpring,
    withSequence,
    interpolate,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ThemeToggle() {
    const { isDark, toggleTheme, colors } = useTheme();
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Rotation animation
        rotation.value = withSequence(
            withTiming(360, { duration: 500 }),
            withTiming(0, { duration: 0 })
        );

        // Scale animation
        scale.value = withSequence(
            withSpring(1.2, { damping: 10 }),
            withSpring(1, { damping: 10 })
        );

        toggleTheme();
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${rotation.value}deg` },
                { scale: scale.value }
            ],
        };
    });

    return (
        <AnimatedPressable
            onPress={handlePress}
            style={[
                styles.container,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                },
                animatedStyle
            ]}
        >
            <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={22}
                color={colors.primary}
            />
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    },
});
