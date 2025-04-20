import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/datasource';
import { CarsModule } from './modules/cars/cars.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    CarsModule,
    BookingsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
