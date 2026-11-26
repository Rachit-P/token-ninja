# token-ninja 🥷

**Convert currency into compute tokens, and plan how you buy and spend them.**

## The idea

We expect tokens to become an everyday digital currency. Instead of paying for compute in dollars or rupees, people and teams will hold tokens and spend them to rent compute for different tasks, such as running AI models, training jobs, rendering or data processing.

token-ninja is an app for that future. It lets you turn regular currency into tokens and manage your token balance the way you would manage an investment portfolio.

## Planned features

- **Currency to token conversion:** Convert fiat currency into tokens at live rates, with clear fees and conversion history.
- **Token SIP (Systematic Investment Plan):** Schedule recurring purchases (daily, weekly or monthly) so you build a token balance steadily instead of buying all at once.
- **Token SWP (Systematic Withdrawal Plan):** Schedule recurring withdrawals or conversions out of tokens, for example to fund regular compute usage or convert back to currency.
- **Compute rental:** Spend tokens to rent compute for specific tasks.
- **Dashboard:** See your balance, upcoming SIP and SWP runs, and spending over time.

## How redemption works

Tokens are priced like credit card reward points: each vendor sets how many tokens one unit of its compute costs, so the same tokens stretch further at some vendors than others. For example, 500 tokens might buy 2 GPU-hours at one vendor or 125 render-minutes at another. Rates are stored as data, so adding a vendor or changing a ratio needs no code change.

## Repository layout

| Folder | What it is | Stack |
| --- | --- | --- |
| [`api/`](api/) | Backend: rates, conversion math, HTTP API | Python, FastAPI, Postgres |
| [`app/`](app/) | Client for iPhone and Mac | Expo (React Native + TypeScript) |

The two are separate apps that deploy independently and talk only over HTTP. The app's API types are generated from the backend's OpenAPI spec. See each folder's README to run it.

## Status

Early stage. The first version converts currency to tokens and quotes token redemption at different vendors. SIP and SWP scheduling come next.

## Contributing

Ideas and feedback are welcome. Open an issue to start a discussion.
