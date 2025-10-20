import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { PointOfInterest } from '../../../domain/models';

interface PointOfInterestCardProps {
  point: PointOfInterest;
  onPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
}

export default function PointOfInterestCard({
  point,
  onPress,
  onFavoritePress,
  isFavorite,
}: PointOfInterestCardProps): JSX.Element {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      marginHorizontal: theme.spacing.base,
      marginVertical: theme.spacing.sm,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: '100%',
      height: 200,
      borderTopLeftRadius: theme.borderRadius.md,
      borderTopRightRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    content: {
      padding: theme.spacing.base,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    title: {
      flex: 1,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
    },
    favoriteButton: {
      padding: theme.spacing.sm,
    },
    description: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
      marginBottom: theme.spacing.sm,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rating: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    category: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.medium,
    },
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />
      );
    }

    return stars;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={{ uri: point.imageUrl || 'https://via.placeholder.com/400x200' }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {point.name}
          </Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {point.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            {renderStars(point.rating)}
            <Text style={styles.rating}>({point.rating.toFixed(1)})</Text>
          </View>
          <Text style={styles.category}>{point.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}