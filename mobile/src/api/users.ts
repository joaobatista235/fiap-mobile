import api from "./client";
import type { TeacherUser } from "@/src/types";

export interface CreateTeacherPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateTeacherPayload {
  name?: string;
  email?: string;
  password?: string;
}

export const UserService = {
  // Retorna todos os usuários — filtramos ADMIN no hook.
  getAll(): Promise<TeacherUser[]> {
    return api.get<TeacherUser[]>("/users").then((r) => r.data);
  },

  getById(id: string): Promise<TeacherUser> {
    return api.get<TeacherUser>(`/users/${id}`).then((r) => r.data);
  },

  // Cria com role ADMIN (professor).
  create(payload: CreateTeacherPayload): Promise<TeacherUser> {
    return api
      .post<TeacherUser>("/users", { ...payload, role: "ADMIN" })
      .then((r) => r.data);
  },

  // Cria com role USER (aluno).
  createStudent(payload: CreateTeacherPayload): Promise<TeacherUser> {
    return api
      .post<TeacherUser>("/users", { ...payload, role: "USER" })
      .then((r) => r.data);
  },

  update(id: string, payload: UpdateTeacherPayload): Promise<TeacherUser> {
    return api.put<TeacherUser>(`/users/${id}`, payload).then((r) => r.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/users/${id}`).then(() => undefined);
  },
};
