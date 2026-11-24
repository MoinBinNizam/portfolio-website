import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import { Profile } from '../src/models/Profile.js';

async function seed(): Promise<void> {
  await connectDatabase();

  const existingProfile = await Profile.findOne();
  if (!existingProfile) {
    await Profile.create({
      name: 'Moin Uddin',
      headline: 'Full-Stack MERN & TypeScript Developer',
      tagline: '[TODO] Confirm owner tagline before publishing',
      intro:
        'Full-stack developer building fast, accessible web applications with MongoDB, Express, React, Node.js, and TypeScript.',
      about:
        '[TODO] Replace with Moin Uddin full biography, values, and working approach from the admin panel.',
      email: 'contact@moinuddinbd.com',
      location: 'Dhaka, Bangladesh',
      socials: {
        github: 'https://github.com/moinuddinbd',
        linkedin: 'https://www.linkedin.com/in/moinuddinbd',
      },
    });
    console.log('Seeded initial profile');
  } else {
    console.log('Profile already exists, skipping seed');
  }

  await disconnectDatabase();
}

void seed();
