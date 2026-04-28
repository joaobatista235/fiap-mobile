import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userRepository from "@/repositories/UserRepository";

class UsersService {
  async getAll() {
    return userRepository.getAll();
  }

  async getById(id: string) {
    return userRepository.getById(id);
  }

  async getByEmail(email: string) {
    return userRepository.getByEmail(email);
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    const emailExists = await userRepository.getByEmail(data.email);
    if (emailExists) {
      throw new Error("Email em uso");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "USER",
    });
  }

  async update(
    id: string,
    data: { name?: string; email?: string; password?: string; role?: string }
  ) {
    if (data.email) {
      const emailExists = await userRepository.getByEmail(data.email);
      if (emailExists && emailExists.id !== id) {
        throw new Error("Email já em uso");
      }
    }

    const updatePayload: Record<string, unknown> = {};
    if (data.name) updatePayload.name = data.name;
    if (data.email) updatePayload.email = data.email;
    if (data.role) updatePayload.role = data.role;
    if (data.password) {
      updatePayload.password = await bcrypt.hash(data.password, 10);
    }

    return userRepository.update(id, updatePayload);
  }

  async delete(id: string) {
    return userRepository.delete(id);
  }

  async login(email: string, password: string) {
    const user = await userRepository.getByEmailWithPassword(email);

    if (!user) throw new Error("Credenciais inválidas");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error("Credenciais inválidas");

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    };
  }
}

export default new UsersService();
