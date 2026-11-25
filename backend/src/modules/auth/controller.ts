import type { Request, Response } from 'express';
import { env } from '../../config/env.js';
import { AUTH_COOKIE_NAME } from '../../middleware/requireAuth.js';
import * as authService from './service.js';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  const result = await authService.loginOwner(email, password);

  res.cookie(AUTH_COOKIE_NAME, result.token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.json({ data: result.user });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ data: { loggedOut: true } });
}

export async function me(_req: Request, res: Response): Promise<void> {
  const auth = res.locals.auth as { sub: string; email: string };
  res.json({
    data: {
      id: auth.sub,
      email: auth.email,
    },
  });
}
