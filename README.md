# API Shield Demo

A demo project for Cloudflare API Shield demonstrating **Schema Validation** and **JWT Validation** using Hono.js on Cloudflare Workers.

## Overview

This project implements a JWT authentication API with RS256 signing to test Cloudflare's API Shield capabilities:

- **Schema Validation**: OpenAPI 3.0 schema (`schema.json`) defines request/response validation rules
- **JWT Validation**: RS256-based JWT token generation and verification using JWK (JSON Web Keys)
- **Framework**: Hono.js for fast, lightweight routing on Cloudflare Workers
- **Deployment**: Custom domain routing

## Endpoints

### `GET /`
Health check endpoint that returns `"Hello Hono!"`

### `POST /token`
Generates a JWT token signed with RS256 algorithm using a private JWK.

**Response:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### `POST /secure`
Validates JWT token from `Authorization` header and processes client credentials.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "clientId": "client_123",
  "clientSecret": "secret_abc123"
}
```

**Response:**
```json
{
  "clientId": "client_123",
  "clientSecret": "secret_abc123",
  "uid": "123456"
}
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Wrangler

Create a `wrangler.jsonc` file from the example:

```bash
cp wrangler.jsonc.example wrangler.jsonc
```

Update the configuration with your custom domain or routes as needed.

### 3. Configure Environment Variables

Create a `.dev.vars` file with your JWK keys:

```bash
cp .dev.vars.example .dev.vars
```

Add your JWK keys (see `public-key-example.json` and `private-key-example.json` for format):

```
JWK_PRIVATE_KEY='{"kty":"RSA","e":"AQAB",...}'
JWK_PUBLIC_KEY='{"kty":"RSA","e":"AQAB",...}'
```

### 4. Generate Types (Optional)

Generate TypeScript types based on Worker configuration:

```bash
npm run cf-typegen
```

## Development

Start the local development server:

```bash
npm run dev
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

### Production Secrets

Set secrets for production using Wrangler:

```bash
wrangler secret put JWK_PRIVATE_KEY
wrangler secret put JWK_PUBLIC_KEY
```

## API Shield Configuration

1. **Schema Validation**: Upload `schema.json` to Cloudflare API Shield to enforce OpenAPI schema validation
2. **JWT Validation**: Configure API Shield to validate JWT tokens with your public key from `JWK_PUBLIC_KEY`

## Project Structure

```
├── src/
│   └── index.ts               # Main Hono application with JWT endpoints
├── schema.json                # OpenAPI 3.0 schema for API Shield
├── wrangler.jsonc.example     # Example Cloudflare Workers configuration
├── .dev.vars.example          # Example environment variables
├── public-key-example.json    # Example JWK public key format
└── private-key-example.json   # Example JWK private key format
```

## Tech Stack

- **Hono.js** v4.9.12 - Fast web framework for Cloudflare Workers
- **Cloudflare Workers** - Serverless edge compute platform
- **Wrangler** v4.43.0 - Cloudflare Workers CLI
- **JWT with RS256** - Asymmetric token signing using JWK
