export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface TeacherUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface PostAuthor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
  author?: PostAuthor;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
