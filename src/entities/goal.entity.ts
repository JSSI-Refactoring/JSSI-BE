import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonPkEntity } from './common/common.entity';
import { UserEntity } from './user.entity';
import { VideoEntity } from './video.entity';

@Entity()
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

  // Goal - User
  @ManyToOne(() => UserEntity, (user) => user.goals)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  // Goal - Video
  @OneToOne(() => VideoEntity, (video) => video.goal)
  videos: VideoEntity;
}
