# Architecture

## Overview

- `backend`: Spring Boot service that validates LinkedIn profile URLs, creates scrape jobs, executes browser automation, persists results, and exposes a public REST API.
- `frontend`: React app that submits profile URLs, polls job status, and renders normalized JSON and section-based views.
- `postgres`: durable job store for scalable deployments. The backend also supports H2 for local quickstart.

## Request Flow

1. Client submits `POST /api/v1/scrape-jobs`.
2. Backend normalizes the LinkedIn URL and checks for a fresh cached success.
3. If no cache hit exists, backend persists a new job and dispatches it to the async executor.
4. Worker opens a browser session through Playwright, authenticates to LinkedIn, loads the profile page, and extracts HTML.
5. The parser maps the rendered DOM into a stable response schema.
6. Client polls `GET /api/v1/scrape-jobs/{jobId}` and fetches the result from `GET /api/v1/scrape-jobs/{jobId}/profile`.

## Scalability Notes

- Job-oriented API avoids tying user requests to the full browser scrape duration.
- Cached successful results reduce repeated LinkedIn hits.
- Browser connectivity supports a remote Playwright/browserless WebSocket endpoint.
- Persistence is database-backed, so workers can be moved behind a queue in a larger deployment.
- Health and OpenAPI endpoints are included for orchestration and observability.
