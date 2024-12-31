import { Hono } from 'hono';

export const todoRouter = new Hono().get('/data', async c => {
  return c.json({ todos: 'Hello, World!' });
});
