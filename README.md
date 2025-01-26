# PK-Central

A collection of API endpoints designed as cloud functions providing backend services for my other hobby projects, like PK Start or Tripz.

The API started out to run as Netlify functions, but later I started to develop a Node server to act as a host for the functions and deploy it on my private server.

### Features:
* Authentication supporting both password and email based login with JWT
* Endpoints for CRUD operations for several types of data stored in a MongoDB database
* Proxy endpoints collecting data from third party APIs
* Full data backup service
* Swagger-like simple documentation generated from Yaml file
* Common published npm package for types and utilities used across applications
* Functions can be easily published as cloud functions (e.g. on Netlify)
* Custom Node.js server to dynamically load and serve the functions as endpoints

### Technologies used:
* Node.js for API functions and custom server
* TypeScript
* MongoDB database
* Docker & Docker Compose
* NPM for common code package
* CI/CD with GitHub workflows and git hooks
* Jest for unit testing
* Node:test for API acceptance testing

# Development 

## Local DEV MongoDB

MongoDB for development is configured to run in Docker.

The `docker/dev-db/` folder holds the `docker-compose.yml` file with the required configuration and the initializer scripts.

To start the dev database run `npm run start:db` from the root, or `docker-compose up` from the `dev-db/` directory. The data is kept using a docker volume, so as long as you don't delete the volume, it will persist.

To use the local MongoDB for development, set this environment variable:
```shell
MONGO_DB_URI=mongodb://admin:admin@localhost:27017/
```

To access the dev DB on a UI use a MongoDB client like [MongoDB Compass](https://www.mongodb.com/products/tools/compass). To connect, use the URL:
```
mongodb://admin:admin@localhost:27017/
```

To remove the volume and clear the DB data, the best way is to run `npm run clear:db` from the root, `docker-compose down -v` from the `dev-db/` directory.


## Node functions server

The local server can run just using `node` and `tsx` or as a Docker container.
```shell
# Run for development
npm run serve

# Build and run the dockerized server
npm run serve:docker:build
npm run serve:docker
```


## Environment variables

Create a `.env` file in the project folder. See the `.env.example` for currently used variables.


## Third party API keys

For some endpoints third party API keys are expected to be stored in the database in a collection named `shared-keys`. There has to be only one document, an object containing these properties:

```json
{
  "airlabsApiKey": "api key",
  "locationIqApiKey": "api key",
  "unsplashApiKey": "api key",
  "openWeatherApiKey": "api key",
  "stravaClientId": "client id",
  "stravaClientSecret": "secret"
}
```


## Common types and utils

This repository contains type declarations and utils like validators that can be used by frontends or other clients.
Everything under the `common/` folder will be part of the public NPM package published under the name `@kinpeter/pk-common`.

To publish a new version after any change in the common files run
```shell
npm run common:publish
```

This command automatically increases the patch version of the package. If you want to increase minor or major version, do it manually and run 
```shell
cd common
npm publish --access public
```

Don't forget to log in to NPM before publishing using the `npm login` command!

[Link to the package on NPM](https://www.npmjs.com/package/@kinpeter/pk-common)


## Proxy mock server

The API `proxy` endpoints are calling out to different 3rd party API services. 
For development a tiny mock server is set up in the `docker/proxy-mock` folder. To run:
```shell
npm run mock:proxy
```
When running, it listens to requests on port `9876`. Don't forget to update the related environment variables to target this mock instead of the real APIs.

It is also used for the API Acceptance test suite.


## Maintaining the API Docs

On any change of the API (e.g. routes, parameters, types, validators) update the YAML file: `api-docs/api-docs.yaml` and run this command to generate a new HTML:
```shell
npm run docs:generate
```

### Postman collection
A Postman collection export can be downloaded [from the repository](./api-docs/postman-collection.json). This file should also be updated on any changes to the API.


## Testing

### Unit tests

Unit tests powered by Jest are in the `test` folder.
```shell
npm run test
```
Run this command to execute the unit test suite.

### API Acceptance tests

Acceptance tests are powered by `node:test` and are located in the `test-acc` folder. These tests are designed to actually call the real endpoints so executing them locally requires a server and a database also running in the same time.

To run the text suite locally, use:
```shell
npm run test-acc
```

**(!) Note that these tests will make changes in the database! Do not run them with PROD configuration of the server.** 

To test in an **encapsulated environment** there is a Docker compose project setup `acc-test.docker-compose.yml`, which can be operated using these commands below.

To fire up the test suite in docker:
```shell
npm run test-acc:docker
```
This will start a database, a mock server for 3rd party APIs, the node server for the functions and the test suite in separate containers. Make sure the dev db and dev server are not running so all the ports are available.

To clean up after a test run (if needed), run:
```shell
npm run test-acc:docker:clean
```


# Deployment

## Building and publishing to Docker Hub

To publish a new version of the Docker image on Docker Hub run this command:
```shell
npm run build-publish
```
This updates the patch version in `package.json`, uses that to build and tag the image of the server, and pushes it to Docker Hub.


## Running on the server

On the server use the "base" `docker-compose.yml` file with the commands
```shell
docker-compose up -d
docker-compose stop
docker-compose start
docker-compose down
```
Make sure there is a `.env` file with all the PROD variable contents in the project folder. 

When there is a new version published to Docker Hub make sure to remove the old image and container so Docker will pull the new one.

For the initial VPS server setup see [this Gist](https://gist.github.com/KinPeter/5728e4f07348be7353e1298d5f264118).


## Logs

Open the logs of an existing container:
```shell
docker logs <container_id>

# Follow the logs in real-time (like tail -f)
docker logs -f <container_id>

# Show timestamps
docker logs -t <container_id>

# Show last n lines
docker logs --tail=100 <container_id>

# Combine options (follow + timestamps + last 100 lines)
docker logs -f -t --tail=100 <container_id>
```

JSON format logs for an existing container:
```shell
/var/lib/docker/containers/<container_id>/<container_id>-json.log
```
