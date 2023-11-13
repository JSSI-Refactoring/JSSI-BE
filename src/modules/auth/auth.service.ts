import { Injectable } from '@nestjs/common';
import { AuthDAO } from './dao/auth.dao';
import { ConfigService } from '@nestjs/config';
import * as querystring from 'querystring';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

type UserInfo = {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
    };
  };
};

type RequestUserInfoToKaKao = {
  isNewUser: boolean;
  data?: object;
  userInfo?: UserInfo;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly authDAO: AuthDAO,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogin(apiKey: string, redirectUri: string, code: string) {
    const requestTokensToKakao = await this.requestTokensToKakao(apiKey, redirectUri, code);
    const { kakaoTokens } = requestTokensToKakao;

    const requestUserInfoToKakao = await this.requestUserInfoToKakao(kakaoTokens);
    const { isNewUser } = requestUserInfoToKakao;

    // 신규 회원일 때
    // 회원 등록
    let result = {};
    if (isNewUser) {
      const { userInfo } = requestUserInfoToKakao;
      const createUser = await this.authDAO.createUser(userInfo, kakaoTokens);

      const accessPayload = {
        id: createUser.id,
        nickname: userInfo.properties.nickname,
        profileImage: userInfo.properties.profile_image,
      };

      const hashIndex = await this.hashUserIdForRefreshToken(createUser.id);
      const refreshPayload = {
        hash: hashIndex,
      };

      // prettier-ignore
      const [refreshToken, accessToken] = [ this.generateRefreshToken(refreshPayload), this.generateAccessToken(accessPayload) ];
      const updateAppTokenOfUser = await this.authDAO.updateAppTokensOfUser(createUser.id, refreshToken, accessToken);

      return { refreshToken, accessToken };
    }

    const { data } = requestUserInfoToKakao;
    console.log(data);
    // 기존 회원일 때
    // 액세스 토큰 유효기간 확인

    // 유효기간 만료: 새로운 액세스 토큰 발급
    // 유효기간 만료X: 해당 액세스 토큰 반환
  }

  /** 카카오 토큰 요청 */
  async requestTokensToKakao(apiKey: string, redirectUri: string, code: string) {
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
    const kakaoTokens = { refreshToken: response.data.refresh_token, accessToken: response.data.access_token };

    return { kakaoTokens };
  }

  /** 카카오 회원 정보 요청 */
  async requestUserInfoToKakao(kakaoTokens): Promise<RequestUserInfoToKaKao> {
    const getUserInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${kakaoTokens.accessToken}` },
    });
    const userInfo = getUserInfo.data; // 발급한 토큰 정보
    const socialId = userInfo.id;

    const selectOneUserBySocialId = await this.authDAO.selectOneUserBySocialId(socialId);

    let result: RequestUserInfoToKaKao = undefined;
    if (!selectOneUserBySocialId.data) result = { isNewUser: selectOneUserBySocialId.isNewUser, userInfo };
    else result = { isNewUser: selectOneUserBySocialId.isNewUser, data: selectOneUserBySocialId.data };

    return result;
  }

  // 추후에 jwt provider로 분리
  /** 리프레쉬 토큰 발급 */
  private generateRefreshToken(payload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }

  private decodeRefreshToken(refreshToekn) {
    return this.jwtService.verify(refreshToekn, { secret: this.configService.get('JWT_REFRESH_SECRET') });
  }

  /** 액세스 토큰 발급 */
  private generateAccessToken(payload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });
  }

  private decodeAccessToken(accessToken) {
    return this.jwtService.verify(accessToken, { secret: this.configService.get('JWT_ACCESS_SECRET') });
  }

  /** 리프레쉬 토큰 인덱스 암호화 */
  private async hashUserIdForRefreshToken(id) {
    const result = await bcrypt.hash(id.toString(), 10);
    return result;
  }
}
