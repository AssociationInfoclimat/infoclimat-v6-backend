## For local tests:

### Build and run sphinx

Setup the DB configuration in `docker-compose.yml`.

The Dockerfile creates a debian:jessie image based on: https://sphinxsearch.com/downloads/sphinx-2.2.11-release.tar.gz/thankyou.html

```bash
docker compose up sphinx
```

Default behaviour :

By default, the entrypoint is `scripts/entrypoint.sh` which is :

```sh
indexer -c /etc/sphinxsearch/sphinxy.conf test
```

where `test` is setup in the sphinx-conf with : `source = docs`.

So, by default, once started it indexes the table `docs` from you mysql database.

### Run a php search

Once Sphinx is started, from another terminal:

With php7 on your host machine (that is hosting the docker container):

```bash
php ./test.php
```

### You need some test database ?

Add this service in you docker-compose:

```yaml
services:
  mysql:
    #image: mysql:latest
    # Silicon:
    image: biarms/mysql:5.7
    container_name: mysql
    restart: always
    environment:
      MYSQL_DATABASE: "sphinx"
      MYSQL_USER: "user"
      MYSQL_PASSWORD: "password"
      # root
      MYSQL_ROOT_PASSWORD: "password"
    ports:
      - "3306:3306"
    expose:
      - "3306"
    volumes:
      - "./.mysql-data/db:/var/lib/mysql"
```

Then:

```bash
docker compose up mysql
```

Credentials:

- user: user
- password: password
- dbname: sphinx
- port: 3306
- host: localhost

In your SQL client, connect to database and create a table `docs` and docs.

```sql
CREATE TABLE docs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT
);

INSERT INTO `docs` (`id`, `title`, `content`)
VALUES
	(1, 'jhgjhgjhg', 'kjhjkhhkj'),
	(2, 'zozo', 'dsfsdf');
```
