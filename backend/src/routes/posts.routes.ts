import { Router } from "express";
import PostsController from "@/controllers/PostsController";

const router = Router();

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Busca posts por palavra-chave
 *     description: Retorna posts que contenham a palavra-chave no título ou conteúdo
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Palavra-chave para busca
 *         example: react
 *     responses:
 *       200:
 *         description: Lista de posts encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Aprendendo React
 *                   content:
 *                     type: string
 *                     example: React é uma biblioteca JavaScript...
 *                   authorId:
 *                     type: integer
 *                     example: 2
 *       400:
 *         description: Palavra-chave não informada
 */
router.get("/search", PostsController.search);

router.get("/", PostsController.getAll);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retorna um post pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post
 *     responses:
 *       200:
 *         description: Post encontrado
 *       404:
 *         description: Post não encontrado
 */
router.get("/:id", PostsController.getById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria um novo post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", PostsController.create);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualiza um post existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *       404:
 *         description: Post não encontrado
 */
router.put("/:id", PostsController.update);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Exclui um post
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post
 *     responses:
 *       200:
 *         description: Post excluído com sucesso
 *       404:
 *         description: Post não encontrado
 */
router.delete("/:id", PostsController.delete);

router.get("/author/:authorId", PostsController.getMyPosts);
/**
 * @swagger
 * /posts/author/{authorId}:
 *   get:
 *     summary: Retorna os posts de um autor específico
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         description: ID do autor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de posts do autor retornada com sucesso
 *       404:
 *         description: Autor não encontrado
 */

export default router;

