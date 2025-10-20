# ViagemFácil - Travel Guide App

Um aplicativo móvel para descobrir e explorar pontos turísticos, desenvolvido com React Native e Expo.

## 🚀 Funcionalidades

- **Autenticação**: Login e cadastro de usuários com Firebase Auth
- **Descoberta**: Explore pontos turísticos próximos com base na localização
- **Busca**: Filtre por categoria, preço, avaliação e distância
- **Favoritos**: Salve seus lugares preferidos
- **Mapa**: Visualize pontos de interesse em um mapa interativo
- **Perfil**: Gerencie preferências e histórico de visitas
- **Temas**: Suporte a modo claro, escuro e automático
- **Multilíngue**: Português, Inglês e Espanhol

## 🛠️ Tecnologias

- **React Native** com Expo
- **TypeScript** para tipagem estática
- **Firebase** (Auth, Firestore, Storage)
- **React Navigation** para navegação
- **React Query** para gerenciamento de estado
- **React Native Maps** para mapas
- **React Native Paper** para UI

## 📱 Arquitetura

O projeto segue os princípios da **Clean Architecture**:

```
src/
├── core/           # Configurações e utilitários
├── domain/         # Entidades e casos de uso
├── data/           # Implementações e repositórios
└── presentation/   # UI, componentes e telas
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio ou Xcode (para emuladores)

### Configuração

1. **Clone o repositório**
```bash
git clone <repository-url>
cd ViagemFacil
```

2. **Instale as dependências**
```bash
npm install --legacy-peer-deps
```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Ative Authentication (Email/Password)
   - Ative Firestore Database
   - Copie as configurações para o arquivo `.env`

4. **Configure o Google Maps**
   - Obtenha uma API Key no [Google Cloud Console](https://console.cloud.google.com)
   - Ative a Google Maps SDK
   - Adicione a chave no arquivo `.env`

5. **Arquivo .env**
```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps API
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

## 🚀 Executando

### Desenvolvimento
```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar no navegador
npm run web
```

### Build
```bash
# Verificar tipos TypeScript
npm run type-check

# Executar linter
npm run lint

# Formatar código
npm run format

# Build para produção
npm run build
```

## 📊 Dados de Exemplo

Para popular o banco com dados de exemplo:

```typescript
import { runSeeder } from './src/data/seeders/pointsSeeder';

// Execute em desenvolvimento
runSeeder();
```



## 📱 Estrutura de Telas

### Autenticação
- **SplashScreen**: Tela inicial com verificação de autenticação
- **OnboardingScreen**: Introdução ao aplicativo
- **LoginScreen**: Login com email/senha
- **SignUpScreen**: Cadastro de novos usuários

### Principal
- **HomeScreen**: Recomendações baseadas na localização
- **SearchScreen**: Busca e filtros avançados
- **MapScreen**: Mapa interativo com pontos de interesse
- **FavoritesScreen**: Lista de favoritos do usuário
- **ProfileScreen**: Perfil e configurações

## 🔒 Segurança

- Autenticação segura com Firebase Auth
- Validação de dados no frontend e backend
- Regras de segurança no Firestore
- Sanitização de inputs do usuário

## 🌍 Internacionalização

Suporte a múltiplos idiomas:
- Português (Brasil) - Padrão
- Inglês (Estados Unidos)
- Espanhol (Espanha)

## 📈 Performance

- Lazy loading de imagens
- Paginação de resultados
- Cache inteligente com React Query
- Otimizações de FlatList
- Bundle splitting

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, envie um email para support@viagemfacil.com ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ pela equipe ViagemFácil