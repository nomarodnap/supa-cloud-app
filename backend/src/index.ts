import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Basic health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Port configuration
const port = parseInt(process.env.PORT || '8080', 10);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
