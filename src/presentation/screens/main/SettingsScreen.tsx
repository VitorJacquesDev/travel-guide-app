import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'navigation' | 'switch' | 'info';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen(): JSX.Element {
  const { theme, toggleTheme, themeMode, setThemeMode } = useTheme();
  const { user } = useAuth();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [recommendationsEnabled, setRecommendationsEnabled] = useState(true);
  const [favoritesNotifications, setFavoritesNotifications] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleThemeSelection = () => {
    Alert.alert(
      'Tema do Aplicativo',
      'Escolha o tema do aplicativo:',
      [
        { 
          text: 'Claro', 
          onPress: () => setThemeMode('light')
        },
        { 
          text: 'Escuro', 
          onPress: () => setThemeMode('dark')
        },
        { 
          text: 'Sistema', 
          onPress: () => setThemeMode('system')
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleLanguageSelection = () => {
    Alert.alert(
      'Idioma do Aplicativo',
      'Selecione o idioma:',
      [
        { text: 'Português (Brasil)', onPress: () => {} },
        { text: 'English (US)', onPress: () => {} },
        { text: 'Español', onPress: () => {} },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleDataManagement = () => {
    Alert.alert(
      'Gerenciar Dados',
      'Escolha uma opção:',
      [
        { text: 'Limpar Cache', onPress: () => Alert.alert('Cache limpo com sucesso!') },
        { text: 'Exportar Dados', onPress: () => Alert.alert('Funcionalidade em desenvolvimento') },
        { text: 'Excluir Conta', style: 'destructive', onPress: () => Alert.alert('Funcionalidade em desenvolvimento') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Aparência',
      items: [
        {
          id: 'theme',
          title: 'Tema',
          subtitle: `Atual: ${themeMode === 'dark' ? 'Escuro' : themeMode === 'light' ? 'Claro' : 'Sistema'}`,
          icon: 'color-palette-outline',
          type: 'navigation',
          onPress: handleThemeSelection,
        },
        {
          id: 'language',
          title: 'Idioma',
          subtitle: 'Português (Brasil)',
          icon: 'language-outline',
          type: 'navigation',
          onPress: handleLanguageSelection,
        },
      ],
    },
    {
      title: 'Notificações',
      items: [
        {
          id: 'notifications',
          title: 'Notificações Gerais',
          subtitle: 'Receber todas as notificações',
          icon: 'notifications-outline',
          type: 'switch',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'recommendations',
          title: 'Recomendações',
          subtitle: 'Notificações de novos pontos turísticos',
          icon: 'compass-outline',
          type: 'switch',
          value: recommendationsEnabled,
          onToggle: setRecommendationsEnabled,
        },
        {
          id: 'favorites',
          title: 'Favoritos',
          subtitle: 'Atualizações sobre seus favoritos',
          icon: 'heart-outline',
          type: 'switch',
          value: favoritesNotifications,
          onToggle: setFavoritesNotifications,
        },
      ],
    },
    {
      title: 'Privacidade e Dados',
      items: [
        {
          id: 'location',
          title: 'Localização',
          subtitle: 'Permitir acesso à localização',
          icon: 'location-outline',
          type: 'switch',
          value: locationEnabled,
          onToggle: setLocationEnabled,
        },
        {
          id: 'offline',
          title: 'Modo Offline',
          subtitle: 'Salvar dados para uso offline',
          icon: 'cloud-offline-outline',
          type: 'switch',
          value: offlineMode,
          onToggle: setOfflineMode,
        },
        {
          id: 'data',
          title: 'Gerenciar Dados',
          subtitle: 'Cache, exportação e exclusão',
          icon: 'server-outline',
          type: 'navigation',
          onPress: handleDataManagement,
        },
      ],
    },
    {
      title: 'Suporte',
      items: [
        {
          id: 'help',
          title: 'Central de Ajuda',
          subtitle: 'FAQ e tutoriais',
          icon: 'help-circle-outline',
          type: 'navigation',
          onPress: () => Alert.alert('Ajuda', 'Acesse nossa central de ajuda em: help.viagemfacil.com'),
        },
        {
          id: 'contact',
          title: 'Contato',
          subtitle: 'Entre em contato conosco',
          icon: 'mail-outline',
          type: 'navigation',
          onPress: () => Alert.alert('Contato', 'Email: suporte@viagemfacil.com\nTelefone: (11) 1234-5678'),
        },
        {
          id: 'feedback',
          title: 'Enviar Feedback',
          subtitle: 'Ajude-nos a melhorar o app',
          icon: 'chatbubble-outline',
          type: 'navigation',
          onPress: () => Alert.alert('Feedback', 'Funcionalidade em desenvolvimento'),
        },
      ],
    },
    {
      title: 'Sobre',
      items: [
        {
          id: 'version',
          title: 'Versão do App',
          subtitle: '1.0.0 (Build 1)',
          icon: 'information-circle-outline',
          type: 'info',
        },
        {
          id: 'terms',
          title: 'Termos de Uso',
          icon: 'document-text-outline',
          type: 'navigation',
          onPress: () => Alert.alert('Termos de Uso', 'Funcionalidade em desenvolvimento'),
        },
        {
          id: 'privacy',
          title: 'Política de Privacidade',
          icon: 'shield-checkmark-outline',
          type: 'navigation',
          onPress: () => Alert.alert('Política de Privacidade', 'Funcionalidade em desenvolvimento'),
        },
      ],
    },
  ];

  const renderSettingsItem = (item: SettingsItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingsItem}
      onPress={item.onPress}
      disabled={item.type === 'switch' || item.type === 'info'}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsIconContainer}>
          <Ionicons 
            name={item.icon} 
            size={22} 
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.settingsTextContainer}>
          <Text style={styles.settingsTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingsItemRight}>
        {item.type === 'switch' ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ 
              false: theme.colors.border, 
              true: theme.colors.primary + '40' 
            }}
            thumbColor={item.value ? theme.colors.primary : theme.colors.surface}
          />
        ) : item.type === 'navigation' ? (
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color={theme.colors.textSecondary}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: SettingsSection) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.items.map(renderSettingsItem)}
    </View>
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
    section: {
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.base,
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.base,
      paddingHorizontal: theme.spacing.base,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingsIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.base,
    },
    settingsTextContainer: {
      flex: 1,
    },
    settingsTitle: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
    },
    settingsSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    settingsItemRight: {
      marginLeft: theme.spacing.base,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Personalize sua experiência</Text>
      </View>

      {settingsSections.map(renderSection)}
    </ScrollView>
  );
}