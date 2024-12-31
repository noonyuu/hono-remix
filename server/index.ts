import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono();

// カスタムロガーの定義
export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

// ログの設定
app.use('*', logger(customLogger));
