# Costs: what's free now and what could become paid

Everything token-ninja uses today costs nothing. This page lists each tool or service, why it's
free for us, and what would make it start costing money, so there are no surprises later.
Prices and allowances change, so check the linked pages before relying on a number.

## Free now

| Tool or service | Used for | Why it's free | What could make it paid |
| --- | --- | --- | --- |
| [GitHub Actions](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions) | CI, iOS and macOS E2E tests | Standard runners, including macOS, are free for **public** repositories | Making the repo **private**: minutes then count against the account's monthly allowance, and macOS minutes count at a much higher multiplier than Linux (historically 10x). The iOS job runs about 20 to 30 macOS minutes per push. Larger runners are always paid. |
| [Playwright](https://playwright.dev) | Web and WebKit (Mac) E2E tests | Open source (Apache 2.0) | Nothing. Only optional third-party cloud browser grids are paid. |
| [Maestro CLI](https://maestro.mobile.dev) | iOS E2E tests (Android later) | Open source, runs on our own CI runners | **Maestro Cloud** (hosted devices and parallel runs) is paid. **We don't use it.** |
| [Expo SDK and Expo Go](https://expo.dev) | App framework, running the app on a phone during development | Open source / free app | Nothing for local development. |
| [FastAPI](https://fastapi.tiangolo.com), [uv](https://docs.astral.sh/uv/), SQLAlchemy, ruff | Backend and tooling | Open source | Nothing. |
| [PostgreSQL](https://www.postgresql.org) via Docker | Local database | Open source, runs on your machine | Nothing locally. Hosting is a separate cost (see below). |

## Will cost money when we ship

| Tool or service | When we'd need it | Free option | Paid when |
| --- | --- | --- | --- |
| [Apple Developer Program](https://developer.apple.com/programs/) | TestFlight, App Store, installing release builds on real devices | Simulator and Expo Go need no membership | Required (yearly fee, about $99/year) to distribute the iOS or Mac app. |
| [EAS Build / Submit / Update](https://expo.dev/pricing) | Cloud builds and store submissions | Free tier with a limited number of builds per month, lower priority queue. Local builds with Xcode are free. | Needing more builds, faster queues or more update users. |
| Postgres hosting (for example Neon, Supabase, RDS) | Running the API for real users | Most providers have a free tier with small storage and compute limits | Data or traffic outgrows the free tier, or we need backups and uptime guarantees. |
| API hosting (for example Fly.io, Render, Railway) | Running the backend publicly | Some offer small free or trial allowances | Always-on instances, more memory, or more regions. |
| Google Play Console | Android release (later) | Emulator testing is free | One-time registration fee to publish. |
| Domain name | Website (later) | GitHub Pages subdomain is free | Buying a custom domain (yearly). |

## Rules of thumb

- Keep the repo public while the project is open source, so macOS CI stays free.
- Don't add Maestro Cloud or a paid browser grid unless runner time becomes a real bottleneck.
- Before going private, consider running the iOS E2E job only on pull requests or nightly
  to save macOS minutes.
