import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withDelay,
    Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import Svg, { Path, G } from "react-native-svg";
import { useTheme } from "@/contexts/ThemeContext";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface PieChartData {
    value: number;
    color: string;
    label: string;
}

interface PieChartProps {
    data: PieChartData[];
    size?: number;
    innerRadius?: number;
    onSegmentPress?: (index: number) => void;
}

function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
}

function createArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    innerRadius: number = 0
) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    if (innerRadius > 0) {
        const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
        const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "L", innerEnd.x, innerEnd.y,
            "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
            "Z"
        ].join(" ");
    }

    return [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
}

function AnimatedSegment({
    data,
    index,
    startAngle,
    endAngle,
    size,
    innerRadius,
    delay,
}: {
    data: PieChartData;
    index: number;
    startAngle: number;
    endAngle: number;
    size: number;
    innerRadius: number;
    delay: number;
}) {
    const progress = useSharedValue(0);
    const center = size / 2;
    const radius = size / 2 - 10;

    useEffect(() => {
        progress.value = withDelay(
            delay,
            withTiming(1, {
                duration: 800,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            })
        );
    }, []);

    const animatedProps = useAnimatedStyle(() => {
        const currentEndAngle = startAngle + (endAngle - startAngle) * progress.value;
        const path = createArc(center, center, radius, startAngle, currentEndAngle, innerRadius);

        return {
            d: path,
        };
    });

    return (
        <AnimatedPath
            // @ts-ignore
            animatedProps={animatedProps}
            fill={data.color}
            stroke="#fff"
            strokeWidth={2}
        />
    );
}

export default function PieChart({
    data,
    size = 200,
    innerRadius = 60,
    onSegmentPress,
}: PieChartProps) {
    const { colors } = useTheme();

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const segments = data.map((item, index) => {
        const angle = (item.value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        return {
            data: item,
            index,
            startAngle,
            endAngle,
            delay: index * 100,
        };
    });

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G>
                    {segments.map((segment) => (
                        <AnimatedSegment
                            key={segment.index}
                            {...segment}
                            size={size}
                            innerRadius={innerRadius}
                        />
                    ))}
                </G>
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
});
