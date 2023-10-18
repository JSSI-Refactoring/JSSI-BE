import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonPkEntity } from './common/common.entity';
import { GoalEntity } from './goal.entity';

@Entity()
export class VideoEntity extends CommonPkEntity {
  @Column('varchar', { unique: false, nullable: true })
  video1: string;

  @Column('varchar', { unique: false, nullable: true })
  video2: string;

  @Column('varchar', { unique: false, nullable: true })
  video3: string;

  @Column('varchar', { unique: false, nullable: true })
  finalVideo: string;

  @Column('int', { unique: true, nullable: false })
  goalId: number;

  // Video - Goal
  @OneToOne(() => GoalEntity, (goal) => goal.videos)
  @JoinColumn({ name: 'goalId', referencedColumnName: 'id' })
  goal: GoalEntity;
}
