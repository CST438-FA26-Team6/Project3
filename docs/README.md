# Anime and Manga Tracker Frontend

This repository contains the Expo and React Native frontend for the Anime and
Manga Tracker. The same project can run in a web browser or on Android.

## Requirements

Install the following before starting:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (included with Node.js)
- For Android: Android Studio with an Android emulator, or Expo Go on a
  physical Android device
- The Project3 backend when testing features that use the API

## First-time setup

From a terminal, open this repository and install its dependencies:

```bash
cd /path/to/Project3
npm install
```

Create the local environment file from the provided example:

```bash
cp .env.example .env
```

For the web version, `.env` should contain:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
```

The `.env` file is ignored by Git and should not be committed.

## Run the app

Start the Expo development server:

```bash
npx expo start
```

After Expo starts, use one of these options:

- Press `w` to open the web version.
- Press `a` to open the app in an Android emulator.
- Scan the QR code with Expo Go to open it on a physical device.

You can also start a platform directly:

```bash
npx expo start --web
npx expo start --android
```

## Connect Android to the backend

An Android emulator cannot reach the computer's backend through `localhost`.
Change `.env` to use Android's host-machine address:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

For a physical phone, replace `10.0.2.2` with the computer's local network IP
address. The phone and computer must be connected to the same network.

Restart Expo after changing `.env` so the new API URL is loaded:

```bash
npx expo start --clear
```

The Spring Boot backend must be running on port `8080` for API features, such
as title search, to return data.

## Run the tests

```bash
npm test -- --runInBand
```

## Troubleshooting

- If packages are missing, run `npm install` again.
- If Expo is showing an older version of the app, restart it with
  `npx expo start --clear`.
- If the app opens but an API request fails, confirm that the backend is
  running and that `EXPO_PUBLIC_API_URL` is correct for the selected device.
