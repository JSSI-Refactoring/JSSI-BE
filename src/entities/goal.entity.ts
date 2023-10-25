import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonPk } from '@entities/common/common.entity';
import { User } from '@entities/user.entity';
import { Video } from '@entities/video.entity';
import { Post } from '@entities/post.entity';

@Entity('Goal')
export class Goal extends CommonPk {
  @Column('varchar', { unique: false, nullable: false })
  title: string;

  @Column('varchar', { unique: false, nullable: false })
  status: string;

  @Column('varchar', { unique: false, nullable: false })
  isShare: boolean;

  @Column('varchar', { unique: false, nullable: false })
  day1: string;

  @Column('varchar', { unique: false, nullable: false })
  day2: string;

  @Column('varchar', { unique: false, nullable: false })
  day3: string;

  @Column('int', { unique: false, nullable: false })
  userId: string;

  // user: 다대일
  @ManyToOne(() => User, (user) => user.goals)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  // video: 일대일
  @OneToOne(() => Video, (video) => video.goal)
  video: Video;

  // post: 일대일
  @OneToOne(() => Post, (post) => post.goal)
  post: Post;
}
