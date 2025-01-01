import { Hono } from 'hono';

const test = new Hono();

test.get('/user-agent', c => {
  const userAgent = c.req.header('User-Agent');
  return c.json({ userAgent });
});

export default test;
