import { Injectable } from '@nestjs/common';
import { AuthDAO } from './dao/auth.dao';
import { ConfigService } from '@nestjs/config';
import * as querystring from 'querystring';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { KakaoLoginRequestDto } from './dto/request/kakao-login.req.dto';
import { KakaoTokensParam } from './dto/param/kakaoTokens.param';
import { JwtProvider } from 'src/providers/jwt/jwt.provider';
import { FindOneUserInfo, RequestUserInfoToKaKao } from 'src/interfaces/auth/kakao-login.interface';

@Injectable()
export class AuthService {
  constructor(private readonly authDAO: AuthDAO, private readonly jwtProvider: JwtProvider) {}

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
        this.jwtProvider.generateRefreshToken(refreshPayload),
        this.jwtProvider.generateAccessToken(accessPayload),
      ];
      await this.authDAO.updateAppTokensOfUser(createUser.id, refreshToken, accessToken);

      return { refreshToken, accessToken };
    }

    // 기존 회원일 때
    const data = requestUserInfoToKakao.data as FindOneUserInfo;
    const { id, nickname, profileImage, refreshToken, accessToken } = data;
    const decodeAccessToken: boolean = await this.jwtProvider.decodeAccessToken(accessToken);

    if (decodeAccessToken === false) {
      const reAccessToken = await this.jwtProvider.regenerateAndUpdateAccessToken(id, nickname, profileImage);
      await this.authDAO.updateAppAccessTokenOfUser(id, reAccessToken);

      return { refreshToken, accessToken: reAccessToken };
    }
    return { refreshToken, accessToken };
  }

  /** 카카오 토큰 요청 */
  private async requestTokensToKakao(
    kakaoLoginRequestDto: KakaoLoginRequestDto,
  ): Promise<{ kakaoTokens: KakaoTokensParam }> {
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
  private async requestUserInfoToKakao(kakaoTokens): Promise<RequestUserInfoToKaKao> {
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

  /** 리프레쉬 토큰 인덱스 암호화 */
  private async hashUserIdForRefreshToken(id) {
    const result = await bcrypt.hash(id.toString(), 10);
    return result;
  }
}
