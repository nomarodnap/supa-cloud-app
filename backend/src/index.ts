import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { betterAuthMiddleware } from './middleware/auth';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Basic health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected endpoint
app.get('/api/me', betterAuthMiddleware, (c) => {
  // @ts-ignore
  const user = c.get('user');
  return c.json({
    message: 'Secure data successfully retrieved from Backend',
    user
  });
});

// Port configuration
const port = parseInt(process.env.PORT || '8080', 10);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
