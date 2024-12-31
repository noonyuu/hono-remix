import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

const app = new Hono();

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
