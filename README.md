# Personal Book Manager

A full-stack reading list built with Next.js, Express, MongoDB, and JWT authentication.

## Project structure

- `fe/` - Next.js App Router frontend
- `be/` - Express REST API

## Local setup

1. Install dependencies with `pnpm install` in the root, `fe`, and `be` directories.
2. Copy `be/.env.example` to `be/.env` and fill in the MongoDB and JWT values.
3. Copy `fe/.env.example` to `fe/.env.local`.
4. Run `pnpm dev` from the root.

The frontend runs on `http://localhost:3000` and the API runs on `http://localhost:5000`.
