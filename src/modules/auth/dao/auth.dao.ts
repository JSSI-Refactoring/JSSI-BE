import { User } from '@entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectOneUser } from 'src/interfaces/auth/kakao-login.interface';
import { Repository } from 'typeorm';

export class AuthDAO {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async selectOneUserBySocialId(socialId): Promise<SelectOneUser> {
    return await this.userRepository.findOne({ where: { socialId } });
  }

  async createUser(userInfo, kakaoTokens) {
    const createUser = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          socialId: userInfo.id,
          socialType: 'KAKAO',
          nickname: userInfo.properties.nickname,
          profileImage: userInfo.properties.profile_image,
          OAuthRefreshToken: kakaoTokens.refreshToken,
          OAuthAccessToken: kakaoTokens.accessToken,
        },
      ])
      .execute();

    const id = createUser.raw.insertId;
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

  async updateAppAccessTokenOfUser(id, accessToken) {
    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        accessToken,
      })
      .where(id)
      .execute();
  }
}
