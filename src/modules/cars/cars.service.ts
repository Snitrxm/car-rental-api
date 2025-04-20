import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { calculateTotalPrice } from 'src/helpers/calculateTotalPriceForBooking';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  public async findAvailableCarsByDate(startDate: string, endDate: string) {
    const cars = await this.carsRepository.find();

    const bookingsInSelectedDate = await this.bookingsRepository
      .createQueryBuilder('booking')
      .where(
        'booking.startDate <= :endDate AND booking.endDate >= :startDate',
        {
          startDate,
          endDate,
        },
      )
      .getMany();

    const availableCars = cars.filter((car) => {
      const bookingsForCar = bookingsInSelectedDate.filter(
        (b) => b.carId === car.id,
      );
      return bookingsForCar.length <= car.stock;
    });

    return availableCars.map((car) => {
      const totalPrice = calculateTotalPrice(
        parseISO(startDate),
        parseISO(endDate),
        car,
      );
      const days = differenceInCalendarDays(endDate, startDate) + 1;

      return {
        id: car.id,
        brand: car.brand,
        model: car.model,
        priceTotal: Number(totalPrice.toFixed(2)),
        pricePerDay: Number((totalPrice / days).toFixed(2)),
        stock: car.stock,
      };
    });
  }

  public async findOne(data: FindOneOptions<Car>) {
    return await this.carsRepository.findOne(data);
  }

  public async update(car: Car) {
    return await this.carsRepository.save(car);
  }
}
