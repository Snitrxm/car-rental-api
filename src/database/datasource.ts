import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5438,
  username: 'postgres',
  password: 'postgres',
  database: 'car_rental',
  entities: ['dist/**/modules/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/database/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
