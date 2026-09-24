import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const nodes = await prisma.orgNode.findMany();
    console.log(JSON.stringify(nodes, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main();
