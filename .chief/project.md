# Project Configuration

## Project
**Moji App** — A minimal and friendly expense tracker mobile app to help you stay mindful with your money — with a touch of charm.

## Development Commands
| Command | Purpose |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm start` | Start Expo dev server |
| `pnpm android` | Run on Android |
| `pnpm ios` | Run on iOS |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm lint` | Lint code |
| `pnpm format` | Format code with Prettier |

## Architecture Overview

### Tech Stack
- **Runtime**: React Native 0.81 + Expo ~54
- **Language**: TypeScript
- **Navigation**: expo-router (file-based routing)
- **Styling**: NativeWind v4 (Tailwind CSS for RN) + Gluestack UI
- **State Management**: Zustand
- **Server State**: TanStack Query v5
- **HTTP Client**: Axios
- **Validation**: Zod
- **Date Handling**: Day.js
- **Icons**: Lucide React Native
- **Auth**: Google Sign-In (`@react-native-google-signin/google-signin`)

### Key Architectural Patterns
- Feature-based folder structure with shared components
- Screens live in `src/app/` (expo-router file-based routing)
- Features encapsulate their own logic, UI, and hooks in `src/features/`
- Shared UI components in `src/components/`

### Directory Structure
```
src/
├── app/          # expo-router screens and layouts
├── components/   # shared UI components
├── features/     # feature modules (self-contained)
├── hooks/        # shared hooks
├── libs/         # third-party wrappers and config
├── stores/       # Zustand stores
└── utils/        # pure utility functions
```

### Important Development Rules
1. **Code style** — Always run `pnpm format` and `pnpm lint` before committing.
2. **Commit style** — Follow Conventional Commits: `feat(scope): description`, `fix(scope): description`, etc.
3. **Branch policy**
   - Feature branches: based on `main`, prefix `feat/` (e.g. `feat/crud-users`)
   - Hotfix branches: based on `main`, prefix `fix/` (e.g. `fix/auth-google-error`)
4. **Unit tests** — Always write unit tests for pure functions.
