import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@admin.com";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log("Seed: admin já existe, nada a fazer.");
    return;
  }

  const password = await bcrypt.hash("admin", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: adminEmail,
      password,
      role: "ADMIN",
    },
  });

  console.log("Seed: usuário admin criado — admin@admin.com / admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
