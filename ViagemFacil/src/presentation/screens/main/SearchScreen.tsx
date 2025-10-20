import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../../navigation/types';
import { useTheme } from '../../theme';
import { useSearchPoints } from '../../hooks';
import { 
  SearchBar, 
  PointOfInterestCard, 
  LoadingState, 
  ErrorState, 
  EmptyState 
} from '../../components';
import { PointOfInterest, Category, PriceRange } from '../../../domain/models/PointOfInterest';
import { SearchQuery } from '../../../domain/repositories/PointOfInterestRepository';
import { useRootNavigation } from '../../navigation/navigationUtils';

type Props = MainTabScreenProps<'Search'>;

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'nature', label: 'Natureza' },
  { key: 'cultural', label: 'Cultural' },
  { key: 'historic', label: 'Histórico' },
  { key: 'museum', label: 'Museu' },
  { key: 'monument', label: 'Monumento' },
  { key: 'entertainment', label: 'Entretenimento' },
  { key: 'restaurant', label: 'Restaurante' },
  { key: 'shopping', label: 'Compras' },
];

const PRICE_RANGES: { key: PriceRange; label: string }[] = [
  { key: 'free', label: 'Gratuito' },
  { key: 'low', label: 'Baixo' },
  { key: 'medium', label: 'Médio' },
  { key: 'high', label: 'Alto' },
];

const RATING_OPTIONS = [
  { key: 4.5, label: '4.5+ estrelas' },
  { key: 4.0, label: '4.0+ estrelas' },
  { key: 3.5, label: '3.5+ estrelas' },
  { key: 3.0, label: '3.0+ estrelas' },
];

export default function SearchScreen({ navigation }: Props): JSX.Element {
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [selectedMinRating, setSelectedMinRating] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchParams: SearchQuery = {
    query: searchQuery.trim() || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    priceRanges: selectedPriceRanges.length > 0 ? selectedPriceRanges : undefined,
    minRating: selectedMinRating,
    limit: 20,
    offset: 0,
  };

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useSearchPoints({
    ...searchParams,
    enabled: hasSearched,
  });

  const handleSearch = useCallback(() => {
    setHasSearched(true);
    refetch();
  }, [refetch]);

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedMinRating(undefined);
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePriceRange = (priceRange: PriceRange) => {
    setSelectedPriceRanges(prev => 
      prev.includes(priceRange) 
        ? prev.filter(p => p !== priceRange)
        : [...prev, priceRange]
    );
  };

  const handlePointPress = (point: PointOfInterest) => {
    rootNavigation.navigate('PointDetails', { pointId: point.id });
  };

  const handleFavoritePress = (point: PointOfInterest) => {
    Alert.alert(
      'Favoritos',
      'Funcionalidade de favoritos será implementada na Task 6',
      [{ text: 'OK' }]
    );
  };

  const renderSearchResult = ({ item }: { item: PointOfInterest }) => (
    <PointOfInterestCard
      point={item}
      onPress={() => handlePointPress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={false}
    />
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filtros</Text>
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.clearButton}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Categories */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Categorias</Text>
            <View style={styles.filterOptions}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.filterChip,
                    selectedCategories.includes(category.key) && styles.filterChipSelected
                  ]}
                  onPress={() => toggleCategory(category.key)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedCategories.includes(category.key) && styles.filterChipTextSelected
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Ranges */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Faixa de Preço</Text>
            <View style={styles.filterOptions}>
              {PRICE_RANGES.map(price => (
                <TouchableOpacity
                  key={price.key}
                  style={[
                    styles.filterChip,
                    selectedPriceRanges.includes(price.key) && styles.filterChipSelected
                  ]}
                  onPress={() => togglePriceRange(price.key)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedPriceRanges.includes(price.key) && styles.filterChipTextSelected
                  ]}>
                    {price.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Avaliação Mínima</Text>
            <View style={styles.filterOptions}>
              {RATING_OPTIONS.map(rating => (
                <TouchableOpacity
                  key={rating.key}
                  style={[
                    styles.filterChip,
                    selectedMinRating === rating.key && styles.filterChipSelected
                  ]}
                  onPress={() => setSelectedMinRating(
                    selectedMinRating === rating.key ? undefined : rating.key
                  )}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedMinRating === rating.key && styles.filterChipTextSelected
                  ]}>
                    {rating.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.applyButton} 
            onPress={() => {
              setShowFilters(false);
              handleSearch();
            }}
          >
            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: 60,
      paddingBottom: theme.spacing.base,
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
    searchContainer: {
      paddingHorizontal: theme.spacing.base,
    },
    resultsContainer: {
      flex: 1,
      paddingTop: theme.spacing.base,
    },
    resultsHeader: {
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.base,
    },
    resultsText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    listContainer: {
      paddingBottom: theme.spacing.xl,
    },
    emptyContainer: {
      flex: 1,
      minHeight: 300,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    clearButton: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    modalContent: {
      flex: 1,
      paddingHorizontal: theme.spacing.xl,
    },
    filterSection: {
      marginVertical: theme.spacing.base,
    },
    filterTitle: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    filterOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    filterChip: {
      paddingHorizontal: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterChipSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterChipText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text,
    },
    filterChipTextSelected: {
      color: '#FFFFFF',
    },
    modalFooter: {
      padding: theme.spacing.xl,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    applyButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.base,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    applyButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
        <Text style={styles.subtitle}>Encontre pontos turísticos</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar pontos turísticos..."
          showFilter={true}
          onFilterPress={() => setShowFilters(true)}
          onSubmit={handleSearch}
        />
      </View>

      <View style={styles.resultsContainer}>
        {isLoading ? (
          <LoadingState message="Buscando..." />
        ) : error ? (
          <ErrorState
            title="Erro na busca"
            message="Não foi possível realizar a busca. Tente novamente."
            onRetry={handleSearch}
          />
        ) : hasSearched && searchResults ? (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {searchResults.total} resultado{searchResults.total !== 1 ? 's' : ''} encontrado{searchResults.total !== 1 ? 's' : ''}
              </Text>
            </View>
            
            {searchResults.points.length > 0 ? (
              <FlatList
                data={searchResults.points}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <EmptyState
                  icon="search-outline"
                  title="Nenhum resultado encontrado"
                  message="Tente ajustar os filtros ou usar termos diferentes."
                  actionText="Limpar filtros"
                  onAction={handleClearFilters}
                />
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="search-outline"
              title="Faça sua primeira busca"
              message="Digite o que você está procurando ou use os filtros para encontrar pontos turísticos."
            />
          </View>
        )}
      </View>

      {renderFilterModal()}
    </View>
  );
}