import { UserEntity } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityRepository, Repository } from 'typeorm';

@EntityRepository(AuthRepository)
export class AuthRepository extends Repository<UserEntity> {
  async kakaoLogin() {
    // const test = await this.find();
    // console.log(test);
    return 'hi';
  }
}
