import { Controller, Post, Get, Query, Res, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CommonResponseDto } from 'src/common/dto/reponse.dto';
import { KakaoLoginResponseDto } from './dto/response/kakao-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  apiKey = this.configService.get('KAKAO_REST_API_KEY');
  redirectUri = this.configService.get('KAKAO_REDIRECT_URI');

  // 프론트에서 발급 받은 인가코드로 카카오에 토큰 발급 요청
  @Post('/kakaoLogin')
  async kakaoLogin(@Query() query): Promise<CommonResponseDto<KakaoLoginResponseDto>> {
    try {
      const { code } = query;
      const apiKey = this.apiKey;
      const redirectUri = this.redirectUri;

      // 카카오에 토큰 발급 요청
      const myToken = await this.authService.requestTokensToKakao(apiKey, redirectUri, code);
      const { token } = myToken;

      // 응답 형식에 맞게 지정
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
