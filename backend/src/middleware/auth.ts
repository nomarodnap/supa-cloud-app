import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

export const supabaseAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    console.error('SUPABASE_JWT_SECRET is not set');
    return c.json({ error: 'Internal Server Error' }, 500);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    c.set('user', decoded);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid Token' }, 401);
  }
};
