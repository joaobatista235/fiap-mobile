import prisma from "@/database/prisma";
import { Prisma } from "@prisma/client";

const safeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

class UserRepository {
  async getAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: safeSelect,
    });
  }

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: safeSelect,
    });
  }

  async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: safeSelect,
    });
  }

  async getByEmailWithPassword(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data, select: safeSelect });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data, select: safeSelect });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export default new UserRepository();
