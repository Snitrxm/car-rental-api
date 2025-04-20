import { Controller, Get, Query } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('availability')
  public findAvailableCarsByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.carsService.findAvailableCarsByDate(startDate, endDate);
  }
}
