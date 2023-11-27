import { User } from '@entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectOneUser, UserInfo } from '@auth/interfaces/kakao-login.interface';
import { Repository } from 'typeorm';

export class AuthDAO {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async selectOneUserBySocialId(socialId: number): Promise<SelectOneUser> {
    try {
      return await this.userRepository.findOne({ where: { socialId } });
    } catch (err) {
      console.log(err);
      throw new Error('Database Error');
    }
  }

  async createUser(userInfo: UserInfo, kakaoTokens) {
    try {
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
    } catch (err) {
      console.log(err);
      throw new Error('Database Error');
    }
  }

  async updateAppTokensOfUser(id, refreshToken, accessToken, hashIdx) {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          refreshToken,
          accessToken,
          hashIdx,
        })
        .where('id = :id', { id })
        .execute();
    } catch (err) {
      console.log(err);
      throw new Error('Database Error');
    }
  }

  async updateAppAccessTokenOfUser(id, accessToken) {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          accessToken,
        })
        .where(id)
        .execute();
    } catch (err) {
      console.log(err);
      throw new Error('Database Error');
    }
  }
}
