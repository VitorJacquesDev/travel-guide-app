import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../../navigation/types';
import { useTheme } from '../../theme';
import { useFavorites } from '../../contexts/FavoritesContext';
import { usePointsByIds } from '../../hooks';
import { 
  PointOfInterestCard, 
  LoadingState, 
  ErrorState, 
  EmptyState 
} from '../../components';
import { PointOfInterest } from '../../../domain/models/PointOfInterest';
import { useRootNavigation } from '../../navigation/navigationUtils';

type Props = MainTabScreenProps<'Favorites'>;

export default function FavoritesScreen({ navigation }: Props): JSX.Element {
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  const { favoriteIds, removeFromFavorites, isLoading: favoritesLoading } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: favoritePoints,
    isLoading,
    error,
    refetch,
  } = usePointsByIds(favoriteIds, favoriteIds.length > 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handlePointPress = (point: PointOfInterest) => {
    rootNavigation.navigate('PointDetails', { pointId: point.id });
  };

  const handleFavoritePress = async (point: PointOfInterest) => {
    try {
      Alert.alert(
        'Remover dos Favoritos',
        `Deseja remover "${point.name}" dos seus favoritos?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Remover', 
            style: 'destructive',
            onPress: async () => {
              try {
                await removeFromFavorites(point.id);
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível remover dos favoritos.');
              }
            }
          },
        ]
      );
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleClearAllFavorites = () => {
    if (favoriteIds.length === 0) return;

    Alert.alert(
      'Limpar Favoritos',
      'Deseja remover todos os pontos dos seus favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar Todos', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove all favorites one by one
              for (const pointId of favoriteIds) {
                await removeFromFavorites(pointId);
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar todos os favoritos.');
            }
          }
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: PointOfInterest }) => (
    <PointOfInterestCard
      point={item}
      onPress={() => handlePointPress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={true}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Favoritos</Text>
          <Text style={styles.subtitle}>
            {favoritePoints?.length || 0} lugar{(favoritePoints?.length || 0) !== 1 ? 'es' : ''} salvo{(favoritePoints?.length || 0) !== 1 ? 's' : ''}
          </Text>
        </View>
        
        {favoriteIds.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearAllFavorites}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: 60,
      paddingBottom: theme.spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
    },
    clearButtonText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.error,
      marginLeft: theme.spacing.xs,
      fontWeight: theme.typography.fontWeight.medium,
    },
    listContainer: {
      paddingBottom: theme.spacing.xl,
    },
    emptyContainer: {
      flex: 1,
      minHeight: 400,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (isLoading && !favoritePoints) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <LoadingState message="Carregando favoritos..." />
      </View>
    );
  }

  if (error && !favoritePoints) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <ErrorState
          title="Erro ao carregar favoritos"
          message="Não foi possível carregar seus pontos favoritos."
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      {favoritePoints && favoritePoints.length > 0 ? (
        <FlatList
          data={favoritePoints}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="heart-outline"
            title="Nenhum favorito ainda"
            message="Adicione pontos turísticos aos seus favoritos para vê-los aqui."
            actionText="Explorar pontos"
            onAction={() => navigation.navigate('Home')}
          />
        </View>
      )}
    </View>
  );
}