
# Documentation

## Server config

Environment variables can be specified in the server.env file in the src directory.
These are parsed when the server is started and used to configure or customize the server. Below the default values are provided for each variable.

### Environment config

The environment of the node deployment (production or development) can be set with:

```text
NODE_ENV = 'development' # Can also be 'production'
```

See the [express documentation](http://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production)

### Express config

The express package can be customized with the following variables:

```text
PORT = '3000'
```

The secret for express-session can also provided, which is used to sign the
session cookies. See the [express-session documentation](https://github.com/expressjs/session#readme)

```text
SESSION_SECRET = 'secret'
```

### Database config

The node-postgres package connects to the database through these variables:

```text
PGHOST = 'localhost'
PGUSER = process.env.USER
PGPASSWORD = null
PGDATABASE = process.env.USER
PGPORT = 5432
```

See the [postgresql documentation](https://www.postgresql.org/docs/9.1/libpq-envars.html)

### MQTT config

Connection to the MQTT server is established though these variables:

```text
MQTTURL = 'mqtt://test.mosquitto.org'
MQTTPORT = 1883
```

## Docker

### Dockerfile

The Dockerfile creates an image of the server which exposes a port, given through
build-arg.
The server can be modified with the server.env file. See the documentation above at [server config](#server-config).

```text
docker build --build-arg SERVER_PORT=8080 -t imagename:tag .
```

### docker-compose

The docker-compose creates containers for the server and postgresql and links them up.

```text
docker-compose up
```

Environment variables for the images can be set with server.env for the node server
and postgres.env for the database.  
For server.env see the documentation above at [server config](#server-config).  
For postgres.env see the documentation at [postgres config](https://github.com/docker-library/docs/blob/master/postgres/README.md#environment-variables).