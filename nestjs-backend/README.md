# Usage

For some modules, you will need MySQL5 db access.

Start a MySQL5 db (you can use the docker-compose in parent directory).

```bash
nvm use
npm ci

cp .env.sample .env
# edit .env (which your db which is running with docker in localhost)

npm run prisma:generate

npm run api:start:dev
```

Then, you can access the example endpoint at: http://localhost:3000/api

http://localhost:3000/api/stations-meteo/temperature?year=2024&month=4&day=16&hour=20

# CRON tasks

```bash
# see API, then:

# Set a cron timeout in ***.cron.ts `@Timeout(2)` so it can start without waiting the schedule.
# Choose a <name> among:
# - refresh-stations-vignettes
npm run cron:start:dev <name>
```
