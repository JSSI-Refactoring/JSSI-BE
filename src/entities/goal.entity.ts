import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonPkEntity } from './common/common.entity';
import { UserEntity } from './user.entity';
import { VideoEntity } from './video.entity';
import { PostEntity } from './post.entity';

@Entity('Goal')
export class GoalEntity extends CommonPkEntity {
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
  @ManyToOne(() => UserEntity, (user) => user.goals)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  // video: 일대일
  @OneToOne(() => VideoEntity, (video) => video.goal)
  video: VideoEntity;

  // post: 일대일
  @OneToOne(() => PostEntity, (post) => post.goal)
  post: PostEntity;
}
