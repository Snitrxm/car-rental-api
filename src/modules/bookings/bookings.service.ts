import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateBookingDTO } from './dtos/create.dto';
import { differenceInDays, isBefore, parseISO } from 'date-fns';
import { calculateTotalPrice } from 'src/helpers/calculateTotalPriceForBooking';
import { UsersService } from '../users/users.service';
import { CarsService } from '../cars/cars.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private carsService: CarsService,
    private usersService: UsersService,
  ) {}

  public async create(data: CreateBookingDTO) {
    const start = parseISO(data.startDate);
    const end = parseISO(data.endDate);
    const licenseValidUntil = parseISO(data.licenseValidUntil);
    const days = differenceInDays(end, start);

    if (isBefore(end, start)) {
      throw new BadRequestException('End date must be after start date');
    }

    if (licenseValidUntil < end) {
      throw new BadRequestException(
        'Driving license is not valid through the booking period',
      );
    }

    let user = await this.usersService.findOne({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      const newUser = await this.usersService.create({
        ...data,
      });

      user = newUser;
    }

    const existingBookings = await this.bookingsRepository.find({
      where: {
        userId: user.id,
        startDate: LessThanOrEqual(end),
        endDate: MoreThanOrEqual(start),
      },
    });

    if (existingBookings.length > 0) {
      throw new BadRequestException(
        'User already has a booking in the selected period',
      );
    }

    const car = await this.carsService.findOne({
      where: { id: data.carId },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    car.decreaseInStock();

    await this.carsService.update(car);

    const totalPrice = calculateTotalPrice(start, end, car);

    const booking = this.bookingsRepository.create({
      userId: user.id,
      carId: data.carId,
      startDate: start,
      endDate: end,
      totalPrice,
      averagePricePerDay: Number((totalPrice / days).toFixed(2)),
    });

    await this.bookingsRepository.save(booking);

    return booking;
  }
}
