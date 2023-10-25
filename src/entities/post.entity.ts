import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CommonPk } from '@entities/common/common.entity';
import { Goal } from '@entities/goal.entity';
import { User } from '@entities/user.entity';
import { Comment } from '@entities/comment.entity';

@Entity('Post')
export class Post extends CommonPk {
  @Column('int', { unique: true, nullable: false })
  goalId: number;

  @Column('int', { unique: false, nullable: false })
  userId: number;

  // user: 다대일
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  // goal: 일대일
  @OneToOne(() => Post)
  @JoinColumn({ name: 'goalId' })
  goal: Goal;

  // comment: 일대다
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
