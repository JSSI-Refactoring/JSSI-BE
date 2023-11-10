import { Column, Entity, OneToMany } from 'typeorm';
import { CommonPk } from '@entities/common/common.entity';
import { Goal } from '@entities/goal.entity';
import { Post } from '@entities/post.entity';
import { Comment } from '@entities/comment.entity';

@Entity('User')
export class User extends CommonPk {
  @Column('varchar', { unique: true, nullable: false })
  socialId: string;

  @Column('varchar', { unique: false, nullable: false })
  socialType: string;

  @Column('varchar', { unique: false, nullable: false })
  nickname: string;

  @Column('varchar', { unique: false, nullable: false })
  profileImage: string;

  @Column('varchar', { unique: true, nullable: false })
  OAuthRefreshToken;

  @Column('varchar', { unique: true, nullable: false })
  refreshToken;

  // goal: 일대다
  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  // post: 일대다
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  // comment: 일대다
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  // like: 다대다
}
