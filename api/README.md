# Usage

For some modules, you will need MySQL5 db access.

Start a MySQL5 db (you can use the docker-compose in parent directory).

```bash
nvm use
npm ci

cp .env.sample .env
# edit .env (which your db which is running with docker in localhost)

# in case your modules needs MySQL and Prisma:
npx prisma generate

npm run start:dev
```

Then, you can access the example endpoint at: http://localhost:3000/api

http://localhost:3000/api/stations-meteo/temperature?year=2024&month=4&day=16&hour=20
