import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { User } from '../src/models/User.js';

async function createOwner(): Promise<void> {
  const email = env.OWNER_EMAIL;
  const password = env.OWNER_PASSWORD;

  if (!email || !password) {
    console.error('OWNER_EMAIL and OWNER_PASSWORD must be set in .env to create the owner.');
    process.exit(1);
  }

  await connectDatabase();

  const existing = await User.findOne({ email: email.toLowerCase() });
  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.failedLogins = 0;
    existing.lockedUntil = null;
    await existing.save();
    console.log(`Updated owner account: ${email}`);
  } else {
    await User.create({
      email: email.toLowerCase(),
      passwordHash,
      failedLogins: 0,
      lockedUntil: null,
    });
    console.log(`Created owner account: ${email}`);
  }

  await disconnectDatabase();
}

void createOwner();
