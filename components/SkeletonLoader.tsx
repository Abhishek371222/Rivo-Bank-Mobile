import React from "react";
import { View, StyleSheet, ViewStyle, DimensionValue } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

function Skeleton({ width = "100%", height = 20, borderRadius = 8, style }: SkeletonProps) {
    const { colors, isDark } = useTheme();
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            shimmer.value,
            [0, 1],
            [-300, 300]
        );

        return {
            transform: [{ translateX }],
        };
    });

    const baseColor = isDark ? "#334155" : "#e5e7eb";
    const highlightColor = isDark ? "#475569" : "#f3f4f6";

    return (
        <View
            style={[
                {
                    width: width as DimensionValue,
                    height,
                    borderRadius,

                    backgroundColor: baseColor,
                    overflow: "hidden",
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: highlightColor,
                        width: 300,
                    },
                    animatedStyle,
                ]}
            />
        </View>
    );
}

export function SkeletonCard() {
    const { colors } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Skeleton width="60%" height={16} style={{ marginBottom: 12 }} />
            <Skeleton width="100%" height={120} borderRadius={16} style={{ marginBottom: 16 }} />
            <View style={styles.row}>
                <Skeleton width="30%" height={14} />
                <Skeleton width="30%" height={14} />
            </View>
        </View>
    );
}

export function SkeletonTransaction() {
    const { colors } = useTheme();

    return (
        <View style={[styles.transaction, { backgroundColor: colors.surface }]}>
            <Skeleton width={46} height={46} borderRadius={14} />
            <View style={styles.transactionDetails}>
                <Skeleton width="60%" height={15} style={{ marginBottom: 6 }} />
                <Skeleton width="40%" height={13} />
            </View>
            <Skeleton width={60} height={16} />
        </View>
    );
}

export function SkeletonChart() {
    const { colors } = useTheme();

    return (
        <View style={[styles.chart, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Skeleton width="50%" height={18} style={{ marginBottom: 16 }} />
            <Skeleton width="100%" height={200} borderRadius={12} style={{ marginBottom: 16 }} />
            <View style={styles.legendContainer}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={styles.legendItem}>
                        <Skeleton width={20} height={20} borderRadius={4} />
                        <Skeleton width={80} height={14} />
                    </View>
                ))}
            </View>
        </View>
    );
}

export function SkeletonProfile() {
    const { colors } = useTheme();

    return (
        <View style={[styles.profile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Skeleton width={72} height={72} borderRadius={24} style={{ marginBottom: 14, alignSelf: "center" }} />
            <Skeleton width="50%" height={22} style={{ marginBottom: 6, alignSelf: "center" }} />
            <Skeleton width="40%" height={14} style={{ marginBottom: 12, alignSelf: "center" }} />
            <Skeleton width="30%" height={28} borderRadius={20} style={{ alignSelf: "center" }} />
        </View>
    );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
    return (
        <View>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonTransaction key={i} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
    },
    transaction: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 14,
    },
    transactionDetails: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    chart: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
    },
    legendContainer: {
        gap: 12,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    profile: {
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 28,
        paddingHorizontal: 20,
        marginBottom: 16,
        borderWidth: 1,
    },
});

export default Skeleton;
