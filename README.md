# LinkedIn Profile API

This repository implements the hiring challenge as a production-shaped full-stack system:

- Java backend with Spring Boot 3
- React frontend with Vite
- Playwright for authenticated LinkedIn page rendering
- PostgreSQL for durable jobs in containerized/scalable deployments
- H2 for lightweight local backend startup
- Async scrape jobs, caching, health checks, OpenAPI docs, and CI

## What It Does

The API accepts a LinkedIn profile URL and returns structured JSON for the profile when the data is available, including:

- name
- headline
- location
- about
- experience
- education
- skills
- certifications
- languages
- profile and background images when present

The backend exposes scrape jobs asynchronously instead of blocking a single HTTP request for the entire browser session.

## Repository Layout

```text
linkedin-profile-api/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
└── .env.example
```

## API

### Create a scrape job

```http
POST /api/v1/scrape-jobs
Content-Type: application/json

{
  "linkedinProfileUrl": "https://www.linkedin.com/in/example-profile",
  "waitForCompletion": false
}
```

### Get job status

```http
GET /api/v1/scrape-jobs/{jobId}
```

### Get extracted profile

```http
GET /api/v1/scrape-jobs/{jobId}/profile
```

### Service metadata and docs

- Metadata: `GET /api/v1/meta`
- Health: `GET /actuator/health`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## Environment Variables

Copy `.env.example` to `.env` and populate LinkedIn authentication details.

Required for authenticated scraping:

- `LINKEDIN_EMAIL`
- `LINKEDIN_PASSWORD`

Supported alternatives:

- `LINKEDIN_STORAGE_STATE_PATH` for a saved authenticated browser session
- `BROWSER_WS_ENDPOINT` for a remote Playwright/browserless endpoint

Useful operational settings:

- `SCRAPE_THREAD_POOL_SIZE`
- `SCRAPE_CACHE_TTL_HOURS`
- `SCRAPER_TIMEOUT_MS`
- `SCRAPER_POLL_DELAY_MS`
- `CORS_ALLOWED_ORIGINS`

## Local Setup

### Prerequisites

- Java 21+
- Node 18+
- npm 10+

### Backend

```bash
cd backend
./mvnw test
./mvnw exec:java -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install chromium"
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

The dev server talks to `http://localhost:8080/api/v1` by default. A production
build expects the API on the same origin under `/api/v1` unless
`VITE_API_BASE_URL` is set explicitly.

### Full stack with Docker

```bash
cp .env.example .env
docker compose up --build
```

The backend container uses a Playwright Java base image so Chromium is available in the container runtime.
The frontend container serves the React app with nginx and proxies `/api/*` to the backend,
so the full stack can be exposed from a single public origin.

## Hosting

This repository is now set up for single-origin hosting with Docker:

1. Create `.env` from `.env.example` and set at minimum:
   - `LINKEDIN_EMAIL` and `LINKEDIN_PASSWORD`, or `LINKEDIN_STORAGE_STATE_PATH`
   - `CORS_ALLOWED_ORIGINS=https://your-domain.example`
2. Build and run the hosting stack:

```bash
docker compose -f docker-compose.hosting.yml up -d --build
```

3. Only the frontend is published publicly; `postgres` and `backend` stay on the
   internal Docker network.

The frontend image serves the SPA and reverse-proxies `/api/` to the backend,
which avoids browser CORS issues in hosted environments. If you want the
frontend to call a different API origin, set `VITE_API_BASE_URL` at build time.

## Scalability Decisions

- Async job API avoids long-lived request threads during scraping.
- Successful scrapes are cached by normalized LinkedIn URL.
- Persistence is database-backed and can be moved behind a queue later without changing the API contract.
- Browser connectivity supports either local Chromium or a remote Playwright WebSocket endpoint.
- Health and OpenAPI endpoints are included for deployment readiness.
- CI validates backend tests and frontend production builds on every push and pull request.

## Known Limitations

- LinkedIn DOM structure changes frequently, so selectors will need maintenance.
- Login checkpoints, MFA, or anti-bot protections can interrupt scraping.
- Some profile sections are only visible after interaction, expansion, or premium visibility.
- The parser is heuristic-based and should be tuned against real profile HTML samples.

## Submission Notes

This repo is structured as a deployable application rather than a single script. It includes:

- backend API
- frontend UI
- persistence
- async job orchestration
- Playwright-based scraping
- containerization
- CI workflow
- docs and local run instructions
