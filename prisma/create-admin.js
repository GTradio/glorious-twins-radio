import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("GTradio1960", 10);

  const admin = await prisma.admin.create({
    data: {
      email: "admin@glorioustwinsradio.com",
      password: hashedPassword,
      name: "Glorious Twins",
      role: "admin",
      active: true,
    },
  });

  console.log("✅ Admin created successfully:", admin.email);
}

main()
  .catch((e) => {
    console.error("❌ Error creating admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
