import "dotenv/config";

import { seedWorkshops } from "./seed-workshops";

async function main() {
  try {
    console.log("🌱 Seeding database...");
    await seedWorkshops();
    console.log("✅ Done");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
