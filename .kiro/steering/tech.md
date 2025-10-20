# Technology Stack & Build System

## Core Technologies

- **React Native 0.74.5** with **Expo SDK 51** for cross-platform mobile development
- **TypeScript 5.3** with strict type checking enabled
- **Expo Router 3.5** for file-based navigation with typed routes
- **Firebase 10.0** for backend services (Auth, Firestore, Storage)

## Key Libraries

### UI & Navigation
- **React Native Paper 5.12** - Material Design components
- **React Navigation 6** - Navigation library (stack, bottom tabs)
- **React Native Maps 1.14** - Interactive maps
- **Expo Vector Icons 14** - Icon library
- **React Native Reanimated 3.10** - Animations

### State Management & Data
- **TanStack React Query 5.0** - Server state management and caching
- **React Hook Form 7.48** with **Zod 3.22** - Form handling and validation
- **AsyncStorage 1.23** - Local storage
- **NetInfo 11.3** - Network connectivity

### Development Tools
- **ESLint** with TypeScript, React, and Expo configs
- **Prettier** for code formatting
- **Jest 29.7** with **Testing Library** for testing
- **Babel** with module resolver for path aliases

## Build System

### Development Commands
```bash
# Start development server
npm start

# Platform-specific development
npm run android    # Android emulator/device
npm run ios        # iOS simulator/device  
npm run web        # Web browser

# Development tools
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run format     # Format with Prettier
npm run type-check # TypeScript type checking
```

### Testing Commands
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Build Commands
```bash
npm run build         # Production build
expo build           # Platform-specific builds
```

## Configuration

### TypeScript Configuration
- Strict mode enabled with comprehensive type checking
- Path aliases configured for clean imports (`@/`, `@/domain/`, etc.)
- Expo TypeScript base configuration extended

### Code Style
- **Prettier**: 100 char line width, single quotes, trailing commas
- **ESLint**: Strict TypeScript rules, React hooks validation, no console warnings
- **Import aliases**: Use `@/` prefix for all internal imports

### Environment Variables
Required `.env` file with Firebase and Google Maps configuration:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## Platform Support

- **Primary**: iOS and Android via Expo
- **Secondary**: Web via Expo Web with Metro bundler
- **Permissions**: Location access for GPS features
- **Scheme**: `viagemfacil://` for deep linking