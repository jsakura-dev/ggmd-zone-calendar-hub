import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export default async function Home() {
  const chapter = await prisma.orgNode.findFirst({
    where: { name: "Bay Bridge-Bay Island Chapter" },
    include: { activities: true },
  });

  if (!chapter) {
    return <div style={{ padding: 40 }}>No chapter found yet — run the seed script.</div>;
  }

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>{chapter.name} calendars</h1>
      <p style={{ color: "#666" }}>Level: {chapter.level}</p>

      <h2 style={{ marginTop: 24, fontSize: 20, fontWeight: 600 }}>Activities</h2>
      <ul>
        {chapter.activities.map((activity) => (
          <li key={activity.id} style={{ padding: "8px 0" }}>
            <strong>{activity.title}</strong>{" "}
            — {new Date(activity.date).toLocaleDateString()}
            {activity.startTime && ` · ${activity.startTime}`}
            {activity.location && ` · ${activity.location}`}
            {activity.isLocked && " (Required)"}
          </li>
        ))}
      </ul>
    </main>
  );
}