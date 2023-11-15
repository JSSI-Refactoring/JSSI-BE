import { Injectable } from '@nestjs/common';
import { AuthDAO } from './dao/auth.dao';
import { ConfigService } from '@nestjs/config';
import * as querystring from 'querystring';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { KakaoLoginRequestDto } from './dto/request/kakao-login.dto';
import { KakaoTokensParam } from './dto/param/kakaoTokens.param';

interface UserInfo {
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
}

interface RequestUserInfoToKaKao {
  isNewUser: boolean;
  data?: object;
  userInfo?: UserInfo;
}

interface FindOneUserInfo {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: null | Date;
  socialId: string;
  socialType: 'KAKAO' | string;
  nickname: string;
  profileImage: string;
  OAuthRefreshToken: string;
  OAuthAccessToken: string;
  refreshToken: string;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authDAO: AuthDAO,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogin(kakaoLoginRequestDto: KakaoLoginRequestDto) {
    const requestTokensToKakao = await this.requestTokensToKakao(kakaoLoginRequestDto);
    const { kakaoTokens } = requestTokensToKakao;

    const requestUserInfoToKakao = await this.requestUserInfoToKakao(kakaoTokens);
    const { isNewUser } = requestUserInfoToKakao;

    // 신규 회원일 때
    // 회원 등록
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

      const [refreshToken, accessToken] = [
        this.generateRefreshToken(refreshPayload),
        this.generateAccessToken(accessPayload),
      ];
      await this.authDAO.updateAppTokensOfUser(createUser.id, refreshToken, accessToken);

      return { refreshToken, accessToken };
    }

    // 기존 회원일 때
    const data = requestUserInfoToKakao.data as FindOneUserInfo;
    const { id, nickname, profileImage, refreshToken, accessToken } = data;
    const decodeAccessToken: boolean = await this.decodeAccessToken(accessToken);

    if (decodeAccessToken === false) {
      const reAccessToken = await this.regenerateAndUpdateAccessToken(id, nickname, profileImage);
      return { refreshToken, accessToken: reAccessToken };
    }
    return { refreshToken, accessToken };
  }

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
    const socialId = userInfo.id;

    const selectOneUserBySocialId = await this.authDAO.selectOneUserBySocialId(socialId);

    let result: RequestUserInfoToKaKao = undefined;
    if (!selectOneUserBySocialId.data) result = { isNewUser: selectOneUserBySocialId.isNewUser, userInfo };
    else result = { isNewUser: selectOneUserBySocialId.isNewUser, data: selectOneUserBySocialId.data };

    return result;
  }

  // 추후에 jwt provider로 분리
  /** 리프레쉬 토큰 발급 */
  private async generateRefreshToken(payload) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }

  private async decodeRefreshToken(refreshToken: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return decodedToken;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return false;
      } else {
        throw err;
      }
    }
  }

  /** 액세스 토큰 발급 */
  private async generateAccessToken(payload) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });
  }

  private async decodeAccessToken(accessToken: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      return decodedToken; // 토큰이 유효하면 payload를 반환
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return false; // 토큰이 만료되었을 경우 false 반환
      } else {
        throw err; // 다른 JWT 오류에 대해서는 예외를 다시 던짐
      }
    }
  }

  /** 리프레쉬 토큰 인덱스 암호화 */
  private async hashUserIdForRefreshToken(id) {
    const result = await bcrypt.hash(id.toString(), 10);
    return result;
  }

  private async regenerateAndUpdateAccessToken(id, nickname, profileImage): Promise<string> {
    const accessPayload = {
      id: id,
      nickname: nickname,
      profileImage: profileImage,
    };
    const reAccessToken = this.generateAccessToken(accessPayload);
    await this.authDAO.updateAppAccessTokenOfUser(id, reAccessToken);

    return reAccessToken;
  }
}
