import { Controller, Post, Get, Query, Res, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CommonResponseDto } from 'src/common/dto/reponse.dto';
import { KakaoLoginResponseDto } from './dto/response/kakao-login.dto';

/** https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type */
type KakaoLogin = {
  data?: {
    refreshToken: string;
    accessToken: string;
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  apiKey = this.configService.get('KAKAO_REST_API_KEY');
  redirectUri = this.configService.get('KAKAO_REDIRECT_URI');

  @Get('/kakao')
  async getAuthrization(@Res() res) {
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${this.apiKey}&redirect_uri=${this.redirectUri}&response_type=code`;
    return res.redirect(302, url); // 1-1. 인가코드 발급을 위해 redirect_uri로 리다이렉트
  }

  // 프론트에서 발급 받은 인가코드로 카카오에 토큰 발급 요청
  @Get('/kakaoLogin')
  // @Post('/kakaoLogin')
  async kakaoLogin(
    @Query() query,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommonResponseDto<KakaoLoginResponseDto>> {
    try {
      const { code } = query;
      const apiKey = this.apiKey;
      const redirectUri = this.redirectUri;

      const kakaoLogin: KakaoLogin = await this.authService.kakaoLogin(apiKey, redirectUri, code);

      // 응답 형식에 맞게 지정
      const kakaoResponse: KakaoLoginResponseDto = new KakaoLoginResponseDto();
      kakaoResponse.accessToken = kakaoLogin.data.accessToken;

      res.setHeader('Authorization', `Bearer ${kakaoLogin.data.refreshToken}`);
      res.cookie('refresh_token', kakaoLogin.data.refreshToken, {
        httpOnly: true,
        // maxAge: 24 * 60 * 60 * 1000 쿠키 유효 기간(하루)
      });

      return {
        status: true,
        statusCode: 200,
        message: '카카오 토큰 발급 성공',
        result: kakaoResponse,
      };
    } catch (err) {
      // console.log(err);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
