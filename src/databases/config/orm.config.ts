import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

export const PROJECT_SRC_ROOT = `${__dirname}/../..`;

dotenv.config({ path: `${PROJECT_SRC_ROOT}/../.env.dev` });

export const ormConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  logging: true,
  synchronize: true,
};
