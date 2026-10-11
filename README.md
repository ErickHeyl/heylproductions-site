# Heyl Productions

Website for Heyl Productions, San Diego wedding, promo and event videography.
Built with Astro 5 + Tailwind, deployed on Vercel.

Live: [https://heylproductions.vercel.app/](https://heylproductions.vercel.app/)

## Getting started

Requires Node 22 (see `.nvmrc`).

```bash
npm install
cp .env.example .env   # then fill in the values (see below)
npm run dev
```

## Blog

Posts live in Postgres and are managed from a password-protected admin area,
so new posts go live without touching code or redeploying.

- Public pages: `/blog` (all posts, filterable by category) and `/blog/<slug>`
- Admin: `/admin` (log in with `BLOG_ADMIN_PASSWORD`) to write, edit and delete posts
- Categories: Weddings, Business, Events, General. Weddings/Business/Events
  posts also appear on that section of `/service`, and the three newest posts
  appear on the homepage.

### Setup

Set these in `.env` locally and in Vercel (Project Settings → Environment Variables):

| Variable | What it's for |
| --- | --- |
| `POSTGRES_URL` | Neon Postgres connection string (Vercel → Storage → Neon) |
| `BLOG_ADMIN_PASSWORD` | Password for `/admin` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for post photos (Vercel → Storage → Blob) |

After `POSTGRES_URL` is set, create the table and load the sample posts once:

```bash
npm run db:seed
```

Without `POSTGRES_URL` the site falls back to the built-in sample posts and any
admin changes are kept in memory only (lost on restart). Without
`BLOB_READ_WRITE_TOKEN`, photos are saved to `public/uploads/` (local dev only).

## Design

"Editorial Arch": Instrument Serif headings, Hanken Grotesk body, paper/sand
backgrounds with a deep pine accent. Colors and fonts are defined in
`tailwind.config.cjs`; shared button/label/field styles are in
`src/styles/global.css`.
