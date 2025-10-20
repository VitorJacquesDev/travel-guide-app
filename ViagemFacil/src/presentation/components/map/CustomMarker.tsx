import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Category } from '../../../domain/models/PointOfInterest';

interface CustomMarkerProps {
  category: Category;
  rating: number;
  size?: 'small' | 'medium' | 'large';
}

export default function CustomMarker({ 
  category, 
  rating, 
  size = 'medium' 
}: CustomMarkerProps): JSX.Element {
  const { theme } = useTheme();

  const getMarkerConfig = (category: Category) => {
    switch (category) {
      case 'nature':
        return { icon: 'leaf', color: '#4CAF50' };
      case 'cultural':
        return { icon: 'library', color: '#9C27B0' };
      case 'historic':
        return { icon: 'library-outline', color: '#FF9800' };
      case 'museum':
        return { icon: 'business', color: '#2196F3' };
      case 'monument':
        return { icon: 'flag', color: '#795548' };
      case 'entertainment':
        return { icon: 'musical-notes', color: '#E91E63' };
      case 'restaurant':
        return { icon: 'restaurant', color: '#FF5722' };
      case 'shopping':
        return { icon: 'storefront', color: '#607D8B' };
      default:
        return { icon: 'location', color: theme.colors.primary };
    }
  };

  const getSizeConfig = (size: string) => {
    switch (size) {
      case 'small':
        return { containerSize: 32, iconSize: 16, fontSize: 10 };
      case 'large':
        return { containerSize: 48, iconSize: 24, fontSize: 12 };
      default:
        return { containerSize: 40, iconSize: 20, fontSize: 11 };
    }
  };

  const markerConfig = getMarkerConfig(category);
  const sizeConfig = getSizeConfig(size);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    markerContainer: {
      width: sizeConfig.containerSize,
      height: sizeConfig.containerSize,
      borderRadius: sizeConfig.containerSize / 2,
      backgroundColor: markerConfig.color,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFFFFF',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    ratingContainer: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 8,
      marginTop: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    ratingText: {
      fontSize: sizeConfig.fontSize,
      fontWeight: '600',
      color: '#333333',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.markerContainer}>
        <Ionicons 
          name={markerConfig.icon as keyof typeof Ionicons.glyphMap} 
          size={sizeConfig.iconSize} 
          color="#FFFFFF" 
        />
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    </View>
  );
}