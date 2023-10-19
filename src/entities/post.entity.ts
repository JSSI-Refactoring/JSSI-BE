import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CommonPkEntity } from './common/common.entity';
import { GoalEntity } from './goal.entity';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';

@Entity()
export class PostEntity extends CommonPkEntity {
  @Column('int', { unique: true, nullable: false })
  goalId: number;

  @Column('int', { unique: false, nullable: false })
  userId: number;

  // user: 다대일
  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  // goal: 일대일
  @OneToOne(() => PostEntity)
  @JoinColumn({ name: 'goalId' })
  goal: GoalEntity;

  // comment: 일대다
  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];
}
