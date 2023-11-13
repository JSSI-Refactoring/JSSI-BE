import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonPk } from '@entities/common/common.entity';
import { User } from '@entities/user.entity';
import { Post } from '@entities/post.entity';
// import { Post } from './post.entity';

@Entity({ name: 'comment', schema: 'jssi' })
export class Comment extends CommonPk {
  @Column('int', { unique: false, nullable: false })
  userId: number;

  @Column('int', { unique: false, nullable: false })
  postId: number;

  @Column('varchar', { unique: false, nullable: true })
  comment: string;

  // user: 다대일
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  // post: 다대일
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: Post;
}
