import { Injectable } from '@nestjs/common';
import { AuthDAO } from './models/auth.dao';
import { ConfigService } from '@nestjs/config';
import * as querystring from 'querystring';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private readonly authDAO: AuthDAO, private readonly configService: ConfigService) {}

  // 2-2. 카카오 토큰 발급 요청 Service
  async requestAccessTokenToKakao(apiKey, redirectUri, code) {
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

    // 2-3. 토큰 발급 성공
    const response = await axios.post(urlToRequest, body, { headers });
  }
}
