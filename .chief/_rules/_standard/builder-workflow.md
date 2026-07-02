# Builder Workflow Rules

## After Each Task Implementation

1. Run `pnpm format && pnpm lint && pnpm test` — ALL must pass before committing.
2. If any step fails, fix the issues before proceeding.

## Installing Libraries

- ALWAYS use `pnpm exec expo install <lib>` instead of `pnpm add <lib>`.
- This ensures Expo-compatible versions are resolved.

## Commit Style

Follow Conventional Commits: `feat(scope): description`, `fix(scope): description`, etc.
