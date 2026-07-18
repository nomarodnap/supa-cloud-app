import { Context, Next } from 'hono';
import { auth } from '../auth';

export const betterAuthMiddleware = async (c: Context, next: Next) => {
  try {
    // Verify token using Better Auth
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    });
    
    if (!session) {
      return c.json({ error: 'Invalid or expired session' }, 401);
    }
    
    c.set('user', session.user);
    await next();
  } catch (error: any) {
    console.error('Auth Verification Error:', error.message);
    return c.json({ error: error.message }, 401);
  }
};
