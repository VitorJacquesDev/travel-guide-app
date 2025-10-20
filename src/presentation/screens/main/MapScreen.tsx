import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import MapView, { Marker, Region, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../../navigation/types';
import { useTheme } from '../../theme';
import { useRecommendations, useNearbyPoints } from '../../hooks';
import { LoadingState, ErrorState } from '../../components';
import { PointOfInterest, Coordinates } from '../../../domain/models/PointOfInterest';
import { LocationService } from '../../../core/services/LocationService';
import { MAP_CONFIG } from '../../../core/config/maps';
import { useRootNavigation } from '../../navigation/navigationUtils';

type Props = MainTabScreenProps<'Map'>;

const { width, height } = Dimensions.get('window');

export default function MapScreen({ navigation }: Props): JSX.Element {
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  const mapRef = useRef<MapView>(null);
  const locationService = LocationService.getInstance();

  const [userLocation, setUserLocation] = useState<Coordinates | undefined>();
  const [mapRegion, setMapRegion] = useState<Region>(MAP_CONFIG.DEFAULT_REGION);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PointOfInterest | null>(null);

  // Get nearby points based on current map region
  const {
    data: nearbyPoints,
    isLoading: isLoadingPoints,
    error: pointsError,
    refetch: refetchPoints,
  } = useNearbyPoints(
    userLocation,
    10, // 10km radius
    50, // limit
    !!userLocation
  );

  // Fallback to recommendations if no location
  const {
    data: recommendations,
    isLoading: isLoadingRecommendations,
  } = useRecommendations({
    location: userLocation,
    limit: 20,
    enabled: !userLocation,
  });

  const points = nearbyPoints || recommendations || [];

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const permissions = await locationService.checkPermissions();
    setLocationPermissionGranted(permissions.granted);
    
    if (permissions.granted) {
      getCurrentLocation();
    }
  };

  const requestLocationPermission = async () => {
    setIsLoadingLocation(true);
    
    try {
      const permissions = await locationService.requestPermissions();
      setLocationPermissionGranted(permissions.granted);
      
      if (permissions.granted) {
        await getCurrentLocation();
      } else {
        Alert.alert(
          'Permissão Negada',
          'Para ver sua localização no mapa, permita o acesso à localização nas configurações do app.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Erro', 'Não foi possível solicitar permissão de localização.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    try {
      const location = await locationService.getCurrentLocation();
      
      if (location) {
        setUserLocation(location);
        
        const newRegion: Region = {
          latitude: location.latitude,
          longitude: location.longitude,
          ...MAP_CONFIG.DEFAULT_ZOOM,
        };
        
        setMapRegion(newRegion);
        
        // Animate to user location
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização atual.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMyLocationPress = () => {
    if (!locationPermissionGranted) {
      requestLocationPermission();
    } else {
      getCurrentLocation();
    }
  };

  const handleMarkerPress = (point: PointOfInterest) => {
    setSelectedPoint(point);
    
    // Center map on selected point
    const newRegion: Region = {
      latitude: point.location.latitude,
      longitude: point.location.longitude,
      ...MAP_CONFIG.CLOSE_ZOOM,
    };
    
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 500);
    }
  };

  const handleCalloutPress = (point: PointOfInterest) => {
    rootNavigation.navigate('PointDetails', { pointId: point.id });
  };

  const renderMarker = (point: PointOfInterest) => {
    const getMarkerColor = (category: string) => {
      switch (category) {
        case 'nature': return '#4CAF50';
        case 'cultural': return '#9C27B0';
        case 'historic': return '#FF9800';
        case 'museum': return '#2196F3';
        case 'monument': return '#795548';
        case 'entertainment': return '#E91E63';
        case 'restaurant': return '#FF5722';
        case 'shopping': return '#607D8B';
        default: return theme.colors.primary;
      }
    };

    return (
      <Marker
        key={point.id}
        coordinate={{
          latitude: point.location.latitude,
          longitude: point.location.longitude,
        }}
        title={point.name}
        description={point.description}
        pinColor={getMarkerColor(point.category)}
        onPress={() => handleMarkerPress(point)}
      >
        <Callout onPress={() => handleCalloutPress(point)}>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutTitle} numberOfLines={1}>
              {point.name}
            </Text>
            <Text style={styles.calloutDescription} numberOfLines={2}>
              {point.description}
            </Text>
            <View style={styles.calloutFooter}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>{point.rating.toFixed(1)}</Text>
              </View>
              <Text style={styles.categoryText}>{point.category}</Text>
            </View>
          </View>
        </Callout>
      </Marker>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    map: {
      width,
      height,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    controlsContainer: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 40,
      left: theme.spacing.base,
      right: theme.spacing.base,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleContainer: {
      backgroundColor: theme.colors.card,
      paddingHorizontal: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    myLocationButton: {
      backgroundColor: theme.colors.card,
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    bottomControls: {
      position: 'absolute',
      bottom: theme.spacing.xl,
      left: theme.spacing.base,
      right: theme.spacing.base,
    },
    refreshButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    refreshButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      marginLeft: theme.spacing.xs,
    },
    calloutContainer: {
      width: 200,
      padding: theme.spacing.sm,
    },
    calloutTitle: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    calloutDescription: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    calloutFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    categoryText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.medium,
    },
  });

  if (isLoadingPoints && !points.length) {
    return <LoadingState message="Carregando pontos no mapa..." />;
  }

  if (pointsError && !points.length) {
    return (
      <ErrorState
        title="Erro ao carregar mapa"
        message="Não foi possível carregar os pontos turísticos no mapa."
        onRetry={() => refetchPoints()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={mapRegion}
        showsUserLocation={locationPermissionGranted}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        onRegionChangeComplete={setMapRegion}
      >
        {points.map(renderMarker)}
      </MapView>

      <View style={styles.controlsContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mapa</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.myLocationButton} 
          onPress={handleMyLocationPress}
          disabled={isLoadingLocation}
        >
          <Ionicons 
            name={isLoadingLocation ? 'refresh' : 'locate'} 
            size={24} 
            color={locationPermissionGranted ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomControls}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={() => refetchPoints()}
          disabled={isLoadingPoints}
        >
          <Ionicons 
            name="refresh" 
            size={16} 
            color="#FFFFFF"
          />
          <Text style={styles.refreshButtonText}>
            Atualizar pontos ({points.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}