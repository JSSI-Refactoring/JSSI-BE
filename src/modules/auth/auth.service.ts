import { Injectable } from '@nestjs/common';
import { AuthDAO } from './models/auth.dao';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly authDAO: AuthDAO,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async kakaoRedirect(code: string) {
    
  }
}
