import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export default function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonLoaderProps): JSX.Element {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surface, theme.colors.border],
  });

  const styles = StyleSheet.create({
    skeleton: {
      width,
      height,
      borderRadius,
      backgroundColor: theme.colors.surface,
    },
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { backgroundColor },
        style,
      ]}
    />
  );
}