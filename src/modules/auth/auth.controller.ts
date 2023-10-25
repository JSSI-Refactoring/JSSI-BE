import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Get('/kakao')
  async kakaoLogin(@Res() res) {
    res.redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${this.configService.get(
        'KAKAO_REST_API_KEY',
      )}&redirect_uri=${this.configService.get('KAKAO_REDIRECT_URI')}&response_type=code`,
    );
  }

  @Get('/redirect')
  // @Header('content-type', 'application/x-www-form-urlencoded')
  async kakaoRedirect(@Query() code: string) {
    return await this.authService.kakaoRedirect(code);
  }
}
