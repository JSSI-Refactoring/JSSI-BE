import { Injectable } from '@nestjs/common';
import { AuthDAO } from './models/auth.dao';
import { ConfigService } from '@nestjs/config';
import * as querystring from 'querystring';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private readonly authDAO: AuthDAO, private readonly configService: ConfigService) {}

  async requestTokensToKakao(apiKey, redirectUri, code) {
    const urlToRequest = 'https://kauth.kakao.com/oauth/token';
    const headers = {
      'Content-type': `application/x-www-form-urlencoded;charset=utf-8`,
    };
    const body = querystring.stringify({
      // header의 해당 Content-Type으로 인해
      grant_type: 'authorization_code',
      client_id: apiKey,
      redirect_uri: redirectUri,
      code,
    });

    // 토큰 발급 요청
    const response = await axios.post(urlToRequest, body, { headers });
    // 토큰 발급 성공
    const tokens = { accessToken: response.data.access_token, refreshToken: response.data.refresh_token };

    // 발급받은 토큰으로 카카오 회원 정보 요청
    const getUserInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    const userInfo = getUserInfo.data;

    return await this.authDAO.kakaoSignIn(tokens, userInfo);
  }
}
