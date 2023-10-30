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

    // 2-5. 신규 회원 유무 판단
    const checkThisUser = await this.userRepository.findOne({ where: { socialId } });
    const isNewUser = !checkThisUser; // checkThisUser가 없으면 true, 있으면 false
    console.log(`isNewUser? ${isNewUser}`);

    // 2-6. 페이로드 값 세팅(추가)
    const userPayload = {
      id: isNewUser ? null : checkThisUser.id,
      nickname: isNewUser ? nickname : checkThisUser.nickname,
      profileImage: isNewUser ? profileImage : checkThisUser.profileImage,
    };

    // 2-7. 신규 회원일 경우 create(추가)
    if (isNewUser) {
      const createUser = await this.userRepository.save({ socialId, socialType: 'KAKAO', ...userPayload });
      userPayload.id = createUser.id;
    }

    // 2-8. 기존 회원일 경우 서버에서 로그인 세션 또는 토큰 발급
    return { token: await this.jwtService.signAsync(userPayload) };
  }
}
