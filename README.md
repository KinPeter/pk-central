# PK-Central

Serverless functions based API

## Development

### Netlify CLI

- Run `npx netlify login` to log in by opening a browser, signing in to Netlify using GitHub and authorize the CLI.
- Run `npx netlify link --id <site-ID>` to link the project, find the site ID on Netlify under site configuration.
- Run `npx netlify dev` or `npm run dev` for a local development server

Find out more at the [Netlify Docs](https://docs.netlify.com/cli/get-started/) or [Netlify CLI Docs](https://cli.netlify.com/)

### Environment variables - PROD

Environment variables are handled by Netlify, it is possible to set one by one or import from .env file on the Netlify UI under Site configuration / Environment variables.

### Local DEV MongoDB

MongoDB for development is configured to run in Docker.

The `docker/dev-db/` folder holds the `docker-compose.yml` file with the required configuration and the initializer scripts.

To start the dev database run `npm run start:db` from the root, or `docker-compose up` from the `dev-db/` directory. The data is kept using a docker volume, so as long as you don't delete the volume, it will persist.

To access the dev DB on a UI use a MongoDB client like [MongoDB Compass](https://www.mongodb.com/products/tools/compass). To connect, use the URL:
```
mongodb://admin:admin@localhost:27017/
```

To remove the volume and clear the DB data, the best way is to run `npm run clear:db` from the root, `docker-compose down -v` from the `dev-db/` directory.