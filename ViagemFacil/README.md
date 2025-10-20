# ViagemFacil - Travel App

A comprehensive travel application built with Expo/React Native that helps users discover tourist attractions, visualize them on interactive maps, save favorites, and receive personalized recommendations.

## Features

- 🔐 User authentication with Firebase Auth
- 🗺️ Interactive maps with Google Maps integration
- 📍 Location-based recommendations
- ⭐ Favorites management
- 🔍 Advanced search and filtering
- 🎨 Clean Architecture implementation
- 🌍 Multi-language support (Portuguese, English, Spanish)
- 🌙 Dark/Light theme support

## Architecture

This project follows Clean Architecture principles with three main layers:

- **Domain Layer**: Business logic, entities, and use cases
- **Data Layer**: Repository implementations and data sources
- **Presentation Layer**: UI components, screens, and navigation

## Project Structure

```
src/
├── domain/              # Business Logic Layer
│   ├── models/          # Core entities and value objects
│   ├── repositories/    # Abstract repository interfaces
│   └── usecases/        # Business use cases
├── data/                # Data Access Layer
│   ├── repositories/    # Concrete repository implementations
│   ├── datasources/     # External data sources (Firebase, APIs)
│   └── models/          # DTOs and data mappers
├── presentation/        # UI Layer
│   ├── screens/         # Screen components
│   ├── components/      # Reusable UI components
│   ├── navigation/      # Navigation configuration
│   ├── hooks/           # Custom React hooks
│   └── theme/           # Styling and theming
└── core/                # Shared utilities
    ├── config/          # App configuration
    └── utils/           # Helper functions
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI
- Firebase project setup
- Google Maps API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your Firebase and Google Maps credentials in `.env`

5. Start the development server:
   ```bash
   npm start
   ```

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication and Firestore
3. Configure security rules using the provided `firestore.rules`
4. Add your Firebase configuration to the environment variables

### Environment Variables

Create a `.env` file with the following variables:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## Development

### Code Quality

The project includes ESLint and Prettier configurations for consistent code formatting:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Building

```bash
# Build for production
npm run build
```

## Contributing

1. Follow the Clean Architecture principles
2. Write TypeScript with strict mode enabled
3. Use the established folder structure
4. Follow the ESLint and Prettier configurations
5. Write meaningful commit messages

## License

This project is licensed under the MIT License.