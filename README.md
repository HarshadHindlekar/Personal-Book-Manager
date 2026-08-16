# Personal Book Manager

A full-stack reading list built with Next.js, Express, MongoDB, and JWT authentication.

## Project structure

- `fe/` - Next.js App Router frontend
- `be/` - Express REST API

## Local setup

1. Install the root dependencies:

   ```powershell
   npm install
   ```

2. Install the backend dependencies:

   ```powershell
   cd be
   npm install
   cd ..
   ```

3. Install the frontend dependencies:

   ```powershell
   cd fe
   npm install
   cd ..
   ```

4. Copy `be/.env.example` to `be/.env` and fill in the MongoDB and JWT values.
5. Copy `fe/.env.example` to `fe/.env.local`.
6. Run `npm run dev` from the root.

The frontend runs on `http://localhost:3000` and the API runs on `http://localhost:5000`.

## Deployed application

- Frontend: [harshadhindlekar.github.io/Personal-Book-Manager](https://harshadhindlekar.github.io/Personal-Book-Manager/)
- Backend API: [personal-book-manager-dno9.onrender.com](https://personal-book-manager-dno9.onrender.com/)
- API health check: [/api/health](https://personal-book-manager-dno9.onrender.com/api/health)

Production environment variables:

- Frontend `NEXT_PUBLIC_API_URL` points to the deployed backend URL with `/api`:
  `https://personal-book-manager-dno9.onrender.com/api`
- Backend `CLIENT_URL` points to the deployed frontend origin:
  `https://harshadhindlekar.github.io`

Database and JWT secrets are configured through the hosting provider's environment
variables and should not be committed to the repository.

## Backend architecture

The Express API is organized by responsibility:

- `be/src/app.ts` - Express middleware and route registration
- `be/src/server.ts` - database startup, HTTP server, and graceful shutdown
- `be/src/routes/` - URL definitions only
- `be/src/controllers/` - request and response handling
- `be/src/services/` - business logic and database operations
- `be/src/schemas/` - reusable Zod request validation
- `be/src/middleware/` - authentication, validation, async errors, and error responses
- `be/src/models/` - Mongoose database models
- `be/src/constants/` - shared application constants

## Frontend architecture

The Next.js frontend uses the App Router and reusable feature components:

- `fe/app/` - routes, layouts, global styles, and page composition
- `fe/app/(auth)/` - shared authentication layout with login and signup routes
- `fe/components/home/` - landing page hero and book-stack components
- `fe/components/auth/` - login and signup form components
- `fe/components/dashboard/` - dashboard container, book form, book cards, statistics, and empty states
- `fe/components/forms/` - reusable form shell and field components
- `fe/constants/` - shared home and dashboard display constants
- `fe/lib/api.ts` - frontend API request helper
- `fe/lib/validation.ts` - reusable Zod schemas and form types
- `fe/types/` - shared frontend TypeScript types

Forms use React Hook Form with Zod validation, while Tailwind CSS utility classes
are used directly in JSX through `className`.

## Verify the API

Open `http://localhost:5000/api/health` to check that the backend and MongoDB connection are working. It should return:

```json
{"status":"ok"}
```

The API root (`http://localhost:5000/`) does not define a route, so `Cannot GET /` there is expected. Use the frontend at `http://localhost:3000`.
