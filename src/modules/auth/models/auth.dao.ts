import { User } from '@entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class AuthDAO {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async kakaoLogin() {
    return await this.userRepository.find();
  }
}
