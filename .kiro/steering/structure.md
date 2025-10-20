# Project Structure & Architecture

## Clean Architecture Implementation

The project follows **Clean Architecture** principles with clear separation of concerns across four main layers:

```
src/
├── core/           # Cross-cutting concerns and configuration
├── domain/         # Business logic and entities (framework-independent)
├── data/           # Data access and external service implementations
└── presentation/   # UI components, screens, and user interactions
```

## Layer Responsibilities

### Core Layer (`src/core/`)
- **config/**: App configuration, constants, and environment setup
- **i18n/**: Internationalization and localization files
- **services/**: Shared services (analytics, notifications, etc.)
- **utils/**: Pure utility functions and helpers

### Domain Layer (`src/domain/`)
- **models/**: Business entities and value objects
- **repositories/**: Repository interfaces (contracts)
- **usecases/**: Business logic and application use cases
- **index.ts**: Public API exports

**Rules**: 
- No dependencies on external frameworks
- Contains pure business logic only
- Defines interfaces that outer layers implement

### Data Layer (`src/data/`)
- **datasources/**: External API clients and data sources
- **models/**: Data transfer objects and API response models
- **repositories/**: Repository implementations (implements domain interfaces)
- **seeders/**: Database seeding and sample data
- **usecases/**: Use case implementations

**Rules**:
- Implements domain repository interfaces
- Handles data transformation between external APIs and domain models
- Manages caching, persistence, and network requests

### Presentation Layer (`src/presentation/`)
- **components/**: Reusable UI components
- **contexts/**: React contexts for state management
- **hooks/**: Custom React hooks
- **navigation/**: Navigation configuration and routing
- **screens/**: Screen components organized by feature
- **theme/**: UI theming and styling
- **validation/**: Form validation schemas

**Rules**:
- Only layer that imports React Native components
- Consumes domain use cases through dependency injection
- Handles user interactions and UI state

## Import Conventions

### Path Aliases
Use configured TypeScript path aliases for clean imports:

```typescript
// ✅ Correct - Use aliases
import { User } from '@/domain/models/User';
import { AuthService } from '@/data/services/AuthService';
import { Button } from '@/presentation/components/Button';

// ❌ Incorrect - Relative paths
import { User } from '../../../domain/models/User';
```

### Layer Dependencies
Follow dependency direction (outer layers depend on inner layers):

```typescript
// ✅ Correct - Presentation depends on Domain
import { LoginUseCase } from '@/domain/usecases/LoginUseCase';

// ❌ Incorrect - Domain depending on Presentation
import { LoginScreen } from '@/presentation/screens/LoginScreen';
```

## File Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types/Interfaces**: PascalCase (`UserModel.ts`)

## Screen Organization

Screens are organized by feature/domain:

```
presentation/screens/
├── auth/           # Authentication screens
├── home/           # Home and discovery screens  
├── search/         # Search and filtering screens
├── map/            # Map and location screens
├── profile/        # User profile screens
└── shared/         # Shared/common screens
```

## Component Structure

### Reusable Components
```
presentation/components/
├── common/         # Generic UI components (Button, Input, etc.)
├── forms/          # Form-specific components
├── navigation/     # Navigation-related components
└── maps/           # Map-related components
```

### Component File Structure
```typescript
// ComponentName/
├── index.ts        # Public exports
├── ComponentName.tsx
├── ComponentName.styles.ts
└── types.ts        # Component-specific types
```

## Configuration Files

- **Root level**: Build tools, linting, and project configuration
- **src/core/config/**: Runtime application configuration
- **Environment**: Use `.env` for environment-specific values with `EXPO_PUBLIC_` prefix for client-side access

## Documentation Rules

- **NEVER create new .md files** for documentation, summaries, or any other purpose
- All documentation should be kept in existing steering files or code comments
- Avoid creating unnecessary documentation files that clutter the workspace