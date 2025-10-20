# ViagemFácil - Travel Guide App

Um aplicativo móvel completo para descobrir e explorar pontos turísticos, desenvolvido com React Native, Expo e Firebase.

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação e Usuários
- Sistema completo de autenticação com Firebase Auth
- Telas de login, cadastro e onboarding
- Gerenciamento de perfil de usuário
- Contexto global de autenticação

### ✅ Navegação e Interface
- Navegação com React Navigation (Stack + Bottom Tabs)
- 5 telas principais: Home, Busca, Mapa, Favoritos, Perfil
- Tema claro/escuro com sistema automático
- Componentes UI reutilizáveis e responsivos

### ✅ Pontos Turísticos
- Repositório Firestore para dados dos pontos
- Sistema de recomendações baseado em localização
- Busca avançada com filtros (categoria, preço, avaliação)
- Dados de exemplo com pontos turísticos brasileiros

### ✅ Mapas e Localização
- Integração com react-native-maps
- Serviço de localização com permissões
- Marcadores customizados por categoria
- Cálculo de distâncias e pontos próximos

### ✅ Sistema de Favoritos
- Adicionar/remover pontos dos favoritos
- Sincronização em tempo real com Firestore
- Armazenamento offline com AsyncStorage
- Atualizações otimistas para melhor UX

### ✅ Tratamento de Erros
- Error Boundary global para crashes
- Detecção de conectividade de rede
- Estados de loading com skeletons
- Feedback visual para erros e estados offline

### ✅ Internacionalização
- Suporte a 3 idiomas: Português, Inglês, Espanhol
- Detecção automática do idioma do dispositivo
- Hook personalizado para traduções

### ✅ Performance e Qualidade
- Arquitetura Clean Architecture
- Testes unitários abrangentes
- Caching inteligente com React Query
- Componentes otimizados e reutilizáveis

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture:

```
src/
├── core/           # Configurações e serviços centrais
├── domain/         # Entidades, casos de uso e interfaces
├── data/           # Implementações de repositórios e fontes de dados
└── presentation/   # UI, componentes, telas e contextos
```

## 🛠️ Tecnologias Utilizadas

- **React Native** + **Expo** - Framework mobile
- **TypeScript** - Tipagem estática
- **Firebase** - Backend (Auth + Firestore)
- **React Navigation** - Navegação
- **React Query** - Gerenciamento de estado e cache
- **React Native Maps** - Mapas interativos
- **Expo Location** - Serviços de localização
- **AsyncStorage** - Armazenamento local
- **Jest** - Testes unitários

## 📱 Telas Implementadas

1. **Splash Screen** - Tela inicial com logo
2. **Onboarding** - Introdução ao app
3. **Login/Cadastro** - Autenticação de usuários
4. **Home** - Recomendações personalizadas
5. **Busca** - Pesquisa com filtros avançados
6. **Mapa** - Visualização geográfica dos pontos
7. **Favoritos** - Lista de pontos salvos
8. **Perfil** - Informações e configurações do usuário

## 🧪 Testes

O projeto inclui testes unitários para:
- Casos de uso (Use Cases)
- Repositórios (Repositories)
- Serviços (Services)
- Hooks personalizados
- Componentes React

Execute os testes com:
```bash
npm test
```

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar Firebase:**
   - Criar projeto no Firebase Console
   - Adicionar configurações em `src/core/config/firebase.ts`

3. **Executar o app:**
   ```bash
   npm start
   ```

## 📋 Próximos Passos

Para produção, considere implementar:
- [ ] Autenticação social (Google, Facebook)
- [ ] Sistema de avaliações e comentários
- [ ] Notificações push
- [ ] Modo offline completo
- [ ] Analytics e crash reporting
- [ ] Testes E2E com Detox

## 🤝 Contribuição

Este projeto foi desenvolvido seguindo as melhores práticas de desenvolvimento mobile e está pronto para extensões futuras.

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.