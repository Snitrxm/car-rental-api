import { Car } from 'src/modules/cars/entities/car.entity';
import { getSeasonForDate } from './getSeassonForDate';

export const calculateTotalPrice = (
  start: Date,
  end: Date,
  car: Car,
): number => {
  let total = 0;
  const current = new Date(start);

  while (current <= end) {
    const season = getSeasonForDate(current);
    switch (season) {
      case 'peak':
        total += car.peakSeasonPricePerDay;
        break;
      case 'mid':
        total += car.midSeasonPricePerDay;
        break;
      case 'off':
        total += car.offSeasonPricePerDay;
        break;
    }
    current.setDate(current.getDate() + 1);
  }

  return total;
};
