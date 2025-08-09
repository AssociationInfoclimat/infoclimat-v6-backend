# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is the InfoClimat v6 backend - a weather data platform consisting of:

- **NestJS Backend** (`nestjs-backend/`): Main API server and CRON tasks
- **MapServer** (`mapserver/`): Geographic/map tile server
- **Sphinx** (`sphinx/`): Search engine components
- **Demo Tiles** (`demo-tiles/`): Sample weather tile data

### Database Architecture

The system uses **multiple MySQL5 databases** accessed via separate Prisma clients:

- `V5` - Main database
- `V5_data_YYYY` - Per-year data databases (dynamic based on year)
- `V5_data_params` - Data parameters
- `V5_prevs` - Weather predictions  
- `V5_photolive` - Live photo data
- `V5_chroniques` - Chronicle data
- `dico` - Dictionary/reference data

Each database has its own Prisma schema in `prisma-*/` directories and corresponding client in `src/database/`.

### Key Components

- **Modules**: Feature modules in `src/modules/` (auth, stations-meteo, previ, etc.)
- **Redis Cache**: Used for performance optimization
- **User Authentication**: Custom middleware with salt-based auth
- **Legacy API Integration**: Connects to existing InfoClimat API

## Development Commands

### Initial Setup
```bash
cd nestjs-backend
nvm use
npm ci
cp .env.sample .env
# Edit .env with your database credentials
npm run prisma:generate
```

### API Development
```bash
npm run api:start:dev    # Start API in development mode
npm run api:build        # Build API for production
npm run api:start:prod   # Start API in production
```

### CRON Tasks
```bash
npm run cron:start:dev <name>  # Start specific CRON task in dev mode
npm run cron:build             # Build CRON tasks
npm run cron:start:prod        # Start CRON tasks in production
```

Available CRON tasks: `refresh-stations-vignettes`

### Database Management
```bash
npm run prisma:generate                    # Generate all Prisma clients
npm run prisma:generate:dico              # Generate specific client
npm run prisma:generate:v5                # Generate V5 client
npm run prisma:generate:v5_per_year       # Generate per-year client
# (and similar commands for other databases)
```

### Testing & Quality
```bash
npm run test              # Run unit tests
npm run test:unit         # Run unit tests (alias)
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run end-to-end tests
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

### Infrastructure
```bash
# Start required services
docker compose up        # Start all services (MySQL, Redis, TimescaleDB)
docker compose up redis  # Start only Redis
mkdir ./data             # Create data directory if needed
```

## API Access

- Base URL: `http://localhost:3000/api`
- Example endpoint: `http://localhost:3000/api/stations-meteo/temperature?year=2024&month=4&day=16&hour=20`

## Environment Configuration

Key environment variables in `.env`:
- Database URLs for all 7+ databases
- `REDIS_CACHE_HOST` for cache
- `IC_LEGACY_API_URL` for legacy API integration  
- `TUILES_CHEMINS` for tile data path
- `SALT_AUTH_KEY` for authentication
- `STATIONS_METEO_PATTERN_TILES_KEY` for weather station tiles

## Development Notes

- The API module selectively imports controllers - remember to add both module import AND controller registration
- User authentication middleware applies to all routes via `UserAuthMiddleware`
- CRON tasks use `@Timeout(2)` decorator for immediate startup during development
- Per-year databases use dynamic URL replacement (YYYY → actual year)

## Testing

Unit tests are organized by module with comprehensive database mocking:

- **Test Structure**: Each service/repository has corresponding `.spec.ts` files
- **Mock Factories**: `src/testing/mock-factories.ts` provides consistent test data
- **Database Mocks**: Prisma clients are mocked via `src/testing/prisma-mock-factory.ts`
- **CI/CD**: GitHub Actions runs tests on Node.js 18.x/20.x with coverage reporting
- **Coverage Thresholds**: 80% lines/functions, 70% branches

See `nestjs-backend/TESTING.md` for detailed testing patterns and examples.