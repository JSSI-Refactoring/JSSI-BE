import { Module, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('DB_HOST');
    const port = this.configService.get<number>('DB_PORT');
    const username = this.configService.get<string>('DB_USERNAME');
    const password = this.configService.get<string>('DB_PASSWORD');
    const title = this.configService.get<string>('DB_DATABASE');
  }

  // TypeOrmModule.forRootAsync()와 useFactory를 사용하여 module로 분리 가능
  dbConfig = TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [],
    synchronize: true,
  });
}
