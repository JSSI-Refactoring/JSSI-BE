import { Injectable } from '@nestjs/common';
import { AuthDAO } from './models/auth.dao';
import { ConfigService } from '@nestjs/config';
import * as querystring from 'querystring';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authDAO: AuthDAO,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogin(apiKey, redirectUri, code) {
    const requestTokensToKakao = await this.requestTokensToKakao(apiKey, redirectUri, code);
    const kakaoTokens = requestTokensToKakao.data;

    const requestUserInfoToKakao = await this.requestUserInfoToKakao(kakaoTokens);
    const { isNewUser, userInfo } = requestUserInfoToKakao;

    // 신규 회원일 때
    // 회원 등록
    let result = {};
    if (isNewUser) {
      const createUser = await this.authDAO.createUser(userInfo, kakaoTokens);

      const accessPayload = {
        id: createUser.data.id,
        nickname: userInfo.properties.nickname,
        profileImage: userInfo.properties.profile_image,
      };

      const hashIndex = await this.hashUserIdForRefreshToken(createUser.data.id);
      const refreshPayload = {
        hash: hashIndex,
      };

      const [refreshToken, accessToken] = [
        this.generateRefreshToken(refreshPayload),
        this.generateAccessToken(accessPayload),
      ];

      const updateAppTokenOfUser = await this.authDAO.updateAppTokensOfUser(
        createUser.data.id,
        refreshToken,
        accessToken,
      );

      result = { data: { refreshToken, accessToken } };
      return result;
    } else {
      console.log('here');
    }

    // 기존 회원일 때
    // 액세스 토큰 유효기간 확인
    // 유효기간 만료: 새로운 액세스 토큰 발급
    // 유효기간 만료X: 해당 액세스 토큰 반환
  }

  /** 카카오 토큰 요청 */
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

    const response = await axios.post(urlToRequest, body, { headers });
    const kakaoTokens = { accessToken: response.data.access_token, refreshToken: response.data.refresh_token };
    const result = { data: kakaoTokens };

    return result;
  }

  /** 카카오 회원 정보 요청 */
  async requestUserInfoToKakao(kakaoTokens) {
    const getUserInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${kakaoTokens.accessToken}` },
    });
    const userInfo = getUserInfo.data; // 발급한 토큰 정보
    const socialId = userInfo.id;

    const isNewUser = await this.authDAO.selectOneUserBySocialId(socialId);
    const result = { isNewUser, userInfo };

    return result;
  }

  /** 리프레쉬 토큰 발급 */
  private generateRefreshToken(payload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }

  /** 액세스 토큰 발급 */
  private generateAccessToken(payload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });
  }

  /** 리프레쉬 토큰 인덱스 암호화 */
  private async hashUserIdForRefreshToken(id) {
    const result = await bcrypt.hash(id.toString(), 10);
    return result;
  }
}
