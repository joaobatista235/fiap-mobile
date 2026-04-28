import { Request, Response } from "express";

import usersService from "@/services/UserService";

class UsersController {
  async getAll(_req: Request, res: Response) {
    const users = await usersService.getAll();
    return res.json(users);
  }

  async getById(req: Request, res: Response) {
    const user = await usersService.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.json(user);
  }

  async getByEmail(req: Request, res: Response) {
    const user = await usersService.getByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.json(user);
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const user = await usersService.create({ name, email, password, role });
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message ?? "Erro ao criar usuário" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await usersService.update(req.params.id, req.body);
      return res.status(200).json(updated);
    } catch (error: any) {
      const status = error.message?.includes("Email") ? 409 : 404;
      return res.status(status).json({ message: error.message ?? "Usuário não encontrado" });
    }
  }

  async delete(req: Request, res: Response) {
    const deleted = await usersService.delete(req.params.id);
    return res.json(deleted);
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }
      const result = await usersService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ message: error.message ?? "Credenciais inválidas" });
    }
  }
}

export default new UsersController();
