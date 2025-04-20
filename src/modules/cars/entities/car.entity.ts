import { Booking } from 'src/modules/bookings/entities/booking.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  stock: number;

  @Column({ name: 'peak_season_price_per_day', type: 'float' })
  peakSeasonPricePerDay: number;

  @Column({ name: 'mid_season_price_per_day', type: 'float' })
  midSeasonPricePerDay: number;

  @Column({ name: 'off_season_price_per_day', type: 'float' })
  offSeasonPricePerDay: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Booking, (booking) => booking.car)
  bookings: Booking[];

  public decreaseInStock() {
    this.stock -= 1;
  }
}
