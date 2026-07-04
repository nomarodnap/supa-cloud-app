import { Context, Next } from 'hono';
import { createRemoteJWKSet, jwtVerify } from 'jose';

// Supabase now uses Asymmetric keys (ES256/RS256) for your project.
// We fetch the public keys dynamically from your project's JWKS endpoint.
const JWKS_URL = new URL('https://fsveuykpffrbyzmeltjw.supabase.co/auth/v1/.well-known/jwks.json');
const JWKS = createRemoteJWKSet(JWKS_URL);

export const supabaseAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    // This will securely verify the token using the correct asymmetric algorithm
    // and automatically cache the public keys from the JWKS URL.
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ['ES256', 'RS256', 'HS256'],
    });
    
    c.set('user', payload);
    await next();
  } catch (error: any) {
    console.error('JWT Verification Error:', error.message);
    return c.json({ error: error.message }, 401);
  }
};
