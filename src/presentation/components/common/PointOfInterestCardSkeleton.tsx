import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import SkeletonLoader from './SkeletonLoader';

export default function PointOfInterestCardSkeleton(): JSX.Element {
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
    titleContainer: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    title: {
      marginBottom: theme.spacing.xs,
    },
    description: {
      marginBottom: theme.spacing.sm,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      marginLeft: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <SkeletonLoader style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <SkeletonLoader 
              width="80%" 
              height={20} 
              style={styles.title}
            />
          </View>
          <SkeletonLoader 
            width={24} 
            height={24} 
            borderRadius={12}
          />
        </View>
        
        <SkeletonLoader 
          width="100%" 
          height={16} 
          style={styles.description}
        />
        <SkeletonLoader 
          width="60%" 
          height={16} 
          style={styles.description}
        />
        
        <View style={styles.footer}>
          <View style={styles.rating}>
            <SkeletonLoader width={80} height={16} />
          </View>
          <SkeletonLoader width={60} height={16} />
        </View>
      </View>
    </View>
  );
}