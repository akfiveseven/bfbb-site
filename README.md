# BfBB Community Resource Website

A community-driven resource website for **SpongeBob SquarePants: Battle for Bikini Bottom** speedrunners. Built with Next.js 15, React 19, and TypeScript. All game data is stored as static JSON files, making it easy for anyone to contribute strategies, guides, glossary terms, and more.

## Tech Stack

- **Next.js 15** (App Router) with **Turbopack** for development
- **React 19** with client-side rendering
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4** for styling
- **Axios** for client-side data fetching

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Installation

```bash
git clone <repo-url>
cd bfbb-prod
npm install
```

### Development

```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

### Other Commands

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run build` | Create a production build    |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint                   |

## Project Structure

```
src/
├── app/                    # Pages (Next.js App Router)
│   ├── layout.tsx          # Root layout (navbar, fonts, metadata)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles and Tailwind config
│   ├── guides/page.tsx     # Guides listing
│   ├── strats/page.tsx     # Strategy browser (by level/spatula)
│   ├── tricks/page.tsx     # Tricks listing
│   ├── glossary/page.tsx   # Glossary of terms
│   └── route-builder/page.tsx  # Interactive route planner
├── components/
│   ├── layout/             # Layout components (Navigation, containers)
│   └── ui/                 # Reusable UI components (Difficulty badge, etc.)
public/
├── data/                   # All game data (JSON files — see below)
├── assets/                 # Game asset images (spatulas, tikis, items, etc.)
├── img/                    # Level thumbnails, logos, background
└── font/                   # Custom Spongeboy font
```

## Data Files

All content displayed on the site is stored as **static JSON files** in the `public/data/` directory. This is the primary place contributors will interact with. No database is required — editing a JSON file is all it takes to update the site.

### `Strategies.json`

The largest and most important data file. Contains every speedrun strategy in the game.

```json
{
  "id": 3,
  "name": "Shady Glide",
  "spatula": "On Top of Shady Shoals",
  "level": "Bikini Bottom",
  "prerequisites": ["Bubble Bowl", "Cruise Bubble"],
  "hans": "N/A",
  "description": "Using a cruise boost and an ascending sponge-glide...",
  "links": []
}
```

| Field           | Description                                          |
| --------------- | ---------------------------------------------------- |
| `id`            | Unique numeric ID                                    |
| `name`          | Strategy name                                        |
| `spatula`       | The spatula this strategy relates to (or `"N/A"`)    |
| `level`         | Game level name                                      |
| `prerequisites` | Array of abilities/items needed                      |
| `hans`          | Whether Hans (the hand) is involved (`"N/A"` if not) |
| `description`   | Explanation of the strategy                          |
| `links`         | Array of related links                               |

### `Methods.json`

Different ways to execute a strategy. Each method references a strategy by name.

```json
{
  "name": "Original Disable",
  "strat": "Hand Disable",
  "difficulty": "1",
  "description": "Activate the Jellyfish Fields taxi pad by standing OOB...",
  "videoURL": "https://youtu.be/..."
}
```

| Field       | Description                                       |
| ----------- | ------------------------------------------------- |
| `name`      | Method name                                       |
| `strat`     | Name of the parent strategy (must match exactly)  |
| `difficulty`| Difficulty rating (string, `"1"` to `"5"`)        |
| `description`| Step-by-step explanation                         |
| `videoURL`  | Link to a video demonstration (or `"N/A"`)        |

### `Spatulas.json`

All golden spatula collectibles and their locations.

```json
{
  "id": 1,
  "pos": 1,
  "name": "SpongeBob's Closet",
  "level": "Bikini Bottom",
  "min_spatula_requirement": 0
}
```

| Field                    | Description                                  |
| ------------------------ | -------------------------------------------- |
| `id`                     | Unique numeric ID                            |
| `pos`                    | Position index within the level (1-8)        |
| `name`                   | Spatula name                                 |
| `level`                  | Game level name                              |
| `min_spatula_requirement`| Minimum spatulas needed to access this one   |

### `Socks.json`

Patrick's lost socks and their locations.

```json
{
  "id": 1,
  "name": "Sock Name",
  "area": "Area Name",
  "level": "Level Name",
  "min_spat_requirement": 0
}
```

### `Guides.json`

Links to external tutorial videos and guides.

```json
{
  "name": "SHiFT Any% Tutorial",
  "difficulty": "Beginner",
  "category": "Any%",
  "link": "https://youtu.be/...",
  "index": 0
}
```

### `Glossary.json`

Speedrunning terminology and trick definitions.

```json
{
  "name": "Cruise Boost (CB)",
  "difficulty": 5,
  "description": "Name for the trick that gives SpongeBob a constant forward movement vector...",
  "videoURL": "#",
  "index": 1
}
```

| Field       | Description                                    |
| ----------- | ---------------------------------------------- |
| `name`      | Term name                                      |
| `difficulty`| Difficulty rating (numeric, 1-5)               |
| `description`| Plain-text explanation                        |
| `videoURL`  | Link to a video (or `"#"` if none)             |
| `index`     | Display order                                  |

## Contributing

### Adding or Updating Data

The easiest way to contribute is by editing the JSON files in `public/data/`. For example:

- **Add a new strategy:** Append a new object to `Strategies.json` with a unique `id`.
- **Add a method for a strategy:** Append a new object to `Methods.json` with the `strat` field matching the strategy's `name`.
- **Add a glossary term:** Append a new object to `Glossary.json` with the next `index` value.
- **Add a guide:** Append a new object to `Guides.json` with the next `index` value.

Make sure your JSON is valid before submitting. You can verify with `npm run build` — the site will fail to render broken JSON.

### Adding or Updating Pages

Pages live in `src/app/` and follow the [Next.js App Router](https://nextjs.org/docs/app) file convention. Each folder becomes a route, and the `page.tsx` file inside it is the page component.

To create a new page:

1. Create a new folder under `src/app/` (e.g., `src/app/my-page/`).
2. Add a `page.tsx` file inside it.
3. Add the page to the navigation in `src/components/layout/Navigation.tsx`.

All current pages are client components (`"use client"`) that fetch data from `public/data/` using Axios:

```tsx
"use client";
import axios from "axios";
import { useState, useEffect } from "react";

export default function MyPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/data/MyData.json")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return <div>{/* render data */}</div>;
}
```

### Adding or Updating Components

Reusable components live in `src/components/`:

- **`layout/`** — Structural components (navigation, containers)
- **`ui/`** — Visual components (difficulty badges, tables, etc.)

### Adding Images

- **Game assets** (sprites, icons) go in `public/assets/`
- **Level thumbnails and logos** go in `public/img/`

Reference them in code with paths relative to `public/` (e.g., `/img/Bikini-Bottom.png`).

### Styling

The site uses **Tailwind CSS v4** with custom utility classes defined in `src/app/globals.css`. Key custom classes:

- `.font-bob` — SpongeBob-style Spongeboy font
- `.text-yellow` — The yellow accent color (`#fff67b`)
- `.my-container` — Standard page container with background
- `.my-table` — Styled table with borders and responsive behavior

Use Tailwind utility classes for styling. Add new custom classes to `globals.css` only when a pattern is reused across multiple components.

## Level Names Reference

These are the valid level names used across the data files:

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
