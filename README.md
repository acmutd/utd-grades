# UTD Grades

![Deploy to GitHub Pages](https://github.com/acmutd/utd-grades/actions/workflows/deploy.yml/badge.svg)

UTD Grades is an application for viewing grade distributions at UT Dallas.

## Components

This monorepo consists of two sub-projects.

- The [`client`](./client/README.md) project contains the application itself, built with React and Next.js.
- The [`db`](./db/README.md) project contains everything related to the SQLite database that powers the app.

There is also a `raw_data` folder that contains all currently received grade data in CSV format.

Each component as a dedicated readme, and the [architecture](./ARCHITECTURE.md) document describes how everything fits
together.

## Development

> Due to some changes with the fetch API in Node v18 and [sql.js not handling those changes](https://github.com/sql-js/sql.js/issues/517), 
> **please use Node v17**.  
> Install and switch between multiple node versions with [nvm](https://nvm.sh).

We make use of [NPM workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) to simplify development in the
monorepo. To get started developing locally, simply clone this repository run the following commands...

1. `npm install` - install dependencies
2. `npm run dev` - create the SQLite database from the raw data and then launch the Next.js development server

## Deploying

The project builds to a completely static web bundle, making it deployable pretty much anywhere. Simply run
`npm run build`, and deploy the resulting `client/out` directory wherever you want.

### Testing deployment locally

You can easily test the deployment locally using a package like `http-server`. After running `npm run build`, run
`npx http-server out/client`.

### Deploy to GitHub Pages

We have a [workflow](./.github/workflows/deploy.yml) that automatically deploys the `main` branch to GitHub Pages.

## Uploading New Data

Just add the data in CSV format to the `raw_data` directory (be sure to remove any lines before the header) and
rebuild/redeploy.
