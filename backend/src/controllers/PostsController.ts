import { Request, Response } from "express";
import postsService from "@/services/PostsService";
import { getUserFromToken } from "@/utils/getUserFromToken";
import jwt from "jsonwebtoken";


class PostsController {

  async getAll(_req: Request, res: Response) {
    const posts = await postsService.getAll();
    return res.json(posts);
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const post = await postsService.getById(id);
    return res.json(post);
  }

  async create(req: Request, res: Response) {
      const authorId = getUserFromToken(req);

    const { title, content } = req.body;
    const newPost = await postsService.create({ title, content,authorId });
    return res.status(201).json(newPost);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { title, content,authorId  } = req.body;

    const updated = await postsService.update(id, { title, content,authorId });
    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const deleted = await postsService.delete(id);
    return res.json(deleted);
  }


async search(req: Request, res: Response) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Informe uma palavra-chave" });
  }

  const posts = await postsService.search(String(q));

  return res.json(posts);
}
  async getMyPosts(req: Request, res: Response) {
    const authorId = req.params.authorId as string;
    const posts = await postsService.getByAuthorId(authorId);
    return res.json(posts);

}
}
export default new PostsController();
