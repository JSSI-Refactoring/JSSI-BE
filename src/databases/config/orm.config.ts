import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

export const PROJECT_SRC_ROOT = `${__dirname}/../..`;

dotenv.config({ path: `${PROJECT_SRC_ROOT}/../.env.dev` });

export const ormConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  logging: true,
  synchronize: true,
};
