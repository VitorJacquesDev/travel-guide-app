import { renderHook } from '@testing-library/react-native';
import { useTranslation } from '../useTranslation';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'pt' }]),
}));

describe('useTranslation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return translation function', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(typeof result.current.t).toBe('function');
    expect(typeof result.current.changeLanguage).toBe('function');
    expect(typeof result.current.getLanguageName).toBe('function');
    expect(typeof result.current.getAvailableLanguages).toBe('function');
  });

  it('should translate keys correctly', () => {
    const { result } = renderHook(() => useTranslation());
    
    // Test Portuguese translation (default)
    expect(result.current.t('home')).toBe('Início');
    expect(result.current.t('search')).toBe('Buscar');
  });

  it('should return key if translation not found', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(result.current.t('nonexistent' as any)).toBe('nonexistent');
  });

  it('should return available languages', () => {
    const { result } = renderHook(() => useTranslation());
    
    const languages = result.current.getAvailableLanguages();
    
    expect(languages).toHaveLength(3);
    expect(languages.map(l => l.code)).toEqual(['pt', 'en', 'es']);
  });

  it('should return language names correctly', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(result.current.getLanguageName('pt')).toBe('Português (Brasil)');
    expect(result.current.getLanguageName('en')).toBe('English (US)');
    expect(result.current.getLanguageName('es')).toBe('Español');
  });
});