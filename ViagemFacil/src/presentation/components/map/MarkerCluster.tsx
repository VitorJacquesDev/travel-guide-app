import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface MarkerClusterProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
}

export default function MarkerCluster({ 
  count, 
  size = 'medium' 
}: MarkerClusterProps): JSX.Element {
  const { theme } = useTheme();

  const getSizeConfig = (size: string) => {
    switch (size) {
      case 'small':
        return { containerSize: 32, fontSize: 12 };
      case 'large':
        return { containerSize: 56, fontSize: 16 };
      default:
        return { containerSize: 44, fontSize: 14 };
    }
  };

  const getClusterColor = (count: number) => {
    if (count < 5) return theme.colors.primary;
    if (count < 10) return '#FF9800';
    if (count < 20) return '#FF5722';
    return '#9C27B0';
  };

  const sizeConfig = getSizeConfig(size);
  const clusterColor = getClusterColor(count);

  const styles = StyleSheet.create({
    container: {
      width: sizeConfig.containerSize,
      height: sizeConfig.containerSize,
      borderRadius: sizeConfig.containerSize / 2,
      backgroundColor: clusterColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#FFFFFF',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    text: {
      fontSize: sizeConfig.fontSize,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}