# URL Shortener

A full-stack URL shortener built with an Express/TypeScript backend and a React/Vite/TypeScript frontend.

## Project structure

```
bionic/
├── server/   Express + TypeScript API (in-memory storage, port 4000)
└── client/   React + Vite + TypeScript frontend (port 5173)
```

The backend and frontend are separate projects, each with their own `package.json`, so they run and install independently.

## Prerequisites

- Node.js (v18+ recommended)
- npm

## Running the app

You need **two terminals** running at the same time — one for the backend, one for the frontend.

### 1. Start the backend

```bash
cd server
npm install
npm run dev
```

This starts the API on **http://localhost:4000**.

### 2. Start the frontend

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

This starts the frontend on **http://localhost:5173**. Open that URL in your browser to use the app.

## How it works

- Enter a long URL into the form and click **Shorten**.
- The frontend sends a `POST` request to the backend with the URL.
- The backend validates the URL, generates a random short code, stores the mapping **in memory** (no database — data resets when the server restarts), and returns a short URL.
- The short URL is displayed on the page without a page reload.
- Visiting the short URL (e.g. `http://localhost:4000/abc123`) issues a `301` redirect to the original long URL.

## API

**`POST /`**

Request body:
```json
{ "url": "http://www.makeitcheaper.com" }
```

Response:
```json
{ "short_url": "/abc123", "url": "http://www.makeitcheaper.com" }
```

Returns `400` if `url` is missing or not a valid URL.

**`GET /:code`**

Redirects (`301`) to the original URL if `code` exists, otherwise responds `404`.

## Notes

- Storage is in-memory only, as specified — restarting the backend clears all short URLs.
- Submitting the same URL twice returns the same short code rather than creating a duplicate.
- URL validation happens both client-side (immediate feedback) and server-side (source of truth).
