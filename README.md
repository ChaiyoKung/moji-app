# Moji App

The mobile application for Moji, a minimal and friendly expense tracker app to help you stay mindful with your money — with a touch of charm.

## Release

```bash
git checkout main
git pull origin main

pnpm run release
```

## Build Preview (`.apk`)

```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

## Build Production (`.aab`)

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```
