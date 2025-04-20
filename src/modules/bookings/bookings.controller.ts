import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDTO } from './dtos/create.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  public async create(@Body() data: CreateBookingDTO) {
    return await this.bookingsService.create(data);
  }
}
