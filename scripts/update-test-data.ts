import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const existingChapter = await prisma.orgNode.findFirstOrThrow({
      where: { name: "Chapter A" },
    });
    const chapter = await prisma.orgNode.update({
      where: { id: existingChapter.id },
      data: { name: "Bay Bridge-Bay Island Chapter" },
    });
    console.log("Renamed chapter:", chapter.name);

    await prisma.activity.deleteMany({ where: { unitId: chapter.id } });
    console.log("Cleared old activities");

    const intro = await prisma.activity.create({
      data: {
        title: "Chapter Intro Meeting",
        date: new Date("2026-10-11"),
        startTime: "7:00 PM",
        location: "Zone Center",
        unitId: chapter.id,
      },
    });
    console.log("Created:", intro.title);

    const picnic = await prisma.activity.create({
      data: {
        title: "Chapter Picnic",
        date: new Date("2026-10-25"),
        startTime: "12:00 PM",
        location: "Lakeview Park",
        unitId: chapter.id,
      },
    });
    console.log("Created:", picnic.title);

    console.log("Update complete.");
  } finally {
    await prisma.$disconnect();
  }
}

main();
