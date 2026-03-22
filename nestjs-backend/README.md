# Usage

For some modules, you will need MySQL5 db access.

Start a MySQL5 db (you can use the docker-compose in parent directory).

Make sure you are running redis too.

```bash
nvm use
npm ci
cp .env.sample .env
# edit .env (which your db which is running with docker in localhost)
npm run prisma:generate
# Start the db and the redis server (see the main README), then:
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

# Migrate from site-infoclimat

First phase (2025-07) :
up to commit (from site-infoclimat repo) -> a2695364847dacbdacd03b622b5359296e5793e5

files:
```
bs/details_new.php
include/communs/jsontiles.php
include/communs/tiles.php
include/connexion.php
include/template/template.inc.php
include/template/menu_desktop.inc.php
include/template/head_responsive.php
include/template/head.php
include/communs/infos_utilisateur.php
```

Second phase :
a2695364847dacbdacd03b622b5359296e5793e5 -> b7eb3c0c9f9a66c1f4931aef82856f96edf16f70
