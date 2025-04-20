import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { CarsService } from '../cars/cars.service';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBookingRepository: jest.Mocked<Partial<Repository<Booking>>> = {
    find: jest.fn(),
    create: jest.fn().mockImplementation((dto: Booking) => dto),
    save: jest
      .fn()
      .mockImplementation((booking) =>
        Promise.resolve({ id: 'some-uuid', ...booking, createdAt: new Date() }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: CarsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '1',
              brand: 'Toyota',
              model: 'X',
              stock: 10,
              peakSeassonPricePerDay: 100,
              midSeassonPricePerDay: 80,
              offSeassonPricePerDay: 50,
              decreaseInStock: jest.fn(),
            }),
            update: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '1',
              name: 'andre',
              email: 'andre@test.com',
              licenseValidUntil: new Date('2026-01-01'),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  describe('create booking', () => {
    it('should throw an error if end date is before start date', async () => {
      await expect(
        service.create({
          startDate: new Date('2025-04-10').toISOString(),
          endDate: new Date('2025-04-09').toISOString(),
          carId: '1',
          licenseValidUntil: new Date('2026-01-01').toISOString(),
          name: 'Andre',
          email: 'andre@test.com',
        }),
      ).rejects.toThrow(
        new BadRequestException('End date must be after start date'),
      );
    });

    it('should throw an error if drivers license is not valid through the booking period', async () => {
      await expect(
        service.create({
          startDate: new Date('2025-04-10').toISOString(),
          endDate: new Date('2025-04-20').toISOString(),
          carId: '1',
          licenseValidUntil: new Date('2025-04-19').toISOString(),
          name: 'Andre',
          email: 'andre@test.com',
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'Driving license is not valid through the booking period',
        ),
      );
    });

    it('should throw an error if user already have a booking for this period', async () => {
      jest.spyOn(mockBookingRepository, 'find').mockResolvedValueOnce([
        {
          id: '1',
          carId: '1',
          userId: '1',
          startDate: new Date('2025-04-10'),
          endDate: new Date('2025-04-15'),
          averagePricePerDay: 1,
          totalPrice: 1,
          user: {
            id: '1',
            licenseValidUntil: new Date(),
            email: 'andre@test.com',
            name: 'andre',
            createdAt: new Date(),
            bookings: [],
          },
          car: {
            id: '1',
            brand: 'a',
            model: 'b',
            peakSeasonPricePerDay: 100,
            midSeasonPricePerDay: 80,
            offSeasonPricePerDay: 50,
            createdAt: new Date(),
            stock: 10,
            bookings: [],
            decreaseInStock: () => {},
          },
          createdAt: new Date(),
        },
      ]);

      await expect(
        service.create({
          startDate: new Date('2025-04-10').toISOString(),
          endDate: new Date('2025-04-20').toISOString(),
          carId: '1',
          licenseValidUntil: new Date('2026-01-01').toISOString(),
          name: 'Andre',
          email: 'andre@test.com',
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'User already has a booking in the selected period',
        ),
      );
    });

    it('should create a booking when all conditions are met', async () => {
      jest.spyOn(mockBookingRepository, 'find').mockResolvedValueOnce([]);

      const response = await service.create({
        startDate: new Date('2025-04-10').toISOString(),
        endDate: new Date('2025-04-20').toISOString(),
        carId: '1',
        licenseValidUntil: new Date('2026-01-01').toISOString(),
        name: 'Andre',
        email: 'andre@test.com',
      });

      expect(mockBookingRepository.create).toHaveBeenCalled();
      expect(mockBookingRepository.save).toHaveBeenCalled();
      expect(response).toBeDefined();
    });
  });
});
