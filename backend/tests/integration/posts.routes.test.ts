import request from 'supertest';
import app from '../../src/app';

// Mock do repositório
jest.mock('../../src/repositories/PostsRepository', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(async () => [
      { id: 1, title: 'Primeiro Post', content: 'Conteúdo' }
    ]),
    getById: jest.fn(async (id: number) => ({
      id,
      title: 'Post ' + id,
      content: 'Conteúdo'
    })),
    create: jest.fn(async (data) => ({
      id: 1,
      ...data
    })),
    update: jest.fn(async (id, data) => ({ id, ...data })),
    delete: jest.fn(async () => true),
    search: jest.fn(async () => [])
  }
}));

jest.mock('../../src/utils/getUserFromToken', () => ({
  getUserFromToken: jest.fn(() => 'mock-user-id')
}));

describe('Posts API', () => {

  it('deve criar um novo post (POST /api/posts)', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'Novo Post', content: 'Conteúdo' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Novo Post');
  });

  it('deve listar posts (GET /api/posts)', async () => {
    const res = await request(app).get('/api/posts');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});