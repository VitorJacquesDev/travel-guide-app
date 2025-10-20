import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useNetwork } from '../../hooks/useNetwork';

export default function NetworkStatusBar(): JSX.Element | null {
  const { theme } = useTheme();
  const { isConnected, isInternetReachable, networkType } = useNetwork();
  const [showBar, setShowBar] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    const shouldShow = !isConnected || !isInternetReachable;
    
    if (shouldShow !== showBar) {
      setShowBar(shouldShow);
      
      Animated.timing(slideAnim, {
        toValue: shouldShow ? 0 : -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, isInternetReachable, showBar, slideAnim]);

  const getStatusInfo = () => {
    if (!isConnected) {
      return {
        icon: 'cloud-offline-outline' as keyof typeof Ionicons.glyphMap,
        text: 'Sem conexão com a internet',
        color: theme.colors.error,
      };
    }
    
    if (!isInternetReachable) {
      return {
        icon: 'warning-outline' as keyof typeof Ionicons.glyphMap,
        text: 'Conexão limitada - Alguns recursos podem não funcionar',
        color: '#FF9500',
      };
    }

    return null;
  };

  const statusInfo = getStatusInfo();

  if (!statusInfo) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: statusInfo.color,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.base,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    text: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      textAlign: 'center',
      flex: 1,
    },
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Ionicons 
        name={statusInfo.icon} 
        size={16} 
        color="#FFFFFF" 
        style={styles.icon}
      />
      <Text style={styles.text}>{statusInfo.text}</Text>
    </Animated.View>
  );
}