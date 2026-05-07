import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const dataDir = path.join(__dirname, "../public/data");

  // Seed Spatulas
  const spatulas = JSON.parse(fs.readFileSync(path.join(dataDir, "Spatulas.json"), "utf-8"));
  for (const s of spatulas) {
    await prisma.spatula.create({
      data: {
        id: s.id,
        pos: s.pos,
        name: s.name,
        level: s.level,
        minSpatulaRequirement: s.min_spatula_requirement,
      },
    });
  }
  console.log(`Seeded ${spatulas.length} spatulas`);

  // Seed Socks
  const socks = JSON.parse(fs.readFileSync(path.join(dataDir, "Socks.json"), "utf-8"));
  for (const s of socks) {
    await prisma.sock.create({
      data: {
        id: s.id,
        name: s.name,
        area: s.area || null,
        level: s.level,
        minSpatRequirement: s.min_spat_requirement,
      },
    });
  }
  console.log(`Seeded ${socks.length} socks`);

  // Seed Strategies
  const strategies = JSON.parse(fs.readFileSync(path.join(dataDir, "Strategies.json"), "utf-8"));
  for (const s of strategies) {
    await prisma.strategy.create({
      data: {
        id: s.id,
        name: s.name,
        spatula: s.spatula,
        level: s.level,
        description: s.description,
      },
    });
  }
  console.log(`Seeded ${strategies.length} strategies`);

  // Seed Methods
  const methods = JSON.parse(fs.readFileSync(path.join(dataDir, "Methods.json"), "utf-8"));
  for (let i = 0; i < methods.length; i++) {
    const m = methods[i];
    await prisma.method.create({
      data: {
        name: m.name,
        strat: m.strat,
        difficulty: String(m.difficulty),
        description: m.description,
        videoURLs: JSON.stringify(m.videoURL && m.videoURL !== "N/A" ? [m.videoURL] : []),
      },
    });
  }
  console.log(`Seeded ${methods.length} methods`);

  // Seed Glossary
  const glossary = JSON.parse(fs.readFileSync(path.join(dataDir, "Glossary.json"), "utf-8"));
  for (const g of glossary) {
    await prisma.glossaryEntry.create({
      data: {
        name: g.name,
        difficulty: Number(g.difficulty) || 0,
        description: g.description,
        videoURL: g.videoURL || "",
      },
    });
  }
  console.log(`Seeded ${glossary.length} glossary entries`);

  // Seed Guides
  const guides = JSON.parse(fs.readFileSync(path.join(dataDir, "Guides.json"), "utf-8"));
  for (const g of guides) {
    await prisma.guide.create({
      data: {
        name: g.name,
        difficulty: g.difficulty,
        category: g.category || "",
        link: g.link,
      },
    });
  }
  console.log(`Seeded ${guides.length} guides`);

  // Reset autoincrement sequences to avoid ID conflicts
  const pg = await import("pg");
  const client = new pg.default.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const tables = ["Strategy", "Method", "Spatula", "Sock", "GlossaryEntry", "Guide"];
  for (const table of tables) {
    const seq = await client.query(`SELECT pg_get_serial_sequence('"${table}"', 'id')`);
    if (seq.rows[0].pg_get_serial_sequence) {
      const max = await client.query(`SELECT COALESCE(MAX(id), 0) as m FROM "${table}"`);
      await client.query(`SELECT setval('${seq.rows[0].pg_get_serial_sequence}', ${max.rows[0].m + 1}, false)`);
    }
  }
  await client.end();
  console.log("Reset autoincrement sequences");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
