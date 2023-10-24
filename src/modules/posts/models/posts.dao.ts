import { Post } from '@entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class PostsDAO {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async findAll() {
    console.log(this);
    const result = await this.postsRepository.find();
    console.log(result);
    return result;
  }
}
