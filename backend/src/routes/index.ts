import { Router } from "express";
import postsRoutes from "./posts.routes";
import usersRoutes from "@/routes/users.routes";
import PostsController from "@/controllers/PostsController";
import { isAdmin } from "@/middlewares/isAdmin";

const routes = Router();

routes.use("/posts", postsRoutes);
routes.use("/users", usersRoutes); // Adiciona as rotas de usuários
routes.get("/admin/posts", isAdmin, PostsController.getAll);
routes.delete("/admin/posts/:id", isAdmin, PostsController.delete);
routes.put("/admin/posts/:id", isAdmin, PostsController.update);

export default routes;
