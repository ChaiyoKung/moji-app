import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

function Dot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity, delay]);

  return (
    <Animated.View
      style={{ opacity }}
      className="mx-0.5 h-2 w-2 rounded-full bg-typography-400"
    />
  );
}

export function LoadingBubble() {
  return (
    <View className="mb-2 self-start">
      <View className="flex-row items-center rounded-2xl rounded-tl-sm bg-background-100 px-4 py-3">
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </View>
  );
}
