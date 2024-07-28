[![Netlify Status](https://api.netlify.com/api/v1/badges/4392a538-26c9-440f-8182-b09de5e6177a/deploy-status)](https://app.netlify.com/sites/pk-central/deploys)

# PK-Central

A collection of API endpoints powered by Netlify cloud functions providing backend services for my other hobby projects, like PK Start or Tripz.

### Features:
* Authentication supporting both password and email based login with JWT
* Endpoints for CRUD operations for several types of data stored in a MongoDB database
* Proxy endpoints collecting data from third party APIs
* Full data backup service
* Swagger-like simple documentation generated from Yaml file
* Common published npm package for types and utilities used across applications

### Technologies used:
* Node.js API with Netlify cloud functions
* MongoDB database
* TypeScript
* Docker & Docker Compose
* NPM for common code package
* CI/CD with Netlify CLI and git hooks
* Jest for testing

# Development 

## Netlify CLI

- Run `npx netlify login` to log in by opening a browser, signing in to Netlify using GitHub and authorize the CLI.
- Run `npx netlify link --id <site-ID>` to link the project, find the site ID on Netlify under site configuration.
- Run `npx netlify dev` or `npm run dev` for a local development server

Find out more at the [Netlify Docs](https://docs.netlify.com/cli/get-started/) or [Netlify CLI Docs](https://cli.netlify.com/)

## Environment variables - PROD

Environment variables are handled by Netlify, it is possible to set one by one or import from .env file on the Netlify UI under Site configuration / Environment variables.

See the `.env.example` for currently used variables.

## Environment variables for Local dev server

When running the Netlify CLI local dev server it automatically reads the local `.env` file and uses the variables stored in that file (thus ignoring the variables stored on Netlify online). 
To use the local MongoDB for development, set this variable:
```shell
MONGO_DB_URI=mongodb://admin:admin@localhost:27017/
```

## Third party API keys

For some endpoints third party API keys are expected to be stored in the database in a collection named `shared-keys`. There has to be only one document, an object containing these properties:

```json
{
  "airlabsApiKey": "api key",
  "locationIqApiKey": "api key"
}
```

## Local DEV MongoDB

MongoDB for development is configured to run in Docker.

The `docker/dev-db/` folder holds the `docker-compose.yml` file with the required configuration and the initializer scripts.

To start the dev database run `npm run start:db` from the root, or `docker-compose up` from the `dev-db/` directory. The data is kept using a docker volume, so as long as you don't delete the volume, it will persist.

To access the dev DB on a UI use a MongoDB client like [MongoDB Compass](https://www.mongodb.com/products/tools/compass). To connect, use the URL:
```
mongodb://admin:admin@localhost:27017/
```

To remove the volume and clear the DB data, the best way is to run `npm run clear:db` from the root, `docker-compose down -v` from the `dev-db/` directory.


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

## Maintaining the API Docs

On any change of the API (e.g. routes, parameters, types, validators) update the YAML file: `api-docs/api-docs.yaml` and run this command to generate a new HTML:
```shell
npm run docs:generate
```