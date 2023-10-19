import { Column, Entity, OneToMany } from 'typeorm';
import { CommonPkEntity } from './common/common.entity';
import { GoalEntity } from './goal.entity';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';

@Entity('User')
export class UserEntity extends CommonPkEntity {
  @Column('varchar', { unique: true, nullable: false })
  socialId: string;

  @Column('varchar', { unique: false, nullable: false })
  socialType: string;

  @Column('varchar', { unique: false, nullable: false })
  nickname: string;

  @Column('varchar', { unique: false, nullable: false })
  profileImage: string;

  // goal: 일대다
  @OneToMany(() => GoalEntity, (goal) => goal.user)
  goals: GoalEntity[];

  // post: 일대다
  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  // comment: 일대다
  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  // like: 다대다
}
