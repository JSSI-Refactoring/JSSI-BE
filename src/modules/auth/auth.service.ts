import { Injectable } from '@nestjs/common';
import { AuthDAO } from './dao/auth.dao';
import * as bcrypt from 'bcrypt';
import { KakaoLoginRequestDto } from './dto/request/kakao-login.req.dto';
import { JwtProvider } from 'src/providers/jwt/jwt.provider';
import { SelectOneUser } from 'src/interfaces/auth/kakao-login.interface';
import { KakaoProvider } from 'src/providers/kakao/kakao.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly authDAO: AuthDAO,
    private readonly jwtProvider: JwtProvider,
    private readonly kakaoProvider: KakaoProvider,
  ) {}

  async kakaoLogin(kakaoLoginRequestDto: KakaoLoginRequestDto) {
    const requestTokensToKakao = await this.kakaoProvider.requestTokensToKakao(kakaoLoginRequestDto);
    const { kakaoTokens } = requestTokensToKakao;

    const requestUserInfoToKakao = await this.kakaoProvider.requestUserInfoToKakao(kakaoTokens);
    const { userInfo } = requestUserInfoToKakao;
    const socialId = userInfo.id;

    const selectOneUserBySocialId = await this.authDAO.selectOneUserBySocialId(socialId);
    const isNewUser = !selectOneUserBySocialId ? true : false;

    let result = undefined;
    if (!selectOneUserBySocialId) result = { isNewUser, userInfo };
    else result = { isNewUser, data: selectOneUserBySocialId };

    /* 신규 회원일 때: 회원 등록 */
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
        await this.jwtProvider.generateRefreshToken(refreshPayload),
        await this.jwtProvider.generateAccessToken(accessPayload),
      ];
      await this.authDAO.updateAppTokensOfUser(createUser.id, refreshToken, accessToken);

      return { refreshToken, accessToken };
    }

    /* 기존 회원일 때 */
    const data = selectOneUserBySocialId as SelectOneUser;
    const { id, nickname, profileImage, refreshToken, accessToken } = data;
    const decodeAccessToken: boolean = await this.jwtProvider.decodeAccessToken(accessToken);

    if (decodeAccessToken === false) {
      const reAccessToken = await this.jwtProvider.regenerateAndUpdateAccessToken(id, nickname, profileImage);
      await this.authDAO.updateAppAccessTokenOfUser(id, reAccessToken);

      return { refreshToken, accessToken: reAccessToken };
    }
    return { refreshToken, accessToken };
  }

  /** 리프레쉬 토큰 인덱스 암호화 */
  private async hashUserIdForRefreshToken(id) {
    const result = await bcrypt.hash(id.toString(), 10);
    return result;
  }
}
