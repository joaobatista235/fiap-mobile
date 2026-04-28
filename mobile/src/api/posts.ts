import api from "./client";
import type { Post } from "@/src/types";

export interface CreatePostPayload {
  title: string;
  content: string;
}

export interface UpdatePostPayload {
  title: string;
  content: string;
}

export const PostService = {
  getAll(): Promise<Post[]> {
    return api.get<Post[]>("/posts").then((r) => r.data);
  },

  getById(id: number): Promise<Post> {
    return api.get<Post>(`/posts/${id}`).then((r) => r.data);
  },

  create(payload: CreatePostPayload): Promise<Post> {
    return api.post<Post>("/posts", payload).then((r) => r.data);
  },

  update(id: number, payload: UpdatePostPayload): Promise<Post> {
    return api.put<Post>(`/posts/${id}`, payload).then((r) => r.data);
  },

  delete(id: number): Promise<void> {
    return api.delete(`/posts/${id}`).then(() => undefined);
  },

  search(q: string): Promise<Post[]> {
    return api
      .get<Post[]>("/posts/search", { params: { q } })
      .then((r) => r.data);
  },
};
