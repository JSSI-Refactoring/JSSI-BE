import { KakaoTokensParam } from '@auth/dto/param/kakaoTokens.param';
import { KakaoLoginRequestDto } from '@auth/dto/request/kakao-login.req.dto';
import { Injectable } from '@nestjs/common';
import * as querystring from 'querystring';
import axios from 'axios';
import { RequestUserInfoToKaKao } from '@auth/interfaces/kakao-login.interface';

@Injectable()
export class KakaoProvider {
  /** 카카오 토큰 요청 */
  async requestTokensToKakao(kakaoLoginRequestDto: KakaoLoginRequestDto): Promise<{ kakaoTokens: KakaoTokensParam }> {
    const urlToRequest = 'https://kauth.kakao.com/oauth/token';
    const headers = {
      'Content-type': `application/x-www-form-urlencoded;charset=utf-8`,
    };
    const body = querystring.stringify({
      // header의 해당 Content-Type으로 인해
      grant_type: 'authorization_code',
      client_id: kakaoLoginRequestDto.apiKey,
      redirect_uri: kakaoLoginRequestDto.redirectUri,
      code: kakaoLoginRequestDto.code,
    });

    const response = await axios.post(urlToRequest, body, { headers });
    const kakaoTokens: KakaoTokensParam = {
      refreshToken: response.data.refresh_token,
      accessToken: response.data.access_token,
    };

    return { kakaoTokens };
  }

  /** 카카오 회원 정보 요청 */
  async requestUserInfoToKakao(kakaoTokens): Promise<RequestUserInfoToKaKao> {
    const getUserInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${kakaoTokens.accessToken}` },
    });
    const userInfo = getUserInfo.data; // 발급한 토큰 정보

    return { userInfo };
  }
}
