import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { translations, Language, TranslationKey } from '../../core/i18n/translations';

const LANGUAGE_STORAGE_KEY = '@viagemfacil:language';

/**
 * Hook for internationalization
 */
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('pt');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      // Try to load saved language
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      
      if (savedLanguage && isValidLanguage(savedLanguage)) {
        setCurrentLanguage(savedLanguage as Language);
      } else {
        // Use device locale as fallback
        const deviceLanguage = getDeviceLanguage();
        setCurrentLanguage(deviceLanguage);
      }
    } catch (error) {
      console.warn('Failed to load language:', error);
      // Use default language
      setCurrentLanguage('pt');
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceLanguage = (): Language => {
    try {
      const locales = getLocales();
      const primaryLocale = locales[0];
      
      if (primaryLocale?.languageCode) {
        const languageCode = primaryLocale.languageCode.toLowerCase();
        
        switch (languageCode) {
          case 'en':
            return 'en';
          case 'es':
            return 'es';
          case 'pt':
          default:
            return 'pt';
        }
      }
    } catch (error) {
      console.warn('Failed to get device language:', error);
    }
    
    return 'pt'; // Default fallback
  };

  const isValidLanguage = (language: string): boolean => {
    return Object.keys(translations).includes(language);
  };

  const changeLanguage = async (language: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      setCurrentLanguage(language);
    } catch (error) {
      console.warn('Failed to save language:', error);
      // Still update the current language even if saving fails
      setCurrentLanguage(language);
    }
  };

  const t = (key: TranslationKey): string => {
    const translation = translations[currentLanguage]?.[key];
    
    if (translation) {
      return translation;
    }
    
    // Fallback to Portuguese if translation not found
    const fallback = translations.pt[key];
    if (fallback) {
      return fallback;
    }
    
    // Return the key itself as last resort
    return key;
  };

  const getLanguageName = (language: Language): string => {
    switch (language) {
      case 'pt':
        return 'Português (Brasil)';
      case 'en':
        return 'English (US)';
      case 'es':
        return 'Español';
      default:
        return language;
    }
  };

  const getAvailableLanguages = (): { code: Language; name: string }[] => {
    return Object.keys(translations).map(code => ({
      code: code as Language,
      name: getLanguageName(code as Language),
    }));
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    getLanguageName,
    getAvailableLanguages,
    isLoading,
  };
}