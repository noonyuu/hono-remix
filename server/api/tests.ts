import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';

type Env = {
  Variables: {
    echo: (str: string) => string;
  };
};

const test = new Hono();

const echoMiddleware = createMiddleware<Env>(async (c, next) => {
  c.set('echo', str => str);
  await next();
});

// welcomeルートにミドルウェアを適用
test.use('/welcome', async (c, next) => {
  await next();
  c.res.headers.append('X-Debug', 'Debug message');
});

// render
test.use(async (c, next) => {
  c.setRenderer((content, head) => {
    return c.html(`
      <html>
        <head>
          <title>${head.title}</title>
        </head>
        <body>
          <header>${head.title}</header>
          <p>${content}</p>
        </body>
      </html>,
    `);
  });
  await next();
});

test.get('/render', c => {
  return c.render(`<p>Hello Hono!!</p>`, {
    title: 'Hono',
  });
});

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

// リダイレクト
test.get('/redirect', c => {
  return c.redirect('/api/tests/html');
});

test.get('/echo', echoMiddleware, c => {
  return c.text(c.var.echo('Hello, Hono!'));
});

// executionCtx.waitUntil
test.get('/wait', async c => {
  c.executionCtx.waitUntil(
    (async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('waited 1s');
    })(),
  );
  return c.text('Waiting...');
});

export default test;

declare module 'hono' {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head: { title: string },
    ): Response | Promise<Response>;
  }
}
