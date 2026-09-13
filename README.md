# Coachmate

A simple marketplace where developers find experienced engineers for one-on-one coaching sessions. Signed-in users get a dashboard view with a sidebar; guests see the public landing page.

## Stack

- React 18 + Vite
- Tailwind CSS (custom design system, no UI framework)
- Firebase Auth + Realtime Database
- React Router, React Toastify

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env
   ```

3. Fill in your Firebase values in `.env`:

   - `VITE_FIREBASE_API_KEY` — Firebase Web API key
   - `VITE_FIREBASE_DB_URL` — Firebase Realtime Database URL

4. Run the dev server:

   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.