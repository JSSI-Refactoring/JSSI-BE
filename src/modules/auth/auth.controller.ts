import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';
import { AxiosResponse } from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  apiKey = this.configService.get('KAKAO_REST_API_KEY');
  redirectUri = this.configService.get('KAKAO_REDIRECT_URI');

  // 1. 카카오 로그인 인가코드 발급
  @Get('/kakao')
  async kakaoLogin(@Res() res) {
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${this.apiKey}&redirect_uri=${this.redirectUri}&response_type=code`;
    return res.redirect(302, url); // 1-1. 인가코드 발급을 위해 redirect_uri로 리다이렉트
  }

  // 2. 1-1에 리다이렉트 후 발급된 인가코드로 카카오에 토큰 발급 요청
  @Get('/redirect')
  async kakaoRedirect(@Query() query) {
    const { code } = query;
    const apiKey = this.apiKey;
    const redirectUri = this.redirectUri;

    // 2-1. 카카오에 토큰 발급 요청 받으러 가는 중
    return await this.authService.requestAccessTokenToKakao(apiKey, redirectUri, code);
  }
}
