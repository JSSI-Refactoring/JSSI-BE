import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthDAO } from './models/auth.dao';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule.register({ timeout: 5000, maxRedirects: 20 })],
  controllers: [AuthController],
  providers: [AuthService, AuthDAO],
})
export class AuthModule {}
