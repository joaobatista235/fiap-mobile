import { useCallback, useEffect, useState } from "react";

import { UserService } from "@/src/api/users";
import type { TeacherUser } from "@/src/types";

export type StudentUser = TeacherUser;

export interface CreateStudentPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateStudentPayload {
  name?: string;
  email?: string;
  password?: string;
}

const PAGE_SIZE = 10;

interface State {
  students: StudentUser[];
  isLoading: boolean;
  error: string | null;
}

export function useStudents() {
  const [state, setState] = useState<State>({
    students: [],
    isLoading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const all = await UserService.getAll();
      const students = all.filter((u) => u.role === "USER");
      setState((s) => ({ ...s, students, isLoading: false }));
    } catch {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: "Erro ao carregar alunos.",
      }));
    }
  }, []);

  const create = useCallback(async (payload: CreateStudentPayload): Promise<StudentUser> => {
    const student = await UserService.createStudent(payload);
    setState((s) => ({ ...s, students: [student, ...s.students] }));
    return student;
  }, []);

  const update = useCallback(async (id: string, payload: UpdateStudentPayload): Promise<StudentUser> => {
    const updated = await UserService.update(id, payload);
    setState((s) => ({
      ...s,
      students: s.students.map((st) => (st.id === id ? updated : st)),
    }));
    return updated;
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    await UserService.delete(id);
    setState((s) => ({
      ...s,
      students: s.students.filter((st) => st.id !== id),
    }));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    allStudents: state.students,
    isLoading: state.isLoading,
    error: state.error,
    refresh: fetch,
    create,
    update,
    remove,
    PAGE_SIZE,
  };
}
