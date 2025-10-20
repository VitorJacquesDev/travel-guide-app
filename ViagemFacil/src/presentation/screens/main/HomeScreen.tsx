import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { MainTabScreenProps } from '../../navigation/types';
import { useTheme } from '../../theme';
import { useRecommendations } from '../../hooks';
import { PointOfInterestCard, LoadingState, ErrorState, EmptyState } from '../../components';
import { PointOfInterest, Coordinates } from '../../../domain/models/PointOfInterest';
import { useRootNavigation } from '../../navigation/navigationUtils';

type Props = MainTabScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props): JSX.Element {
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  const [userLocation, setUserLocation] = useState<Coordinates | undefined>();
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const {
    data: recommendations,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useRecommendations({
    location: userLocation,
    limit: 20,
    enabled: true,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setLocationPermissionGranted(true);
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        setLocationPermissionGranted(false);
        // Show recommendations without location
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermissionGranted(false);
    }
  };

  const handlePointPress = (point: PointOfInterest) => {
    rootNavigation.navigate('PointDetails', { pointId: point.id });
  };

  const handleFavoritePress = (point: PointOfInterest) => {
    // TODO: Implement favorites functionality in Task 6
    Alert.alert(
      'Favoritos',
      'Funcionalidade de favoritos será implementada na Task 6',
      [{ text: 'OK' }]
    );
  };

  const handleLocationPress = () => {
    if (!locationPermissionGranted) {
      Alert.alert(
        'Permissão de Localização',
        'Permita o acesso à localização para ver recomendações próximas a você.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Permitir', onPress: requestLocationPermission },
        ]
      );
    }
  };

  const renderRecommendationItem = ({ item }: { item: PointOfInterest }) => (
    <PointOfInterestCard
      point={item}
      onPress={() => handlePointPress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={false} // TODO: Get from favorites context in Task 6
    />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: 60,
      paddingBottom: theme.spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
    },
    locationButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      backgroundColor: locationPermissionGranted ? theme.colors.primary : theme.colors.surface,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
    locationText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    sectionHeader: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.base,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    listContainer: {
      paddingBottom: theme.spacing.xl,
    },
    emptyContainer: {
      flex: 1,
      minHeight: 400,
    },
  });

  if (isLoading && !recommendations) {
    return <LoadingState message="Carregando recomendações..." />;
  }

  if (error && !recommendations) {
    return (
      <ErrorState
        title="Erro ao carregar recomendações"
        message="Não foi possível carregar as recomendações. Verifique sua conexão e tente novamente."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Início</Text>
          <TouchableOpacity 
            style={styles.locationButton} 
            onPress={handleLocationPress}
          >
            <Ionicons 
              name={locationPermissionGranted ? 'location' : 'location-outline'} 
              size={24} 
              color={locationPermissionGranted ? '#FFFFFF' : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Descubra lugares incríveis</Text>
        {userLocation && (
          <Text style={styles.locationText}>
            Recomendações próximas a você
          </Text>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recomendações para você</Text>
      </View>

      {recommendations && recommendations.length > 0 ? (
        <FlatList
          data={recommendations}
          renderItem={renderRecommendationItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="compass-outline"
            title="Nenhuma recomendação encontrada"
            message="Não encontramos recomendações no momento. Tente novamente mais tarde."
            actionText="Tentar novamente"
            onAction={() => refetch()}
          />
        </View>
      )}
    </View>
  );
}