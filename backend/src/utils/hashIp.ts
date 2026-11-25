import crypto from 'node:crypto';
import { env } from '../config/env.js';

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(`${env.JWT_SECRET}:${ip}`).digest('hex');
}
