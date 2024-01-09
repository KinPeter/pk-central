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

