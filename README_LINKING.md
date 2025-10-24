Linking E-tutors-fronted frontend with the server

Quick overview
- The frontend (this project) uses `src/utils/api.ts` which defaults to `http://localhost:4000/api` unless `VITE_API_BASE` is set in your environment.
- The server listens on PORT `4000` by default and exposes endpoints under `/api/*` (see `server/src/app.ts`).

Run the server (from the repo root)
1. Open a terminal and start the server:

   # from project root
   cd server
   npm install
   npm run dev

   The server will print: `Server running on http://localhost:4000` if successful.

Run the frontend (E-tutors-fronted)
1. In a new terminal:

   cd E-tutors-fronted
   npm install
   npm run dev

2. If you prefer to explicitly set the API base URL, create a `.env` file in `E-tutors-fronted` (or copy `.env.example`) and set `VITE_API_BASE=http://localhost:4000/api`.

Verify the connection
- With the server running, visit the server debug endpoint in a browser or use curl:

  http://localhost:4000/api/debug

- A successful response looks like: { ok: true, env: { ... } }
- From the frontend, try logging in or calling any page that uses the `api` helper; network requests should go to `http://localhost:4000/api/...`.

Notes / Troubleshooting
- CORS: the server has `cors()` enabled and socket.io allows all origins in development. No extra CORS config is needed for local dev.
- If the client is built and placed in `client/dist`, the server will serve it as static assets (see `server/src/app.ts`).
- If you set `VITE_API_BASE`, restart the frontend dev server to pick up env changes.

If you'd like, I can:
- Add a small sanity-check page in the frontend that calls `/api/debug` and displays the result.
- Add a `dev` script at the repo root to start both server and frontend with one command (using `concurrently`).
