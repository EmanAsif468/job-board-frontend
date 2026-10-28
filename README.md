# Job Board (Frontend)

A job board where companies post jobs and candidates apply. This is the Next.js frontend. It talks to a separate Express + PostgreSQL API.

**Live demo:** https://job-board-frontend-weld.vercel.app

**Backend API:** https://job-board-blush.vercel.app

**Backend repo:** https://github.com/EmanAsif468/job-board

## Features

- Browse all jobs and open a job detail page
- Register and log in as a **company** or a **candidate**
- Companies can post jobs and see applications for their own jobs
- Candidates can apply to a job with a short message
- Protected actions use a JWT token sent to the API

## Tech stack

- Next.js (App Router), React, JavaScript
- Tailwind CSS
- Deployed on Vercel

## Run locally

1. Clone the repo and install packages: `npm install`
2. (Optional) Create a `.env.local` file with the API address. If you skip this, it defaults to `http://localhost:3000`:

3. Start the dev server on port 3001: `npm run dev -- -p 3001`
4. Make sure the backend is running (see the backend repo)

## Author

Built by EmanAsif468 while learning full-stack development.
https://job-board-frontend-weld.vercel.app