import { Hono } from 'hono';

const test = new Hono();

// ユーザーエージェントを取得
test.get('/user-agent', c => {
  const userAgent = c.req.header('User-Agent');
  return c.json({ userAgent });
});

// レスポンスヘッダーを設定
test.get('welcome', c => {
  c.header('X-Message', 'Hello!');
  c.header('Content-Type', 'text/plain');

  c.status(201);

  return c.body('Welcome to Hono!');
});

// レスポンスボディをHTMLで返す
test.get('/html', c => {
  return c.html('<h1>Hello, Hono!</h1>');
});

// notFoundを返す
test.get('/notfound', c => {
  return c.notFound();
});

export default test;
