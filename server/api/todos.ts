import { Hono } from 'hono';

type Variables = {
  message: string;
};

export const todoRouter = new Hono<{ Variables: Variables }>()
  .use(async (c, next) => {
    c.set('message', 'Hello, World!!!');
    await next();
  })
  .get('/data', async c => {
    const message = c.get('message');
    return c.json({ todos: message });
  });
