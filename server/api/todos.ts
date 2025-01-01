import { Hono } from 'hono';

type Variables = {
  message: string;
};

const todo = new Hono<{ Variables: Variables }>();

todo.use(async (c, next) => {
  c.set('message', 'Hello, World!!!');
  await next();
});

todo.get('/data', async c => {
  const message = c.get('message');
  return c.json({ todos: message });
});

export default todo;
