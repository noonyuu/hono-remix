import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';

import todo from './api/todos';
import test from './api/tests';

type Env = {
  Variables: {
    hoge: () => void;
  };
};

const app = new Hono<Env>();

const middleware = createMiddleware<Env>(async (c, next) => {
  c.set('hoge', () => {
    console.log('fuga!');
  }); // Contextにhoge関数を追加
  await next();
});

app.use('/*', middleware);

app.get('/hello', c => {
  const { hoge } = c.var;
  hoge(); // output: fuga
  return c.text('Hello, Hono!');
});
// カスタムロガーの定義
export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

// ログの設定
app.use('*', logger(customLogger));

// すべてのルートにCORS設定を適用
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
  }),
);

app.get('/api/hello', c => c.text('Hello, World!'));

// ワイルドカードを含むパス
app.get('/wild/*/card', c => {
  return c.text('GET /wild/*/card');
});

// パラメータを含むパス
app.get('/post/:id/comment/:comment_id', c => {
  // const id = c.req.param('id');
  // const commentId = c.req.param('comment_id');

  // return c.json({ id, commentId });

  const { id, comment_id } = c.req.param();

  return c.json({ id, comment_id });
});

// チェーンルーティング
app
  .get('/chain', c => {
    return c.text('GET /chain');
  })
  .post(c => {
    return c.text('POST /chain');
  })
  .put(c => {
    return c.text('PUT /chain');
  });

// aysnc/awaitを利用した非同期処理
app.get('/async', async c => {
  const response = await fetch(
    'https://benki.noonyuu.com/app/v1/word-list/all',
  );
  return c.text(`Status is ${response.status}`);
});

// prettier-ignore
const router = app
  .basePath('/api')
  .route('/todos', todo)
  .route('/tests', test)

export default app;

// クライアント側で利用する型定義
export type ApiRoutes = typeof router;
