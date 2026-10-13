# Smart Blood Bank Frontend

This repository contains only the static frontend for Smart Blood Bank.

## Deploy to Vercel

Import this repository into Vercel and use the repository root as the **Root Directory**.
`vercel.json` builds the HTML pages and assets into `dist`, which Vercel serves as the site.
The home page is available at `/`; login, registration, and dashboard pages use their existing
short routes.

This frontend does not include the Spring Boot API or MySQL database. Features that send requests
to `/api` require a separately deployed backend.
