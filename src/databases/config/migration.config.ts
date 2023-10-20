import { DataSource } from 'typeorm';
import { PROJECT_SRC_ROOT, ormConfig } from './orm.config';

const migrationDataSource = new DataSource({
  ...ormConfig,
  migrationsTableName: 'migrations',
  migrations: [`${PROJECT_SRC_ROOT}/databases/migrations/*.ts`],
});

export default migrationDataSource;
