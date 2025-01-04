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

// prettier-ignore
const router = app
  .basePath('/api')
  .route('/todos', todo)
  .route('/tests', test)

export default app;

// クライアント側で利用する型定義
export type ApiRoutes = typeof router;
