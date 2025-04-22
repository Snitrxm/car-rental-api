import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { calculateTotalPrice } from 'src/helpers/calculateTotalPriceForBooking';
import { differenceInCalendarDays, parseISO } from 'date-fns';

jest.mock('src/helpers/calculateTotalPriceForBooking', () => ({
  calculateTotalPrice: jest.fn().mockReturnValue(100),
}));

describe('CarsService', () => {
  let service: CarsService;
  let carRepository: Repository<Car>;
  let bookingRepository: Repository<Booking>;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const mockCarRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const mockBookingRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: getRepositoryToken(Car),
          useValue: mockCarRepository,
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
    carRepository = module.get<Repository<Car>>(getRepositoryToken(Car));
    bookingRepository = module.get<Repository<Booking>>(
      getRepositoryToken(Booking),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAvailableCarsByDate', () => {
    const startDate = '2025-04-10';
    const endDate = '2025-04-15';

    const mockCars = [
      {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        stock: 2,
        peakSeasonPricePerDay: 100,
        midSeasonPricePerDay: 80,
        offSeasonPricePerDay: 50,
      },
      {
        id: '2',
        brand: 'Honda',
        model: 'Civic',
        stock: 1,
        peakSeasonPricePerDay: 110,
        midSeasonPricePerDay: 90,
        offSeasonPricePerDay: 60,
      },
    ];

    it('should return available cars with pricing information', async () => {
      jest.spyOn(carRepository, 'find').mockResolvedValue(mockCars as Car[]);
      mockQueryBuilder.getMany.mockResolvedValue([{ carId: '1' } as Booking]);

      const result = await service.findAvailableCarsByDate(startDate, endDate);

      expect(carRepository.find).toHaveBeenCalled();
      expect(bookingRepository.createQueryBuilder).toHaveBeenCalledWith(
        'booking',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'booking.startDate <= :endDate AND booking.endDate >= :startDate',
        { startDate, endDate },
      );

      expect(result).toHaveLength(2);

      expect(result[0]).toEqual({
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        priceTotal: 100,
        pricePerDay: 16.67,
        stock: 2,
      });

      expect(calculateTotalPrice).toHaveBeenCalledWith(
        parseISO(startDate),
        parseISO(endDate),
        mockCars[0],
      );
    });

    it('should filter out cars that are fully booked', async () => {
      jest.spyOn(carRepository, 'find').mockResolvedValue(mockCars as Car[]);
      mockQueryBuilder.getMany.mockResolvedValue([
        { carId: '1' } as Booking,
        { carId: '2' } as Booking,
      ]);

      const result = await service.findAvailableCarsByDate(startDate, endDate);

      expect(result[0].id).toBe('1');
    });

    it('should handle bookings for cars that are not in the current stock', async () => {
      jest
        .spyOn(carRepository, 'find')
        .mockResolvedValue([mockCars[0]] as Car[]);

      mockQueryBuilder.getMany.mockResolvedValue([
        { carId: '1' } as Booking,
        { carId: '3' } as Booking,
      ]);

      const result = await service.findAvailableCarsByDate(startDate, endDate);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should correctly calculate days between dates including both endpoints', async () => {
      jest
        .spyOn(carRepository, 'find')
        .mockResolvedValue([mockCars[0]] as Car[]);
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAvailableCarsByDate(startDate, endDate);

      expect(
        differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1,
      ).toBe(6);
    });
  });

  describe('findOne', () => {
    it('should find a car by the given criteria', async () => {
      const mockCar = {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        stock: 2,
      };

      const findOptions: FindOneOptions<Car> = { where: { id: '1' } };

      jest.spyOn(carRepository, 'findOne').mockResolvedValue(mockCar as Car);

      const result = await service.findOne(findOptions);

      expect(carRepository.findOne).toHaveBeenCalledWith(findOptions);
      expect(result).toEqual(mockCar);
    });

    it('should return null when car is not found', async () => {
      const findOptions: FindOneOptions<Car> = {
        where: { id: 'non-existent' },
      };

      jest.spyOn(carRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findOne(findOptions);

      expect(carRepository.findOne).toHaveBeenCalledWith(findOptions);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a car', async () => {
      const mockCar = {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        stock: 1,
      };

      jest.spyOn(carRepository, 'save').mockResolvedValue(mockCar as Car);

      const result = await service.update(mockCar as Car);

      expect(carRepository.save).toHaveBeenCalledWith(mockCar);
      expect(result).toEqual(mockCar);
    });
  });
});
