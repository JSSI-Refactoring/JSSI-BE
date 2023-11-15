import { Controller, Post, Get, Query, Res, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CommonResponseDto } from 'src/common/dto/reponse.dto';
import { KakaoLoginResponseDto } from './dto/response/kakao-login.res.dto';
import { KakaoLoginRequestDto } from './dto/request/kakao-login.req.dto';
import { KakaoLogin } from 'src/interfaces/auth/kakao-login.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  apiKey = this.configService.get('KAKAO_REST_API_KEY');
  redirectUri = this.configService.get('KAKAO_REDIRECT_URI');

  // 프론트에서 발급 받은 인가코드로 카카오에 토큰 발급 요청
  @Post('/kakaoLogin')
  async kakaoLogin(
    @Query() query,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommonResponseDto<KakaoLoginResponseDto>> {
    try {
      const { code }: { code: string } = query;

      const kakaoLoginRequestDto: KakaoLoginRequestDto = new KakaoLoginRequestDto();
      kakaoLoginRequestDto.apiKey = this.apiKey;
      kakaoLoginRequestDto.redirectUri = this.redirectUri;
      kakaoLoginRequestDto.code = code;

      const kakaoLogin: KakaoLogin = await this.authService.kakaoLogin(kakaoLoginRequestDto);

      const kakaoResponse: KakaoLoginResponseDto = new KakaoLoginResponseDto();
      kakaoResponse.accessToken = kakaoLogin.accessToken;

      res.setHeader('Authorization', `Bearer ${kakaoLogin.refreshToken}`);
      res.cookie('refresh_token', kakaoLogin.refreshToken, {
        httpOnly: true,
        // maxAge: 24 * 60 * 60 * 1000 쿠키 유효 기간(하루)
      });

      return {
        status: true,
        statusCode: 201,
        message: '카카오 로그인 성공',
        result: kakaoResponse,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
