import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface SlideInViewProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  distance?: number;
  style?: ViewStyle;
}

export default function SlideInView({
  children,
  direction = 'up',
  duration = 500,
  delay = 0,
  distance = 50,
  style,
}: SlideInViewProps): JSX.Element {
  const slideAnim = useRef(new Animated.Value(distance)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [slideAnim, opacityAnim, duration, delay]);

  const getTransform = () => {
    switch (direction) {
      case 'left':
        return [{ translateX: slideAnim }];
      case 'right':
        return [{ translateX: Animated.multiply(slideAnim, -1) }];
      case 'up':
        return [{ translateY: slideAnim }];
      case 'down':
        return [{ translateY: Animated.multiply(slideAnim, -1) }];
      default:
        return [{ translateY: slideAnim }];
    }
  };

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: opacityAnim,
          transform: getTransform(),
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}