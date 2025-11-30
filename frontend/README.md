# Frontend — Summary

## Purpose

Provide the client-side application for the E‑Tutors platform: UI, user interactions, and integration with backend services (authentication, course data, payments, messaging).

## Tech stack

- Framework: React (or mention if Vue/Angular in project)
- Language: TypeScript (preferred) or JavaScript
- Bundler/Tooling: Vite / Create React App / Webpack
- State: Redux / Zustand / React Context
- Styling: CSS Modules / SASS / Tailwind / Styled Components
- Testing: Jest + React Testing Library
- Linting/Formatting: ESLint + Prettier

## Key features

- Authentication (signup, login, JWT/session)
- Course browsing and filtering
- Lesson viewer (videos, attachments)
- Booking/scheduling tutors
- Real-time messaging/notifications (WebSocket or polling)
- Payments integration (Stripe/other)
- Admin dashboards and reporting

## Project structure (example)

- src/
   -components/ — reusable UI components
   -pages/ — route-connected views
   -hooks/ — custom React hooks
   -services/api.ts — API clients and adapters
   -store/ — state management
   -styles/ — global styles and theme
   -assets/ — images/fonts
   -utils/ — helpers and constants
- public/ — static files
- tests/ — end-to-end or integration tests

## Getting started

Prerequisites: Node.js >= 16, npm or yarn

1. Install: `npm install` or `yarn`
2. Dev server: `npm run dev` or `yarn dev`
3. Build: `npm run build`
4. Preview: `npm run preview` or serve the `dist`/`build` folder

## Environment

Typical env vars (place in .env.local, not committed):
-REACT_APP_API_URL (or VITE_API_URL)
-REACT_APP_WS_URL
-REACT_APP_STRIPE_KEY
-NODE_ENV

## Scripts (common)

- start/dev: runs dev server
- build: creates production bundle
- test: runs unit tests
- lint: lints source
- format: runs prettier
- e2e: runs end-to-end tests

## API & auth

- API client centralized (axios/fetch wrapper)
- Attach auth token to requests
- Handle 401 refresh flow gracefully

## State & routing

- Keep server state via React Query or Redux Toolkit Query where applicable
- Use React Router (or framework router) with guarded routes for auth

## Testing & quality

- Unit test components and hooks
- Integration tests for critical flows (login, checkout)
- CI runs lint, typecheck, tests, and build

## Deployment

- Build static assets and deploy to CDN or hosting (Netlify, Vercel, S3+CloudFront)
- Configure environment variables in hosting platform
- Use CI/CD pipeline for automated deploys

## Troubleshooting

- Check network requests for CORS or incorrect base URL
- Verify env vars and build-time configuration
- Clear localStorage/session and rebuild after schema changes

## Contacts

- Link to backend README or API docs
- Maintain contact or ownership for frontend changes
