# token-ninja app

Expo (React Native + TypeScript) client for token-ninja. One codebase targets iPhone now, and
the same iOS build runs on Apple Silicon Macs. Android and web can be added later from this code.

## Run it

Start the API first (see `../api/README.md`), then:

```bash
cd app
cp .env.example .env     # set EXPO_PUBLIC_API_URL if the API is not on localhost:8000
npm install
npm run ios              # iOS Simulator (needs Xcode on a Mac)
# or: npx expo start, then scan the QR code with Expo Go on your iPhone
```

On a physical iPhone, `localhost` points at the phone, so set `EXPO_PUBLIC_API_URL` to your
computer's LAN address, for example `http://192.168.1.20:8000`. Add that origin to the API's
`TOKEN_NINJA_CORS_ORIGINS` only if you also run the app in a browser.

## API types

`src/api/schema.ts` is generated from the API's OpenAPI spec, so the app's request and response
types always match the backend. After changing the API, with it running, regenerate with:

```bash
npm run gen:api
```

## Checks

```bash
npm run typecheck
```

## End-to-end tests

Both suites expect the API on `localhost:8000`. Start it with SQLite (no Postgres needed):

```bash
../scripts/start-api-for-e2e.sh
```

**Web / Mac (Playwright):** builds the web app, serves it on port 8081, and runs `e2e/web`.

```bash
npx playwright install webkit
npm run test:web -- --project=webkit    # or chromium, firefox
```

**iOS (Maestro):** needs a Mac with Xcode and [Maestro](https://maestro.mobile.dev) installed.

```bash
npm run ios          # build and install in the simulator
npm run test:ios     # runs e2e/ios
```

Both suites check the same behaviour, so a change to one should usually be mirrored in the other.
UI elements are found by `testID`, which becomes `data-testid` on web and an accessibility id on iOS.
