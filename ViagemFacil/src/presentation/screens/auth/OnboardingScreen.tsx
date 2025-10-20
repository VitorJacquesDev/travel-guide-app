import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Onboarding slide data interface
 */
interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
}

/**
 * Onboarding slides data
 */
const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Descubra Lugares Incríveis',
    description: 'Encontre atrações turísticas, restaurantes e pontos de interesse próximos a você.',
    icon: '🗺️',
  },
  {
    id: '2',
    title: 'Navegue com Facilidade',
    description: 'Use mapas interativos para explorar e navegar até seus destinos favoritos.',
    icon: '📍',
  },
  {
    id: '3',
    title: 'Salve seus Favoritos',
    description: 'Marque lugares especiais e crie sua lista personalizada de destinos.',
    icon: '⭐',
  },
  {
    id: '4',
    title: 'Recomendações Personalizadas',
    description: 'Receba sugestões baseadas em suas preferências e localização.',
    icon: '🎯',
  },
];

/**
 * Onboarding screen props
 */
interface OnboardingScreenProps {
  onComplete: () => void;
}

/**
 * Onboarding screen component
 * Shows app features carousel and navigation to auth screens
 */
export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  /**
   * Handle slide change
   */
  const handleSlideChange = (event: any): void => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(slideIndex);
  };

  /**
   * Go to next slide
   */
  const goToNextSlide = (): void => {
    if (currentIndex < onboardingSlides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      onComplete();
    }
  };

  /**
   * Skip onboarding
   */
  const skipOnboarding = (): void => {
    onComplete();
  };

  /**
   * Render onboarding slide
   */
  const renderSlide = ({ item }: { item: OnboardingSlide }): JSX.Element => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  /**
   * Render pagination dots
   */
  const renderPagination = (): JSX.Element => (
    <View style={styles.pagination}>
      {onboardingSlides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  const isLastSlide = currentIndex === onboardingSlides.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleSlideChange}
        style={styles.carousel}
      />

      {renderPagination()}

      <View style={styles.footer}>
        <TouchableOpacity onPress={goToNextSlide} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'Começar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
    width: 24,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});