import { User } from '@entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class AuthDAO {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoSignIn(tokens, userInfo) {
    const socialId = userInfo.id;
    const { nickname } = userInfo.properties;
    const profileImage = userInfo.properties.profile_image;

    // 2-5. 신규 회원일 경우 회원가입
    const checkThisUser = await this.userRepository.findOne({ where: { socialId } });
    if (!checkThisUser) {
      await this.userRepository.save({ socialId, socialType: 'KAKAO', nickname, profileImage });
    }

    const payload = {
      id: checkThisUser.id,
      nickname: checkThisUser.nickname,
      profileImage: checkThisUser.profileImage,
    };

    // 2-6. 기존 회원일 경우 서버에서 로그인 세션 또는 토큰 발급
    return { token: await this.jwtService.signAsync(payload) };
  }
}
