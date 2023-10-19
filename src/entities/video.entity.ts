import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
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

  // goal: 일대일
  @OneToOne(() => VideoEntity)
  @JoinColumn({ name: 'goalId' })
  goal: GoalEntity;
}
