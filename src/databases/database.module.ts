import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// ConfigModule: 환경변수, 외부 설정 파일을 읽어주게 함
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigService 주입을 위해 임포트
      // useFactory: type은 직접 mysql, postgresql 등 명시해주어야 함
      // useFactory: async (configService: ConfigService)=> { return {} } 일 때 type도 환경 변수로 설정 가능
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DATABASE'),
        // https://stackoverflow.com/questions/62879810/entitymetadatanotfound-no-metadata-for-task-was-found-nestjs
        entities: [`dist/**/**/*.entity{.ts,.js}`],
        /** EntityMetadataNotFoundError: No metadata for X was found */
        //  entities: [__dirname + '/**/*.entity{.ts,.js}'],
        //  autoLoadEntities: true
        logging: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
