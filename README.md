## Nest API (and CRON tasks)

```bash
cd nestjs-backend
# Then read ./nestjs-backend/README.md
```

## Redis cache

Some API features and CRON tasks utilize Redis cache to optimize performance by reducing redundant data fetches.

```bash
docker compose up redis
```

## Database

Using the root docker-compose.yml:

```bash
mkdir ./data # if ./data does not exist
docker compose up mysql
```

## Mapserver

-> mapserver/README.md
