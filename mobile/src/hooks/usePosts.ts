import { useCallback, useEffect, useState } from "react";

import {
  PostService,
  type CreatePostPayload,
  type UpdatePostPayload,
} from "@/src/api/posts";
import type { Post } from "@/src/types";

interface UsePostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

export function usePosts() {
  const [state, setState] = useState<UsePostsState>({
    posts: [],
    isLoading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const posts = await PostService.getAll();
      setState({ posts, isLoading: false, error: null });
    } catch {
      setState((s) => ({ ...s, isLoading: false, error: "Erro ao carregar posts." }));
    }
  }, []);

  const create = useCallback(async (payload: CreatePostPayload): Promise<Post> => {
    const post = await PostService.create(payload);
    setState((s) => ({ ...s, posts: [post, ...s.posts] }));
    return post;
  }, []);

  const update = useCallback(
    async (id: number, payload: UpdatePostPayload): Promise<Post> => {
      const updated = await PostService.update(id, payload);
      setState((s) => ({
        ...s,
        posts: s.posts.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: number): Promise<void> => {
    await PostService.delete(id);
    setState((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== id) }));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refresh: fetch, create, update, remove };
}

export function usePost(id: number) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await PostService.getById(id);
      setPost(data);
    } catch {
      setError("Post não encontrado.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { post, isLoading, error, refresh: fetch };
}
