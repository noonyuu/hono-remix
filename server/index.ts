import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
  }),
);

const route = app.get('/api/test', c => {
  return c.json({ message: 'Hello, World!' });
});

export default app;

export type AppType = typeof route;
