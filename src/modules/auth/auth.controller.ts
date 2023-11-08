import { Controller, Get, Query, Res, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import axios from 'axios';
import { CommonResponseDto } from 'src/common/dto/reponse.dto';
import { KakaoLoginResponseDto } from './dto/response/kakao-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  apiKey = this.configService.get('KAKAO_REST_API_KEY');
  redirectUri = this.configService.get('KAKAO_REDIRECT_URI');

  // 1. 카카오 로그인 인가코드 발급
  // @Get('/kakao')
  // async kakaoLogin(@Res() res) {
  //   try {
  //     const url = `https://kauth.kakao.com/oauth/authorize?client_id=${this.apiKey}&redirect_uri=${this.redirectUri}&response_type=code`;
  //     return res.redirect(302, url); // 1-1. 인가코드 발급을 위해 redirect_uri로 리다이렉트
  //   } catch (err) {
  //     console.log(err);
  //     throw new InternalServerErrorException('Internal server error');
  //   }
  // }

  // 2. 1-1에 리다이렉트 후 발급된 인가코드로 카카오에 토큰 발급 요청
  @Get('/kakaoLogin')
  async redirectKakaoToGetAccessToken(
    @Query() query,
    @Res() res: Response,
  ): Promise<CommonResponseDto<KakaoLoginResponseDto>> {
    try {
      const { code } = query;
      const apiKey = this.apiKey;
      const redirectUri = this.redirectUri;

      // 2-1. 카카오에 토큰 발급 요청 받으러 가는 중
      const myToken = await this.authService.requestAccessTokenToKakao(apiKey, redirectUri, code);
      const { token } = myToken;
      console.log(`1, ${token}`);

      const kakaoResponse: KakaoLoginResponseDto = new KakaoLoginResponseDto();
      kakaoResponse.token = token;

      return {
        status: true,
        statusCode: 200,
        message: '카카오 토큰 발급 성공',
        result: kakaoResponse,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
