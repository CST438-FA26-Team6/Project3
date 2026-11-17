# Anime and Manga Tracker Frontend

Expo and React Native frontend for the Anime and Manga Tracker. The project
runs in a web browser or on Android.

Backend repository:
[CST438-FA26-Team6/Project3-backend](https://github.com/CST438-FA26-Team6/Project3-backend)

For detailed verification and troubleshooting steps, see
[`docs/runbook.md`](docs/runbook.md).

## Requirements

- Git
- Node.js 22 and npm
- Docker Desktop with Docker Compose for the backend
- Java 21 for the backend test suite
- Optional for Android: Android Studio and an Android emulator

### Select Node.js 22 with nvm

The frontend requires Node.js 22. If `node --version` reports another version,
install [nvm](https://github.com/nvm-sh/nvm), then run:

```bash
nvm install 22
nvm use 22
node --version
npm --version
```

The Node output should begin with `v22`. Run `nvm use 22` in each new terminal
before installing dependencies or starting Expo.

## Clone both repositories

The frontend and backend must be cloned into the same parent folder:

```text
Project3-workspace/
├── Project3/
└── Project3-backend/
```

Create that layout with:

```bash
mkdir Project3-workspace
cd Project3-workspace
git clone https://github.com/CST438-FA26-Team6/Project3.git
git clone https://github.com/CST438-FA26-Team6/Project3-backend.git
```

## Setup order

The clone order does not matter, but the applications must be started in this
order:

1. Start the backend API and PostgreSQL with Docker Compose.
2. Confirm `http://localhost:8080/health` returns `{"status":"UP"}`.
3. Start the frontend with Expo.

The backend must be ready first because the frontend sends its API requests to
`http://localhost:8080`.

## Terminal 1: Start the backend
Make sure docker is running.
```bash
cd /path/to/Project3-workspace/Project3-backend
cp .env.example .env
docker compose up --build
```

When startup completes, verify the API from another terminal:

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{"status":"UP"}
```

The backend README explains how to load the included sample anime and manga.

## Terminal 2: Start the frontend

```bash
cd /path/to/Project3-workspace/Project3
nvm use 22
npm ci
cp .env.example .env
npx expo start --web
```

Expo opens the web app at approximately `http://localhost:8081`. The frontend
uses `EXPO_PUBLIC_API_URL=http://localhost:8080` to reach the local backend.

The frontend runs directly with Expo; it does not need its own Dockerfile.
Docker Compose runs the backend API and PostgreSQL.

## OAuth configuration

The example environment file leaves the Google and GitHub client IDs blank.
Visitors can start the stack, open the login screen, and run all automated
tests without provider credentials. Real OAuth login requires test client IDs
from the team and matching provider configuration.

OAuth client secrets belong only in the backend's local environment and must
never be committed. Never commit either repository's populated `.env` file.

Restart Expo after changing environment values:

```bash
npx expo start --web --clear
```

## Run the frontend tests

```bash
npm test -- --runInBand
```

A successful run currently reports 9 passing suites and 32 passing tests.

Verify the production web build:

```bash
npx expo export --platform web
```

## Android emulator

An Android emulator reaches the computer's backend through `10.0.2.2`, not
`localhost`. Change the local frontend `.env` to:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

Then start a previously installed development build:

```bash
npx expo start --android
```

The web version is the simplest option for visitor onboarding.

## Stop the project

Stop Expo with `Ctrl+C`. In the backend terminal, stop the containers with
`Ctrl+C`, then run:

```bash
cd /path/to/Project3-workspace/Project3-backend
docker compose down
```
