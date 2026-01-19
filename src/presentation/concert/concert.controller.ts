import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ConcertFacade } from '../../application/concert/concert.facade';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertFacade: ConcertFacade) {}

  @Get(':scheduleId/seats')
  async getAvailableSeats(@Param('scheduleId') scheduleId: string) {
    return this.concertFacade.getAvailableSeats(scheduleId);
  }

  @Post('reservations')
  async reserveSeat(
    @Body('userId', ParseUUIDPipe) userId: string,
    @Body('seatId', ParseUUIDPipe) seatId: string,
  ) {
    return this.concertFacade.reserveSeat(userId, seatId);
  }
}
