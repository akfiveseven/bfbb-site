# BfBB Community Resource Website

A community-driven resource website for **SpongeBob SquarePants: Battle for Bikini Bottom** speedrunners. Built with Next.js 15, React 19, and TypeScript, backed by a PostgreSQL database with Prisma ORM. Users can browse strategies, guides, glossary terms, and build routes. Authenticated users can submit new content for admin review.

## Tech Stack

- **Next.js 15** (App Router) with **Turbopack** for development
- **React 19**
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4**
- **Prisma 7** with **PostgreSQL** (Neon-compatible via `@prisma/adapter-pg`)
- **NextAuth v5** with Discord OAuth
- **Axios** for client-side data fetching

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm
- A PostgreSQL database (e.g. [Neon](https://neon.tech/))
- A [Discord application](https://discord.com/developers/applications) for OAuth

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host/dbname
AUTH_SECRET=<random-secret>          # generate with: npx auth secret
AUTH_DISCORD_ID=<discord-client-id>
AUTH_DISCORD_SECRET=<discord-client-secret>
ADMIN_DISCORD_IDS=<comma-separated-discord-user-ids>
```

### Installation

```bash
git clone <repo-url>
cd bfbb-site
npm install
```

### Database Setup

```bash
npx prisma migrate deploy   # apply migrations
npx prisma db seed           # seed data from public/data/ JSON files
```

### Development

```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

### Other Commands

| Command              | Description                 |
| -------------------- | --------------------------- |
| `npm run build`      | Create a production build   |
| `npm run start`      | Start the production server |
| `npm run lint`       | Run ESLint                  |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (navbar, auth provider, fonts)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles and Tailwind config
│   ├── strats/                 # Strategy browser (by level/spatula)
│   ├── guides/                 # Guides listing
│   ├── glossary/               # Glossary of terms
│   ├── tricks/                 # Tricks listing
│   ├── levels/                 # Level pages
│   ├── route-builder/          # Interactive route planner
│   ├── resources/              # Community resources
│   ├── modding/                # Modding resources
│   ├── contribute/             # User contribution forms (requires login)
│   ├── admin/                  # Admin panel
│   │   ├── content/            # Manage strategies, methods, glossary, etc.
│   │   ├── submissions/        # Review user submissions
│   │   ├── users/              # Manage users and roles
│   │   └── feedback/           # View user feedback
│   └── api/                    # API routes
│       ├── auth/               # NextAuth endpoints
│       ├── data/               # Public data endpoints
│       ├── routes/             # Saved route CRUD
│       ├── submissions/        # User submission endpoint
│       └── admin/              # Admin API endpoints
├── components/
│   ├── layout/                 # Navigation, containers
│   ├── ui/                     # Reusable UI (DataTable, Difficulty badge, etc.)
│   └── providers/              # SessionProvider (NextAuth)
├── types/                      # TypeScript type definitions
prisma/
├── schema.prisma               # Database schema
├── seed.ts                     # Seeds DB from public/data/ JSON files
├── migrations/                 # Migration history
public/
├── data/                       # Seed data (JSON files)
├── assets/                     # Game asset images (spatulas, tikis, items)
├── img/                        # Level thumbnails, logos, background
└── font/                       # Custom Spongeboy font
```

## Data Model

All game content is stored in PostgreSQL and managed through the admin panel. The `public/data/` JSON files serve as seed data for initial database setup.

### Core Models

**Strategy** — A speedrun strategy tied to a level and spatula(s).

**Method** — A specific way to execute a strategy, with difficulty rating, video links, prerequisites, and an optional obsolete flag.

**Spatula** — A golden spatula collectible with its level and minimum spatula requirement.

**Sock** — Patrick's lost socks and their locations.

**SockStrategy** — Strategies for collecting socks.

**GlossaryEntry** — Speedrunning terms with descriptions and optional video links.

**Guide** — Links to external tutorial videos, categorized by difficulty.

**SavedRoute** — User-created routes saved to their account, optionally published for others.

### Auth & Moderation Models

**User** — Authenticated via Discord OAuth. Has a role (`user` or `admin`).

**Submission** — User-submitted content (strategies, methods, etc.) pending admin review.

## Contributing

### Submitting Content

Logged-in users can submit new strategies, methods, guides, glossary entries, and more through the [Contribute](/contribute) page. Submissions are reviewed and approved by admins.

### Contributing Code

1. Fork the repo and create a feature branch.
2. Set up your local environment (see [Getting Started](#getting-started)).
3. Make your changes and test with `npm run build`.
4. Open a pull request.

## Level Names Reference

These are the valid level names used across the data:

| Level Name                    |
| ----------------------------- |
| Bikini Bottom                 |
| Jellyfish Fields              |
| Downtown Bikini Bottom        |
| Goo Lagoon                    |
| Poseidome                     |
| Rock Bottom                   |
| Mermalair                     |
| Sand Mountain                 |
| Industrial Park               |
| Kelp Forest                   |
| Flying Dutchman's Graveyard   |
| SpongeBob's Dream             |
| Chum Bucket Lab               |

## License

This is an open-source community project. Contributions are welcome.
