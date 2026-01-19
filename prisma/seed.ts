import 'dotenv/config';
import { PrismaClient } from './generated/client';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  connectionLimit: 5,
  database: process.env.DATABASE_SCHEMA,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed Users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      name: 'User One',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      name: 'User Two',
    },
  });

  console.log('Seeded Users:', { user1, user2 });

  // Seed Concerts
  const concertId1 = '11111111-1111-1111-1111-111111111111';
  const concert1 = await prisma.concert.upsert({
    where: { id: concertId1 },
    update: {},
    create: {
      id: concertId1,
      name: 'IU Golden Hour Concert',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
      venue: 'Olympic Stadium',
      totalSeats: 1000,
      availableSeats: 1000,
    },
  });

  const concertId2 = '22222222-2222-2222-2222-222222222222';
  const concert2 = await prisma.concert.upsert({
    where: { id: concertId2 },
    update: {},
    create: {
      id: concertId2,
      name: 'BTS Reunion Concert',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
      venue: 'SoFi Stadium',
      totalSeats: 5000,
      availableSeats: 5000,
    },
  });

  console.log('Seeded Concerts:', { concert1, concert2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
