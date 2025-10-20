import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../../navigation/types';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';

type Props = MainTabScreenProps<'Profile'>;

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

export default function ProfileScreen({ navigation }: Props): JSX.Element {
  const { theme, toggleTheme, themeMode } = useTheme();
  const { user, signOut } = useAuth();
  const { favoriteIds } = useFavorites();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível sair da conta.');
            }
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Editar Perfil',
      'Funcionalidade de edição de perfil será implementada em breve.',
      [{ text: 'OK' }]
    );
  };

  const handleLanguageSettings = () => {
    Alert.alert(
      'Idioma',
      'Selecione o idioma do aplicativo:',
      [
        { text: 'Português', onPress: () => {} },
        { text: 'English', onPress: () => {} },
        { text: 'Español', onPress: () => {} },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const settingsItems: SettingsItem[] = [
    {
      id: 'edit-profile',
      title: 'Editar Perfil',
      subtitle: 'Alterar informações pessoais',
      icon: 'person-outline',
      type: 'navigation',
      onPress: handleEditProfile,
    },
    {
      id: 'notifications',
      title: 'Notificações',
      subtitle: 'Receber notificações do app',
      icon: 'notifications-outline',
      type: 'switch',
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
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
      id: 'theme',
      title: 'Tema Escuro',
      subtitle: `Modo atual: ${themeMode === 'dark' ? 'Escuro' : themeMode === 'light' ? 'Claro' : 'Sistema'}`,
      icon: 'moon-outline',
      type: 'switch',
      value: theme.isDark,
      onToggle: toggleTheme,
    },
    {
      id: 'language',
      title: 'Idioma',
      subtitle: 'Português (Brasil)',
      icon: 'language-outline',
      type: 'navigation',
      onPress: handleLanguageSettings,
    },
    {
      id: 'help',
      title: 'Ajuda e Suporte',
      icon: 'help-circle-outline',
      type: 'navigation',
      onPress: () => Alert.alert('Ajuda', 'Entre em contato conosco em: suporte@viagemfacil.com'),
    },
    {
      id: 'about',
      title: 'Sobre o App',
      subtitle: 'Versão 1.0.0',
      icon: 'information-circle-outline',
      type: 'navigation',
      onPress: () => Alert.alert('ViagemFácil', 'Versão 1.0.0\n\nDescubra lugares incríveis e planeje suas viagens.'),
    },
  ];

  const renderSettingsItem = (item: SettingsItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingsItem}
      onPress={item.onPress}
      disabled={item.type === 'switch'}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsIconContainer}>
          <Ionicons 
            name={item.icon} 
            size={24} 
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
        ) : (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={theme.colors.textSecondary}
          />
        )}
      </View>
    </TouchableOpacity>
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
      alignItems: 'center',
    },
    profileImageContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.base,
      borderWidth: 3,
      borderColor: theme.colors.primary,
    },
    profileImage: {
      width: 94,
      height: 94,
      borderRadius: 47,
    },
    profileName: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    profileEmail: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.base,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingVertical: theme.spacing.base,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.primary,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    settingsSection: {
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
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
      width: 40,
      height: 40,
      borderRadius: 20,
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
    signOutButton: {
      marginHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      paddingVertical: theme.spacing.base,
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    signOutText: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
      color: '#FFFFFF',
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person" size={50} color={theme.colors.textSecondary} />
          )}
        </View>
        
        <Text style={styles.profileName}>
          {user?.displayName || 'Usuário'}
        </Text>
        
        <Text style={styles.profileEmail}>
          {user?.email || 'email@exemplo.com'}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favoriteIds.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Visitados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Avaliações</Text>
          </View>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        {settingsItems.map(renderSettingsItem)}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}