import { Module, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalEntity } from '@entities/goal.entity';
import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/user.entity';
import { VideoEntity } from '@entities/video.entity';
import { CommentEntity } from '@entities/comment.entity';
import { CommonPkEntity } from '@entities/common/common.entity';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {
    this.configService.get<string>('DB_HOST');
    this.configService.get<number>('DB_PORT');
    this.configService.get<string>('DB_USERNAME');
    this.configService.get<string>('DB_PASSWORD');
    this.configService.get<string>('DB_DATABASE');
  }

  // TypeOrmModule.forRootAsync()와 useFactory를 사용하여 module로 분리 가능
  dbConfig = TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
      CommonPkEntity,
      UserEntity,
      GoalEntity,
      VideoEntity,
      PostEntity,
      CommentEntity,
    ],
    // entities: ['src/**/*.entity{.ts,.js}'], // 엔티티 클래스의 경로
    synchronize: true,
  });
}
