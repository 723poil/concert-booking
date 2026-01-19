import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
import {
  PrismaClient,
  SeatGrade,
  SeatStatus,
  UserStatus,
} from './generated/client';

const adapter = new PrismaMariaDb({
  connectionLimit: 5,
  database: process.env.DATABASE_SCHEMA,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
});
// @ts-ignore
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  console.log('🧹 Cleaning up old data...');
  // Delete in order to avoid foreign key constraints
  await prisma.payment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.queueToken.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.concertSchedule.deleteMany();
  await prisma.concert.deleteMany();
  await prisma.user.deleteMany();

  console.log('🎤 Seeding Concerts...');
  const concert = await prisma.concert.create({
    data: {
      name: 'IU Golden Hour : The Grand Finale',
      artist: 'IU',
      description: 'The biggest concert event of the year.',
      thumbnailUrl: 'https://example.com/iu_concert.jpg',
    },
  });

  console.log('📅 Seeding Schedules...');
  const schedules = [];
  const dates = [
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 8), // 1 week + 1 day
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 9), // 1 week + 2 days
  ];

  for (let i = 0; i < dates.length; i++) {
    const schedule = await prisma.concertSchedule.create({
      data: {
        concertId: concert.id,
        startAt: dates[i],
        endAt: new Date(dates[i].getTime() + 1000 * 60 * 60 * 4), // 4 hours long
        venue: 'Olympic Stadium',
        totalSeats: 10000,
        availableSeats: 10000,
      },
    });
    schedules.push(schedule);
  }

  console.log('🪑 Seeding Seats (10,000 per schedule)...');
  // Define sections and seat layout
  // 50 Sections, 20 Rows per section, 10 Seats per row = 10,000 seats
  // Grades: Sections 1-10 (VIP), 11-20 (R), 21-30 (S), 31-50 (A)
  const SECTION_COUNT = 50;
  const ROW_COUNT = 20;
  const SEAT_PER_ROW = 10;

  for (const schedule of schedules) {
    console.log(`  > Generating seats for schedule ${schedule.id}...`);
    const seatsData = [];

    for (let sectionNum = 1; sectionNum <= SECTION_COUNT; sectionNum++) {
      const section = `SECTION-${sectionNum}`;
      let grade: SeatGrade = 'A';
      let price = 50000;

      if (sectionNum <= 10) {
        grade = 'VIP';
        price = 150000;
      } else if (sectionNum <= 20) {
        grade = 'R';
        price = 120000;
      } else if (sectionNum <= 30) {
        grade = 'S';
        price = 90000;
      }

      for (let row = 1; row <= ROW_COUNT; row++) {
        for (let seatNum = 1; seatNum <= SEAT_PER_ROW; seatNum++) {
          seatsData.push({
            scheduleId: schedule.id,
            section: section,
            rowNumber: row,
            seatNumber: seatNum,
            grade: grade,
            price: price,
            status: 'AVAILABLE' as SeatStatus,
            version: 0,
          });
        }
      }
    }

    // Batch insert using createMany
    // Prisma createMany is efficient for large datasets
    await prisma.seat.createMany({
      data: seatsData,
      skipDuplicates: true,
    });
  }

  console.log('👥 Seeding Users (1,000)...');
  const usersData = [];
  for (let i = 1; i <= 1000; i++) {
    usersData.push({
      email: `user${i}@example.com`,
      name: `Test User ${i}`,
      passwordHash: 'hashed_password_placeholder', // In real app, hash this
      status: 'ACTIVE' as UserStatus,
    });
  }

  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });

  console.log('✅ Seeding complete!');
  console.log(`  - Concerts: 1`);
  console.log(`  - Schedules: ${schedules.length}`);
  console.log(
    `  - Seats: ${schedules.length * SECTION_COUNT * ROW_COUNT * SEAT_PER_ROW}`,
  );
  console.log(`  - Users: ${usersData.length}`);
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
