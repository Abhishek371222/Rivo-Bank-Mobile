import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withSequence,
    withTiming,
    Easing,
    runOnJS,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ConfettiPiece {
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    size: number;
    delay: number;
}

const COLORS = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788"
];

function generateConfetti(count: number): ConfettiPiece[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        y: -20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 6,
        delay: Math.random() * 200,
    }));
}

function ConfettiPiece({ piece, onComplete }: { piece: ConfettiPiece; onComplete: () => void }) {
    const translateY = useSharedValue(-20);
    const translateX = useSharedValue(0);
    const rotation = useSharedValue(piece.rotation);
    const opacity = useSharedValue(1);

    useEffect(() => {
        const finalY = SCREEN_HEIGHT + 50;
        const drift = (Math.random() - 0.5) * 100;

        translateY.value = withDelay(
            piece.delay,
            withTiming(finalY, {
                duration: 3000 + Math.random() * 1000,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }, (finished) => {
                if (finished) {
                    runOnJS(onComplete)();
                }
            })
        );

        translateX.value = withDelay(
            piece.delay,
            withSequence(
                withTiming(drift, { duration: 1500 }),
                withTiming(-drift, { duration: 1500 })
            )
        );

        rotation.value = withDelay(
            piece.delay,
            withTiming(piece.rotation + 720, {
                duration: 3000,
                easing: Easing.linear,
            })
        );

        opacity.value = withDelay(
            2500,
            withTiming(0, { duration: 500 })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotation.value}deg` },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.confettiPiece,
                {
                    left: piece.x,
                    backgroundColor: piece.color,
                    width: piece.size,
                    height: piece.size,
                },
                animatedStyle,
            ]}
        />
    );
}

interface ConfettiAnimationProps {
    count?: number;
    onComplete?: () => void;
}

export default function ConfettiAnimation({ count = 60, onComplete }: ConfettiAnimationProps) {
    const [confetti] = React.useState(() => generateConfetti(count));
    const [completedCount, setCompletedCount] = React.useState(0);

    const handlePieceComplete = () => {
        setCompletedCount((prev) => {
            const newCount = prev + 1;
            if (newCount === count && onComplete) {
                onComplete();
            }
            return newCount;
        });
    };

    return (
        <View style={styles.container} pointerEvents="none">
            {confetti.map((piece) => (
                <ConfettiPiece key={piece.id} piece={piece} onComplete={handlePieceComplete} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
    },
    confettiPiece: {
        position: "absolute",
        borderRadius: 2,
    },
});
