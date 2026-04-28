import { useCallback, useEffect, useState } from "react";

import {
  UserService,
  type CreateTeacherPayload,
  type UpdateTeacherPayload,
} from "@/src/api/users";
import type { TeacherUser } from "@/src/types";

const PAGE_SIZE = 10;

interface State {
  teachers: TeacherUser[];
  isLoading: boolean;
  error: string | null;
  page: number;
}

export function useTeachers() {
  const [state, setState] = useState<State>({
    teachers: [],
    isLoading: false,
    error: null,
    page: 0,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const all = await UserService.getAll();
      // Apenas professores (ADMIN)
      const teachers = all.filter((u) => u.role === "ADMIN");
      setState((s) => ({ ...s, teachers, isLoading: false, page: 0 }));
    } catch {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: "Erro ao carregar professores.",
      }));
    }
  }, []);

  const create = useCallback(
    async (payload: CreateTeacherPayload): Promise<TeacherUser> => {
      const teacher = await UserService.create(payload);
      setState((s) => ({ ...s, teachers: [teacher, ...s.teachers] }));
      return teacher;
    },
    []
  );

  const update = useCallback(
    async (id: string, payload: UpdateTeacherPayload): Promise<TeacherUser> => {
      const updated = await UserService.update(id, payload);
      setState((s) => ({
        ...s,
        teachers: s.teachers.map((t) => (t.id === id ? updated : t)),
      }));
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    await UserService.delete(id);
    setState((s) => ({
      ...s,
      teachers: s.teachers.filter((t) => t.id !== id),
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState((s) => ({ ...s, page }));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const totalPages = Math.ceil(state.teachers.length / PAGE_SIZE);
  const paginated = state.teachers.slice(
    state.page * PAGE_SIZE,
    (state.page + 1) * PAGE_SIZE
  );

  return {
    teachers: paginated,
    allTeachers: state.teachers,
    isLoading: state.isLoading,
    error: state.error,
    page: state.page,
    totalPages,
    setPage,
    refresh: fetch,
    create,
    update,
    remove,
  };
}
