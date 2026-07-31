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

## Verify the API

Open `http://localhost:5000/api/health` to check that the backend and MongoDB connection are working. It should return:

```json
{"status":"ok"}
```

The API root (`http://localhost:5000/`) does not define a route, so `Cannot GET /` there is expected. Use the frontend at `http://localhost:3000`.
