import { User } from '@entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class AuthDAO {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async selectOneUserBySocialId(socialId) {
    const selectOneUserBySocialId = await this.userRepository.findOne({ where: { socialId } });
    const isNewUser = !selectOneUserBySocialId ? true : false;

    return { data: selectOneUserBySocialId, isNewUser };
  }

  async createUser(userInfo, kakaoTokens) {
    const createUser = await this.userRepository.save({
      socialId: userInfo.id,
      socialType: 'KAKAO',
      nickname: userInfo.properties.nickname,
      profileImage: userInfo.properties.profile_image,
      OAuthRefreshToken: kakaoTokens.refreshToken,
      OAuthAccessToken: kakaoTokens.accessToken,
    });

    const { id } = createUser;

    return { id };
  }

  async updateAppTokensOfUser(id, refreshToken, accessToken) {
    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        refreshToken,
        accessToken,
      })
      .where(id)
      .execute();
  }

  // async kakaoSignIn(kakaoTokens, userInfo) {
  //   const socialId = userInfo.id;
  //   const { nickname } = userInfo.properties;
  //   const profileImage = userInfo.properties.profile_image;
  //   const [kakaoRefreshToken, kakaoAccessToken] = [kakaoTokens.access_token, kakaoTokens.refresh_token];

  //   // 신규 회원 유무 판단
  //   const checkThisUser = await this.userRepository.findOne({ where: { socialId } });
  //   const isNewUser = !checkThisUser; // checkThisUser가 없으면 true, 있으면 false

  //   let result = '';
  //   // 이미 존재하는 회원이면
  //   // 유저의 액세스 토큰 만료 기간 확인
  //   if (!isNewUser) {
  //     // DB에서 액세스 토큰 찾기
  //     // 액세스 토큰의 만료시간 확인
  //     // 만료시간이 안 지났으면 해당 토큰과 리프레쉬 토큰 반환하기
  //     // 만료시간이 지났으면 새로 액세스 토큰 만들어서 프레쉬 토큰 반환하기
  //   } else {
  //     // 액세스 토큰 페이로드 값 세팅(추가)
  //     const userPayload = {
  //       id: isNewUser ? null : checkThisUser.id,
  //       nickname: isNewUser ? nickname : checkThisUser.nickname,
  //       profileImage: isNewUser ? profileImage : checkThisUser.profileImage,
  //     };

  //     // 리프레쉬 토큰
  //     const refreshToken = this.generateRefreshToken(userPayload);
  //     const accessToken = this.generateAccessToken(userPayload);

  //     // 신규 회원일 경우 create(추가)
  //     // DB에 토큰 저장
  //     const createUser = await this.userRepository.save({
  //       socialId,
  //       socialType: 'KAKAO',
  //       OAuthRefreshToken: kakaoRefreshToken,
  //       OAuthAccessToken: kakaoAccessToken,
  //       AppRefreshToken: refreshToken,
  //       AppAccessToken: accessToken,
  //       ...userPayload,
  //     });
  //     userPayload.id = createUser.id;

  //     result = { refreshToken, accessToken };
  //     return result;
  //   }

  //   // 원래 기존에 가입한 회원이어도 리프레쉬 토큰이 풀려서 다시 로그인하게 된다면 리프레쉬 토큰을 재발급한다.
  //   return {
  //     refreshToken: result.refreshToken,
  //     accessToken: result.accessToken,
  //   };
  // }
}
