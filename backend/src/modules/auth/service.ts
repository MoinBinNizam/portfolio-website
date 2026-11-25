import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { User } from '../../models/User.js';
import { httpError } from '../../utils/httpError.js';

const MAX_FAILED_LOGINS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export async function loginOwner(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw httpError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    throw httpError(
      423,
      'ACCOUNT_LOCKED',
      'Account is temporarily locked due to too many failed attempts. Try again in 15 minutes.',
    );
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const nextFailed = (user.failedLogins ?? 0) + 1;
    user.failedLogins = nextFailed;
    if (nextFailed >= MAX_FAILED_LOGINS) {
      user.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
    }
    await user.save();

    if (nextFailed >= MAX_FAILED_LOGINS) {
      throw httpError(
        423,
        'ACCOUNT_LOCKED',
        'Account locked for 15 minutes after 5 failed login attempts.',
      );
    }
    throw httpError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  user.failedLogins = 0;
  user.lockedUntil = null;
  await user.save();

  const token = jwt.sign({ sub: String(user._id), email: user.email }, env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    token,
    user: {
      id: String(user._id),
      email: user.email,
    },
  };
}
