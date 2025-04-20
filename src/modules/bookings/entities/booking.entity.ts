import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'car_id' })
  carId: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'total_price', type: 'float' })
  totalPrice: number;

  @Column({
    name: 'average_price_per_day',
    type: 'float',
  })
  averagePricePerDay: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Car, (car) => car.bookings)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
