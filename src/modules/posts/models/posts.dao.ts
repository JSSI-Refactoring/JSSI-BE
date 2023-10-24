import { PostEntity } from '@entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class PostsDAO {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async findAll() {
    console.log(this);
    const result = await this.postsRepository.find();
    console.log(result);
    return result;
  }
}
