# Architecture

This document explains the high-level structure of the project as well as the reasoning behind some architectural
decisions.

## No backend

First, it is important to point out that this app _has no backend_. The entire thing builds to a completely static web
bundle. This is made possible by utilizing [SQLite](https://www.sqlite.org) and [sql.js](https://sql.js.org). The
[raw data](./raw_data) is [bundled](./db/src/import/index.ts) into a single SQLite database file
([schema](./db/db_schema.sql)) which is pushed to the browser. This means that all data queries are done completely in
the browser!

This approach has a number of advantages:

  1. Hosting is free! We can use GitHub Pages to host the app completely for free.
  2. Simplifies hosting and deployment. Deploying a static website is very easy.
  3. Fewer moving parts. There's no need to worry about data conversion between the frontend and backend, for example.
  4. Speed. sql.js is _very_ fast, making searches nearly instant.

...and disadvantages:

  1. _Much_ larger bundle size. We gain about 2.5mb by bundling sql.js and a grades database with about 5 years of data.
     This puts the total bundle size at aorund 5mb (before compression). This is _not_ insignificant and we have to be
     concious about adding more data.
  2. Inherently limits the scope of the project since we have to be careful abot how much data we add.

## Monorepo

The project is organized as a monorepo containing the `client` and `db` subprojects. This separation is not strictly
necessary, but keeping all database-related code in one place helps when making database-related changes.

We make use of [NPM workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) to simplify development in the
monorepo. Take a look at the scripts in the root [`package.json`](./package.json) to get an idea of how that works.

- `db` is packaged as `@utd-grades/db`
- `client` is packaged as `@utd-grades/client` and depends on `@utd-grades/db`

TODO: explain more here, walk through the flow of a search, for example