import { Module } from '@nestjs/common';
import { ConcertFacade } from '../../application/concert/concert.facade';
import { SEAT_REPOSITORY } from '../../domain/concert/repositories/seat.repository.interface';
import { PrismaSeatRepository } from '../../infrastructure/persistence/concert/prisma-seat.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { ConcertController } from '../../presentation/concert/concert.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ConcertController],
  providers: [
    ConcertFacade,
    {
      provide: SEAT_REPOSITORY,
      useClass: PrismaSeatRepository,
    },
  ],
  exports: [ConcertFacade],
})
export class ConcertModule {}
