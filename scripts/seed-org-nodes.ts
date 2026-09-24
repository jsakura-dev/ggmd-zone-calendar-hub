import "dotenv/config";
console.log("DB URL loaded:", !!process.env.DATABASE_URL);
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const zone = await prisma.orgNode.create({
      data: { name: "Zone Test", level: "ZONE" },
    });
    console.log("Created zone:", zone.id);

    const region = await prisma.orgNode.create({
      data: { name: "Region North", level: "REGION", parentId: zone.id },
    });
    console.log("Created region:", region.id);

    const chapter = await prisma.orgNode.create({
      data: { name: "Chapter A", level: "CHAPTER", parentId: region.id },
    });
    console.log("Created chapter:", chapter.id);

    const activity1 = await prisma.activity.create({
      data: {
        title: "Chapter Discussion Meeting",
        date: new Date("2026-10-07"),
        startTime: "7:30 PM",
        unitId: chapter.id,
      },
    });
    console.log("Created activity:", activity1.id);

    const activity2 = await prisma.activity.create({
      data: {
        title: "Zone Leaders Meeting",
        date: new Date("2026-10-03"),
        startTime: "10:00 AM",
        isLocked: true,
        unitId: chapter.id,
      },
    });
    console.log("Created activity:", activity2.id);

    console.log("Seed complete.");
  } finally {
    await prisma.$disconnect();
  }
}

main();
