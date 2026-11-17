# Frontend Onboarding Runbook

This runbook starts both repositories while keeping Docker limited to the
backend. Use separate terminals for the backend and frontend.

## 1. Check prerequisites

Install and start:

- Git
- Node.js 22 and npm
- Docker Desktop with Docker Compose
- Java 21 for backend tests

Check the tools:

```bash
git --version
node --version
npm --version
docker --version
docker compose version
java -version
```

## 2. Clone both repositories

```bash
mkdir Project3-workspace
cd Project3-workspace
git clone https://github.com/CST438-FA26-Team6/Project3.git
git clone https://github.com/CST438-FA26-Team6/Project3-backend.git
```

Confirm both default branches:

```bash
git -C Project3 branch --show-current
git -C Project3-backend branch --show-current
```

Both commands should report `main`.

## 3. Start the backend in Terminal 1

```bash
cd /path/to/Project3-workspace/Project3-backend
cp .env.example .env
docker compose up --build
```

Leave that terminal running. In another terminal, verify the API:

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{"status":"UP"}
```

Follow the backend README if you want to load the sample titles.

## 4. Start the frontend in Terminal 2

```bash
cd /path/to/Project3-workspace/Project3
npm ci
cp .env.example .env
npx expo start --web
```

The browser should display the Anime and Manga Tracker login screen at
approximately `http://localhost:8081`.

The default frontend API URL is `http://localhost:8080`, so the backend must
remain running while testing API features.

## 5. OAuth expectations

The app can start and the automated tests can pass with blank OAuth client
IDs. Real Google or GitHub login requires test client IDs supplied by the team
and matching provider configuration. Provider client secrets must never be
added to the frontend or committed to either repository.

After changing `.env`, restart Expo:

```bash
npx expo start --web --clear
```

## 6. Run the frontend checks

Stop the Expo server with `Ctrl+C`, or use another terminal in `Project3`:

```bash
npm test -- --runInBand
npx expo export --platform web
```

The test command should report 9 passing suites and 32 passing tests. The web
export should finish successfully and create the ignored `dist` directory.

## 7. Run the backend checks

Keep Docker Desktop running:

```bash
cd /path/to/Project3-workspace/Project3-backend
./gradlew clean check
```

The command should end with `BUILD SUCCESSFUL`.

## 8. Stop the project

Stop Expo and the foreground Compose process with `Ctrl+C`, then run:

```bash
cd /path/to/Project3-workspace/Project3-backend
docker compose down
```

## Troubleshooting

### The frontend cannot reach the API

Confirm the backend health request succeeds and the frontend `.env` contains:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
```

Restart Expo with `npx expo start --web --clear` after changing `.env`.

### Port 8080 or 8081 is already in use

Stop the other process using that port. Keep Expo on port `8081` because the
backend's default CORS configuration allows that origin.

### Packages are missing or inconsistent

Run `npm ci` again. Use the committed `package-lock.json`; do not replace it.

### Docker or backend tests fail

Confirm Docker Desktop is running and `docker ps` succeeds. For backend test
failures, also confirm `java -version` reports Java 21.

### Android cannot reach localhost

Use `EXPO_PUBLIC_API_URL=http://10.0.2.2:8080` for an Android emulator and
restart Expo.

## Visitor command log

Record each command, its result, and any unclear instruction during testing.

| Command | Result | Notes or error |
| --- | --- | --- |
| `git clone .../Project3.git` |  |  |
| `git clone .../Project3-backend.git` |  |  |
| `docker compose up --build` |  |  |
| `curl http://localhost:8080/health` |  |  |
| `npm ci` |  |  |
| `npx expo start --web` |  |  |
| `npm test -- --runInBand` |  |  |
| `./gradlew clean check` |  |  |
